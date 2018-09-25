import ASN from "./asn.model";
import Carrier from "./carrier.model";
import Company from "./company.model";

export default class IPinfo {
    public static Fqdn: string = "http://ipinfo.io/";
    public static FqdnSSL: string = "https://ipinfo.io/";

    private _ip: string;
    private _hostname: string;
    private _city: string;
    private _region: string;
    private _country: string;
    private _loc: string;
    private _postal: string;
    private _carrier: Carrier;
    private _asn: ASN;
    private _company: Company;
    private _phone: string;

    constructor(data: any) {
        this._ip = data.ip;
        this._hostname = data.hostname;
        this._city = data.city;
        this._region = data.region;
        this._country = data.country;
        this._loc = data.loc;
        this._postal = data.postal;
        this._carrier = data.carrier;
        this._asn = data.asn;
        this._company = data.company;
        this._phone = data.phone;
    }

    /**
     * Getter ip
     * @return {string}
     */
	public get ip(): string {
		return this._ip;
	}

    /**
     * Getter hostname
     * @return {string}
     */
	public get hostname(): string {
		return this._hostname;
	}

    /**
     * Getter city
     * @return {string}
     */
	public get city(): string {
		return this._city;
	}

    /**
     * Getter region
     * @return {string}
     */
	public get region(): string {
		return this._region;
	}

    /**
     * Getter country
     * @return {string}
     */
	public get country(): string {
		return this._country;
	}

    /**
     * Getter loc
     * @return {string}
     */
	public get loc(): string {
		return this._loc;
	}

    /**
     * Getter postal
     * @return {string}
     */
	public get postal(): string {
		return this._postal;
	}

    /**
     * Getter carrier
     * @return {Carrier}
     */
	public get carrier(): Carrier {
		return this._carrier;
	}

    /**
     * Getter asn
     * @return {ASN}
     */
	public get asn(): ASN {
		return this._asn;
	}

    /**
     * Getter company
     * @return {Company}
     */
	public get company(): Company {
		return this._company;
	}

    /**
     * Getter phone
     * @return {string}
     */
	public get phone(): string {
		return this._phone;
	}
}
