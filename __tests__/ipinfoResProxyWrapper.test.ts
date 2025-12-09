import * as dotenv from "dotenv"
import { IPBogon, IPinfoResProxy } from "../src/common"
import IPinfoResProxyWrapper from "../src/ipinfoResProxyWrapper"

const testIfTokenIsSet = process.env.IPINFO_TOKEN ? test : test.skip

beforeAll(() => {
  dotenv.config()
})

describe("IPinfoResProxyWrapper", () => {
  testIfTokenIsSet("lookupIp", async () => {
    const wrapper = new IPinfoResProxyWrapper(process.env.IPINFO_TOKEN!)

    for (let i = 0; i < 5; i++) {
      const data = (await wrapper.lookupIp("139.5.0.122")) as IPinfoResProxy

      expect(data.ip).toEqual("139.5.0.122")
      expect(data.service).toBeDefined()
      expect(typeof data.service).toBe("string")
      expect(data.last_seen).toBeDefined()
      expect(typeof data.last_seen).toBe("string")
      expect(data.percent_days_seen).toBeDefined()
      expect(typeof data.percent_days_seen).toBe("number")
    }
  })

  testIfTokenIsSet("isBogon", async () => {
    const wrapper = new IPinfoResProxyWrapper(process.env.IPINFO_TOKEN!)

    const data = (await wrapper.lookupIp("198.51.100.1")) as IPBogon
    expect(data.ip).toEqual("198.51.100.1")
    expect(data.bogon).toEqual(true)
  })

  test("Error is thrown for invalid token", async () => {
    const wrapper = new IPinfoResProxyWrapper("invalid-token")
    await expect(wrapper.lookupIp("1.2.3.4")).rejects.toThrow()
  })

  test("Error is thrown when response cannot be parsed as JSON", async () => {
    const baseUrlWithUnparseableResponse = "https://ipinfo.io/developers#"
    const wrapper = new IPinfoResProxyWrapper("token", undefined, undefined, baseUrlWithUnparseableResponse)

    await expect(wrapper.lookupIp("1.2.3.4")).rejects.toThrow()

    const result = await wrapper
      .lookupIp("1.2.3.4")
      .then((_) => "parseable")
      .catch((_) => "unparseable")

    expect(result).toEqual("unparseable")
  })
})