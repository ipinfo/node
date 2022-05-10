export class ApiLimitError extends Error {
    // handles 429 status code
    constructor() {
    super('You have exceeded 50,000 requests a month. Visit https://ipinfo.io/account to see your API limits.');
    Object.setPrototypeOf(this, ApiLimitError.prototype);
  }
}
