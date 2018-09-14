export default class Company {
  public constructor(
    private readonly name: string,
    private readonly domain: string,
    private readonly type: string
  ) {}

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
   * Getter type
   * @return {string}
   */
  public getType(): string {
    return this.type
  }
}
