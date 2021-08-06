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
    const ips = ["8.8.8.8", "4.4.4.4"];
    const asn = "AS7922";

    test("lookupIp", async (done) => {
        // test multiple times for cache.
        for (let i = 0; i < 5; i++) {
            const data: IPinfo = await ipinfoWrapper.lookupIp(ip);
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
                type: "business"
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
                hosting: false
            });
            expect(data.abuse).toEqual({
                address:
                    "US, CA, Mountain View, 1600 Amphitheatre Parkway, 94043",
                country: "United States",
                countryCode: "US",
                email: "network-abuse@google.com",
                name: "Abuse",
                network: "8.8.8.0/24",
                phone: "+1-650-253-0000"
            });
            expect(data.domains.ip).toEqual("8.8.8.8");
            expect(data.domains.total).not.toBeFalsy();
            expect(data.domains.domains.length).toEqual(5);
        }

        done();
    });

    test("lookupASN", async (done) => {
        // test multiple times for cache.
        for (let i = 0; i < 5; i++) {
            const data: AsnResponse = await ipinfoWrapper.lookupASN(asn);
            expect(data.asn).toEqual("AS7922");
            expect(data.name).toEqual("Comcast Cable Communications, LLC");
            expect(data.country).toEqual("United States");
            expect(data.countryCode).toEqual("US");
            expect(data.allocated).toEqual("1997-02-14");
            expect(data.registry).toEqual("arin");
            expect(data.domain).toEqual("comcast.com");
            expect(data.num_ips).not.toBeFalsy();
            expect(data.type).toEqual("isp");
        }

        done();
    });

    test("lookupIps", async (done) => {
        let data = await ipinfoWrapper.lookupIps(ips);
        data = JSON.parse(data);

        expect(data.status).toEqual("Report Generated");
        expect(
            data.reportUrl?.includes("https://ipinfo.io/tools/map/")
        ).toBeTruthy();
        done();
    });

    test("getBatchDetails", async (done) => {
        const data = await ipinfoWrapper.getBatchDetails(ips);

        expect("8.8.8.8" in data).not.toBeFalsy();
        expect("4.4.4.4" in data).not.toBeFalsy();

        expect(data["4.4.4.4"]).toEqual({
            ip: "4.4.4.4",
            city: "New York City",
            region: "New York",
            country: "United States",
            loc: "40.7143,-74.0060",
            postal: "10004",
            timezone: "America/New_York",
            asn: {
                asn: "AS3356",
                name: "Level 3 Parent, LLC",
                domain: "level3.com",
                route: "4.0.0.0/9",
                type: "isp"
            },
            company: {
                name: "Level 3 Communications, Inc.",
                domain: "lumen.com",
                type: "isp"
            },
            privacy: { vpn: false, proxy: false, tor: false, hosting: false },
            abuse: {
                address: "US, CO, Broomfield, 1025 Eldorado Blvd., 80021",
                country: "United States",
                email: "abuse@level3.com",
                name: "Abuse POC LVLT",
                network: "4.4.0.0/16",
                phone: "+1-877-453-8353",
                countryCode: "US"
            },
            domains: {
                ip: "4.4.4.4",
                total: 224,
                domains: [
                    "gf-clan.ch",
                    "cms3970.com",
                    "blue-buff.com",
                    "dc-scape.eu",
                    "www.guixf.cn"
                ]
            },
            countryCode: "US"
        });
        expect(data["8.8.8.8"]).toEqual({
            ip: "8.8.8.8",
            hostname: "dns.google",
            anycast: true,
            city: "Mountain View",
            region: "California",
            country: "United States",
            loc: "37.4056,-122.0775",
            postal: "94043",
            timezone: "America/Los_Angeles",
            asn: {
                asn: "AS15169",
                name: "Google LLC",
                domain: "google.com",
                route: "8.8.8.0/24",
                type: "business"
            },
            company: {
                name: "Google LLC",
                domain: "google.com",
                type: "business"
            },
            privacy: { vpn: false, proxy: false, tor: false, hosting: false },
            abuse: {
                address:
                    "US, CA, Mountain View, 1600 Amphitheatre Parkway, 94043",
                country: "United States",
                email: "network-abuse@google.com",
                name: "Abuse",
                network: "8.8.8.0/24",
                phone: "+1-650-253-0000",
                countryCode: "US"
            },
            domains: {
                ip: "8.8.8.8",
                total: 13196,
                domains: [
                    "41.cn",
                    "peace-and-yummy.com",
                    "authrock.com",
                    "itempurl.com",
                    "nextroute.co.th"
                ]
            },
            countryCode: "US"
        });

        done();
    });
});
