'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    _ = require('underscore'),
    sandboxes = require('./lib/sandboxes'),
    builds = require('./lib/builds'),
    format = require('string-format'),
    asynchronous = require('async');

//format.extend(String.prototype)
let application_list = [];

async function processArray(array, processingFunc, objArgs) {
    const promises = array.map(processingFunc.bind(null, objArgs));
    await Promise.all(promises);
}

async function appendApplicationSandboxes(app, sandbox) {
    app.sandboxes.push({
        sandbox_id: sandbox.sandbox_id,
        builds: []
    });
}

async function appendApplicationList(element, app) {
    application_list.push({
        app_id: app.app_id,
        app_name: app.app_name,
        sandboxes: []
    });
}

async function appendSandboxBuilds(sandbox, build) {
    sandbox.builds.push({
        build_id: build.build_id,
        date: build.version,
        submitter: '',
    });
}

async function getApps() {
    let apps = await applications.getApps();
    await processArray(apps, appendApplicationList);
}

async function GetSandboxBuilds(app_id, sandbox) {
    let build_list = await builds.getBuilds(app_id, sandbox.sandbox_id);
    await processArray(build_list, appendSandboxBuilds, sandbox);
}

async function GetSandboxes(element, application) {
    let sandbox_list = await sandboxes.getSandboxes(application.app_id);
    await processArray(sandbox_list, appendApplicationSandboxes, application);
}

async function GetBuild(app_id, build) {
    let build_info = await builds.getBuild(app_id, build.build_id);
    build.submitter = build_info[0].submitter;
}

async function getAppSandboxes(application_list) {
    await processArray(application_list, GetSandboxes);
}

async function GetBuilds(element, application) {
    await processArray(application.sandboxes, GetSandboxBuilds, application.app_id);
}

async function GetOnlyBuilds(element, sandboxes) { //element == app_id
    await processArray(sandboxes.builds, GetBuild, element);
}

async function getBuilds() {
    await processArray(application_list, GetBuilds);
}

async function GetAllSandboxBuilds(element, sandbox) {
    await processArray(sandbox.builds, GetBuild, element);
}

async function GetAllBuilds(element, application) {
    await processArray(application.sandboxes, GetAllSandboxBuilds, application.app_id);
}

async function getAllBuilds() {
    await processArray(application_list, GetAllBuilds);
}

async function getSandboxBuilds() {
    await getBuilds();
}

async function getSandboxes() {
    await getAppSandboxes(application_list);
}

async function main() {
    var start = new Date();
    await getApps();
    await getSandboxes();
    await getSandboxBuilds();
    await getAllBuilds();
    console.log(application_list);
    var end = new Date() - start;
    console.log('Execution time: %dms', end);
}

main();
