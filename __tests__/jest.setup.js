const fakeServer = require("test-fake-server");
const path = require("path");

module.exports = async function globalSetup() {
    const model = {
        port: 9090,
        api: [
            {
                method: "GET",
                path: "/8.8.8.8/json",
                response: path.resolve(__dirname, "./fixtures/8.8.8.8.json")
            },
            {
                method: "GET",
                path: "/198.51.100.1/json",
                response: path.resolve(
                    __dirname,
                    "./fixtures/198.51.100.1.json"
                )
            },
            {
                method: "GET",
                path: "/AS7922/json",
                response: path.resolve(__dirname, "./fixtures/AS7922.json")
            },
            {
                method: "POST",
                path: "/batch",
                response: path.resolve(__dirname, "./fixtures/batch.json")
            },
            {
                method: "POST",
                path: "/tools/map",
                response: path.resolve(__dirname, "./fixtures/tools/map.json")
            }
        ]
    };

    globalThis.server = await fakeServer(model);
};
