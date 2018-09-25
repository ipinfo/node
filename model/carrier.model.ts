export default class Carrier {
    private _name: string;
    private _mcc: string;
    private _mnc: string;

    constructor(name: string, mcc: string, mnc: string) {
        this._name = name;
        this._mcc = mcc;
        this._mnc = mnc;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter mcc
     * @return {string}
     */
    public get mcc(): string {
        return this._mcc;
    }

    /**
     * Getter mnc
     * @return {string}
     */
    public get mnc(): string {
        return this._mnc;
    }
}
