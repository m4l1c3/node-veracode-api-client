'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications');

let apps = applications.getApps();
apps.then((response) => {
    console.log(response);
});

