# [<img src="https://ipinfo.io/static/ipinfo-small.svg" alt="IPinfo" width="24"/>](https://ipinfo.io/) IPinfo NodeJS Client Library

This is the official NodeJS client library for the [IPinfo.io](https://ipinfo.io) IP data API, allowing you to lookup your own IP address, or get any of the following details for an IP:

- [IP geolocation data](https://ipinfo.io/ip-geolocation-api) (city, region, country, postal code, latitude and longitude)
- [ASN details](https://ipinfo.io/asn-api) (ISP or network operator, associated domain name, and type, such as business, hosting or company)
- [Company data](https://ipinfo.io/ip-company-api) (the name and domain of the business that uses the IP address)
- [Carrier information](https://ipinfo.io/ip-carrier-api) (the name of the mobile carrier and MNC and MCC for that carrier if the IP is used exclusively for mobile traffic)

Check all the data we have for your IP address [here](https://ipinfo.io/what-is-my-ip).

**Works with ES5, ES6+ and TypeScript.**

## Getting Started

You'll need an IPinfo API access token, which you can get by signing up for a free account at [https://ipinfo.io/signup](https://ipinfo.io/signup).

The free plan is limited to 50,000 requests per month, and doesn't include some of the data fields such as IP type and company data. To enable all the data fields and additional request volumes see [https://ipinfo.io/pricing](https://ipinfo.io/pricing).

## Installation

```sh
npm install node-ipinfo
```

## Usage

### TypeScript

```typescript
import IPinfoWrapper from "node-ipinfo";

const token = "myToken"
const ip = "8.8.8.8";
const asn = "AS7922";
const ipinfoWrapper = new IPinfoWrapper(token);

ipinfoWrapper.lookupIp(ip).then((response: IPinfo) => {
    console.log(response.asn); // { asn: 'AS15169', name: 'Google LLC', domain: 'google.com', route: '8.8.8.0/24', type: 'business' }
    console.log(response.hostname); // dns.google
    console.log(response.city); // Mountain View
});

ipinfoWrapper.lookupASN(asn).then((response: ASNResponse) => {
    console.log(response.asn); // AS7922
    console.log(response.name); // Comcast Cable Communications, LLC
    console.log(response.country); // United States
});
```

### JavaScript

```javascript
var IPinfo = require("node-ipinfo");

var token = "myToken"
var ip = "8.8.8.8"
var asn = "AS7922";
var ipinfo = new IPinfo(token);

ipinfo.lookupIp(ip).then((response) => {
    console.log(response.asn); // { asn: 'AS15169', name: 'Google LLC', domain: 'google.com', route: '8.8.8.0/24', type: 'business' }
    console.log(response.hostname); // dns.google
    console.log(response.city); // Mountain View
});

ipinfo.lookupASN(asn).then((response) => {
    console.log(response.asn); // AS7922
    console.log(response.name); // Comcast Cable Communications, LLC
    console.log(response.country); // United States
});
```

### AMD

```javascript
define(function(require,exports,module){
  var ipinfo = require('node-ipinfo');
});
```

### Caching

This library uses an LRU cache (deletes the least-recently-used items).

If you prefer a different caching methodology, you may use the `IPCache` interface through TypeScript and implement your own caching system around your own infrastructure.

The default cache length is 1 day and the defauly max number of items allowed in the cache is 5000. This can be changed by passing an `Option` to the `LruCache` constructor.

##### TypeScript

```typescript
import IPinfoWrapper, { LruCache, Options } from "node-ipinfo";

const cacheOptions: Options = {
    max: 5000,
    maxAge: 24 * 1000 * 60 * 60,
};
var cache = new LruCache(cacheOptions);
var ipinfoWrapper = new IPinfoWrapper("token", cacheOptions);
```

##### JavaScript

```javascript
var IPinfo = require("node-ipinfo");

var cacheOptions = {
    max: 5000,
    maxAge: 24 * 1000 * 60 * 60,
};
var cache = new IPinfo.LruCache(cacheOptions);
var ipinfo = new IPinfo("myToken", cache);
```

### Errors

```javascript
// example coming soon
```

### Country Name Lookup

```javascript
// example coming soon
```

### Location Information

```javascript
// example coming soon
```

## Integrated Typescript Typings

Get great code completion for this package using the integrated typescript typings. It includes the complete typings of the IPinfo API too, so you'll know both how to the navigate the API as well as the response you are getting.

## Running tests

In order to run the tests, run:

    $ npm run test

If you want to check out the coverage, run:

    $ npm run test:coverage

### Other Libraries

There are official IPinfo client libraries available for many languages including PHP, Python, Go, Java, Ruby, and many popular frameworks such as Django, Rails and Laravel. There are also many third party libraries and integrations available for our API.

https://ipinfo.io/developers/libraries

### About IPinfo

Founded in 2013, IPinfo prides itself on being the most reliable, accurate, and in-depth source of IP address data available anywhere. We process terabytes of data to produce our custom IP geolocation, company, carrier, privacy detection (VPN, proxie, Tor), hosted domains, and IP type data sets. Our API handles over 20 billion requests a month for 100,000 businesses and developers.

[![image](https://avatars3.githubusercontent.com/u/15721521?s=128&u=7bb7dde5c4991335fb234e68a30971944abc6bf3&v=4)](https://ipinfo.io/)
