let { IPinfoWrapper, LruCache } = require("node-ipinfo");

let cacheOptions = {
    max: 5000,
    ttl: 24 * 1000 * 60 * 60
};
let cache = new LruCache(cacheOptions);

let token = process.env.IPINFO_TOKEN;
let ipinfo = new IPinfoWrapper(token, cache);

ipinfo.lookupIp("1.1.1.1").then((response) => {
    console.log(response);
});

ipinfo.lookupASN("AS123").then((response) => {
    console.log(response);
});
