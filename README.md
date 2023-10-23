# [<img src="https://ipinfo.io/static/ipinfo-small.svg" alt="IPinfo" width="24"/>](https://ipinfo.io/) IPinfo NodeJS Client Library

This is the official NodeJS client library for the [IPinfo.io](https://ipinfo.io) IP data API, allowing you to look up your own IP address, or get any of the following details for an IP:

- [IP geolocation data](https://ipinfo.io/ip-geolocation-api) (city, region, country, postal code, latitude, and longitude)
- [ASN details](https://ipinfo.io/asn-api) (ISP or network operator, associated domain name, and type, such as business, hosting, or company)
- [Company data](https://ipinfo.io/ip-company-api) (the name and domain of the business that uses the IP address)
- [Carrier information](https://ipinfo.io/ip-carrier-api) (the name of the mobile carrier and MNC and MCC for that carrier if the IP is used exclusively for mobile traffic)

Check all the data we have for your IP address [here](https://ipinfo.io/what-is-my-ip).

**Works with ES5, ES6+ and TypeScript.**

## Getting Started

You'll need an IPinfo API access token, which you can get by signing up for a free account at [https://ipinfo.io/signup](https://ipinfo.io/signup).

The free plan is limited to 50,000 requests per month, and doesn't include some of the data fields such as IP type and company data. To enable all the data fields and additional request volumes see [https://ipinfo.io/pricing](https://ipinfo.io/pricing).

### Installation

#### npm

```bash
npm install node-ipinfo
```

#### yarn

```bash
yarn add node-ipinfo
```

### Usage

##### TypeScript

```typescript
import IPinfoWrapper, { IPinfo, AsnResponse } from "node-ipinfo";

const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN");

ipinfoWrapper.lookupIp("1.1.1.1").then((response: IPinfo) => {
    console.log(response);
});

ipinfoWrapper.lookupASN("AS7922").then((response: AsnResponse) => {
    console.log(response);
});
```

##### JavaScript

```javascript
const { IPinfoWrapper } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("MY_TOKEN");

ipinfo.lookupIp("1.1.1.1").then((response) => {
    console.log(response);
});

ipinfo.lookupASN("AS7922").then((response) => {
    console.log(response);
});
```

### Caching

This library uses an LRU cache (deletes the least-recently-used items).

If you prefer a different caching methodology, you may use the `IPCache` interface through TypeScript and implement your own caching system around your own infrastructure.

The default cache length is 1 day and the default max number of items allowed in the cache is 5000. This can be changed by passing an `Option` to the `LruCache` constructor.

##### TypeScript

```typescript
import IPinfoWrapper, { LruCache, Options } from "node-ipinfo";

const cacheOptions: Options<string, any> = {
    max: 5000,
    ttl: 24 * 1000 * 60 * 60,
};
const cache = new LruCache(cacheOptions);
const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN", cache);
```

##### JavaScript

```javascript
const { IPinfoWrapper, LruCache } = require("node-ipinfo");

const cacheOptions = {
    max: 5000,
    ttl: 24 * 1000 * 60 * 60,
};
const cache = new LruCache(cacheOptions);
const ipinfo = new IPinfoWrapper("MY_TOKEN", cache);
```

### Timeouts

The client constructor accepts a `timeout` parameter in milliseconds that
controls the timeout of requests. It defaults to `5000` i.e. 5 seconds.

A timeout of `0` disables the timeout feature.

##### TypeScript

```typescript
import IPinfoWrapper from "node-ipinfo";

// 10 second timeout.
const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN", null, 10000);
```

##### JavaScript

```javascript
const { IPinfoWrapper } = require("node-ipinfo");

// 10 second timeout.
const ipinfo = new IPinfoWrapper("MY_TOKEN", null, 10000);
```

### Errors

##### TypeScript

```typescript
import IPinfoWrapper, { IPinfo, ApiLimitError } from "node-ipinfo";

const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN");

ipinfoWrapper.lookupIp("1.1.1.1").then((response: IPinfo) => {
    console.log(response);
})
.catch((error) => {
    console.log(error);
    if (error instanceof ApiLimitError) {
        // handle api limit exceed error
    } else {
        // handle other errors
    }
});
```

##### JavaScript

```javascript
const { IPinfoWrapper, ApiLimitError } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("MY_TOKEN");

ipinfo.lookupIp("1.1.1.1").then((response) => {
    console.log(response);
},
(error) => {
    console.log(error);
    if (error instanceof ApiLimitError){
        // handle api limit exceed error
    } else {
        // handle other errors
    }
});
```

### Country Name Lookup

`response.country` will return the country name, whereas `response.countryCode` can be used to fetch the country code.

Additionally `response.isEU` will return `true` if the country is a member of the European Union (EU), `response.countryFlag` 
will return the emoji and Unicode of the country's flag, `response.countryFlagURL` will return a public link to the country's flag image as an SVG which can be used anywhere, `response.countryCurrency` will return the code and symbol of the country's currency and `response.continent` will return the continent of the IP.

##### TypeScript

```typescript
import IPinfoWrapper, { IPinfo } from "node-ipinfo";

const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN");

ipinfoWrapper.lookupIp("1.1.1.1").then((response: IPinfo) => {
    // country code, e.g. 'US'
    console.log(response.countryCode);

    // country name, e.g. 'United States'
    console.log(response.country);

    // whether part of the EU, e.g. false 
    console.log(response.isEU);

    // emoji and unicode of country flag { emoji: '🇺🇸', unicode: 'U+1F1FA U+1F1F8' }
    console.log(response.countryFlag)

    // country's flag image URL e.g. https://cdn.ipinfo.io/static/images/countries-flags/US.svg
    console.log(response.countryFlagURL)

    // code and symbol of country currency { code: 'USD', symbol: '$' }
    console.log(response.countryCurrency)

    // code and name of continent { code: 'NA', name: 'North America' }
    console.log(response.continent)
});
```

##### JavaScript

```javascript
const { IPinfoWrapper } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("MY_TOKEN");

ipinfo.lookupIp("1.1.1.1").then((response) => {
    // country code, e.g. 'US'
    console.log(response.countryCode);

    // country name, e.g. 'United States'
    console.log(response.country);

    // whether part of the EU, e.g. false 
    console.log(response.isEU);
    
    // emoji and unicode of country flag { emoji: '🇺🇸', unicode: 'U+1F1FA U+1F1F8' }
    console.log(response.countryFlag)

    // country's flag image URL e.g. https://cdn.ipinfo.io/static/images/countries-flags/US.svg
    console.log(response.countryFlagURL)

    // code and symbol of country currency { code: 'USD', symbol: '$' }
    console.log(response.countryCurrency)
});
```

### Location Information

`response.loc` will return a composite string of latitude and longitude values in the `"latitude,longitude"` format.

##### TypeScript

```typescript
import IPinfoWrapper, { IPinfo } from "node-ipinfo";

const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN");

ipinfoWrapper.lookupIp("1.1.1.1").then((response: IPinfo) => {
    // '34.0522,-118.2437'
    console.log(response.loc);
});
```

##### JavaScript

```javascript
const { IPinfoWrapper } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("MY_TOKEN");

ipinfo.lookupIp("1.1.1.1").then((response) => {
    // '34.0522,-118.2437'
    console.log(response.loc);
});
```

### Locate IPs on a World Map

A world map can be generated with locations of all input IPs using `getMap`. It returns the URL of the map in the response.

##### TypeScript

```typescript
import IPinfoWrapper, { MapResponse } from "node-ipinfo";

const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN");

const ips = ["1.1.1.1", "8.8.8.8", "1.2.3.4"]; 
ipinfoWrapper.getMap(ips).then((response: MapResponse) => {
    console.log(response);
});
```

##### JavaScript

```javascript
const { IPinfoWrapper } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("MY_TOKEN");

const ips = ["1.1.1.1", "8.8.8.8", "1.2.3.4"]; 
ipinfo.getMap(ips).then((response) => {
    console.log(response);
});
```

### Batch Operations

Looking up a single IP at a time can be slow. It could be done concurrently from the client side, but IPinfo supports a batch endpoint to allow you to group together IPs and let us handle retrieving details for them in bulk for you.

##### TypeScript

```typescript
import IPinfoWrapper, { BatchResponse } from "node-ipinfo";

const ipinfoWrapper = new IPinfoWrapper("MY_TOKEN");

const ips = ["1.1.1.1", "8.8.8.8", "1.2.3.4/country"]; 
ipinfoWrapper.getBatch(ips).then((response: BatchResponse) => {
    console.log(response);
});
```

##### JavaScript

```javascript
const { IPinfoWrapper } = require("node-ipinfo");

const ipinfo = new IPinfoWrapper("MY_TOKEN");

const ips = ["1.1.1.1", "8.8.8.8", "1.2.3.4/country"]; 
ipinfo.getBatch(ips).then((response) => {
    console.log(response);
});
```

The input size is not limited, as the interface will chunk operations for you
behind the scenes.

Please see [the official documentation](https://ipinfo.io/developers/batch) for
more information and limitations.

## Integrated Typescript Typings

Get great code completion for this package using the integrated typescript typings. It includes the complete typings of the IPinfo API too, so you'll know how to navigate both the API as well as the response you are getting.

## Running tests

In order to run the tests, run:

    $ npm run test

If you want to check out the coverage, run:

    $ npm run test:coverage

## Other Libraries

There are official IPinfo client libraries available for many languages including PHP, Python, Go, Java, Ruby, and many popular frameworks such as Django, Rails, and Laravel. There are also many third-party libraries and integrations available for our API.

https://ipinfo.io/developers/libraries

## About IPinfo

Founded in 2013, IPinfo prides itself on being the most reliable, accurate, and in-depth source of IP address data available anywhere. We process terabytes of data to produce our custom IP geolocation, company, carrier, privacy detection (VPN, proxies, Tor), hosted domains, and IP type data sets. Our API handles over 40 billion requests a month for 100,000 businesses and developers.

[![image](https://avatars3.githubusercontent.com/u/15721521?s=128&u=7bb7dde5c4991335fb234e68a30971944abc6bf3&v=4)](https://ipinfo.io/)
