'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    _ = require('underscore'),
    sandboxes = require('./lib/sandboxes');

let apps = applications.getApps();
apps.then((response) => {
    console.log(response);
    _.forEach(response, (item) => {
        let boxes = sandboxes.getSandboxes(item.app_id);
        boxes.then((sandbox) => {
            console.log(sandbox);
        });
    });
});

