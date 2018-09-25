export default class ASN {
    private _asn: string;
    private _name: string;
    private _domain: string;
    private _route: string;
    private _type: string;

    constructor(asn: string, name: string, domain: string, route: string, type: string) {
        this._asn = asn;
        this._name = name;
        this._domain = domain;
        this._route = route;
        this._type = type;
    }

    /**
     * Getter asn
     * @return {string}
     */
    public get asn(): string {
        return this._asn;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter domain
     * @return {string}
     */
    public get domain(): string {
        return this._domain;
    }

    /**
     * Getter route
     * @return {string}
     */
    public get route(): string {
        return this._route;
    }

    /**
     * Getter type
     * @return {string}
     */
    public get type(): string {
        return this._type;
    }
}
