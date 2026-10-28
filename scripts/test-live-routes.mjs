import http from 'http';

const urls = [
  'http://localhost:8080/',
  'http://localhost:8080/dashboard/student',
  'http://localhost:8080/dashboard/faculty',
  'http://localhost:8080/dashboard/professional',
  'http://localhost:8080/admin/command-centre',
  'http://localhost:8080/app',
  'http://127.0.0.1:8000/health',
  'http://127.0.0.1:8000/api/v1/tools/health/summary'
];

async function testAll() {
  console.log('--- TESTING LIVE RUNTIME RESPONSES ---');
  for (const url of urls) {
    const start = Date.now();
    try {
      const res = await fetch(url);
      const elapsed = Date.now() - start;
      const text = await res.text();
      const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : (url.includes('8000') ? JSON.parse(text).status || 'API' : 'No Title');
      console.log(`[PASS] ${res.status} ${url} (${elapsed}ms) - Title: "${title}" - Payload: ${text.length} bytes`);
    } catch (err) {
      const elapsed = Date.now() - start;
      console.log(`[FAIL] ${url} (${elapsed}ms) - Error: ${err.message}`);
    }
  }
}

testAll();
