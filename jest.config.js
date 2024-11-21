module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    roots: ["<rootDir>/"],
    testMatch: ["**/*.test.ts"],
    globalSetup: "./__tests__/jest.setup.js",
    globalTeardown: "./__tests__/jest.teardown.js"
};
