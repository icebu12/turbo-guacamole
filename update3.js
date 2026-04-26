import fs from "fs";
import path from "path";

const START_URL = "https://url24.link/AtomSporTV";
const OUTPUT_FOLDER = "streams3";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
  Referer: "https://url24.link/",
};

const M3U8_HEADER = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5500000,AVERAGE-BANDWIDTH=8976000,RESOLUTION=1920x1080,CODECS="avc1.640028,mp4a.40.2",FRAME-RATE=25`;

async function fetchNoRedirect(url) {
  const res = await fetch(url, {
    headers: HEADERS,
    redirect: "manual",
  });
  return res;
}

async function getBaseDomain() {
  const fallback = "https://atomsportv500.top";

  try {
    const r1 = await fetchNoRedirect(START_URL);
    const loc1 = r1.headers.get("location");

    if (loc1) {
      const r2 = await fetchNoRedirect(loc1);
      const loc2 = r2.headers.get("location");

      if (loc2) {
        return loc2.trim().replace(/\/$/, "");
      }
    }

    return fallback;
  } catch (e) {
    return fallback;
  }
}

async function getChannelM3u8(channelId, baseDomain) {
  try {
    const matchesUrl = `${baseDomain}/matches?id=${channelId}`;

    const r1 = await fetch(matchesUrl, { headers: HEADERS });
    const text1 = await r1.text();

    const fetchMatch = text1.match(/fetch\(\s*["'](.*?)["']/);
    if (!fetchMatch) return null;

    let fetchUrl = fetchMatch[1].trim();
    if (!fetchUrl.endsWith(channelId)) {
      fetchUrl += channelId;
    }

    const r2 = await fetch(fetchUrl, { headers: HEADERS });
    const text2 = await r2.text();

    const m3u8Match = text2.match(
      /"(?:stream|url|source|deismackanal)":\s*"(.*?\.m3u8|.*?)"/
    );

    if (m3u8Match) {
      return m3u8Match[1].replace(/\\/g, "");
    }

    return null;
  } catch (e) {
    return null;
  }
}

async function main() {
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
  }

  const baseDomain = await getBaseDomain();

  const mainChannels = [
    { id: "bein-sports-1" },
    { id: "bein-sports-2" },
    { id: "bein-sports-3" },
    { id: "bein-sports-4" },
    { id: "bein-sports-5" },
    { id: "bein-sports-max-1" },
    { id: "bein-sports-max-2" },
    { id: "s-sport" },
    { id: "s-sport-2" },
    { id: "tivibu-spor" },
    { id: "tivibu-spor-1" },
    { id: "tivibu-spor-2" },
    { id: "tivibu-spor-3" },
    { id: "trt-spor" },
    { id: "trt-yildiz" },
    { id: "trt-1" },
    { id: "a-spor" }
  ];

  const tabiiList = [
    "tabii",
    "tabii1",
    "tabii2",
    "tabii3",
    "tabii4",
    "tabii5",
    "tabii6",
  ];

  let templateUrl = null;

  console.log("Scanning streams...");

  for (const ch of mainChannels) {
    const url = await getChannelM3u8(ch.id, baseDomain);

    if (url) {
      if (!templateUrl) templateUrl = url;

      const filePath = path.join(OUTPUT_FOLDER, `${ch.id}.m3u8`);
      fs.writeFileSync(filePath, `${M3U8_HEADER}\n${url}`);

      console.log(`Saved ${ch.id}`);
    }
  }

  if (templateUrl) {
    const parts = templateUrl.split("/");
    const baseHlsUrl = parts.slice(0, -1).join("/");

    for (const tId of tabiiList) {
      const finalUrl = `${baseHlsUrl}/${tId}.m3u8`;

      const filePath = path.join(OUTPUT_FOLDER, `${tId}.m3u8`);
      fs.writeFileSync(filePath, `${M3U8_HEADER}\n${finalUrl}`);

      console.log(`${tId}.m3u8 -> Stream: ${tId}.m3u8`);
    }
  }
}

main();
