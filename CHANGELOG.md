# CHANGELOG

## 3.3.0

- Checking `bogon` IP locally.

## 3.2.0

- Added `isEU` that checks whether the IP geolocates to a European Union (EU) country.
- Added `CountryFlag` that returns emoji and unicode of country's flag.
- Added `CountryCurrency` that returns code and symbol of country's currency.
- Added `Continent` that returns the continent where IP geolocates.

## 3.1.1

- Fix error handling for 5xx errors; a slightly more sensible error is now
  thrown.

## 3.1.0

- Fixed error handling; 429 errors were not properly being propagated to the
  user.
- Added a lot more documentation across the board.

## 3.0.2

- Added `relay` and `service` fields to Privacy typescript definition.

## 3.0.1

- Added `anycast` and `bogon` boolean fields to Core typescript definition.

## 3.0.0

- Imports using CommonJS don't have a default anymore. You must import the
  `IPinfoWrapper` name separately as follows:

  ```js
  const { IPinfoWrapper, LruCache } = require("node-ipinfo");
  ```

## 2.2.0

- Add `getMap` function for getting map URL for a list of IPs using
  [https://ipinfo.io/tools/map](https://ipinfo.io/tools/map).
- Add `getBatch` function for getting details of IPs in bulk (using 1 request).
- Cache keys are now versioned. **If you were using the cache directly
  before**, please ensure you use `IPinfoWrapper.cacheKey` to get the proper
  cache key given a normal key input.
- `axios` dependency is no longer required.

## 2.1.0

- Add an optional `timeout` parameter (milliseconds) to constructor.

## 2.0.2

- Fixed non-ES module imports to include the 'LruCache' object.

## 2.0.1

- Updates axios version to latest version for security vulnerability fix.
- Update lru-cache version to latest version.
