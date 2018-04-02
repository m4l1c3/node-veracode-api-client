'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    logger = require('./lib/logger'),
    sandboxes = require('./lib/sandboxes'),
    uploader = require('./lib/upload'),
    fs = require('fs'),
    builds = require('./lib/builds');

async function main() {
    await uploader.upload(archive, app_id);
}

main();