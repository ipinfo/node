module.exports = (function () {
    if (exports.__esModule && exports.__esModule === true) {
        return require("./dist/src/ipinfoWrapper.js");
    }
    const m = require("./dist/src/ipinfoWrapper.js");
    m.default.LruCache = m.LruCache;
    return m.default;
})();
