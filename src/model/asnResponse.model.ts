import Prefix from "./prefix.model";

export default class ASNResponse {
    private _asn: string;
    private _name: string;
    private _country: string;
    private _countryCode: string;
    private _allocated: string;
    private _registry: string;
    private _domain: string;
    private _prefixes: Prefix[]; // serialize
    private _prefixes6: Prefix[];
    private _type: string;
    private _num_ips: number;

    constructor(data: any, countries: any) {
        this._asn = data.asn;
        this._name = data.name;
        this._country = countries[data.country];
        this._countryCode = data.country;
        this._allocated = data.allocated;
        this._registry = data.registry;
        this._domain = data.domain;
        this._prefixes = data.prefixes;
        this._prefixes6 = data.prefixes6;
        this._type = data.type;
        this._num_ips = data.num_ips;
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
     * Getter country
     * @return {string}
     */
    public get country(): string {
        return this._country;
    }

    /**
     * Getter countryCode
     * @return {string}
     */
    public get countryCode(): string {
        return this._countryCode;
    }

    /**
     * Getter allocated
     * @return {string}
     */
    public get allocated(): string {
        return this._allocated;
    }

    /**
     * Getter registry
     * @return {string}
     */
    public get registry(): string {
        return this._registry;
    }

    /**
     * Getter domain
     * @return {string}
     */
    public get domain(): string {
        return this._domain;
    }

    /**
     * Getter prefixes
     * @return {Prefix[]}
     */
    public get prefixes(): Prefix[] {
        return this._prefixes;
    }

    /**
     * Getter prefixes6
     * @return {Prefix[]}
     */
    public get prefixes6(): Prefix[] {
        return this._prefixes6;
    }

    /**
     * Getter type
     * @return {string}
     */
    public get type(): string {
        return this._type;
    }

    /**
     * Getter num_ips
     * @return {string}
     */
    public get num_ips(): number {
        return this._num_ips;
    }
}
