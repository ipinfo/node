# node-ipinfo

This is the official NodeJS Client library for the [IPinfo.io](https://ipinfo.io). Works with ES5, ES6+ and TypeScript. IP address API, allowing you to lookup your own IP address, or get any of the following details for an IP:
 - IP geolocation (city, region, country, postal code, latitude and longitude)
 - ASN details (ISP or network operator, associated domain name, and type, such as business, hosting or company)
 - Company details (the name and domain of the business that uses the IP address)
 - Carrier details (the name of the mobile carrier and MNC and MCC for that carrier if the IP is used exclusively for mobile traffic)

[![License](http://img.shields.io/:license-apache-blue.svg)](LICENSE)
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

## Installation

With your favorite package manager (npm or yarn) :

```sh
npm i -s node-ipinfo
yarn add node-ipinfo
bower install node-ipinfo --save
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
    console.log(response.asn); // { asn: 'AS15169', name: 'Google LLC', domain: 'google.com', route: '8.8.8.0/24', type: 'hosting' }
    console.log(response.hostname); // google-public-dns-a.google.com
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
    console.log(response.asn); // { asn: 'AS15169', name: 'Google LLC', domain: 'google.com', route: '8.8.8.0/24', type: 'hosting' }
    console.log(response.hostname); // google-public-dns-a.google.com
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

This library uses lru cache (deletes the least-recently-used items).

If you prefer a different caching methodology, you may use the `IPCache` interface and implement your own caching system around your own infrastructure.

The default cache length is 1 day and the defauly max number of items allowed in the cache is 100. This can be changed by passing an `Option` to the `LruCache` constructor. 

```javascript
// example coming soon
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

    $ npm test

If you want to check out the coverage, run:

    $ npm run test:coverage

### Other Libraries

There are official IPinfo client libraries available for many languages including PHP, Python, Go, Java, Ruby, and many popular frameworks such as Django, Rails and Laravel. There are also many third party libraries and integrations available for our API. 

https://ipinfo.io/developers/libraries

### About IPinfo

Founded in 2013, IPinfo prides itself on being the most reliable, accurate, and in-depth source of IP address data available anywhere. We process terabytes of data to produce our custom IP geolocation, company, carrier and IP type data sets. Our API handles over 12 billion requests a month for 100,000 businesses and developers.

[![image](https://avatars3.githubusercontent.com/u/15721521?s=128&u=7bb7dde5c4991335fb234e68a30971944abc6bf3&v=4)](https://ipinfo.io/)


