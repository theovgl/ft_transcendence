module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	extends: [
		'airbnb',
		'airbnb-typescript',
	],
	root: true,
	env: {
		browser: true,
    node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js', 'dist/**'],
	rules: {
		'@typescript-eslint/indent': 'off',
		'react/react-in-jsx-scope': 'off',
		'no-tabs': 'off',
		'semi': [ 'error', 'always' ],
		'indent': [ 'error', 'tab' ],
		'quotes': [ 'error', 'single' ],
	},
};
