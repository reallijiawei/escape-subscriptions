#!/usr/bin/env node
/**
 * Weekly software check: verify prices, platforms, discover new alternatives.
 * Uses DeepSeek API to analyze web pages and search results.
 * Sends email notifications via Resend when changes are found.
 * Updates JSON data files and commits changes.
 *
 * Usage:
 *   node scripts/weekly-check.js              # full run
 *   node scripts/weekly-check.js --dry-run    # no emails, no commits
 */

const fs = require('fs');
const path = require('path');

// ── Config ────────────────────────────────────────────────────────────────────
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'notify@mail.escapesubscriptions.online';
const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'Escape Subscriptions';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_KV_EMAIL_ID = process.env.CLOUDFLARE_KV_EMAIL_ID || '8596576f18ac4c1980f16a278cb0c663';
const SITE_URL = 'https://escapesubscriptions.online';

const DRY_RUN = process.argv.includes('--dry-run');
const MAX_TOOLS_PER_RUN = 10; // Limit to control cost/time
const REQUEST_DELAY_MS = 2000; // Delay between requests

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const TOOLS_FILE = path.join(DATA_DIR, 'subscription-tools.json');
const SOFTWARE_FILE = path.join(DATA_DIR, 'software.json');
const RELATIONS_FILE = path.join(DATA_DIR, 'alternative-relations.json');
const CHANGELOG_FILE = path.join(__dirname, '..', 'weekly-changelog.json');

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(url, opts = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

// ── Cloudflare KV: get subscribers ────────────────────────────────────────────
async function getSubscribers() {
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID) {
    console.log('Missing Cloudflare credentials, skipping subscriber fetch.');
    return {};
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_EMAIL_ID}/keys?prefix=sub:&limit=1000`;

  try {
    const res = await fetchWithTimeout(url, {
      headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
    });
    const data = await res.json();

    if (!data.success) {
      console.error('Cloudflare API error:', data.errors);
      return {};
    }

    // Group subscribers by toolSlug
    const subscribers = {}; // { toolSlug: [email, ...] }
    for (const key of data.result || []) {
      const parts = key.name.split(':'); // sub:{email}:{toolSlug}
      if (parts.length >= 3) {
        const email = parts[1];
        const toolSlug = parts.slice(2).join(':');
        if (!subscribers[toolSlug]) subscribers[toolSlug] = [];
        subscribers[toolSlug].push(email);
      }
    }

    return subscribers;
  } catch (err) {
    console.error('Failed to fetch subscribers:', err.message);
    return {};
  }
}

// ── Web fetch: get tool website content ───────────────────────────────────────
async function fetchToolWebsite(url) {
  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EscapeSubscriptions/1.0)',
        Accept: 'text/html',
      },
    });
    const html = await res.text();
    // Strip HTML tags, collapse whitespace, limit length
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);
  } catch (err) {
    console.warn(`  Failed to fetch ${url}: ${err.message}`);
    return '';
  }
}

// ── Web search: DuckDuckGo HTML search ────────────────────────────────────────
async function webSearch(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EscapeSubscriptions/1.0)',
        Accept: 'text/html',
      },
    });
    const html = await res.text();
    // Extract result snippets
    const results = [];
    const regex = /<a[^>]*class="result__a"[^>]*>(.*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/gi;
    let match;
    while ((match = regex.exec(html)) !== null && results.length < 5) {
      results.push({
        title: match[1].replace(/<[^>]+>/g, '').trim(),
        snippet: match[2].replace(/<[^>]+>/g, '').trim(),
      });
    }
    // Fallback: simpler regex
    if (results.length === 0) {
      const simpleRegex = /<a[^>]*class="result__a"[^>]*>(.*?)<\/a>/gi;
      while ((match = simpleRegex.exec(html)) !== null && results.length < 5) {
        results.push({
          title: match[1].replace(/<[^>]+>/g, '').trim(),
          snippet: '',
        });
      }
    }
    return results;
  } catch (err) {
    console.warn(`  Search failed for "${query}": ${err.message}`);
    return [];
  }
}

// ── DeepSeek: analyze tool data ───────────────────────────────────────────────
async function analyzeWithDeepSeek(tool, websiteContent, searchResults, existingSoftware) {
  const existingAlts = existingSoftware
    .filter((s) => s.replaces && s.replaces.includes(tool.id))
    .map((s) => s.name);

  const prompt = `You are analyzing software pricing and alternatives for a website that helps people escape software subscriptions.

TOOL: ${tool.name} (${tool.websiteUrl})
CURRENT PRICE: $${tool.monthlyPrice}/month, $${tool.yearlyPrice}/year
CURRENT CATEGORY: ${tool.category}
KNOWN ALTERNATIVES: ${existingAlts.join(', ') || 'none'}

WEBSITE CONTENT (truncated):
${websiteContent || '(unable to fetch)'}

SEARCH RESULTS for "${tool.name} free alternative":
${searchResults.map((r) => `- ${r.title}: ${r.snippet}`).join('\n') || '(no results)'}

Analyze this data and return a JSON object with EXACTLY this format:
{
  "currentMonthlyPrice": <number or null>,
  "currentYearlyPrice": <number or null>,
  "platforms": ["WINDOWS", "MACOS", "LINUX", "IOS", "ANDROID", "WEB", "SELF_HOSTED", "IPAD"],
  "priceChanged": <boolean>,
  "platformsChanged": <boolean>,
  "newAlternatives": [
    {
      "name": "Alternative Name",
      "url": "https://example.com",
      "reason": "Why it's a good alternative"
    }
  ],
  "summary": "Brief summary of any changes found",
  "hasChanges": <boolean>
}

Rules:
- Only include platforms that are explicitly mentioned on the website or in search results
- Only include newAlternatives that are NOT in the known alternatives list
- priceChanged is true if the price differs from the current price by more than 10%
- hasChanges is true if ANY of priceChanged, platformsChanged, or newAlternatives.length > 0
- If you can't determine the current price, set currentMonthlyPrice to null and priceChanged to false
- Keep summary under 100 words
- Return ONLY the JSON object, no other text`;

  try {
    const res = await fetchWithTimeout('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-v4-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    }, 30000);

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Extract JSON from response (may have markdown code block)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('  DeepSeek returned no JSON');
      return null;
    }

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn(`  DeepSeek analysis failed: ${err.message}`);
    return null;
  }
}

// ── Email: send notification via Resend ───────────────────────────────────────
async function sendEmail(to, subject, htmlBody) {
  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would send email to ${to}: ${subject}`);
    return true;
  }

  try {
    const res = await fetchWithTimeout('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
        to: [to],
        subject,
        html: htmlBody,
      }),
    });

    const data = await res.json();
    if (data.id) {
      console.log(`  Email sent to ${to}`);
      return true;
    } else {
      console.warn(`  Email failed to ${to}:`, data.message || data);
      return false;
    }
  } catch (err) {
    console.warn(`  Email error to ${to}: ${err.message}`);
    return false;
  }
}

function buildEmailHtml(tool, changes) {
  const changeList = [];

  if (changes.priceChanged) {
    changeList.push(`<li><strong>Price update:</strong> Now $${changes.currentMonthlyPrice}/month (was $${tool.monthlyPrice}/month)</li>`);
  }
  if (changes.platformsChanged) {
    changeList.push(`<li><strong>Platform update:</strong> Now supports ${(changes.platforms || []).join(', ')}</li>`);
  }
  if (changes.newAlternatives && changes.newAlternatives.length > 0) {
    for (const alt of changes.newAlternatives) {
      changeList.push(`<li><strong>New alternative:</strong> <a href="${alt.url}">${alt.name}</a> — ${alt.reason}</li>`);
    }
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0f172a; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h2 style="color: #f59e0b; margin: 0 0 8px;">Escape Subscriptions</h2>
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">Updates for ${tool.name}</p>
      </div>

      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h3 style="color: #0f172a; margin: 0 0 16px;">What changed:</h3>
        <ul style="color: #475569; line-height: 1.8; padding-left: 20px;">
          ${changeList.join('\n')}
        </ul>

        ${changes.summary ? `<p style="color: #64748b; font-size: 14px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">${changes.summary}</p>` : ''}

        <div style="margin-top: 24px;">
          <a href="${SITE_URL}/alternatives/${tool.slug}" style="display: inline-block; background: #f59e0b; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            View all ${tool.name} alternatives
          </a>
        </div>
      </div>

      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
        You're receiving this because you subscribed to ${tool.name} updates on Escape Subscriptions.
      </p>
    </div>
  `;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Weekly Software Check ===');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Date: ${new Date().toISOString()}\n`);

  // Validate required env vars
  if (!DEEPSEEK_API_KEY) {
    console.error('Missing DEEPSEEK_API_KEY');
    process.exit(1);
  }

  // Load data
  const tools = loadJSON(TOOLS_FILE);
  const software = loadJSON(SOFTWARE_FILE);
  const relations = loadJSON(RELATIONS_FILE);

  console.log(`Loaded: ${tools.length} tools, ${software.length} software, ${relations.length} relations`);

  // Get subscribers
  const subscribers = await getSubscribers();
  const subscribedToolSlugs = Object.keys(subscribers);
  console.log(`Subscribers: ${subscribedToolSlugs.length} tools with active subscriptions\n`);

  if (subscribedToolSlugs.length === 0) {
    console.log('No subscribers found. Nothing to check.');
    return;
  }

  // Prioritize tools with subscribers, limit per run
  const toolsToCheck = tools
    .filter((t) => subscribedToolSlugs.includes(t.slug))
    .slice(0, MAX_TOOLS_PER_RUN);

  console.log(`Checking ${toolsToCheck.length} tools...\n`);

  const allChanges = []; // { tool, changes, emails }

  for (const tool of toolsToCheck) {
    console.log(`Checking: ${tool.name} (${tool.slug})`);

    // 1. Fetch website
    console.log('  Fetching website...');
    const websiteContent = await fetchToolWebsite(tool.websiteUrl);
    await sleep(REQUEST_DELAY_MS);

    // 2. Web search
    console.log('  Searching for alternatives...');
    const searchResults = await webSearch(`${tool.name} free alternative ${new Date().getFullYear()}`);
    await sleep(REQUEST_DELAY_MS);

    // 3. Analyze with DeepSeek
    console.log('  Analyzing with DeepSeek...');
    const analysis = await analyzeWithDeepSeek(tool, websiteContent, searchResults, software);

    if (!analysis) {
      console.log('  Analysis failed, skipping.\n');
      continue;
    }

    if (analysis.hasChanges) {
      console.log('  CHANGES DETECTED:');
      if (analysis.priceChanged) console.log(`    Price: $${tool.monthlyPrice} -> $${analysis.currentMonthlyPrice}/mo`);
      if (analysis.platformsChanged) console.log(`    Platforms: ${(analysis.platforms || []).join(', ')}`);
      if (analysis.newAlternatives?.length) {
        for (const alt of analysis.newAlternatives) {
          console.log(`    New alternative: ${alt.name} (${alt.url})`);
        }
      }
      console.log(`    Summary: ${analysis.summary}`);

      allChanges.push({
        tool,
        changes: analysis,
        emails: subscribers[tool.slug] || [],
      });
    } else {
      console.log('  No changes detected.');
    }

    console.log('');
    await sleep(REQUEST_DELAY_MS);
  }

  // ── Apply changes ─────────────────────────────────────────────────────
  if (allChanges.length === 0) {
    console.log('No changes found across all checked tools. Done.');
    return;
  }

  console.log(`\n=== Applying ${allChanges.length} tool update(s) ===\n`);

  let toolsModified = false;
  let softwareModified = false;
  const changelog = [];

  for (const { tool, changes, emails } of allChanges) {
    // Update tool price if changed
    if (changes.priceChanged && changes.currentMonthlyPrice != null) {
      const toolIndex = tools.findIndex((t) => t.id === tool.id);
      if (toolIndex !== -1) {
        const oldPrice = tools[toolIndex].monthlyPrice;
        tools[toolIndex].monthlyPrice = changes.currentMonthlyPrice;
        if (changes.currentYearlyPrice != null) {
          tools[toolIndex].yearlyPrice = changes.currentYearlyPrice;
        }
        tools[toolIndex].lastCheckedAt = new Date().toISOString().split('T')[0];
        toolsModified = true;
        console.log(`Updated ${tool.name} price: $${oldPrice} -> $${changes.currentMonthlyPrice}/mo`);
      }
    }

    // Update tool platforms if changed
    if (changes.platformsChanged && changes.platforms) {
      // Platforms are on software, not tools. Log only.
      console.log(`Platform change noted for ${tool.name}: ${changes.platforms.join(', ')}`);
    }

    // Add new alternatives to software.json
    if (changes.newAlternatives?.length) {
      for (const alt of changes.newAlternatives) {
        // Check if already exists
        const exists = software.some(
          (s) => s.name.toLowerCase() === alt.name.toLowerCase() || s.websiteUrl === alt.url
        );

        if (!exists) {
          const newSoftware = {
            id: alt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            name: alt.name,
            slug: alt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            description: alt.reason || `Alternative to ${tool.name}`,
            websiteUrl: alt.url || '',
            pricingType: 'FREE',
            priceText: 'Free',
            startingPrice: null,
            currency: 'USD',
            platforms: [],
            categories: [tool.category],
            isOpenSource: false,
            isOfflineSupported: false,
            requiresAccount: false,
            hasFreeTrial: false,
            ownershipLevel: 'MEDIUM',
            cloudDependency: 'MEDIUM',
            bestFor: [],
            pros: [],
            cons: [],
            replaces: [tool.id],
            affiliateUrl: null,
            lastCheckedAt: new Date().toISOString().split('T')[0],
          };

          software.push(newSoftware);
          softwareModified = true;
          console.log(`Added new software: ${alt.name}`);
        }
      }
    }

    // Send emails to subscribers
    if (emails.length > 0) {
      const subject = `${tool.name} update — ${changes.summary?.slice(0, 60) || 'changes detected'}`;
      const html = buildEmailHtml(tool, changes);

      for (const email of emails) {
        await sendEmail(email, subject, html);
        await sleep(500); // Rate limit
      }
    }

    changelog.push({
      toolId: tool.id,
      toolName: tool.name,
      changes: {
        priceChanged: changes.priceChanged,
        newAlternatives: changes.newAlternatives?.map((a) => a.name) || [],
        summary: changes.summary,
      },
      emailsSent: emails.length,
      timestamp: new Date().toISOString(),
    });
  }

  // ── Save files ────────────────────────────────────────────────────────
  if (toolsModified && !DRY_RUN) {
    saveJSON(TOOLS_FILE, tools);
    console.log('Saved subscription-tools.json');
  }

  if (softwareModified && !DRY_RUN) {
    saveJSON(SOFTWARE_FILE, software);
    console.log('Saved software.json');
  }

  // Save changelog
  const existingChangelog = fs.existsSync(CHANGELOG_FILE)
    ? JSON.parse(fs.readFileSync(CHANGELOG_FILE, 'utf-8'))
    : [];
  existingChangelog.push(...changelog);
  // Keep last 52 entries (1 year)
  const trimmedChangelog = existingChangelog.slice(-52);
  if (!DRY_RUN) {
    saveJSON(CHANGELOG_FILE, trimmedChangelog);
    console.log('Saved weekly-changelog.json');
  }

  // ── Git commit ────────────────────────────────────────────────────────
  if ((toolsModified || softwareModified) && !DRY_RUN) {
    const { execSync } = require('child_process');
    const cwd = path.join(__dirname, '..');
    try {
      execSync('git add src/data/subscription-tools.json src/data/software.json weekly-changelog.json', { cwd });
      execSync(`git commit -m "chore: weekly software data update - ${new Date().toISOString().split('T')[0]}"`, { cwd });
      console.log('Git committed changes.');
      // Note: push is handled by GitHub Actions auto-commit step
    } catch (err) {
      console.warn('Git commit failed (may be no changes):', err.message);
    }
  }

  console.log(`\n=== Done. ${allChanges.length} tool(s) updated, ${changelog.reduce((s, c) => s + c.emailsSent, 0)} email(s) sent. ===`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
