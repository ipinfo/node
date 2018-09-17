import ASN from "./asn.model";
import Carrier from "./carrier.model";
import Company from "./company.model";

export default class IPinfo {
    public constructor(
        private readonly ip: string,
        private readonly hostname: string,
        private readonly city: string,
        private readonly region: string,
        private readonly country: string,
        private readonly loc: string,
        private readonly postal: string,
        private readonly org: string,
        private readonly phone: string,
        private readonly asn: ASN,
        private readonly company: Company,
        private readonly carrier?: Carrier
        // private readonly context: Context;
    ) { }

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
     * Getter org
     * @return {string}
     */
    public getOrg(): string {
        return this.org;
    }

    /**
     * Getter phone
     * @return {string}
     */
    public getPhone(): string {
        return this.phone;
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
} 