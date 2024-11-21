module.exports = async function globalTeardown() {
    await globalThis.server.stop();
};
