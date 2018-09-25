import ASN from "./asn.model";
import Carrier from "./carrier.model";
import Company from "./company.model";

export default class IPinfo {
    public static Fqdn: string = "http://ipinfo.io/";
    public static FqdnSSL: string = "https://ipinfo.io/";

    private readonly ip: string;
    private readonly hostname: string;
    private readonly city: string;
    private readonly region: string;
    private readonly country: string;
    private readonly loc: string;
    private readonly postal: string;
    private readonly carrier: Carrier;
    private readonly asn: ASN;
    private readonly company: Company;
    private readonly phone: string;

    public constructor(data: any) {
        this.ip = data.ip;
        this.hostname = data.hostname;
        this.city = data.city;
        this.region = data.region;
        this.country = data.country; // todo
        this.loc = data.loc;
        this.postal = data.postal;
        this.asn = data.asn;
        this.company = data.company;
        this.carrier = data.carrier;
        this.phone = data.phone
    }

    /**
     * Getter ip
     * @return {string}
     */
    public getIp(): string {
        return this.ip;
    }

    /**
     * Getter hostname
     * @return {string}
     */
    public getHostname(): string {
        return this.hostname;
    }

    /**
     * Getter city
     * @return {string}
     */
    public getCity(): string {
        return this.city;
    }

    /**
     * Getter region
     * @return {string}
     */
    public getRegion(): string {
        return this.region;
    }

    /**
     * Getter country
     * @return {string}
     */
    public getCountry(): string {
        return this.country;
    }

    /**
     * Getter loc
     * @return {string}
     */
    public getLoc(): string {
        return this.loc;
    }

    /**
     * Getter postal
     * @return {string}
     */
    public getPostal(): string {
        return this.postal;
    }

    /**
     * Getter asn
     * @return {ASN}
     */
    public getAsn(): ASN {
        return this.asn;
    }

    /**
     * Getter company
     * @return {Company}
     */
    public getCompany(): Company {
        return this.company;
    }

    /**
     * Getter carrier
     * @return {Carrier}
     */
    public getCarrier(): Carrier {
        return this.carrier;
    }
} 