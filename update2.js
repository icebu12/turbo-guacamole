import fs from "fs";

const REDIRECT_URL = "https://taraftariumizle.org";
const BASE_PATTERN = REDIRECT_URL;
const CONFIG_PAGE_PATH = "/event.html?id=androstreamlivebs1";
const MAX_ATTEMPTS = 15;
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
const REFERER = `${REDIRECT_URL}/`
const OUTPUT_DIR = "streams2";
const PREFIX = "/checklist"

const healthReport = {
    timestamp: Date.now(),
    success: false,
    baseUrl: null,
    streams: [],
    error: null
};

const STREAM_SUFFIXES = [
    { name: "androstreamlivebs1", path: `${PREFIX}/receptestt.m3u8` },
    { name: "androstreamlivebs2", path: `${PREFIX}/androstreamlivebs2.m3u8` },
    { name: "androstreamlivebs3", path: `${PREFIX}/androstreamlivebs3.m3u8` },
    { name: "androstreamlivebs4", path: `${PREFIX}/androstreamlivebs4.m3u8` },
    { name: "androstreamlivebs5", path: `${PREFIX}/androstreamlivebs5.m3u8` },
    { name: "androstreamlivebsm1", path: `${PREFIX}/androstreamlivebsm1.m3u8` },
    { name: "androstreamlivebsm2", path: `${PREFIX}/androstreamlivebsm2.m3u8` },
    { name: "androstreamlivess1", path: `${PREFIX}/androstreamlivess1.m3u8` },
    { name: "androstreamlivess2", path: `${PREFIX}/androstreamlivess2.m3u8` },
    { name: "androstreamlivessplus1", path: `${PREFIX}/androstreamlivessplus1.m3u8` },
    { name: "androstreamlivets", path: `${PREFIX}/androstreamlivets.m3u8` },
    { name: "androstreamlivets1", path: `${PREFIX}/androstreamlivets1.m3u8` },
    { name: "androstreamlivets2", path: `${PREFIX}/androstreamlivets2.m3u8` },
    { name: "androstreamlivets3", path: `${PREFIX}/androstreamlivets3.m3u8` },
    { name: "androstreamlivets4", path: `${PREFIX}/androstreamlivets4.m3u8` },
    { name: "androstreamlivesm1", path: `${PREFIX}/androstreamlivesm1.m3u8` },
    { name: "androstreamlivesm2", path: `${PREFIX}/androstreamlivesm2.m3u8` },
    { name: "androstreamlivees1", path: `${PREFIX}/androstreamlivees1.m3u8` },
    { name: "androstreamlivees2", path: `${PREFIX}/androstreamlivees2.m3u8` },
    { name: "androstreamliveidm", path: `${PREFIX}/androstreamliveidm.m3u8` },
    { name: "androstreamlivetrt1", path: `${PREFIX}/androstreamlivetrt1.m3u8` },
    { name: "androstreamlivetrts", path: `${PREFIX}/androstreamlivetrts.m3u8` },
    { name: "androstreamlivetrtsy", path: `${PREFIX}/androstreamlivetrtsy.m3u8` },
    { name: "androstreamliveatv", path: `${PREFIX}/androstreamliveatv.m3u8` },
    { name: "androstreamliveas", path: `${PREFIX}/androstreamliveas.m3u8` },
    { name: "androstreamlivea2", path: `${PREFIX}/androstreamlivea2.m3u8` },
    { name: "androstreamlivetjk", path: `${PREFIX}/androstreamlivetjk.m3u8` },
    { name: "androstreamliveht", path: `${PREFIX}/androstreamliveht.m3u8` },
    { name: "androstreamlivenba", path: `${PREFIX}/androstreamlivenba.m3u8` },
    { name: "androstreamlivetv8", path: `${PREFIX}/androstreamlivetv8.m3u8` },
    { name: "androstreamlivetv85", path: `${PREFIX}/androstreamlivetv85.m3u8` },
    { name: "androstreamlivetb", path: `${PREFIX}/androstreamlivetb.m3u8` },
    { name: "androstreamlivetb1", path: `${PREFIX}/androstreamlivetb1.m3u8` },
    { name: "androstreamlivetb2", path: `${PREFIX}/androstreamlivetb2.m3u8` },
    { name: "androstreamlivetb3", path: `${PREFIX}/androstreamlivetb3.m3u8` },
    { name: "androstreamlivetb4", path: `${PREFIX}/androstreamlivetb4.m3u8` },
    { name: "androstreamlivetb5", path: `${PREFIX}/androstreamlivetb5.m3u8` },
    { name: "androstreamlivetb6", path: `${PREFIX}/androstreamlivetb6.m3u8` },
    { name: "androstreamlivetb7", path: `${PREFIX}/androstreamlivetb7.m3u8` },
    { name: "androstreamlivetb8", path: `${PREFIX}/androstreamlivetb8.m3u8` },
    { name: "androstreamlivefb", path: `${PREFIX}/androstreamlivefb.m3u8` },
    { name: "androstreamlivecbcs", path: `${PREFIX}/androstreamlivecbcs.m3u8` },
    { name: "androstreamlivegs", path: `${PREFIX}/androstreamlivegs.m3u8` },
    { name: "androstreamlivesptstv", path: `${PREFIX}/androstreamlivesptstv.m3u8` },
    { name: "androstreamliveexn", path: `${PREFIX}/androstreamliveexn.m3u8` },
    { name: "androstreamliveexn1", path: `${PREFIX}/androstreamliveexn1.m3u8` },
    { name: "androstreamliveexn2", path: `${PREFIX}/androstreamliveexn2.m3u8` },
    { name: "androstreamliveexn3", path: `${PREFIX}/androstreamliveexn3.m3u8` },
    { name: "androstreamliveexn4", path: `${PREFIX}/androstreamliveexn4.m3u8` },
    { name: "androstreamliveexn5", path: `${PREFIX}/androstreamliveexn5.m3u8` },
    { name: "androstreamliveexn6", path: `${PREFIX}/androstreamliveexn6.m3u8` },
    { name: "androstreamliveexn7", path: `${PREFIX}/androstreamliveexn7.m3u8` },
    { name: "androstreamliveexn8", path: `${PREFIX}/androstreamliveexn8.m3u8` }
];

const CONFIG_REGEX = /const\s+baseurls\s*=\s*\[\s*([\s\S]*?)\s*\]/i;

const M3U8_HEADER = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=5500000,RESOLUTION=1920x1080,FRAME-RATE=25`;

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

function loadLastDomain() {
    if (!fs.existsSync("domains2.json")) return null;
    const data = JSON.parse(fs.readFileSync("domains2.json"));
    return data.lastWorking || null;
}

function saveLastDomain(domain) {
    fs.writeFileSync(
        "domains2.json",
        JSON.stringify({ lastWorking: domain }, null, 2)
    );
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

async function extractBaseUrlFromPage(domain) {
    const fullUrl = domain + CONFIG_PAGE_PATH;

    console.log("Visiting config page:", fullUrl);

    const html = await fetchWithTimeout(fullUrl);
    if (!html) return null;

    const baseUrls = extractBaseUrls(html);
    if (baseUrls.length === 0) return null;

    const working = await pickWorkingBaseUrl(baseUrls, configPageUrl);

    return working;
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

async function pickWorkingBaseUrl(baseUrls, referer) {

    for (const url of baseUrls) {

        // Try lightweight test
        const testUrl = `${url}${PREFIX}/receptestt.m3u8`;

        const valid = await validateStream(testUrl, referer);

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

        const streamStatus = {
            name: stream.name,
            url: streamUrl,
            valid: false,
            error: null
        };

        console.log("Validating stream:", streamUrl);

        try {

            const valid = await validateStream(streamUrl);

            if (valid) {

                streamStatus.valid = true;
                success++;

                const filename = `${OUTPUT_DIR}/stream_${stream.name}.m3u8`;

                const content = `${M3U8_HEADER}
${streamUrl}
`;

                fs.writeFileSync(filename, content);

            } else {
                streamStatus.error = "Validation failed";
            }

        } catch (err) {
            streamStatus.error = err.message;
        }

        healthReport.streams.push(streamStatus);
    }

    return success;
}

(async () => {
    try {
       /* const domain = await findWorkingDomain();
        healthReport.workingDomain = domain;
        if (!domain) throw new Error("No working domain found");*/

        const baseUrl = await extractBaseUrlFromPage(BASE_PATTERN);
        healthReport.baseUrl = baseUrl;
        if (!baseUrl) throw new Error("Could not extract baseUrl");

        console.log("Extracted baseUrl:", baseUrl);

        const count = await generateStreams(baseUrl);
        if (count === 0) throw new Error("No valid streams generated");

        //saveLastDomain(domain);

        healthReport.success = healthReport.streams.some(s => s.valid);

        fs.writeFileSync(
            "health2.json",
            JSON.stringify(healthReport, null, 2)
        );

        console.log("Done. Streams generated:", count);
    } catch (err) {
        healthReport.error = err.message;
    }
})();
