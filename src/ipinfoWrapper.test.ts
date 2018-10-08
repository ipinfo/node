import * as dotenv from "dotenv";
import IPinfoWrapper from "./ipinfoWrapper";
import ASNResponse from "./model/asnResponse.model";
import IPinfo from "./model/ipinfo.model";

let ipinfoWrapper;

beforeEach(() => {
    dotenv.config();
    ipinfoWrapper = new IPinfoWrapper(process.env.IPINFO_TOKEN);
});

describe("IPinfoWrapper", () => {
  const ip = "8.8.8.8";
  const asn = "AS7922";

  test("lookupIp", () => {
    expect.assertions(10);
    return ipinfoWrapper.lookupIp(ip)
      .then((data: IPinfo) => {
        expect(data.ip).toEqual("8.8.8.8");
        expect(data.hostname).toEqual("google-public-dns-a.google.com");
        expect(data.city).toEqual("Mountain View");
        expect(data.region).toEqual("California");
        expect(data.countryCode).toEqual("US");
        expect(data.country).toEqual("United States");
        expect(data.loc).toEqual("37.3860,-122.0840");
        expect(data.phone).toEqual("650");
        expect(data.asn).toEqual({asn: "AS15169", name: "Google LLC", domain: "google.com", route: "8.8.8.0/24", type: "hosting"});
        expect(data.company).toEqual({name: "Google LLC", domain: "google.com", type: "hosting"});
      })
  })

  test("lookupASN", () => {
    expect.assertions(8);
    return ipinfoWrapper.lookupASN(asn)
      .then((data: ASNResponse) => {
        expect(data.asn).toEqual("AS7922");
        expect(data.name).toEqual("Comcast Cable Communications, LLC");
        expect(data.country).toEqual("United States");
        expect(data.countryCode).toEqual("US");
        expect(data.allocated).toEqual("1997-02-14");
        expect(data.registry).toEqual("arin");
        expect(data.domain).toEqual("comcast.net");
        expect(data.num_ips).toEqual(71230208);
      })
  })
})