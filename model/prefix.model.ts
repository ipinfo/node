export default class Prefix {
    public constructor(
      private readonly netblock: string,
      private readonly id: string,
      private readonly name: string,
      private readonly country: string,
    ) {}
  
    /**
     * Getter netblock
     * @return {string}
     */
    public getNetblock(): string {
      return this.netblock
    }
  
    /**
     * Getter id
     * @return {string}
     */
    public getId(): string {
      return this.id
    }
  
    /**
     * Getter name
     * @return {string}
     */
    public getName(): string {
      return this.name
    }
  
    /**
     * @return {string}
     * Getter country
     */
    public getCountry(): string {
      return this.country
    }
  }
  