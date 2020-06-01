module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'/coverage/',
		'/logs/',
		'/.vscode/'
	],
	coverageThreshold: {},
	moduleDirectories: ['node_modules'],
	transform: { '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest' },
	transformIgnorePatterns: [
		'[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
		'^.+\\.module\\.(css|sass|scss)$'
	]
}
