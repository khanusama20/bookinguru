const joi = require("joi");
const ResponseUtil = require("../utils/responseUtil");
const guruProxy = require("../proxies/bookinguru.proxy");
const wikipediaProxy = require("../proxies/wikipedia.proxy");
const utils = require("../utils/utils");
const CountryCodes = require("../constants/countries");
const LRUCache = require("../utils/LRUCache");

const WIKI_CONCURRENCY = 5; // be nice to Wikipedia / proxy
const WIKI_CACHE = new LRUCache(1000, 12 * 60 * 60 * 1000); // 12h TTL
const wikiLimit = utils.pLimit(WIKI_CONCURRENCY);

async function getWikipediaSummaryCached(cityName) {
    const key = cityName.toLowerCase();
    const cached = WIKI_CACHE.get(key);
    
    if (cached) {
        return cached;
    };

    const data = await utils.withBackoff(() => wikipediaProxy.getWikipediaSummary(cityName));
    
    const payload = data ? {
        title: data.title,
        extract: data.extract ?? "",
        url: data.content_urls?.desktop?.page
    } : null;

    WIKI_CACHE.set(key, payload);

    return payload;
}

function normalizeCityName(raw) {
    const name = utils.cleanCityName?.(raw) ?? String(raw ?? "").trim();
    return name.replace(/\s+/g, " ");
}

const getCities = async function (req, res) {
    try {
        console.log("Cities request");
        const schema = joi.object({
            countryCode: joi.string().length(2).uppercase().required(),
            page: joi.number().integer().min(1).optional(), // optional: start page
            limit: joi.number().integer().min(1).max(100).optional(), // how many cities to return
        });

        const { countryCode, page = 1, limit = 10 } = await schema.validateAsync({
            countryCode: req.query.countryCode,
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
        });

        let pageNo = page;
        const seen = new Set(); // distinct city names
        const collected = []; // final city objects

        let totalPages = null;

        // await schema.validateAsync(req.query);
        // let country_code = req.query.countryCode;
        // let pageNo = 1;

        while(collected.length < limit) {

            const response = await utils.withBackoff(() => guruProxy.getPollution(countryCode, pageNo));
            totalPages = response.data.meta.totalPages;

            const results = Array.isArray(response.data.results) ? response.data.results : [];

            if (results.length === 0) {
                break;
            }

            const candidates = [];

            for (const row of results) {
                console.log(`-------------------------${row.name}--------------------------`)
                let citiName = utils.cleanCityName(row.name);
                let bool = utils.isLikelyCityName(citiName);
                if (!bool) {
                    continue;
                }
                // Deduplicate by (countryCode + normalized name)
                const key = `${countryCode}:${citiName.toLowerCase()}`;
                if (seen.has(key)) {
                    continue;
                }

                seen.add(key);

                

                candidates.push({
                    ...row,
                    country: CountryCodes[countryCode],
                    citiName,
                    description: "", // to be filled
                });

                if (candidates.length + collected.length >= limit) {
                    break;
                };
            }
            
            // Fetch Wikipedia summaries only for new candidates (deduped)
            // Constrained concurrency + cached to avoid rate limit pain

            const wikiTasks = candidates.map((item) => wikiLimit(async () => {
                const wiki = await getWikipediaSummaryCached(item.name);
                // Prefer exact title match (case-insensitive); otherwise accept close match
                if (wiki && wiki.title && wiki.extract) {
                    
                    const exact = wiki.title.localeCompare(item.name, undefined, {
                        sensitivity: "accent"
                    }) === 0;
                    
                    // always accept; “exact” can be used for scoring if you later need it
                    return {
                        ...item,
                        description: wiki.extract,
                        wikiUrl: wiki.url,
                        _exact: exact
                    };
                }

                return item;
            }));

            const enriched = wikiTasks.length ? await Promise.all(wikiTasks) : candidates;
        
            const withDesc = enriched.filter((c) => c.description && c.description.trim().length > 0);
            const withoutDesc = enriched.filter((c) => !c.description || c.description.trim() === "");

            withDesc.sort((a, b) => (b._exact === true) - (a._exact === true));

            const remainingSlots = Math.max(0, limit - collected.length);
            collected.push(...withDesc.slice(0, remainingSlots));
            
            if (collected.length < limit) {
                const remaining = limit - collected.length;
                collected.push(...withoutDesc.slice(0, remaining));
            }

            if (collected.length >= limit) break;
            if (pageNo >= totalPages) break;
            pageNo++;
        }

        if (collected.length === 0) {
            return res.status(200).json(ResponseUtil.notFound());
        }

        return res.status(200).json(
            ResponseUtil.success({
                page: page,
                limit,
                total: collected.length,
                totalPages: totalPages ?? 1,
                countryCode,
                cities: collected.map(({ _exact, ...rest }) => rest), // strip internal flag
            })
        );
    } catch (error) {
        // console.log(error)
        // if (error.response) {
        //     return res.status(error.response.status).json(ResponseUtil.info(error.response.data));
        // }
        // if (error.name === 'ValidationError') {
        //     return res.status(400).json(ResponseUtil.validationError(error.message));
        // } 
        // return res.status(500).json(ResponseUtil.internalServerError())

        console.error("getCities error:",  error);

        if (error.response) {
        return res
            .status(error.response.status)
            .json(ResponseUtil.info(error.response.data));
        }
        if (error.name === "ValidationError") {
            return res.status(400).json(ResponseUtil.validationError(error.message));
        }
        return res.status(500).json(ResponseUtil.internalServerError());
    }
}

module.exports = {
    getCities
}