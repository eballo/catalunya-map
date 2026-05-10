module.exports = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        url: 'http://localhost'
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    moduleNameMapper: {
        // Mock static asset imports which Webpack handles with loaders
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg)$': 'identity-obj-proxy'
    }
};
