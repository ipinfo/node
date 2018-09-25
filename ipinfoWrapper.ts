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
import IPinfo from "./model/ipinfo.model";

export default class IPinfoWrapper {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    public lookupIp(ip: string): Promise<any> {
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
                    //   console.log(response.data);
                    resolve(new IPinfo(response.data));
                })
                .catch((error: AxiosError) => {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else {
                        console.log(error.message);
                    }
                    reject(error);
                });
        });
    }
}
