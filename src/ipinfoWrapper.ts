import axios, {
    AxiosAdapter,
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    Cancel,
    Canceler,
    CancelToken,
    CancelTokenSource,
} from "axios";
import ASNResponse from "./model/asnResponse.model";
import IPinfo from "./model/ipinfo.model";
import countries from '../config/en_US.json';
import LRU from "lru-cache"

export default class IPinfoWrapper {
    private token: string;
    private countries: any;
    private lru: any;

    constructor(token: string) {
        this.token = token;
        this.countries = countries;
        this.lru = LRU();
    }

    public lookupIp(ip: string): Promise<any> {
        if (!ip || typeof ip !== "string") {
            throw new Error("ip is a required parameter");
        }

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
                    resolve(new IPinfo(response.data, this.countries));
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.status === 429) {
                        throw new Error(
                            "You have exceeded 1,000 requests a day. Visit https://ipinfo.io/account to see your API limits."
                        );
                    }
                    reject(error);
                });
        });
    }

    public lookupASN(asn: string): Promise<any> {
        if (!asn || typeof asn !== "string") {
            throw new Error("asn is a required parameter");
        }
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
                    resolve(new ASNResponse(response.data, this.countries));
                })
                .catch((error: AxiosError) => {
                    if (error.response && error.response.status === 429) {
                        throw new Error(
                            "You have exceeded 1,000 requests a day. Visit https://ipinfo.io/account to see your API limits."
                        );
                    }
                    reject(error);
                });
        });
    }
}
