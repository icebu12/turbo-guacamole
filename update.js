import fs from "fs";

const REDIRECT_URL = "https://t.co/6vPuUxO91F";
const BASE_PATTERN = "https://trgoals1532.xyz";
const CONFIG_PAGE_PATH = "/channel.html?id=trgoals";
const MAX_ATTEMPTS = 15;

const STREAM_SUFFIXES = [
  "/trgoals/mono.m3u8",
  "/zirve/mono.m3u8",
  "/b1/mono.m3u8",
  "/b2/mono.m3u8",
  "/b3/mono.m3u8",
  "/b4/mono.m3u8",
  "/b5/mono.m3u8",
  "/bm1/mono.m3u8",
  "/bm2/mono.m3u8",
  "/ss/mono.m3u8",
  "/ss2/mono.m3u8",
  "/t1/mono.m3u8",
  "/t2/mono.m3u8",
  "/t3/mono.m3u8",
  "/t4/mono.m3u8",
  "/smarts/mono.m3u8",
  "/sms2/mono.m3u8",
  "/trtspor/mono.m3u8",
  "/trtspor2/mono.m3u8",
  "/trt1/mono.m3u8",
  "/as/mono.m3u8",
  "/atv/mono.m3u8",
  "/tv8/mono.m3u8",
  "/tv85/mono.m3u8",
  "/f1/mono.m3u8",
  "/nbatv/mono.m3u8",
  "/eu1/mono.m3u8",
  "/eu2/mono.m3u8"
];

const CONFIG_REGEX = /CONFIG\s*=\s*\{[^}]*baseUrl\s*:\s*['"]([^'"]+)['"]/i;

const M3U8_HEADER = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5500000,AVERAGE-BANDWIDTH=8976000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2",FRAME-RATE=25`;

function fetchWithTimeout(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    signal: controller.signal,
    redirect: "follow",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
    }
  })
    .then(res => {
      clearTimeout(id);
      if (!res.ok) return null;
      return res.text();
    })
    .catch(() => null);
}

function loadLastDomain() {
  if (!fs.existsSync("domains.json")) return null;
  const data = JSON.parse(fs.readFileSync("domains.json"));
  return data.lastWorking || null;
}

function saveLastDomain(domain) {
  fs.writeFileSync(
    "domains.json",
    JSON.stringify({ lastWorking: domain }, null, 2)
  );
}

async function domainIsAlive(domain) {
  const res = await fetchWithTimeout(domain);
  return !!res;
}

async function findWorkingDomain() {
  const candidates = [];

  const lastKnown = loadLastDomain();
  if (lastKnown) candidates.push(lastKnown);

  candidates.push(REDIRECT_URL);

  const match = REDIRECT_URL.match(/(\d+)/);
  const startNumber = match ? parseInt(match[1]) : 1000;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const guess = BASE_PATTERN.replace("{num}", startNumber + i);
    candidates.push(guess);
  }

  for (const domain of candidates) {
    console.log("Testing domain:", domain);
    if (await domainIsAlive(domain)) {
      console.log("Domain alive:", domain);
      return domain;
    }
  }

  return null;
}

async function extractBaseUrlFromPage(domain) {
  const fullUrl = domain + CONFIG_PAGE_PATH;

  console.log("Visiting config page:", fullUrl);

  const html = await fetchWithTimeout(fullUrl);
  if (!html) return null;

  const match = html.match(CONFIG_REGEX);
  return match ? match[1] : null;
}

async function validateStream(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok &&
      res.headers.get("content-type")?.includes("mpegurl");
  } catch {
    return false;
  }
}

async function generateStreams(baseUrl) {
  let success = 0;

  for (let i = 0; i < STREAM_SUFFIXES.length; i++) {
    const streamUrl = baseUrl + STREAM_SUFFIXES[i];

    console.log("Validating stream:", streamUrl);

    if (!(await validateStream(streamUrl))) {
      console.log("Invalid:", streamUrl);
      continue;
    }

    const content = `${M3U8_HEADER}
${streamUrl}
`;

    const filename = `stream_${i + 1}.m3u8`;
    fs.writeFileSync(filename, content);

    console.log("Created:", filename);
    success++;
  }

  return success;
}

(async () => {
  const domain = await findWorkingDomain();
  if (!domain) throw new Error("No working domain found");

  const baseUrl = await extractBaseUrlFromPage(domain);
  if (!baseUrl) throw new Error("Could not extract baseUrl");

  console.log("Extracted baseUrl:", baseUrl);

  const count = await generateStreams(baseUrl);
  if (count === 0) throw new Error("No valid streams generated");

  saveLastDomain(domain);

  console.log("Done. Streams generated:", count);
})();
