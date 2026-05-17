#!/usr/bin/env node
/** Usage: node scripts/verify-youtube-oembed.mjs id1 id2 ... */
const ids = process.argv.slice(2);
for (const id of ids) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.log(`${id}\tFAIL\t${res.status}`);
      continue;
    }
    const data = await res.json();
    console.log(`${id}\tOK\t${data.title?.slice(0, 60) ?? ""}`);
  } catch (e) {
    console.log(`${id}\tERR\t${e.message}`);
  }
}
