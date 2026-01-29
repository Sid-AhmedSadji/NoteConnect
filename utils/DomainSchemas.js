const DOMAIN_SCHEMAS = {
    // =========================
    // 1) FR - "chapitre-XX"
    // =========================
    "french-chapitre-url": {
        domains: [
            "m.scan-manga.com",
            "www.scan-manga.com",
            "scan-manga.com",
            "manga-scantrad.net",
            "www.manga-scantrad.net",
            "reaperscans.fr",
        ],
        chapter: {
            source: "url",
            patterns: [
                /chapitre[-_ ]?(\d+(\.\d+)?)(?:\/|$)/i
            ]
        }
    },

    // =========================
    // 2) EN - "chapter-XX" (standard)
    // =========================
    "english-chapter-url": {
        domains: [
            "1stkissmanga.io",
            "agscomics.com",
            "asura.gg",
            "asura.nacm.xyz",
            "asuracomics.com",
            "asuratoon.com",
            "chapmanganato.com",
            "chapmanganato.to",
            "comix.to",
            "dark-scan.com",
            "dragontea.ink",
            "flamescans.org",
            "isekaiscan.com",
            "kissmanga.in",
            "kunmanga.com",
            "lhtranslation.net",
            "mangabuddy.com",
            "mangaclash.com",
            "mangaeffect.com",
            "mangakomi.com",
            "manganelo.com",
            "mangasushi.org",
            "manhuaus.org",
            "manhuagold.top",
            "manhuaplus.com",
            "manhuas.net",
            "manhuaus.com",
            "manhwaclan.com",
            "newmanhua.com",
            "novelmic.com",
            "ravenscans.com",
            "readmanganato.com",
            "reaperscans.com",
            "topmanhua.com",
            "unwantedundeadadventurer.com",
            "wistoriawandandsword.site",
            "www.asurascans.com",
            "manga-raw.club",
            "www.mangaread.org",
            "www.mgeko.cc",
            "www.mreader.co",
            "www.webtoon.xyz",
        ],
        chapter: {
            source: "url",
            patterns: [
                /chapter[-_ ]?(\d+(\.\d+)?)(?:\/|$)/i
            ]
        }
    },

    // =========================
    // 3) Mangakakalot - "chapter/ID/chapter_XX"
    // =========================
    "mangakakalot-chapter-url": {
        domains: [
            "mangakakalot.com",
            "ww2.mangakakalots.com",
            "www.mangakakalove.com",
            "www.mangakakalot.gg",
            "ww6.mangakakalot.tv",
        ],
        chapter: {
            source: "url",
            patterns: [
                /\/chapter[-_]?(\d+(\.\d+)?)(?:\/|$)/i
            ]
        }
    },

    // =========================
    // 4) Numérique à la fin (scan-fr / lelscans)
    // =========================
    "numeric-end-url": {
        domains: [
            "lelscans.net",
            "www.lelscans.net",
            "scan-fr.cc",
            "www.scan-fr.cc",
            "scan-fr.org",
            "www.scan-fr.org"
        ],
        chapter: {
            source: "url",
            patterns: [
                /\/(\d+)(?:#.*)?$/  // reste inchangé, fonctionne déjà
            ]
        }
    },

    // =========================
    // 5) Mangafreak - Read1_..._XX
    // =========================
    "mangafreak-read": {
        domains: [
            "w11.mangafreak.net",
            "www.w11.mangafreak.net",
            "ww2.mangafreak.me",
            "www.ww2.mangafreak.me"
        ],
        chapter: {
            source: "url",
            patterns: [
                /Read1_.*?_(\d+(\.\d+)?)(?:\/|$)/i
            ]
        }
    },

    // =========================
    // 6) AsuraComic - ancien et nouveau format
    // =========================
    "asuracomic": {
        domains: [
            "asuracomic.net"
        ],
        chapter: {
            source: "url",
            patterns: [
                /chapter[-_ ]?(\d+(\.\d+)?)(?:\/|$)/i,    // ancien format
                /\/chapter\/(\d+(\.\d+)?)(?:\/|$)/i       // nouveau format
            ]
        }
    },

    // =========================
    // 7) Mangadex - via API
    // =========================
    "mangadex": {
        domains: [
            "mangadex.org",
        ],
        id : [
            /\/chapter\/([a-f0-9-]{36})/i
        ],
        chapter: {
            source: "api",
            api: {
                type: "mangadex",
                endpoint: "https://api.mangadex.org/chapter/{id}",
                data: "data.attributes.chapter"
            }
        }
    }
};

export default DOMAIN_SCHEMAS;
