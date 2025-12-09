import type { RequestInit, Response } from "node-fetch";
import Cache from "./cache/cache";
import LruCache from "./cache/lruCache";
import ApiLimitError from "./errors/apiLimitError";
import { isInSubnet } from "subnet-check";
import {
    REQUEST_TIMEOUT_DEFAULT,
    CACHE_VSN,
    HOST_RES_PROXY,
    BOGON_NETWORKS,
    IPinfoResProxy,
    IPBogon
} from "./common";
import VERSION from "./version";

const clientUserAgent = `IPinfoClient/nodejs/${VERSION}`;

export default class IPinfoResProxyWrapper {
    private token: string;
    private baseUrl: string;
    private cache: Cache;
    private timeout: number;

    /**
     * Creates IPinfoResProxyWrapper object to communicate with the IPinfo Res Proxy API.
     *
     * @param token Token string provided by IPinfo for the registered user.
     * @param cache An implementation of IPCache interface, or LruCache if not specified.
     * @param timeout Request timeout in milliseconds, or 5000ms if not specified. 0 disables the timeout.
     * @param baseUrl The base url to use for api requests, or "ipinfo.io" if not specified.
     */
    constructor(
        token: string,
        cache?: Cache,
        timeout?: number,
        baseUrl?: string
    ) {
        this.token = token;
        this.cache = cache || new LruCache();
        this.timeout =
            timeout === null || timeout === undefined
                ? REQUEST_TIMEOUT_DEFAULT
                : timeout;
        this.baseUrl = baseUrl || `https://${HOST_RES_PROXY}`;
    }

    public static cacheKey(k: string): string {
        return `${k}:${CACHE_VSN}`;
    }

    public async fetchApi(
        path: string,
        init: RequestInit = {}
    ): Promise<Response> {
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            "User-Agent": clientUserAgent
        };

        const request = Object.assign(
            {
                timeout: this.timeout,
                method: "GET",
                compress: false
            },
            init,
            { headers: Object.assign(headers, init.headers) }
        );

        const url = [this.baseUrl, path].join(
            !this.baseUrl.endsWith("/") && !path.startsWith("/") ? "/" : ""
        );

        return fetch(url, request).then((response: Response) => {
            if (response.status === 429) {
                throw new ApiLimitError();
            }

            if (response.status >= 400) {
                throw new Error(
                    `Received an error from the IPinfo API ` +
                        `(using authorization ${headers["Authorization"]}) ` +
                        `${response.status} ${response.statusText} ${response.url}`
                );
            }

            return response;
        });
    }

    public async lookupIp(
        ip: string | undefined = undefined
    ): Promise<IPinfoResProxy | IPBogon> {
        if (ip && this.isBogon(ip)) {
            return { ip, bogon: true };
        }

        if (!ip) {
            ip = "me";
        }

        const data = await this.cache.get(IPinfoResProxyWrapper.cacheKey(ip));

        if (data) {
            return data;
        }

        return this.fetchApi(ip).then(async (response) => {
            const ipinfo = (await response.json()) as IPinfoResProxy;
            this.cache.set(IPinfoResProxyWrapper.cacheKey(ip), ipinfo);

            return ipinfo;
        });
    }

    private isBogon(ip: string): boolean {
        if (ip != "") {
            for (let network of BOGON_NETWORKS) {
                if (isInSubnet(ip, network)) {
                    return true;
                }
            }
        }
        return false;
    }
}
