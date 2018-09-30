export interface IAsn {
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

export interface IIPinfo {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    postal: string;
    phone: string;
    asn: IAsn;
    company: ICompany;
}

export interface IPrefix {
    netblock: string;
    id: string;
    name: string;
    country: string;
}

export interface IPrefixes6 {
    netblock: string;
    id: string;
    name: string;
    country: string;
}

export interface IAsnResponse {
    asn: string;
    name: string;
    country: string;
    allocated: string;
    registry: string;
    domain: string;
    num_ips: number;
    prefixes: IPrefix[];
    prefixes6: IPrefixes6[];
}
