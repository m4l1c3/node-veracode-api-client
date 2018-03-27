'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    sandboxes = require('./lib/sandboxes'),
    builds = require('./lib/builds'),
    format = require('string-format'),
    logger = require('./lib/logger'),
    excel = require('exceljs'),
    moment = require('moment'),
    _ = require('underscore'),
    asynchronous = require('async');

format.extend(String.prototype)

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

function createWorkbook() {
    let workbook = new excel.Workbook();
    workbook.creator('it-veracodeadmins@scentsy.com');
    workbook.created = new Date();
}

function createAggregateWorksheet(workbook, data) {
    let worksheet = workbook.addWorksheet('Aggregate');
    worksheet.columns = [
        {header: 'UserName', key: ''},
        {header: 'TotalBuilds', key: ''}
    ];
}

function createScansWorksheet(workbook, data) {
    let worksheet = workbook.addWorksheet('Scans');
    worksheet.columns = [
        {header: 'User', key: ''},
        {header: 'Application', key: ''},
        {header: 'BuildDate', key: ''},
        {header: 'BuildID', key: ''}
    ]
}

function createSpreadsheet(data) {
    let workbook = createWorkbook();
    createAggregateWorksheet(workbook, data);
    createScansWorksheet(workbook, data);
}

function hasValidBuilds(builds) {
    var isValid = false;
    _.any(builds, (build) => {
        let date = new Date(build.date.substring(0, build.date.lastIndexOf(' ')));
        if(moment(date).isAfter(moment().subtract(7, 'days'))) {
            isValid = true;
        }
    });
    return isValid;
}

async function main() {
    logger.info('Beginning sandbox report generation')
    let start = new Date();
    await getApps();
    await getSandboxes();
    await getSandboxBuilds();
    await getAllBuilds();
    let apps = _.reject(application_list, (application) => {
        return _.any(application.sandboxes, (sandbox) => {
            return !hasValidBuilds(sandbox.builds);
            // return _.any(sandbox.builds, (build) => {
            //     let date = new Date(build.date.substring(0, build.date.lastIndexOf(' ')));
                // return sandbox.builds.length < 1 && !moment(date).isAfter(moment().subtract(7, 'days'));
            // });
        });
        logger.info(application);
    });
    if(apps.length) {
        let spreadsheet = createSpreadsheet(apps);
    }
    
    let end = (new Date() - start) / 1000;
    logger.info('Total Execution time: {} seconds'.format(end));
}

main();
