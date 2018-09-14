export default class ASN {
  public constructor(
    private readonly asn: string,
    private readonly name: string,
    private readonly domain: string,
    private readonly route: string,
    private readonly type: string
  ) {}

  /**
   * Getter asn
   * @return {string}
   */
  public getAsn(): string {
    return this.asn
  }

  /**
   * Getter name
   * @return {string}
   */
  public getName(): string {
    return this.name
  }

  /**
   * Getter domain
   * @return {string}
   */
  public getDomain(): string {
    return this.domain
  }

  /**
   * Getter route
   * @return {string}
   */
  public getRoute(): string {
    return this.route
  }

  /**
   * Getter type
   * @return {string}
   */
  public getType(): string {
    return this.type
  }
}
