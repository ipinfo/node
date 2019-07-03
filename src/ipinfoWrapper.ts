import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import countries from "../config/en_US.json";
import Cache from "./cache/cache";
import LruCache from "./cache/lruCache";
import ASNResponse from "./model/asnResponse.model";
import IPinfo from "./model/ipinfo.model";

export { Cache, LruCache };
export { Options } from "lru-cache";

export default class IPinfoWrapper {
    private token: string;
    private countries: any;
    private cache: Cache;
    private limitErrorMessage: string =
        "You have exceeded 1,000 requests a day. Visit https://ipinfo.io/account to see your API limits.";

    constructor(token: string, cache?: Cache) {
        this.token = token;
        this.countries = countries;
        this.cache = cache ? cache : new LruCache();
    }

    public lookupIp(ip: string): Promise<IPinfo> {
        if (!ip || typeof ip !== "string")
            throw new Error("ip is a required parameter");

        const data = this.cache.get(ip);
        if (!data) {
            const url = `${IPinfo.Fqdn}${ip}`;
            const config: AxiosRequestConfig = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                    "User-Agent": "IPinfoClient/nodejs/1.0",
                },
                method: "get",
                url: `${url}`,
            };

            return new Promise((resolve, reject) => {
                axios(config)
                    .then((response: AxiosResponse) => {
                        const ipinfo = new IPinfo(response.data, this.countries);
                        this.cache.set(ip, ipinfo);
                        resolve(ipinfo);
                    })
                    .catch((error: AxiosError) => {
                        if (error.response && error.response.status === 429)
                            throw new Error(this.limitErrorMessage);
                        reject(error);
                    });
            });
        }

        return new Promise((resolve) => resolve(data));
    }

    public lookupASN(asn: string): Promise<ASNResponse> {
        if (!asn || typeof asn !== "string")
            throw new Error("asn is a required parameter");

        const data = this.cache.get(asn);
        if (!data) {
            const url = `${IPinfo.Fqdn}${asn}/json`;
            const config: AxiosRequestConfig = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                    "User-Agent": "IPinfoClient/nodejs/1.0",
                },
                method: "get",
                url: `${url}`,
            };

            return new Promise((resolve, reject) => {
                axios(config)
                    .then((response: AxiosResponse) => {
                        const asnResponse = new ASNResponse(response.data, this.countries);
                        this.cache.set(asn, asnResponse);
                        resolve(asnResponse);
                    })
                    .catch((error: AxiosError) => {
                        if (error.response && error.response.status === 429)
                            reject(Error(this.limitErrorMessage));
                        reject(error);
                    });
            });
        }

        return new Promise((resolve) => resolve(data));
    }
}
