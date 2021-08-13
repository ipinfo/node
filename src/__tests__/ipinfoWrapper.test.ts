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
    test("lookupIp", async (done) => {
        // test multiple times for cache.
        for (let i = 0; i < 5; i++) {
            const data: IPinfo = await ipinfoWrapper.lookupIp("8.8.8.8");
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
            const data: AsnResponse = await ipinfoWrapper.lookupASN("AS7922");
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

    test("getMap", async (done) => {
        let data = await ipinfoWrapper.getMap(["8.8.8.8", "4.4.4.4"]);

        expect(data.status).toEqual("Report Generated");
        expect(
            data.reportUrl?.includes("https://ipinfo.io/tools/map/")
        ).toBeTruthy();
        done();
    });

    test("getBatchDetails", async (done) => {
        const data = await ipinfoWrapper.getBatchDetails([
            "8.8.8.8/hostname",
            "4.4.4.4",
            "AS123",
        ]);

        expect("8.8.8.8/hostname" in data).not.toBeFalsy();
        expect("4.4.4.4" in data).not.toBeFalsy();
        expect("AS123" in data).not.toBeFalsy();

        expect(data["8.8.8.8/hostname"]).toEqual("dns.google");
        expect(data["4.4.4.4"]).toEqual({
            ip: "4.4.4.4",
            city: "New York City",
            region: "New York",
            country: "United States",
            loc: "40.7143,-74.0060",
            org: "AS3356 Level 3 Parent, LLC",
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

        expect(data["AS123"]).toEqual({
            asn: "AS123",
            name: "Air Force Systems Networking",
            country: "United States",
            countryCode: "US",
            allocated: "1987-08-24",
            registry: "arin",
            domain: "af.mil",
            num_ips: 0,
            type: "inactive",
            prefixes: [],
            prefixes6: [],
            peers: null,
            upstreams: null,
            downstreams: null
        });

        done();
    });
});
