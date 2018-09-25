import IPinfoWrapper from "./IPinfoWrapper";
import IPinfo from "./model/ipinfo.model";

const token = "token";
const ip = "8.8.8.8";

const ipinfoWrapper = new IPinfoWrapper(token);
ipinfoWrapper.lookupIp(ip).then((response: IPinfo) => {
    console.log(response.asn);
    console.log(response.carrier);
    console.log(response.city);
});
