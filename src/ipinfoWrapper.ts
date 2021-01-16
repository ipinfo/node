import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import countries from "../config/en_US.json";
import Cache from "./cache/cache";
import LruCache from "./cache/lruCache";
import { FQDN, IPinfo, AsnResponse } from "./common";
import VERSION from "./version";

export { Cache, LruCache };
export { Options } from "lru-cache";

const clientUserAgent = `IPinfoClient/nodejs/${VERSION}`;

export default class IPinfoWrapper {
    private token: string;
    private countries: any;
    private cache: Cache;
    private limitErrorMessage: string =
        "You have exceeded 50,000 requests a month. Visit https://ipinfo.io/account to see your API limits.";

    constructor(token: string, cache?: Cache) {
        this.token = token;
        this.countries = countries;
        this.cache = cache ? cache : new LruCache();
    }

    public lookupIp(ip: string): Promise<IPinfo> {
        const data = this.cache.get(ip);
        if (data) {
            return new Promise((resolve) => {
                resolve(data);
            });
        }

        const url = `${FQDN}/${ip}`;
        const config: AxiosRequestConfig = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": clientUserAgent
            },
            method: "get",
            url: `${url}`
        };

        return new Promise((resolve, reject) => {
            axios(config)
                .then((response: AxiosResponse) => {
                    const ipinfo: IPinfo = response.data;

                    /* convert country code to full country name */
                    // NOTE: always do this _before_ setting cache.
                    if (ipinfo.country) {
                        ipinfo.countryCode = ipinfo.country;
                        ipinfo.country = this.countries[ipinfo.countryCode];
                    }
                    if (ipinfo.abuse && ipinfo.abuse.country) {
                        ipinfo.abuse.countryCode = ipinfo.abuse.country;
                        ipinfo.abuse.country = this.countries[
                            ipinfo.abuse.countryCode
                        ];
                    }

                    this.cache.set(ip, ipinfo);
                    resolve(ipinfo);
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.status === 429) {
                        throw new Error(this.limitErrorMessage);
                    }
                    reject(error);
                });
        });
    }

    public lookupASN(asn: string): Promise<AsnResponse> {
        const data = this.cache.get(asn);
        if (data) {
            return new Promise((resolve) => {
                resolve(data);
            });
        }

        const url = `${FQDN}/${asn}/json`;
        const config: AxiosRequestConfig = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": clientUserAgent
            },
            method: "get",
            url: `${url}`
        };

        return new Promise((resolve, reject) => {
            axios(config)
                .then((response: AxiosResponse) => {
                    const asnResp: AsnResponse = response.data;

                    /* convert country code to full country name */
                    // NOTE: always do this _before_ setting cache.
                    if (asnResp.country) {
                        asnResp.countryCode = asnResp.country;
                        asnResp.country = this.countries[asnResp.countryCode];
                    }

                    this.cache.set(asn, asnResp);
                    resolve(asnResp);
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.status === 429) {
                        reject(Error(this.limitErrorMessage));
                    }
                    reject(error);
                });
        });
    }
}
