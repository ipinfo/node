export default class Prefix {
    private _netblock: string;
    private _id: string;
    private _name: string;
    private _country: string;

    constructor(netblock: string, id: string, name: string, country: string) {
        this._netblock = netblock;
        this._id = id;
        this._name = name;
        this._country = country;
    }

    /**
     * Getter netblock
     * @return {string}
     */
    public get netblock(): string {
        return this._netblock;
    }

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
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
}
