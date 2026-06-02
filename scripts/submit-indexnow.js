const SITE_URL = 'https://escapesubscriptions.online';
const API_KEY = 'cb558c0446c54b65a326e899897e1bec';

async function fetchSitemapUrls() {
  try {
    const res = await fetch(`${SITE_URL}/sitemap.xml`);
    const xml = await res.text();
    // Extract all <loc> values from sitemap
    const urls = [];
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
      urls.push(match[1]);
    }
    return urls;
  } catch (err) {
    console.error('Failed to fetch sitemap:', err.message);
    return [SITE_URL];
  }
}

async function submitIndexNow(urls) {
  // IndexNow accepts max 10,000 URLs per request
  const batch = urls.slice(0, 10000);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'escapesubscriptions.online',
        key: API_KEY,
        keyLocation: `${SITE_URL}/${API_KEY}.txt`,
        urlList: batch,
      }),
    });

    if (res.ok || res.status === 202) {
      console.log(`IndexNow: Submitted ${batch.length} URLs successfully`);
    } else {
      const text = await res.text();
      console.log(`IndexNow: Status ${res.status} - ${text}`);
    }
  } catch (err) {
    console.error('IndexNow: Error -', err.message);
  }
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`Found ${urls.length} URLs in sitemap`);
  await submitIndexNow(urls);
}

main();
