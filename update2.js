import fs from "fs";

const REDIRECT_URL = "https://taraftariumizle.org";
const WORKER_PROXY = "https://proxy.freecdn.workers.dev/?url=";
const MAX_ATTEMPTS = 15;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
const REFERER = `${REDIRECT_URL}/`
const OUTPUT_DIR = "streams2";

const STREAM_SUFFIXES = [
    { name: "androstreamlivebiraz1", path: `androstreamlivebiraz1.m3u8` },
    { name: "androstreamlivebs1", path: `androstreamlivebs1.m3u8` },
    { name: "androstreamlivebs2", path: `androstreamlivebs2.m3u8` },
    { name: "androstreamlivebs3", path: `androstreamlivebs3.m3u8` },
    { name: "androstreamlivebs4", path: `androstreamlivebs4.m3u8` },
    { name: "androstreamlivebs5", path: `androstreamlivebs5.m3u8` },
    { name: "androstreamlivebsm1", path: `androstreamlivebsm1.m3u8` },
    { name: "androstreamlivebsm2", path: `androstreamlivebsm2.m3u8` },
    { name: "androstreamlivess1", path: `androstreamlivess1.m3u8` },
    { name: "androstreamlivess2", path: `androstreamlivess2.m3u8` },
    { name: "androstreamlivessplus1", path: `androstreamlivessplus1.m3u8` },
    { name: "androstreamlivets", path: `androstreamlivets.m3u8` },
    { name: "androstreamlivets1", path: `androstreamlivets1.m3u8` },
    { name: "androstreamlivets2", path: `androstreamlivets2.m3u8` },
    { name: "androstreamlivets3", path: `androstreamlivets3.m3u8` },
    { name: "androstreamlivets4", path: `androstreamlivets4.m3u8` },
    { name: "androstreamlivesm1", path: `androstreamlivesm1.m3u8` },
    { name: "androstreamlivesm2", path: `androstreamlivesm2.m3u8` },
    { name: "androstreamlivees1", path: `androstreamlivees1.m3u8` },
    { name: "androstreamlivees2", path: `androstreamlivees2.m3u8` },
    { name: "androstreamliveidm", path: `androstreamliveidm.m3u8` },
    { name: "androstreamlivetrt1", path: `androstreamlivetrt1.m3u8` },
    { name: "androstreamlivetrts", path: `androstreamlivetrts.m3u8` },
    { name: "androstreamlivetrtsy", path: `androstreamlivetrtsy.m3u8` },
    { name: "androstreamliveatv", path: `androstreamliveatv.m3u8` },
    { name: "androstreamliveas", path: `androstreamliveas.m3u8` },
    { name: "androstreamlivea2", path: `androstreamlivea2.m3u8` },
    { name: "androstreamlivetjk", path: `androstreamlivetjk.m3u8` },
    { name: "androstreamliveht", path: `androstreamliveht.m3u8` },
    { name: "androstreamlivenba", path: `androstreamlivenba.m3u8` },
    { name: "androstreamlivetv8", path: `androstreamlivetv8.m3u8` },
    { name: "androstreamlivetv85", path: `androstreamlivetv85.m3u8` },
    { name: "androstreamlivetb", path: `androstreamlivetb.m3u8` },
    { name: "androstreamlivetb1", path: `androstreamlivetb1.m3u8` },
    { name: "androstreamlivetb2", path: `androstreamlivetb2.m3u8` },
    { name: "androstreamlivetb3", path: `androstreamlivetb3.m3u8` },
    { name: "androstreamlivetb4", path: `androstreamlivetb4.m3u8` },
    { name: "androstreamlivetb5", path: `androstreamlivetb5.m3u8` },
    { name: "androstreamlivetb6", path: `androstreamlivetb6.m3u8` },
    { name: "androstreamlivetb7", path: `androstreamlivetb7.m3u8` },
    { name: "androstreamlivetb8", path: `androstreamlivetb8.m3u8` },
    { name: "androstreamlivefb", path: `androstreamlivefb.m3u8` },
    { name: "androstreamlivecbcs", path: `androstreamlivecbcs.m3u8` },
    { name: "androstreamlivegs", path: `androstreamlivegs.m3u8` },
    { name: "androstreamlivesptstv", path: `androstreamlivesptstv.m3u8` },
    { name: "androstreamliveexn", path: `androstreamliveexn.m3u8` },
    { name: "androstreamliveexn1", path: `androstreamliveexn1.m3u8` },
    { name: "androstreamliveexn2", path: `androstreamliveexn2.m3u8` },
    { name: "androstreamliveexn3", path: `androstreamliveexn3.m3u8` },
    { name: "androstreamliveexn4", path: `androstreamliveexn4.m3u8` },
    { name: "androstreamliveexn5", path: `androstreamliveexn5.m3u8` },
    { name: "androstreamliveexn6", path: `androstreamliveexn6.m3u8` },
    { name: "androstreamliveexn7", path: `androstreamliveexn7.m3u8` },
    { name: "androstreamliveexn8", path: `androstreamliveexn8.m3u8` }
];

const CONFIG_REGEX = /const\s+baseurls\s*=\s*\[(.*?)\]/is;

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
            "User-Agent": USER_AGENT
        }
    })
        .then(res => {
            clearTimeout(id);
            if (!res.ok) return null;
            return res.text();
        })
        .catch(() => null);
}

function extractAmpUrl(html) {
    const match = html.match(
        /<link\s+rel=["']amphtml["']\s+href=["']([^"']+)["']/i
    );

    if (!match) return null;

    return match[1];
}

async function resolveAmpDomain() {
    const proxiedUrl = WORKER_PROXY + encodeURIComponent(REDIRECT_URL);

    console.log("Visiting main site:", proxiedUrl);

    const html = await fetchWithTimeout(proxiedUrl);
    if (!html) return null;

    const ampUrl = extractAmpUrl(html);

    console.log("AMP URL found:", ampUrl);

    return ampUrl;
}

function extractCurrentIframe(html) {
    const match = html.match(
        /<script\s+type=["']application\/json["']>\s*({[\s\S]*?})\s*<\/script>/i
    );

    if (!match) return null;

    try {
        const json = JSON.parse(match[1]);
        return json.currentIframe || null;
    } catch (err) {
        console.log("JSON parse failed");
        return null;
    }
}

async function resolveRedirectChain(startUrl, maxDepth = 5) {
    let currentUrl = startUrl;

    for (let i = 0; i < maxDepth; i++) {
        console.log("Resolving:", currentUrl);

        const res = await fetch(currentUrl, {
            redirect: "follow",
            headers: { "User-Agent": USER_AGENT }
        }).catch(() => null);

        if (!res || !res.ok) return null;

        // If HTTP redirect happened, fetch already followed it
        let finalUrl = res.url;

        const text = await res.text();

        // 1️⃣ JS redirect (location.replace or window.location)
        const jsMatch = text.match(/location\.replace\(["']([^"']+)["']\)/i)
            || text.match(/window\.location\s*=\s*["']([^"']+)["']/i);

        if (jsMatch) {
            currentUrl = jsMatch[1];
            continue;
        }

        // 2️⃣ Meta refresh redirect
        const metaMatch = text.match(
            /<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["'][^"']*url=([^"']+)["']/i
        );

        if (metaMatch) {
            currentUrl = metaMatch[1];
            continue;
        }

        // No more JS/meta redirect → return final origin
        return new URL(finalUrl).origin;
    }

    return null;
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
        const resolved = await resolveRedirectChain(REDIRECT_URL);
        if (resolved) {
            console.log("Resolved final domain:", resolved);
            return resolved;
        }
    }

    return null;
}

async function resolveIframeUrl(domain) {
    const proxiedAmp = WORKER_PROXY + encodeURIComponent(domain);

    console.log("Visiting AMP page:", proxiedAmp);

    const html = await fetchWithTimeout(proxiedAmp);
    if (!html) return null;

    const iframeUrl = extractCurrentIframe(html);
    console.log("Iframe URL found:", iframeUrl);

    return iframeUrl;
}

function extractBaseUrls(html) {
    const blockMatch = html.match(CONFIG_REGEX);
    if (!blockMatch) return [];

    const arrayContent = blockMatch[1];

    // Extract individual URLs
    const urls = [...arrayContent.matchAll(/https?:\/\/[^"']+/g)]
        .map(match => match[0]);

    return urls;
}

async function pickWorkingBaseUrl(baseUrls) {
    for (const url of baseUrls) {

        // Try lightweight test
        const testUrl = WORKER_PROXY + url + "receptestt.m3u8";

        const valid = await validateStream(testUrl);

        if (valid) {
            return url;
        }
    }

    return null;
}

async function validateStream(url) {
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": USER_AGENT,
                "Referer": REFERER,
                "Origin": REFERER
            }
        });

        if (!res.ok) {
            console.log("Status:", res.status);
            return false;
        }

        const text = await res.text();

        // Check if it looks like real m3u8
        if (text.includes("#EXTM3U")) {
            return true;
        }

        return false;

    } catch (err) {
        console.log("Error validating:", err.message);
        return false;
    }
}

async function generateStreams(baseUrl) {
    let success = 0;

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const file of fs.readdirSync(OUTPUT_DIR)) {
        if (file.endsWith(".m3u8")) {
            fs.unlinkSync(`${OUTPUT_DIR}/${file}`);
        }
    }

    for (const stream of STREAM_SUFFIXES) {

        const streamUrl = baseUrl + stream.path;

        //console.log("Validating stream:", streamUrl);

        /*    const valid = await validateStream(streamUrl);
 
            if (valid) {*/
        success++;

        const filename = `${OUTPUT_DIR}/stream_${stream.name}.m3u8`;

        const content = `${M3U8_HEADER}
${streamUrl}
`;

        fs.writeFileSync(filename, content);

        /* } else {
             streamStatus.error = "Validation failed";
         }*/
    }

    return success;
}

(async () => {
    const ampDomain = await resolveAmpDomain();
    if (!ampDomain) throw new Error("Could not resolve AMP domain");

    const iframeUrl = await resolveIframeUrl(ampDomain);
    if (!iframeUrl) throw new Error("Iframe URL not found");

    const proxiedIframe = WORKER_PROXY + encodeURIComponent(iframeUrl);
    const iframeHtml = await fetchWithTimeout(proxiedIframe);

    const baseUrls = extractBaseUrls(iframeHtml);
    const baseUrl = await pickWorkingBaseUrl(baseUrls);
    console.log("Extracted baseUrl:", baseUrl);

    const count = await generateStreams(baseUrl);
    if (count === 0) throw new Error("No valid streams generated");

    console.log("Done. Streams generated:", count);
})();
