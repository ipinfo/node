import * as dotenv from "dotenv";
import { IPBogon, IPinfoLite } from "../src/common";
import IPinfoLiteWrapper from "../src/ipinfoLiteWrapper";

const testIfTokenIsSet = process.env.IPINFO_TOKEN ? test : test.skip;

beforeAll(() => {
    dotenv.config();
});

describe("IPinfoLiteWrapper", () => {
    testIfTokenIsSet("lookupIp", async () => {
        const ipinfoWrapper = new IPinfoLiteWrapper(process.env.IPINFO_TOKEN!);

        // test multiple times for cache.
        for (let i = 0; i < 5; i++) {
            const data = (await ipinfoWrapper.lookupIp(
                "8.8.8.8"
            )) as IPinfoLite;
            expect(data.ip).toEqual("8.8.8.8");
            expect(data.asn).toEqual("AS15169");
            expect(data.asName).toEqual("Google LLC");
            expect(data.asDomain).toEqual("google.com");
            expect(data.countryCode).toEqual("US");
            expect(data.country).toEqual("United States");
            expect(data.continentCode).toEqual("NA");
            expect(data.continent).toEqual("North America");
            expect(data.isEU).toEqual(false);
        }
    });

    testIfTokenIsSet("isBogon", async () => {
        const ipinfoWrapper = new IPinfoLiteWrapper(process.env.IPINFO_TOKEN!);

        const data = (await ipinfoWrapper.lookupIp("198.51.100.1")) as IPBogon;
        expect(data.ip).toEqual("198.51.100.1");
        expect(data.bogon).toEqual(true);
    });

    test("Error is thrown for invalid token", async () => {
        const ipinfo = new IPinfoLiteWrapper("invalid-token");
        await expect(ipinfo.lookupIp("1.2.3.4")).rejects.toThrow();
    });

    test("Error is thrown when response cannot be parsed as JSON", async () => {
        const baseUrlWithUnparseableResponse = "https://ipinfo.io/developers#";

        const ipinfo = new IPinfoLiteWrapper(
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
