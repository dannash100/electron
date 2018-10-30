const { crashReporter } = require('electron');

const host = 'http://localhost:3000/';

const config = {
    productName: 'markdown',
    companyName: 'Dan Nash',
    submitURL: host + 'crashreports',
    uploadToServer: true,
};

crashReporter.start(config);

console.log('[INFO] crash reporting started.', crashReporter);

module.exports = crashReporter;