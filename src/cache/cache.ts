import IPinfo from "../model/ipinfo.model";
import ASNResponse from "../model/asnResponse.model";

export default interface IPCache {
    cache: any;
    getIp(ip: string): IPinfo;
    getAsn(asn: string): ASNResponse;
    setIp(ip: string, data: IPinfo): void;
    setAsn(asn: string, data: ASNResponse): void;
}