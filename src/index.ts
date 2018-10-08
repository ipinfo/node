import * as dotenv from "dotenv";
import IPinfoWrapper from "./ipinfoWrapper";
import ASNResponse from "./model/asnResponse.model";
import IPinfo from "./model/ipinfo.model";

dotenv.config();
const token = process.env.IPINFO_TOKEN;
const ip = "8.8.8.8";
const asn = "AS7922";

const ipinfoWrapper = new IPinfoWrapper(token);
ipinfoWrapper.lookupIp(ip).then((response: IPinfo) => {
    console.log(response.asn);
    console.log(response.carrier);
    console.log(response.city);
});

ipinfoWrapper.lookupASN(asn).then((response: ASNResponse) => {
    console.log(response.asn);
    console.log(response.name);
    console.log(response.country);
});
