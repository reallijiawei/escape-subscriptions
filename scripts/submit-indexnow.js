const SITE_URL = 'https://escapesubscriptions.online';
const API_KEY = 'cb558c0446c54b65a326e899897e1bec';

async function submitIndexNow() {
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'escapesubscriptions.online',
        key: API_KEY,
        keyLocation: `${SITE_URL}/${API_KEY}.txt`,
        urlList: [SITE_URL],
      }),
    });

    if (res.ok || res.status === 202) {
      console.log('IndexNow: Submitted successfully');
    } else {
      console.log(`IndexNow: Status ${res.status}`);
    }
  } catch (err) {
    console.error('IndexNow: Error -', err.message);
  }
}

submitIndexNow();
