const INVALID_PATTERNS = [/power\s*plant/gi, /unknown/gi, /station/gi, /monitoring/gi, /plaza\s*mayor/gi];

function cleanCityName(rawName) {
    if (!rawName) return null;
    
    let name = rawName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\(.*?\)/g, match => ` ${match.slice(1, -1)}`)
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    name = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
    if (INVALID_PATTERNS.some(pattern => pattern.test(name))) {
        return null;
    }
    return name;
}

module.exports = {
    cleanCityName
}