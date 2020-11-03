import * as dotenv from "dotenv";
import IPinfoWrapper from "../ipinfoWrapper";
import { IPinfo, AsnResponse } from "../common";

let ipinfoWrapper: IPinfoWrapper;

beforeEach(() => {
    dotenv.config();
    const token = process.env.IPINFO_TOKEN || "";
    ipinfoWrapper = new IPinfoWrapper(token);
});

describe("IPinfoWrapper", () => {
    const ip = "8.8.8.8";
    const asn = "AS7922";

    test("lookupIp", async () => {
        return ipinfoWrapper.lookupIp(ip).then((data: IPinfo) => {
            expect(data.ip).toEqual("8.8.8.8");
            expect(data.hostname).toEqual("dns.google");
            expect(data.city).toEqual("Mountain View");
            expect(data.region).toEqual("California");
            expect(data.country).toEqual("United States");
            expect(data.countryCode).toEqual("US");
            expect(data.loc).toEqual("37.4056,-122.0775");
            expect(data.postal).toEqual("94043");
            expect(data.timezone).toEqual("America/Los_Angeles");
            expect(data.asn).toEqual({
                asn: "AS15169",
                name: "Google LLC",
                domain: "google.com",
                route: "8.8.8.0/24",
                type: "business",
            });
            expect(data.company).toEqual({
                name: "Google LLC",
                domain: "google.com",
                type: "business"
            });
            expect(data.privacy).toEqual({
                vpn: false,
                proxy: false,
                tor: false,
                hosting: false,
            });
            expect(data.abuse).toEqual({
                address: "US, CA, Mountain View, 1600 Amphitheatre Parkway, 94043",
                country: "United States",
                countryCode: "US",
                email: "network-abuse@google.com",
                name: "Abuse",
                network: "8.8.8.0/24",
                phone: "+1-650-253-0000"
            });
            expect(data.domains).toEqual({
                ip: "8.8.8.8",
                total: 12988,
                domains: [
                    "41.cn",
                    "vrswebapps.com",
                    "etempurl.com",
                    "mtqnia.com",
                    "iptvx.tv"
                ]
            });
        });
    });

    test("lookupASN", async () => {
        return ipinfoWrapper.lookupASN(asn).then((data: AsnResponse) => {
            expect(data.asn).toEqual("AS7922");
            expect(data.name).toEqual("Comcast Cable Communications, LLC");
            expect(data.country).toEqual("United States");
            expect(data.countryCode).toEqual("US");
            expect(data.allocated).toEqual("1997-02-14");
            expect(data.registry).toEqual("arin");
            expect(data.domain).toEqual("comcast.com");
            expect(data.num_ips).toEqual(71324416);
            expect(data.type).toEqual("isp");
        });
    });
});
