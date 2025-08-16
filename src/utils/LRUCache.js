class LRUCache {
    constructor(maxSize = 500, ttlMs = 24 * 60 * 60 * 1000) {
        this.maxSize = maxSize;
        this.ttl = ttlMs;
        this.map = new Map();
    }
    get(key) {
        const hit = this.map.get(key);
        if (!hit) return undefined;
        if (hit.expires < Date.now()) {
            this.map.delete(key);
            return undefined;
        }
        // refresh recency
        this.map.delete(key);
        this.map.set(key, hit);
        return hit.value;
    }
    set(key, value) {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, {
            value,
            expires: Date.now() + this.ttl
        });
        if (this.map.size > this.maxSize) {
            
            // delete least-recently used (first inserted)
            const firstKey = this.map.keys().next().value;
            this.map.delete(firstKey);
        }
    }
}
module.exports = LRUCache;