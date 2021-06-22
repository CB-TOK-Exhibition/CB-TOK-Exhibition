module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: ["tsconfig.json", "tsconfig.dev.json"],
		tsconfigRootDir: __dirname,
		sourceType: "module",
	},
	ignorePatterns: [
	],
	plugins: [
		"@typescript-eslint",
		"import",
	],
	rules: {
		"quotes": ["error", "double"],
		"indent": ["error", "tab"],
		"no-tabs": 0,
		"max-len": 0,
		"camelcase": 0,
	},
};
