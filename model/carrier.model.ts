export default class Carrier {
  public constructor(
    private readonly name: string,
    private readonly mcc: string,
    private readonly mnc: string
  ) {}

  /**
   * Getter name
   * @return {string}
   */
  public getName(): string {
    return this.name
  }

  /**
   * Getter mcc
   * @return {string}
   */
  public getMcc(): string {
    return this.mcc
  }

  /**
   * Getter mnc
   * @return {string}
   */
  public getMnc(): string {
    return this.mnc
  }
}
