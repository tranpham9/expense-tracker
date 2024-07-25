export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    // moduleNameMapper: { "node-fetch": "<rootDir>/node_modules/node-fetch-jest" },
};
