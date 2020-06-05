module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
	coveragePathIgnorePatterns: [
		'/docs/',
		'/configuration/',
		'index.js',
		'icmUrl.js'
	],
	coverageThreshold: {},
	moduleDirectories: ['node_modules'],
	transform: { '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest' },
	transformIgnorePatterns: [
		'[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
		'^.+\\.module\\.(css|sass|scss)$'
	]
}
