export const HOST: string = "ipinfo.io";

// cache version
export const CACHE_VSN: string = "1";

// default max size for batch requests.
export const BATCH_MAX_SIZE: number = 1000;

// default timeout for single request in milliseconds.
export const REQUEST_TIMEOUT_DEFAULT: number = 5000;

// default timeout for batch requests in milliseconds.
export const BATCH_REQ_TIMEOUT_DEFAULT: number = 5000;

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
    relay: boolean;
    hosting: boolean;
    service: string;
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
    bogon: boolean;
    anycast: boolean;
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

export interface MapResponse {
    status: string;
    reportUrl: string;
}

export interface BatchResponse {
    [key: string]:
        | IPinfo
        | AsnResponse
        | Asn
        | Company
        | Carrier
        | Privacy
        | Abuse
        | Domains
        | object
        | string;
}
