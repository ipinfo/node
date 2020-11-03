import LRU, { Options } from "lru-cache";
import IPCache from "./cache";

const cacheOptions: Options = {
    // The maximum number of items allowed in the cache.
    max: 5000,

    // The maximum life of a cached item in milliseconds.
    maxAge: 24 * 1000 * 60 * 60,
};

export default class LruCache implements IPCache {
    private cache: any;

    constructor(option: Options = cacheOptions) {
        this.cache = new LRU(option);
    }

    public get(key: string): any {
        return this.cache.get(key);
    }

    public set(key: string, data: any): void {
        this.cache.set(key, data);
    }
}
