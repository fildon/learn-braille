import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	collectCoverage: true,
	collectCoverageFrom: ["**/src/**"],
	coveragePathIgnorePatterns: [
		// This file forms the imperative shell, which will not be tested
		"src/index.ts",
		"src/serviceWorker.ts",
	],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
};

export default config;
