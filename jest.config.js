module.exports = {
    rootDir: __dirname,
    testEnvironment: "node",
    setupFiles: [
        "<rootDir>/tests/setup.js"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/tests/teardown.js"
    ],
    clearMocks: true,
    collectCoverageFrom: [
        "src/**/*.js",
        "!src/index.js",
        "!src/database.js"
    ],
    coverageDirectory: "coverage"
};