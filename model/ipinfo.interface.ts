export interface IIPinfo {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    postal: string;
    org: string;
    phone: string;
    asn: IASN;
    company: ICompany;
    carrier?: ICarrier;
}

export interface IASN {
    asn: string;
    name: string;
    domain: string;
    route: string;
    type: string;
}

export interface ICompany {
    name: string;
    domain: string;
    type: string;
}

export interface ICarrier {
    name: string;
    mcc: string;
    mnc: string;
}