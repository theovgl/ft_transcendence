module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js', 'dist/**'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'semi': [ 'error', 'always' ],
		'indent': [ 'error', 'tab' ],
		'brace-style': [ 'error', '1tbs' ],
		'quotes': [ 'error', 'single' ],
		'linebreak-style': [ 'error', 'unix' ],
		'curly': ['error', 'multi-or-nest'],
		'no-multiple-empty-lines': ['error', { max: 1 }],
		"keyword-spacing": ["error", { "after": true, "before": true }],
		"no-trailing-spaces": ["error"]
	},
};
