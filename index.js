'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    sandboxes = require('./lib/sandboxes');

let apps = applications.getApps();
apps.then((response) => {
    console.log(response);
});

let boxes = sandboxes.getSandboxes(294558);
boxes.then((response) => {
    console.log(response);
});
