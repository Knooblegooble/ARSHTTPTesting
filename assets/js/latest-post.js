const apiBase = 'https://arstesting.onrender.com';

document.getElementById('fetchLatestBtn').addEventListener('click', async () => {
  const out = document.getElementById('latestPost');
  out.textContent = 'Loading…';

  try {
    const res = await fetch(`${apiBase}/stlcitysc/latest-post`);
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    const data = await res.json();
    out.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    out.textContent = `Error loading latest post:\n${err.message}`;
  }
});
