import { IncomingMessage } from "http";
import https, { RequestOptions } from "https";
import countries from "../config/en_US.json";
import Cache from "./cache/cache";
import LruCache from "./cache/lruCache";
import {
    IPinfo,
    AsnResponse,
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
            timeout === null || timeout === undefined ? REQUEST_TIMEOUT_DEFAULT : timeout;
    }

    public lookupIp(ip: string): Promise<IPinfo> {
        const data = this.cache.get(`${ip}:${CACHE_VSN}`);
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
                            ipinfo.country = this.countries[
                                ipinfo.countryCode
                            ];
                        }
                        if (ipinfo.abuse && ipinfo.abuse.country) {
                            ipinfo.abuse.countryCode = ipinfo.abuse.country;
                            ipinfo.abuse.country = this.countries[
                                ipinfo.abuse.countryCode
                            ];
                        }

                        this.cache.set(`${ip}:${CACHE_VSN}`, ipinfo);
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
        const data = this.cache.get(`${asn}:${CACHE_VSN}`);
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
                            asnResp.country = this.countries[
                                asnResp.countryCode
                            ];
                        }

                        this.cache.set(`${asn}:${CACHE_VSN}`, asnResp);
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

    public lookupIps(ips: string[]): Promise<any> {
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
            path: `/map?cli=1`,
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
            if (ips?.length <= 500000) {
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
                            if (
                                error.response &&
                                error.response.status === 429
                            ) {
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
            } else {
                reject(this.mapLimitErrorMessage);
            }
        });
    }

    public getSingleBatchDetails(
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

    public async getBatchDetails(
        ips: string[] = [],
        batchSize: number = BATCH_MAX_SIZE,
        batchTimeout: number = BATCH_REQ_TIMEOUT_DEFAULT,
        timeoutTotal: number = 0,
        filter: boolean = false
    ): Promise<any> {
        let result = {};
        if (!ips.length) {
            return new Promise((resolve) => {
                resolve(result);
            });
        }

        if (batchSize <= 0 || batchSize > BATCH_MAX_SIZE) {
            batchSize = BATCH_MAX_SIZE;
        }

        const lookupIps: string[] = [];
        ips.forEach((ip) => {
            const cachedIpAddr = this.cache.get(`${ip}:${CACHE_VSN}`);
            if (cachedIpAddr) {
                result = {
                    ...result,
                    [ip]: cachedIpAddr
                };
            } else {
                lookupIps.push(ip);
            }
        });

        let lookupIpsArr: string[] = [...lookupIps], 
            promises: any = [];
        for (let i = 0; i < lookupIps.length; i += batchSize) {
            const resDetails = this.getSingleBatchDetails(
                lookupIpsArr.splice(0, batchSize),
                batchTimeout,
                filter
            );
            promises.push(resDetails)
        }

        const batchPromise = Promise.all(promises).then((values) => {
            values.forEach((el: any) => {
                let batchIpDetails = JSON.parse(el);

                for (var key in batchIpDetails) {
                    if (batchIpDetails.hasOwnProperty(key)) {
                        const ipinfo = batchIpDetails[key];

                        if (ipinfo.error) {
                            delete batchIpDetails[key];
                        } else {
                            /* convert country code to full country name */
                            // NOTE: always do this _before_ setting cache.
                            if (ipinfo.country) {
                                ipinfo.countryCode = ipinfo.country;
                                ipinfo.country = this.countries[
                                    ipinfo.countryCode
                                ];
                            }
                            if (ipinfo.abuse && ipinfo.abuse.country) {
                                ipinfo.abuse.countryCode =
                                    ipinfo.abuse.country;
                                ipinfo.abuse.country = this.countries[
                                    ipinfo.abuse.countryCode
                                ];
                            }
                            this.cache.set(
                                `${key}:${CACHE_VSN}`,
                                ipinfo
                            );

                            result = {
                                ...result,
                                ...batchIpDetails
                            };
                        }
                    }
                }
            })
        });

        const timeoutPromise = new Promise((resolve) => {
            if (timeoutTotal) {
                setTimeout(resolve, timeoutTotal, 'totalTimeoutReached');
            }
        });

        return await Promise.race([batchPromise, timeoutPromise]).then((value) => {
            return new Promise((resolve, reject) => {
                if (value === "totalTimeoutReached") {
                    reject("Total timeout has been exceeded.")
                } else {
                    resolve(result);
                }
            });
        });
    }
}
