export default class Company {
    private _name: string;
    private _domain: string;
    private _type: string;

    constructor(name: string, domain: string, type: string) {
        this._name = name;
        this._domain = domain;
        this._type = type;
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
     * Getter type
     * @return {string}
     */
    public get type(): string {
        return this._type;
    }
}
