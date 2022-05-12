/** Error class for the case when API per month limit is exceeded. */
export default class ApiLimitError extends Error {
    constructor() {
        super(
            "You have exceeded your total request quota this month. Visit https://ipinfo.io/account to see your API limits."
        );
        Object.setPrototypeOf(this, ApiLimitError.prototype);
    }
}
