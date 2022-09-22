import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	collectCoverage: true,
	collectCoverageFrom: ["**/src/**"],
	coveragePathIgnorePatterns: [
		// These two files form the imperative shell, which will not be tested
		"src/index.ts",
		"src/service_worker.ts",
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
