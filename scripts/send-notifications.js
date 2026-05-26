const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const SITE_URL = 'https://escapesubscriptions.online';

// --- Load env ---
function loadEnv() {
  if (!fs.existsSync(ENV_PATH)) return {};
  const env = {};
  const lines = fs.readFileSync(ENV_PATH, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }
  return env;
}

// --- Cloudflare KV helpers ---
async function getKvSubscriptions(env) {
  const token = env.CLOUDFLARE_API_TOKEN;
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const kvId = env.CLOUDFLARE_KV_EMAIL_ID;
  if (!token || !accountId || !kvId) throw new Error('CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, and CLOUDFLARE_KV_EMAIL_ID required in .env');

  // List all keys with "sub:" prefix
  const listRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/keys?prefix=sub:&limit=1000`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const listData = await listRes.json();
  if (!listData.success) {
    console.error('[Cloudflare Error] List keys:', JSON.stringify(listData.errors));
    throw new Error('Failed to list KV keys');
  }

  // Get values
  const keys = listData.result.map((k) => k.name);
  if (keys.length === 0) return [];

  const bulkRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvId}/bulk/get`,
    {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ keys }),
    }
  );
  const bulkData = await bulkRes.json();
  if (!bulkData.success) {
    console.error('[Cloudflare Error] Bulk get:', JSON.stringify(bulkData.errors));
    throw new Error('Failed to get KV values');
  }

  return Object.values(bulkData.result.values || {}).map((v) => {
    try { return JSON.parse(v); } catch { return null; }
  }).filter(Boolean);
}

// --- Resend email sending ---
async function sendEmail(apiKey, fromAddr, to, subject, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddr,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => null);
    const errMsg = errBody?.message || JSON.stringify(errBody) || `HTTP ${res.status}`;
    console.error(`[Resend Error] to=${to} status=${res.status} message=${errMsg}`);
    throw new Error(`Resend API error: ${errMsg}`);
  }
  return await res.json();
}

// --- Main ---
async function main() {
  const env = loadEnv();
  const resendKey = env.RESEND_API_KEY;
  const fromName = env.RESEND_FROM_NAME || 'Escape Subscriptions';
  const fromEmail = env.RESEND_FROM_EMAIL || 'notify@mail.escapesubscriptions.online';
  const fromAddr = `${fromName} <${fromEmail}>`;

  if (!resendKey) {
    console.error('RESEND_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('\n=== Email Notifications ===');

  // Get all subscriptions from KV
  let subscriptions;
  try {
    subscriptions = await getKvSubscriptions(env);
    console.log(`Found ${subscriptions.length} subscriptions`);
  } catch (err) {
    console.error('Failed to fetch subscriptions:', err.message);
    process.exit(1);
  }

  if (subscriptions.length === 0) {
    console.log('No subscriptions. Nothing to send.');
    return;
  }

  // Group by toolSlug
  const byTool = {};
  for (const sub of subscriptions) {
    if (!byTool[sub.toolSlug]) byTool[sub.toolSlug] = { toolName: sub.toolName, emails: [] };
    byTool[sub.toolSlug].emails.push(sub.email);
  }

  // Read current data to get tool info
  const software = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/software.json'), 'utf-8'));
  const tools = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/subscription-tools.json'), 'utf-8'));
  const relations = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/alternative-relations.json'), 'utf-8'));

  let sent = 0, failed = 0;

  for (const [toolSlug, { toolName, emails }] of Object.entries(byTool)) {
    const tool = tools.find((t) => t.slug === toolSlug);
    if (!tool) continue;

    // Get alternatives for this tool
    const toolRelations = relations.filter((r) => r.subscriptionToolId === tool.id);
    const alts = toolRelations
      .map((r) => {
        const sw = software.find((s) => s.id === r.softwareId);
        return sw ? { ...sw, rank: r.recommendationRank } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.rank - b.rank);

    if (alts.length === 0) continue;

    // Build email content
    const topAlts = alts.slice(0, 3);
    const altListHtml = topAlts
      .map((a) => `<li><strong>${a.name}</strong> — ${a.priceText} <a href="${SITE_URL}/software/${a.slug}">View details →</a></li>`)
      .join('');
    const altListText = topAlts.map((a) => `• ${a.name} — ${a.priceText}`).join('\n');

    const subject = `${topAlts.length} alternatives to ${toolName} you should know about`;
    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b; margin-bottom: 16px;">Alternatives to ${toolName}</h2>
        <p style="color: #475569; margin-bottom: 16px;">
          Here are the top alternatives to ${toolName} (${tool.monthlyPrice ? `$${tool.monthlyPrice}/mo` : 'subscription'}):
        </p>
        <ul style="color: #334155; margin-bottom: 20px; padding-left: 20px;">
          ${altListHtml}
        </ul>
        <p style="margin-bottom: 20px;">
          <a href="${SITE_URL}/alternatives/${toolSlug}" style="background: #d97706; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View all alternatives →
          </a>
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">
          You're receiving this because you subscribed to ${toolName} updates on Escape Subscriptions.
          <a href="${SITE_URL}/alternatives/${toolSlug}" style="color: #94a3b8;">Unsubscribe</a>
        </p>
      </div>
    `;

    for (const email of emails) {
      try {
        await sendEmail(resendKey, fromAddr, email, subject, html);
        console.log(`  Sent to ${email} for ${toolName}`);
        sent++;
      } catch (err) {
        console.error(`  Failed to send to ${email}: ${err.message}`);
        failed++;
      }
      // Rate limit: 100ms between emails
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  console.log(`\n=== Report ===`);
  console.log(`Sent: ${sent}`);
  console.log(`Failed: ${failed}`);
}

main().catch(console.error);
