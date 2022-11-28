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

export interface CountryFlag {
    emoji: string;
    unicode: string;
}

export interface CountryCurrency {
    code: string;
    symbol: string;
}

export interface Continent {
    code: string;
    name: string;
}

export interface IPinfo {
    ip: string;
    hostname: string;
    bogon: boolean;
    anycast: boolean;
    city: string;
    region: string;
    country: string;
    countryFlag: CountryFlag;
    countryCurrency: CountryCurrency;
    continent: Continent;
    isEU: boolean;
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

export const BOGON_NETWORKS = [
    "0.0.0.0/8",
    "10.0.0.0/8",
    "100.64.0.0/10",
    "127.0.0.0/8",
    "169.254.0.0/16",
    "172.16.0.0/12",
    "192.0.0.0/24",
    "192.0.2.0/24",
    "192.168.0.0/16",
    "198.18.0.0/15",
    "198.51.100.0/24",
    "203.0.113.0/24",
    "224.0.0.0/4",
    "240.0.0.0/4",
    "255.255.255.255/32",
    "::/128",
    "::1/128",
    "::ffff:0:0/96",
    "::/96",
    "100::/64",
    "2001:10::/28",
    "2001:db8::/32",
    "fc00::/7",
    "fe80::/10",
    "fec0::/10",
    "ff00::/8",
    "2002::/24",
    "2002:a00::/24",
    "2002:7f00::/24",
    "2002:a9fe::/32",
    "2002:ac10::/28",
    "2002:c000::/40",
    "2002:c000:200::/40",
    "2002:c0a8::/32",
    "2002:c612::/31",
    "2002:c633:6400::/40",
    "2002:cb00:7100::/40",
    "2002:e000::/20",
    "2002:f000::/20",
    "2002:ffff:ffff::/48",
    "2001::/40",
    "2001:0:a00::/40",
    "2001:0:7f00::/40",
    "2001:0:a9fe::/48",
    "2001:0:ac10::/44",
    "2001:0:c000::/56",
    "2001:0:c000:200::/56",
    "2001:0:c0a8::/48",
    "2001:0:c612::/47",
    "2001:0:c633:6400::/56",
    "2001:0:cb00:7100::/56",
    "2001:0:e000::/36",
    "2001:0:f000::/36",
    "2001:0:ffff:ffff::/64"
] as const;
