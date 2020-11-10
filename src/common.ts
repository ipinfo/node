export const FQDN: string = "https://ipinfo.io";

export interface Asn {
    asn: string;
    name: string;
    domain: string;
    route: string;
    type: string;
}

export interface Company {
    name: string;
    domain: string;
    type: string;
}

export interface Carrier {
    name: string;
    mcc: string;
    mnc: string;
}

export interface Privacy {
    vpn: boolean;
    proxy: boolean;
    tor: boolean;
    hosting: boolean;
}

export interface Abuse {
    address: string;
    country: string;
    countryCode: string;
    email: string;
    name: string;
    network: string;
    phone: string;
}

export interface Domains {
    ip: string;
    total: number;
    domains: string[];
}

export interface IPinfo {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    countryCode: string;
    loc: string;
    org: string;
    postal: string;
    timezone: string;
    asn: Asn;
    company: Company;
    carrier: Carrier;
    privacy: Privacy;
    abuse: Abuse;
    domains: Domains;
}

export interface Prefix {
    netblock: string;
    id: string;
    name: string;
    country: string;
    size: string;
    status: string;
    domain: string;
}

export interface Prefixes6 {
    netblock: string;
    id: string;
    name: string;
    country: string;
    size: string;
    status: string;
    domain: string;
}

export interface AsnResponse {
    asn: string;
    name: string;
    country: string;
    countryCode: string;
    allocated: string;
    registry: string;
    domain: string;
    num_ips: number;
    type: string;
    prefixes: Prefix[];
    prefixes6: Prefixes6[];
    peers: string[];
    upstreams: string[];
    downstreams: string[];
}
