import ASNResponse from "../model/asnResponse.model";
import IPinfo from "../model/ipinfo.model";

export default interface IPCache {
    getIp(ip: string): IPinfo;
    getAsn(asn: string): ASNResponse;
    setIp(ip: string, data: IPinfo): void;
    setAsn(asn: string, data: ASNResponse): void;
}