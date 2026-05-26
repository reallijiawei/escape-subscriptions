const fs = require('fs');
const path = require('path');
let playwright;
try { playwright = require('playwright'); } catch {} // optional

// --- Config ---
const ROOT = path.resolve(__dirname, '..');
const SOFTWARE_PATH = path.join(ROOT, 'src/data/software.json');
const TOOLS_PATH = path.join(ROOT, 'src/data/subscription-tools.json');
const ENV_PATH = path.join(ROOT, '.env');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-v4-pro';
const STALE_DAYS = 7;
const MAX_HTML_LENGTH = 15000; // truncate HTML to avoid token limits
const REQUEST_DELAY_MS = 2000; // delay between API calls to avoid rate limits

// --- Load API key from .env ---
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('Error: .env file not found. Create .env with DEEPSEEK_API_KEY=sk-xxx');
    process.exit(1);
  }
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    if (key === 'DEEPSEEK_API_KEY') return val;
  }
  console.error('Error: DEEPSEEK_API_KEY not found in .env');
  process.exit(1);
}

// --- Date helpers ---
function isStale(dateStr, days) {
  const checked = new Date(dateStr);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return checked < cutoff;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// --- Fetch webpage content ---
async function fetchDirect(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);
    // Accept any response that returns content (even 403)
    const html = await res.text();
    if (html.length < 200) return null;
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/\s+/g, ' ')
      .slice(0, MAX_HTML_LENGTH);
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

async function fetchWithPlaywright(url) {
  if (!playwright) return null;
  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText);
    await browser.close();
    return text.slice(0, MAX_HTML_LENGTH);
  } catch {
    if (browser) await browser.close().catch(() => {});
    return null;
  }
}

async function fetchPage(url, usePlaywrightFallback = true) {
  // Try direct fetch first
  let content = await fetchDirect(url);
  if (content && content.length > 500) return content;

  // Check if direct fetch got real content (not just error page)
  if (content && content.length > 200) {
    // Got some content but small — might be a JS-rendered site
    const hasPriceInfo = /\$\d+/.test(content) || /pricing|price|plan|subscribe/i.test(content);
    if (hasPriceInfo) return content;
  }

  // Fallback to Playwright for JS-rendered sites
  if (usePlaywrightFallback) {
    console.log(`  Using Playwright fallback...`);
    content = await fetchWithPlaywright(url);
    if (content) return content;
  }

  return null;
}

// --- Call DeepSeek API ---
async function callLLM(prompt, apiKey) {
  const res = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// --- Prompts ---
function softwarePrompt(entry, html) {
  const hasPrice = /\$\d+|price|pricing|plan|cost|free|month|year/i.test(html);
  const knowledgeNote = hasPrice
    ? ''
    : `\nNote: The website content does not contain visible pricing information. Use your training knowledge to verify the current pricing and availability of ${entry.name}. If you are unsure, keep the current values.`;

  return `You are a data verification assistant. Given the following software entry and its website content, extract the CURRENT information.

Software: ${entry.name}
Website: ${entry.websiteUrl}
Current data: pricingType=${entry.pricingType}, priceText="${entry.priceText}", startingPrice=${entry.startingPrice}, isOpenSource=${entry.isOpenSource}, isOfflineSupported=${entry.isOfflineSupported}

Website content (truncated):
${html}
${knowledgeNote}

Return a JSON object with ONLY these fields (use current values if unchanged):
{
  "isStillAvailable": true/false,
  "pricingType": "ONE_TIME_PURCHASE" | "LIFETIME_DEAL" | "OPEN_SOURCE" | "FREE" | "FREEMIUM" | "SUBSCRIPTION_WITH_FREE_PLAN" | "SUBSCRIPTION",
  "priceText": "string describing price",
  "startingPrice": number or null,
  "isOpenSource": true/false,
  "isOfflineSupported": true/false
}

If you cannot determine a field, keep the current value. Only return the JSON object, nothing else.`;
}

function toolPrompt(entry, html) {
  const hasPrice = /\$\d+|price|pricing|plan|cost|month|year/i.test(html);
  const knowledgeNote = hasPrice
    ? ''
    : `\nNote: The website content does not contain visible pricing information. Use your training knowledge to verify the current pricing of ${entry.name}. If you are unsure, keep the current values.`;

  return `You are a data verification assistant. Given the following subscription tool entry and its website content, extract the CURRENT pricing.

Tool: ${entry.name}
Website: ${entry.websiteUrl}
Current data: monthlyPrice=${entry.monthlyPrice}, yearlyPrice=${entry.yearlyPrice}

Website content (truncated):
${html}
${knowledgeNote}

Return a JSON object with ONLY these fields (use current values if unchanged):
{
  "isStillAvailable": true/false,
  "monthlyPrice": number or null,
  "yearlyPrice": number or null
}

If you cannot determine pricing, keep the current values. Only return the JSON object, nothing else.`;
}

function toolKnowledgePrompt(entry) {
  return `You are a data verification assistant. The website for ${entry.name} (${entry.websiteUrl}) could not be scraped. Use your training knowledge to verify the current pricing.

Tool: ${entry.name}
Current data: monthlyPrice=${entry.monthlyPrice}, yearlyPrice=${entry.yearlyPrice}

Return a JSON object with ONLY these fields (keep current values if unsure):
{
  "isStillAvailable": true/false,
  "monthlyPrice": number or null,
  "yearlyPrice": number or null,
  "source": "knowledge"
}

Only return the JSON object, nothing else.`;
}

function softwareKnowledgePrompt(entry) {
  return `You are a data verification assistant. The website for ${entry.name} (${entry.websiteUrl}) could not be scraped. Use your training knowledge to verify the current information.

Software: ${entry.name}
Current data: pricingType=${entry.pricingType}, priceText="${entry.priceText}", startingPrice=${entry.startingPrice}, isOpenSource=${entry.isOpenSource}, isOfflineSupported=${entry.isOfflineSupported}

Return a JSON object with ONLY these fields (keep current values if unsure):
{
  "isStillAvailable": true/false,
  "pricingType": "ONE_TIME_PURCHASE" | "LIFETIME_DEAL" | "OPEN_SOURCE" | "FREE" | "FREEMIUM" | "SUBSCRIPTION_WITH_FREE_PLAN" | "SUBSCRIPTION",
  "priceText": "string describing price",
  "startingPrice": number or null,
  "isOpenSource": true/false,
  "isOfflineSupported": true/false,
  "source": "knowledge"
}

Only return the JSON object, nothing else.`;
}

// --- Compare and detect changes ---
function diffSoftware(current, extracted) {
  const changes = {};
  const fields = ['pricingType', 'priceText', 'startingPrice', 'isOpenSource', 'isOfflineSupported'];
  for (const f of fields) {
    if (extracted[f] !== undefined && extracted[f] !== current[f]) {
      changes[f] = { from: current[f], to: extracted[f] };
    }
  }
  return changes;
}

function diffTool(current, extracted) {
  const changes = {};
  if (extracted.monthlyPrice !== undefined && extracted.monthlyPrice !== current.monthlyPrice) {
    changes.monthlyPrice = { from: current.monthlyPrice, to: extracted.monthlyPrice };
  }
  if (extracted.yearlyPrice !== undefined && extracted.yearlyPrice !== current.yearlyPrice) {
    changes.yearlyPrice = { from: current.yearlyPrice, to: extracted.yearlyPrice };
  }
  return changes;
}

// --- Main ---
async function main() {
  const apiKey = loadEnv();
  const software = JSON.parse(fs.readFileSync(SOFTWARE_PATH, 'utf-8'));
  const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf-8'));

  const staleSoftware = software.filter((s) => isStale(s.lastCheckedAt, STALE_DAYS));
  const staleTools = tools.filter((t) => isStale(t.lastCheckedAt || '2020-01-01', STALE_DAYS));

  console.log(`\n=== Freshness Check ===`);
  console.log(`Software: ${staleSoftware.length}/${software.length} stale`);
  console.log(`Tools: ${staleTools.length}/${tools.length} stale\n`);

  if (staleSoftware.length === 0 && staleTools.length === 0) {
    console.log('All data is fresh. Nothing to do.');
    return;
  }

  let checked = 0, updated = 0, skipped = 0, warnings = [];

  // Check software
  for (const entry of staleSoftware) {
    console.log(`Checking software: ${entry.name} ...`);
    const html = await fetchPage(entry.websiteUrl);

    let prompt;
    if (html) {
      prompt = softwarePrompt(entry, html);
    } else {
      console.log(`  Fetch failed, using LLM knowledge...`);
      prompt = softwareKnowledgePrompt(entry);
    }

    try {
      const extracted = await callLLM(prompt, apiKey);
      checked++;

      if (extracted.isStillAvailable === false) {
        warnings.push(`WARNING: ${entry.name} may no longer be available at ${entry.websiteUrl}`);
      }

      const changes = diffSoftware(entry, extracted);
      if (Object.keys(changes).length > 0) {
        console.log(`  UPDATED:`);
        for (const [field, change] of Object.entries(changes)) {
          console.log(`    ${field}: ${change.from} -> ${change.to}`);
          entry[field] = change.to;
        }
        updated++;
      } else {
        console.log(`  No changes`);
      }

      entry.lastCheckedAt = todayStr();
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      skipped++;
    }

    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  // Check subscription tools
  for (const entry of staleTools) {
    console.log(`Checking tool: ${entry.name} ...`);
    const html = await fetchPage(entry.websiteUrl);

    let prompt;
    if (html) {
      prompt = toolPrompt(entry, html);
    } else {
      console.log(`  Fetch failed, using LLM knowledge...`);
      prompt = toolKnowledgePrompt(entry);
    }

    try {
      const extracted = await callLLM(prompt, apiKey);
      checked++;

      if (extracted.isStillAvailable === false) {
        warnings.push(`WARNING: ${entry.name} may no longer be available at ${entry.websiteUrl}`);
      }

      const changes = diffTool(entry, extracted);
      if (Object.keys(changes).length > 0) {
        console.log(`  UPDATED:`);
        for (const [field, change] of Object.entries(changes)) {
          console.log(`    ${field}: ${change.from} -> ${change.to}`);
          entry[field] = change.to;
        }
        updated++;
      } else {
        console.log(`  No changes`);
      }

      entry.lastCheckedAt = todayStr();
    } catch (err) {
      console.log(`  ERROR: ${err.message}`);
      skipped++;
    }

    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  // Write back if any updates
  if (updated > 0 || staleSoftware.length > 0 || staleTools.length > 0) {
    fs.writeFileSync(SOFTWARE_PATH, JSON.stringify(software, null, 2) + '\n');
    fs.writeFileSync(TOOLS_PATH, JSON.stringify(tools, null, 2) + '\n');
    console.log(`\nJSON files updated.`);
  }

  // Report
  console.log(`\n=== Report ===`);
  console.log(`Checked: ${checked}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  if (warnings.length > 0) {
    console.log(`\nWarnings:`);
    warnings.forEach((w) => console.log(`  ${w}`));
  }

  // Git commit and push if changes
  if (updated > 0) {
    console.log('\nCommitting and pushing changes...');
    const { execSync } = require('child_process');
    try {
      execSync('git add src/data/software.json src/data/subscription-tools.json', { cwd: ROOT, stdio: 'inherit' });
      execSync(`git commit -m "chore: auto-update data freshness (${todayStr()})"`, { cwd: ROOT, stdio: 'inherit' });
      execSync('git push', { cwd: ROOT, stdio: 'inherit' });
      console.log('Changes pushed to remote.');
    } catch (err) {
      console.error('Git operation failed:', err.message);
    }

    // Send email notifications
    console.log('\nSending email notifications...');
    try {
      execSync('node scripts/send-notifications.js', { cwd: ROOT, stdio: 'inherit' });
    } catch (err) {
      console.error('Notification failed:', err.message);
    }
  }
}

main().catch(console.error);
