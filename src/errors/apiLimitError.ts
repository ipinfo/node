/** Error class for the case when API per month limit is exceeded. */
export class ApiLimitError extends Error {
    constructor() {
    super('You have exceeded 50,000 requests a month. Visit https://ipinfo.io/account to see your API limits.');
    Object.setPrototypeOf(this, ApiLimitError.prototype);
  }
}
