#!/usr/bin/env node
/**
 * Sync user-submitted recommendations from Cloudflare KV to user-submissions.json.
 *
 * Usage:
 *   node scripts/sync-recommendations.js
 *
 * After running, commit and push to deploy the updated data.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const KV_NAMESPACE_ID = '8596576f18ac4c1980f16a278cb0c663';
const KV_PREFIX = 'rec:';
const SUBMISSIONS_FILE = path.join(__dirname, '..', 'src', 'data', 'user-submissions.json');

function wrangler(args) {
  try {
    const result = execSync(`npx wrangler ${args}`, {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch (err) {
    console.error(`wrangler error: ${err.stderr || err.message}`);
    process.exit(1);
  }
}

async function main() {
  console.log('Fetching recommendation keys from Cloudflare KV...');

  // List all keys with prefix rec:
  const keysJson = wrangler(`kv key list --namespace-id=${KV_NAMESPACE_ID} --prefix=${KV_PREFIX}`);
  const keys = JSON.parse(keysJson);

  if (keys.length === 0) {
    console.log('No recommendations found in KV. Nothing to sync.');
    return;
  }

  console.log(`Found ${keys.length} recommendation(s) in KV.`);

  // Fetch each value
  const kvSubmissions = [];
  for (const key of keys) {
    const keyName = key.name;
    const valueJson = wrangler(`kv key get "${keyName}" --namespace-id=${KV_NAMESPACE_ID}`);
    try {
      const value = JSON.parse(valueJson);
      kvSubmissions.push(value);
    } catch {
      console.warn(`Skipping invalid JSON for key: ${keyName}`);
    }
  }

  // Load existing submissions
  let existing = [];
  if (fs.existsSync(SUBMISSIONS_FILE)) {
    existing = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf-8'));
  }

  // Merge: add new entries that don't already exist (by ID)
  const existingIds = new Set(existing.map((s) => s.id));
  const newEntries = kvSubmissions.filter((s) => !existingIds.has(s.id));

  if (newEntries.length === 0) {
    console.log('All recommendations already in user-submissions.json. Nothing to update.');
    return;
  }

  const merged = [...existing, ...newEntries];
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(merged, null, 2) + '\n');

  console.log(`Added ${newEntries.length} new recommendation(s) to user-submissions.json.`);
  console.log(`Total submissions: ${merged.length}`);
  console.log('\nNext steps:');
  console.log('  git add src/data/user-submissions.json');
  console.log('  git commit -m "sync: update user recommendations from KV"');
  console.log('  git push');
}

main();
