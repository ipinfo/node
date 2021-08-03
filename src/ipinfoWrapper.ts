import https from 'https';
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
    private timeout: number;
    private limitErrorMessage: string =
        "You have exceeded 50,000 requests a month. Visit https://ipinfo.io/account to see your API limits.";

    constructor(token: string, cache?: Cache, timeout?: number) {
        this.token = token;
        this.countries = countries;
        this.cache = cache ? cache : new LruCache();
        this.timeout =
        timeout === null || timeout === undefined ? 5000 : timeout;
    }
    
    public lookupIp(ip: string): Promise<IPinfo> {
        const data = this.cache.get(ip + "_" +  VERSION);
        if (data) {
            return new Promise((resolve) => {
                resolve(data);
            });
        }
        
        const config : any = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": clientUserAgent
            },
            method: "GET",
            host: `${FQDN.replace("https://", "")}`,
            path: `/${ip}`,
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
           const req = https.request(config, (res: any) => {
               
                let data = '';
                res.on('data', (chunk: any) => {
                   data += chunk;
                });
                    
                res.on('close', () => {
                const ipinfo: IPinfo = JSON.parse(data);
                
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
                
                this.cache.set(ip + "_" + VERSION, ipinfo);
                resolve(ipinfo);
                });
                    
                res.on('error', (error: any) => {
                    if (error.response && error.response.status === 429) {
                        throw new Error(this.limitErrorMessage);
                    }
                    reject(error);
                })
            })
                    
            req.end();
        });
    }

    public lookupASN(asn: string): Promise<AsnResponse> {
        const data = this.cache.get(asn + "_" + VERSION);
        if (data) {
            return new Promise((resolve) => {
                resolve(data);
            });
        }

        const config : any = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
                "User-Agent": clientUserAgent
            },
            method: "GET",
            host: `${FQDN.replace("https://", "")}`,
            path: `/${asn}/json`,
            timeout: this.timeout
        };

        return new Promise((resolve, reject) => {
            const req = https.request(config, (res: any) => {
                
                 let data = '';
                 res.on('data', (chunk: any) => {
                    data += chunk;
                 });
                     
                 res.on('close', () => {
                 const asnResp: AsnResponse = JSON.parse(data);

                 /* convert country code to full country name */
                 // NOTE: always do this _before_ setting cache.
                 if (asnResp.country) {
                     asnResp.countryCode = asnResp.country;
                     asnResp.country = this.countries[asnResp.countryCode];
                 }

                 this.cache.set(asn + "_" + VERSION, asnResp);
                 resolve(asnResp);
                 });
                     
                 res.on('error', (error: any) => {
                     if (error.response && error.response.status === 429) {
                         throw new Error(this.limitErrorMessage);
                     }
                     reject(error);
                 })
             })
                     
             req.end();
         });
    }
}
