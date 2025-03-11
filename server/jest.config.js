export default {
  collectCoverage: true,
  coverageDirectory: "coverage", // Where coverage reports are saved
  coverageReporters: ["text", "text-summary", "lcov"],
  collectCoverageFrom: [
    "**/*.js", // Include specific files or patterns for coverage
    "!**/*.test.js", // Exclude test files
    "!node_modules/**", // Exclude index files if needed
    "!jest.config.js", // Exclude index files if needed
    "!coverage/**", // Exclude index files if needed
  ],
};
