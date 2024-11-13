import IPinfoWrapper, {
    LruCache,
    Options,
    IPinfo,
    AsnResponse
} from "node-ipinfo";

const cacheOptions: Options<string, any> = {
    max: 5000,
    ttl: 24 * 1000 * 60 * 60
};
const cache = new LruCache(cacheOptions);

const token = process.env.IPINFO_TOKEN!;
const ipinfoWrapper = new IPinfoWrapper(token, cache);

ipinfoWrapper.lookupIp("1.1.1.1").then((response: IPinfo) => {
    console.log(response);
});

ipinfoWrapper.lookupASN("AS123").then((response: AsnResponse) => {
    console.log(response);
});
