import * as request from "request";
import config from "./config";

class IPinfoWrapper {
    // greeting: string;
    constructor(private url: string, private token: string) {
        this.url = url;
        this.token = token;
    }

    public getData() {
        request.get(this.url + "?token=" + this.token, (response: any) => {
            console.log(response);
        })
    }
}