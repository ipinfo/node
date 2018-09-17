const Fqdn: string = "http://ipinfo.io/";
const FqdnSSL: string = "https://ipinfo.io/";
const TokenPrefixL: string = "?token=";
const IpRegex = /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/;
export default { Fqdn, FqdnSSL, TokenPrefixL, IpRegex };