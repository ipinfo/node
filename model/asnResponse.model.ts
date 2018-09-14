import Prefix from "./prefix.model";

export default class ASNResponse {
    public constructor(
      private readonly asn: string,
      private readonly name: string,
      private readonly country: string,
      private readonly allocated: string,
      private readonly registry: string,
      private readonly domain: string,
      private readonly prefixes: Prefix[], // serialize
      private readonly prefixes6: Prefix[],
      private readonly type: string
    ) {}
  
  }
  