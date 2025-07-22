# CHANGELOG

## 4.1.0

- Add support for IPinfo Lite API

## 4.0.0 / 4.0.1

Version 4 is a major version bump due to changing internals 
(from http(s) to node-fetch) which consumers may depend on.

- Replace NodeJS http(s) with [node-fetch](https://www.npmjs.com/package/node-fetch) for communication with API
- Increases minimum Node engine version to 14

## 3.5.4 / 3.5.5

- Reject on timeout in lookupIP, lookupASN, and getMap
- Gracefully handle JSON.parse failures

## 3.5.2 / 3.5.3

- No-op release

## 3.5.1

- Inlined files that were previously being loaded as JSON files.

## 3.5.0

- Upgrades underlying default LRU cache library to fix typescript errors (v6
  didn't provide types, but v7 and above do natively).

## 3.4.6

- Last version (3.4.5) incorrectly published a bad dist output due to buggy
  CI/CD. This fixes it.

## 3.4.5 (DEPRECATED)

- Updated tests.

## 3.4.4

- Added lru-cache types into published artifacts.

## 3.4.3

- Moved test files out of published artifacts and updated some packages.

## 3.4.2

- Refactored `isBogon` function.

## 3.4.1

- Fixed `isBogon` empty IP check.

## 3.4.0

- Allow async LRUCache storage.

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
