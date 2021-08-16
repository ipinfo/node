import { IncomingMessage } from "http";
import https, { RequestOptions } from "https";
import countries from "../config/en_US.json";
import Cache from "./cache/cache";
import LruCache from "./cache/lruCache";
import {
    IPinfo,
    AsnResponse,
    MapResponse,
    BatchResponse,
    BATCH_MAX_SIZE,
    BATCH_REQ_TIMEOUT_DEFAULT,
    REQUEST_TIMEOUT_DEFAULT,
    CACHE_VSN,
    HOST
} from "./common";
import VERSION from "./version";

export { Cache, LruCache };
export { Options } from "lru-cache";

const clientUserAgent = `IPinfoClient/nodejs/${VERSION}`;

export default class IPinfoWrapper {
    private token: string;
    private countries: any;
    private cache: Cache;
    private timeout: number;
    private limitErrorMessage: string =
        "You have exceeded 50,000 requests a month. Visit https://ipinfo.io/account to see your API limits.";
    private mapLimitErrorMessage: string =
        "You have exceeded maximum IP upload limit i.e 500,000 IPs per request.";

    constructor(token: string, cache?: Cache, timeout?: number) {
        this.token = token;
        this.countries = countries;
        this.cache = cache ? cache : new LruCache();
        this.timeout =
            timeout === null || timeout === undefined
                ? REQUEST_TIMEOUT_DEFAULT
                : timeout;
    }

    public static cacheKey(k: string) {
        return `${k}:${CACHE_VSN}`;
    }

    public lookupIp(ip: string): Promise<IPinfo> {
        const data = this.cache.get(IPinfoWrapper.cacheKey(ip));
        if (data) {
            return new Promise((resolve) => {
                resolve(data);
            });
        }

        const config: RequestOptions = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": clientUserAgent
            },
            method: "GET",
            host: HOST,
            path: `/${ip}`,
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
            try {
                const req = https.request(config, (res: IncomingMessage) => {
                    let data = "";

                    res.on("data", (chunk: any) => {
                        data += chunk;
                    });

                    res.on("close", () => {
                        const ipinfo: IPinfo = JSON.parse(data);

                        /* convert country code to full country name */
                        // NOTE: always do this _before_ setting cache.
                        if (ipinfo.country) {
                            ipinfo.countryCode = ipinfo.country;
                            ipinfo.country =
                                this.countries[ipinfo.countryCode];
                        }
                        if (ipinfo.abuse && ipinfo.abuse.country) {
                            ipinfo.abuse.countryCode = ipinfo.abuse.country;
                            ipinfo.abuse.country =
                                this.countries[ipinfo.abuse.countryCode];
                        }

                        this.cache.set(IPinfoWrapper.cacheKey(ip), ipinfo);
                        resolve(ipinfo);
                    });

                    res.on("error", (error: any) => {
                        if (error.response && error.response.status === 429) {
                            reject(this.limitErrorMessage);
                        }
                        reject(error);
                    });
                });

                req.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    public lookupASN(asn: string): Promise<AsnResponse> {
        const data = this.cache.get(IPinfoWrapper.cacheKey(asn));
        if (data) {
            return new Promise((resolve) => {
                resolve(data);
            });
        }

        const config: RequestOptions = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": clientUserAgent
            },
            method: "GET",
            host: HOST,
            path: `/${asn}/json`,
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
            try {
                const req = https.request(config, (res: IncomingMessage) => {
                    let data = "";

                    res.on("data", (chunk: any) => {
                        data += chunk;
                    });

                    res.on("close", () => {
                        const asnResp: AsnResponse = JSON.parse(data);

                        /* convert country code to full country name */
                        // NOTE: always do this _before_ setting cache.
                        if (asnResp.country) {
                            asnResp.countryCode = asnResp.country;
                            asnResp.country =
                                this.countries[asnResp.countryCode];
                        }

                        this.cache.set(IPinfoWrapper.cacheKey(asn), asnResp);
                        resolve(asnResp);
                    });

                    res.on("error", (error: any) => {
                        if (error.response && error.response.status === 429) {
                            reject(this.limitErrorMessage);
                        }
                        reject(error);
                    });
                });

                req.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    public getMap(ips: string[]): Promise<MapResponse> {
        if (ips.length > 500000) {
            return new Promise((_resolve, reject) => {
                reject(this.mapLimitErrorMessage);
            });
        }

        const ipsData = JSON.stringify(ips);

        const config: RequestOptions = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "Content-Length": ipsData.length,
                "User-Agent": clientUserAgent
            },
            method: "POST",
            host: HOST,
            path: `/tools/map?cli=1`,
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
            try {
                const req = https.request(config, (res: IncomingMessage) => {
                    let data = "";

                    res.on("data", (chunk: any) => {
                        data += chunk;
                    });

                    res.on("close", () => {
                        resolve(JSON.parse(data));
                    });

                    res.on("error", (error: any) => {
                        if (error.response && error.response.status === 429) {
                            reject(this.limitErrorMessage);
                        }
                        reject(error);
                    });
                });

                req.on("error", (error) => {
                    reject(error);
                });

                req.write(ipsData);
                req.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private __getBatch(
        ips: string[],
        batchTimeout: number,
        filter: boolean
    ): Promise<any> {
        const ipsData = JSON.stringify(ips);
        const config: RequestOptions = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "Content-Length": ipsData.length,
                "User-Agent": clientUserAgent
            },
            method: "POST",
            host: HOST,
            path: `/batch${filter ? "?filter=1" : ""}`,
            timeout: batchTimeout
        };

        return new Promise((resolve, reject) => {
            try {
                const req = https.request(config, (res: IncomingMessage) => {
                    let data = "";

                    res.on("data", (chunk: any) => {
                        data += chunk;
                    });

                    res.on("close", () => {
                        resolve(data);
                    });

                    res.on("error", (error: any) => {
                        if (error.response && error.response.status === 429) {
                            reject(this.limitErrorMessage);
                        }
                        reject(error);
                    });
                });

                req.on("timeout", () => {
                    reject("batch timeout reached");
                });

                req.on("error", (error) => {
                    reject(error);
                });

                req.write(ipsData);
                req.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    public async getBatch(
        urls: string[],
        batchSize: number = BATCH_MAX_SIZE,
        batchTimeout: number = BATCH_REQ_TIMEOUT_DEFAULT,
        timeoutTotal: number = 0,
        filter: boolean = false
    ): Promise<BatchResponse> {
        let result: BatchResponse = {};

        // no items?
        if (urls.length == 0) {
            return new Promise((resolve) => {
                resolve(result);
            });
        }

        // clip batch size.
        if (batchSize <= 0 || batchSize > BATCH_MAX_SIZE) {
            batchSize = BATCH_MAX_SIZE;
        }

        // filter out URLs already cached.
        const lookupUrls: string[] = [];
        urls.forEach((url) => {
            const cachedUrl = this.cache.get(IPinfoWrapper.cacheKey(url));
            if (cachedUrl) {
                result[url] = cachedUrl;
            } else {
                lookupUrls.push(url);
            }
        });

        // everything cached? exit early.
        if (lookupUrls.length == 0) {
            return new Promise((resolve) => {
                resolve(result);
            });
        }

        const promises: Promise<any>[] = [];
        for (let i = 0; i < lookupUrls.length; i += batchSize) {
            let end = i + batchSize;
            if (end > lookupUrls.length) {
                end = lookupUrls.length;
            }
            const resDetails = this.__getBatch(
                lookupUrls.slice(i, end),
                batchTimeout,
                filter
            );
            promises.push(resDetails);
        }

        const batchPromise = Promise.all(promises).then((values) => {
            values.forEach((el: any) => {
                let batchResp = JSON.parse(el);

                for (var key in batchResp) {
                    if (batchResp.hasOwnProperty(key)) {
                        const ipinfo = batchResp[key];

                        if (ipinfo.error) {
                            delete batchResp[key];
                        } else {
                            /* convert country code to full country name */
                            // NOTE: always do this _before_ setting cache.
                            if (ipinfo.country) {
                                ipinfo.countryCode = ipinfo.country;
                                ipinfo.country =
                                    this.countries[ipinfo.countryCode];
                            }
                            if (ipinfo.abuse && ipinfo.abuse.country) {
                                ipinfo.abuse.countryCode =
                                    ipinfo.abuse.country;
                                ipinfo.abuse.country =
                                    this.countries[ipinfo.abuse.countryCode];
                            }
                            this.cache.set(
                                IPinfoWrapper.cacheKey(key),
                                ipinfo
                            );
                            result[key] = batchResp[key];
                        }
                    }
                }
            });
        });

        const totalTimeoutReached = Symbol();
        let totalTimeoutRef: any;
        const timeoutPromise = new Promise((resolve) => {
            if (timeoutTotal > 0) {
                totalTimeoutRef = setTimeout(
                    resolve,
                    timeoutTotal,
                    totalTimeoutReached
                );
            }
        });

        return await Promise.race([batchPromise, timeoutPromise]).then(
            (value) => {
                return new Promise((resolve, reject) => {
                    if (value === totalTimeoutReached) {
                        reject("Total timeout has been exceeded.");
                    } else {
                        // timeout may still be running; cancel it.
                        if (totalTimeoutRef) {
                            clearTimeout(totalTimeoutRef);
                        }

                        resolve(result);
                    }
                });
            }
        );
    }
}
