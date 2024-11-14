import * as dotenv from "dotenv";
import { AsnResponse, IPinfo } from "../src/common";
import IPinfoWrapper from "../src/ipinfoWrapper";

let ipinfoWrapper: IPinfoWrapper;

beforeEach(() => {
    dotenv.config();
    const token = process.env.IPINFO_TOKEN || "";

    if (!token) {
        throw new Error(
            "Tests require a token in the IPINFO_TOKEN Environment Variable."
        );
    }

    ipinfoWrapper = new IPinfoWrapper(token);
});

describe("IPinfoWrapper", () => {
    test("lookupIp", async () => {
        // test multiple times for cache.
        for (let i = 0; i < 5; i++) {
            const data: IPinfo = await ipinfoWrapper.lookupIp("8.8.8.8");
            expect(data.ip).toEqual("8.8.8.8");
            expect(data.hostname).toEqual("dns.google");
            expect(data.city).toEqual("Mountain View");
            expect(data.region).toEqual("California");
            expect(data.country).toEqual("United States");
            expect(data.isEU).toEqual(false);
            expect(data.countryCode).toEqual("US");
            expect(data.countryFlag.emoji).toEqual("🇺🇸");
            expect(data.countryFlag.unicode).toEqual("U+1F1FA U+1F1F8");
            expect(data.countryFlagURL).toEqual(
                "https://cdn.ipinfo.io/static/images/countries-flags/US.svg"
            );
            expect(data.countryCurrency.code).toEqual("USD");
            expect(data.countryCurrency.symbol).toEqual("$");
            expect(data.continent.code).toEqual("NA");
            expect(data.continent.name).toEqual("North America");
            expect(data.loc).toEqual("37.4056,-122.0775");
            expect(data.postal).toEqual("94043");
            expect(data.timezone).toEqual("America/Los_Angeles");
            expect(data.asn).toEqual({
                asn: "AS15169",
                name: "Google LLC",
                domain: "google.com",
                route: "8.8.8.0/24",
                type: "hosting"
            });
            expect(data.company).toEqual({
                name: "Google LLC",
                domain: "google.com",
                type: "hosting"
            });
            expect(data.privacy).toEqual({
                vpn: false,
                proxy: false,
                tor: false,
                relay: false,
                hosting: true,
                service: ""
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
    });

    test("lookupASN", async () => {
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
    });

    test("getMap", async () => {
        let data = await ipinfoWrapper.getMap(["8.8.8.8", "4.4.4.4"]);

        expect(data.status).toEqual("Report Generated");
        expect(
            data.reportUrl?.includes("https://ipinfo.io/tools/map/")
        ).toBeTruthy();
    });

    test("getBatch", async () => {
        // test multiple times for cache.
        for (let i = 0; i < 5; i++) {
            const data = await ipinfoWrapper.getBatch([
                "8.8.8.8/hostname",
                "4.4.4.4",
                "AS123"
            ]);

            expect("8.8.8.8/hostname" in data).not.toBeFalsy();
            expect("4.4.4.4" in data).not.toBeFalsy();
            expect("AS123" in data).not.toBeFalsy();

            expect(data["8.8.8.8/hostname"]).toEqual("dns.google");
            expect(data["4.4.4.4"]).toEqual({
                ip: "4.4.4.4",
                city: "Weda",
                region: "North Maluku",
                country: "Indonesia",
                loc: "0.3295,127.8739",
                org: "AS3356 Level 3 Parent, LLC",
                timezone: "Asia/Jayapura",
                asn: {
                    asn: "AS3356",
                    name: "Level 3 Parent, LLC",
                    domain: "lumen.com",
                    route: "4.0.0.0/9",
                    type: "isp"
                },
                company: {
                    name: "Level 3 Parent, LLC",
                    domain: "level3.com",
                    type: "isp"
                },
                privacy: {
                    vpn: false,
                    proxy: false,
                    tor: false,
                    relay: false,
                    hosting: false,
                    service: ""
                },
                abuse: {
                    address: "US, LA, Monroe, 100 CenturyLink Drive, 71203",
                    country: "United States",
                    email: "abuse@level3.com",
                    name: "L3 Abuse Contact",
                    network: "4.0.0.0/9",
                    phone: "+1-877-453-8353",
                    countryCode: "US"
                },
                domains: {
                    ip: "4.4.4.4",
                    total: 111,
                    domains: [
                        "itmanagementgroup.de",
                        "safermoto.com",
                        "progeni.com",
                        "grahamhostedservices.com",
                        "bhcentral.tech"
                    ]
                },
                countryCode: "ID"
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
        }
    });

    test("isBogon", async () => {
        const data: IPinfo = await ipinfoWrapper.lookupIp("198.51.100.1");
        expect(data.ip).toEqual("198.51.100.1");
        expect(data.bogon).toEqual(true);
    });

    test("Error is thrown for invalid token", async () => {
        const ipinfo = new IPinfoWrapper("invalid-token");
        await expect(ipinfo.lookupIp("1.2.3.4")).rejects.toThrow();
    });

    test("Error is thrown when response cannot be parsed as JSON", async () => {
        const baseUrlWithUnparseableResponse = "https://ipinfo.io/developers#";

        const ipinfo = new IPinfoWrapper(
            "token",
            undefined,
            undefined,
            undefined,
            baseUrlWithUnparseableResponse
        );

        await expect(ipinfo.lookupIp("1.2.3.4")).rejects.toThrow();

        const result = await ipinfo
            .lookupIp("1.2.3.4")
            .then((_) => "parseable")
            .catch((_) => "unparseable");

        expect(result).toEqual("unparseable");
    });
});
