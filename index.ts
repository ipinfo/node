import IPinfoWrapper from "./IPinfoWrapper";
import IPinfo from "./model/ipinfo.model";

const token = "";
const ip = "";

const ipinfoWrapper = new IPinfoWrapper(token);
ipinfoWrapper.lookupIp(ip).then((response: IPinfo) => {
    console.log(response);
});
