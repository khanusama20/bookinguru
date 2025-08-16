const INVALID_PATTERNS = [/power\s*plant/gi, /unknown/gi, /station/gi, /monitoring/gi, /plaza\s*mayor/gi];

function cleanCityName(rawName) {
    if (!rawName) return null;
    let name = rawName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\(.*?\)/g, match => ` ${match.slice(1, -1)}`).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
    name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    if (INVALID_PATTERNS.some(pattern => pattern.test(name))) {
        return null;
    }
    return name;
}
async function withBackoff(task, {
    tries = 4,
    baseMs = 250,
    factor = 2
} = {}) {
    let attempt = 0;
    while (true) {
        try {
            return await task();
        } catch (err) {
            const status = err?.response?.status;
            const retriable = status === 429 || (status >= 500 && status < 600) || !status; // network/429/5xx
            attempt++;
            if (!retriable || attempt >= tries) throw err;
            const delay = baseMs * Math.pow(factor, attempt - 1) + Math.floor(Math.random() * 100); // jitter
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}

function pLimit(concurrency) {
    let active = 0;
    const queue = [];
    const next = () => {
        if (active >= concurrency || queue.length === 0) return;
        active++;
        const {
            fn,
            resolve,
            reject
        } = queue.shift();
        Promise.resolve().then(fn).then(resolve, reject).finally(() => {
            active--;
            next();
        });
    };
    return (fn) => new Promise((resolve, reject) => {
        queue.push({
            fn,
            resolve,
            reject
        });
        next();
    });
}

function isLikelyCityName(name) {
    if (!name || typeof name !== "string") return false;
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 64) return false;
    // No digits or obviously wrong tokens
    if (/[0-9]/.test(trimmed)) return false;
    // Allow letters, spaces, hyphens, apostrophes, dots
    if (!/^[\p{L}\s.'-]+$/u.test(trimmed)) return false;
    // Exclude administrative words that often show up as noise
    const badTokens = [
        "area", 
        "province", 
        "region", 
        "district", 
        "state", 
        "county", 
        "municipality", 
        "governorate", 
        "prefecture", 
        "airport", 
        "industrial" ,
        "zone",
        "station",
        "east"
    ];
    const lower = trimmed.toLowerCase();
    if (badTokens.some((t) => lower.endsWith(t) || lower.includes(` ${t} `))) {
        return false;
    }
    return true;
}


module.exports = {
    cleanCityName,
    withBackoff,
    pLimit,
    isLikelyCityName
}