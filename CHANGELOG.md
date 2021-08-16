# CHANGELOG

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
