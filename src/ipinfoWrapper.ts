import { IncomingMessage } from "http";
import https, { RequestOptions } from "https";
import {
    defaultContinents,
    defaultCountriesCurrencies,
    defaultCountriesFlags,
    defaultCountries,
    defaultEuCountries
} from "../config/utils";
import Cache from "./cache/cache";
import LruCache from "./cache/lruCache";
import ApiLimitError from "./errors/apiLimitError";
const { isInSubnet } = require("subnet-check");
import {
    IPinfo,
    AsnResponse,
    MapResponse,
    BatchResponse,
    BATCH_MAX_SIZE,
    BATCH_REQ_TIMEOUT_DEFAULT,
    REQUEST_TIMEOUT_DEFAULT,
    CACHE_VSN,
    HOST,
    BOGON_NETWORKS
} from "./common";
import VERSION from "./version";

const clientUserAgent = `IPinfoClient/nodejs/${VERSION}`;
const countryFlagURL = "https://cdn.ipinfo.io/static/images/countries-flags/";

export default class IPinfoWrapper {
    private token: string;
    private countries: any;
    private countriesFlags: any;
    private countriesCurrencies: any;
    private continents: any;
    private euCountries: Array<string>;
    private cache: Cache;
    private timeout: number;
    private mapLimitErrorMessage: string =
        "You have exceeded maximum IP upload limit per request.";

    /**
     * Creates IPinfoWrapper object to communicate with the [IPinfo](https://ipinfo.io/) API.
     *
     * @param token Token string provided by IPinfo for registered user.
     * @param cache An implementation of IPCache interface. If it is not provided
     * then LruCache is used as default.
     * @param timeout Timeout in milliseconds that controls the timeout of requests.
     * It defaults to 5000 i.e. 5 seconds. A timeout of 0 disables the timeout feature.
     * @param i18nData Internationalization data for customizing countries-related information.
     * @param i18nData.countries Custom countries data. If not provided, default countries data will be used.
     * @param i18nData.countriesFlags Custom countries flags data. If not provided, default countries flags data will be used.
     * @param i18nData.countriesCurrencies Custom countries currencies data. If not provided, default countries currencies data will be used.
     * @param i18nData.continents Custom continents data. If not provided, default continents data will be used.
     * @param i18nData.euCountries Custom EU countries data. If not provided or an empty array, default EU countries data will be used.
     */
    constructor(
        token: string,
        cache?: Cache,
        timeout?: number,
        i18nData?: {
            countries?: any,
            countriesFlags?: any,
            countriesCurrencies?: any,
            continents?: any,
            euCountries?: Array<string>,
        }
    ) {
        this.token = token;
        this.countries = i18nData?.countries ? i18nData.countries : defaultCountries;
        this.countriesFlags = i18nData?.countriesFlags ? i18nData.countriesFlags: defaultCountriesFlags;
        this.countriesCurrencies = i18nData?.countriesCurrencies ? i18nData.countriesCurrencies: defaultCountriesCurrencies;
        this.continents = i18nData?.continents ? i18nData.continents : defaultContinents;
        this.euCountries =
            i18nData?.euCountries && i18nData?.euCountries.length !== 0
            ? i18nData.euCountries : defaultEuCountries;
        this.cache = cache ? cache : new LruCache();
        this.timeout =
            timeout === null || timeout === undefined
                ? REQUEST_TIMEOUT_DEFAULT
                : timeout;
    }

    public static cacheKey(k: string) {
        return `${k}:${CACHE_VSN}`;
    }

    /**
     * Lookup IP information using the IP.
     *
     * @param ip IP address against which the location information is required.
     * @return Response containing location information.
     */
    public async lookupIp(ip: string): Promise<IPinfo> {
        if (this.isBogon(ip)) {
            const ipinfo: IPinfo = {} as IPinfo;
            ipinfo.bogon = true;
            ipinfo.ip = ip;
            return ipinfo;
        }

        const data = await this.cache.get(IPinfoWrapper.cacheKey(ip));
        if (data) {
            return data;
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

                    if (!this.is4xxOr5xx(res.statusCode)) {
                        res.on("close", () => {
                            const ipinfo: IPinfo = JSON.parse(data);

                            /* convert country code to full country name */
                            // NOTE: always do this _before_ setting cache.
                            if (ipinfo.country) {
                                ipinfo.countryCode = ipinfo.country;
                                ipinfo.country =
                                    this.countries[ipinfo.countryCode];
                                ipinfo.countryFlag =
                                    this.countriesFlags[ipinfo.countryCode];
                                ipinfo.countryFlagURL =
                                    countryFlagURL +
                                    ipinfo.countryCode +
                                    ".svg";
                                ipinfo.countryCurrency =
                                    this.countriesCurrencies[
                                        ipinfo.countryCode
                                    ];
                                ipinfo.continent =
                                    this.continents[ipinfo.countryCode];
                                ipinfo.isEU = this.euCountries.includes(
                                    ipinfo.countryCode
                                );
                            }
                            if (ipinfo.abuse && ipinfo.abuse.country) {
                                ipinfo.abuse.countryCode =
                                    ipinfo.abuse.country;
                                ipinfo.abuse.country =
                                    this.countries[ipinfo.abuse.countryCode];
                            }

                            this.cache.set(IPinfoWrapper.cacheKey(ip), ipinfo);
                            resolve(ipinfo);
                        });

                        res.on("error", (error: any) => {
                            reject(error);
                        });
                    } else {
                        // error cases when status code is in 400 range
                        if (res.statusCode === 429) {
                            reject(new ApiLimitError());
                        } else {
                            res.on("close", () => {
                                reject(new Error(data));
                            });
                        }
                    }
                });

                req.on("error", (error) => {
                    reject(error);
                });

                req.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Lookup ASN information using the AS number.
     *
     * @param asn the asn string to lookup.
     * @return Response containing AsnResponse from the api.
     */
    public async lookupASN(asn: string): Promise<AsnResponse> {
        const data = await this.cache.get(IPinfoWrapper.cacheKey(asn));
        if (data) {
            return data;
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

                    if (!this.is4xxOr5xx(res.statusCode)) {
                        res.on("close", () => {
                            const asnResp: AsnResponse = JSON.parse(data);

                            /* convert country code to full country name */
                            // NOTE: always do this _before_ setting cache.
                            if (asnResp.country) {
                                asnResp.countryCode = asnResp.country;
                                asnResp.country =
                                    this.countries[asnResp.countryCode];
                            }

                            this.cache.set(
                                IPinfoWrapper.cacheKey(asn),
                                asnResp
                            );
                            resolve(asnResp);
                        });

                        res.on("error", (error: any) => {
                            reject(error);
                        });
                    } else {
                        // error cases when status code is in 400 range
                        if (res.statusCode === 429) {
                            reject(new ApiLimitError());
                        } else {
                            res.on("close", () => {
                                reject(new Error(data));
                            });
                        }
                    }
                });

                req.on("error", (error) => {
                    reject(error);
                });

                req.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get a mapping of a list of IPs on a world map.
     *
     * @param ips the array of IPs to map.
     * @return Response containing MapResponse.
     */
    public getMap(ips: string[]): Promise<MapResponse> {
        if (ips.length > 500000) {
            return new Promise((_resolve, reject) => {
                reject(new Error(this.mapLimitErrorMessage));
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

                    if (!this.is4xxOr5xx(res.statusCode)) {
                        res.on("close", () => {
                            resolve(JSON.parse(data));
                        });

                        res.on("error", (error: any) => {
                            reject(error);
                        });
                    } else {
                        // error cases when status code is in 400 range
                        if (res.statusCode === 429) {
                            reject(new ApiLimitError());
                        } else {
                            res.on("close", () => {
                                reject(new Error(data));
                            });
                        }
                    }
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

                    if (!this.is4xxOr5xx(res.statusCode)) {
                        res.on("close", () => {
                            resolve(data);
                        });

                        res.on("error", (error: any) => {
                            reject(error);
                        });
                    } else {
                        // error cases when status code is in 400 range
                        if (res.statusCode === 429) {
                            reject(new ApiLimitError());
                        } else {
                            res.on("close", () => {
                                reject(new Error(data));
                            });
                        }
                    }
                });

                req.on("timeout", () => {
                    reject(new Error("batch timeout reached"));
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

    /**
     * Get the result of a list of URLs in bulk.
     *
     * @param urls the array of URLs.
     * @param batchSize default value is set to max value for batch size, which is 1000.
     * @param batchTimeout in milliseconds. Default value is 5000 milliseconds.
     * @param timeoutTotal disabled by default.
     * @param filter default value is false.
     * @return Response containing BatchResponse for all URLs.
     */
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
            return result;
        }

        // clip batch size.
        if (batchSize <= 0 || batchSize > BATCH_MAX_SIZE) {
            batchSize = BATCH_MAX_SIZE;
        }

        // filter out URLs already cached.
        const lookupUrls: string[] = [];
        for (const url of urls) {
            const cachedUrl = await this.cache.get(
                IPinfoWrapper.cacheKey(url)
            );
            if (cachedUrl) {
                result[url] = cachedUrl;
            } else {
                lookupUrls.push(url);
            }
        }

        // everything cached? exit early.
        if (lookupUrls.length == 0) {
            return result;
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
                        if (!ipinfo.error) {
                            this.cache.set(
                                IPinfoWrapper.cacheKey(key),
                                ipinfo
                            );
                        }
                        result[key] = batchResp[key];
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
                        reject(new Error("Total timeout has been exceeded."));
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

    private is4xxOr5xx(statusCode: any): boolean {
        return statusCode && statusCode >= 400 && statusCode < 600;
    }

    private isBogon(ip: string): boolean {
        if (ip != "") {
            for (var network of BOGON_NETWORKS) {
                if (isInSubnet(ip, network)) {
                    return true;
                }
            }
        }
        return false;
    }
}
