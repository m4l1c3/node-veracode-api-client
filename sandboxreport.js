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

format.extend(String.prototype);

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
    workbook.creator = 'it-veracodeadmins@scentsy.com';
    workbook.created = new Date();
    return workbook;
}

function createAggregateWorksheet(workbook, data) {
    let builders = [];
        
    _.forEach(data, (app) => {
        _.forEach(app.sandboxes, (sandbox) => {
            _.forEach(sandbox.builds, (build) => {
                var builder;
                builder = _.find(builders, (b) => {
                    return b.Builder === build.submitter;
                });
                if(builder === undefined) {
                    let index = builders.push({
                        Builder: build.submitter,
                        TotalBuilds: 0
                    });
                    builder = builders[index - 1];
                }
                
                builder.TotalBuilds += 1;
            });
        });
    });

    if(builders.length) {
        let worksheet = workbook.addWorksheet('Aggregate');
        
        worksheet.columns = [
            {header: 'UserName', key: 'Builder'},
            {header: 'TotalBuilds', key: 'TotalBuilds'}
        ];
        _.forEach(builders, (builder) => {
            worksheet.addRow(builder);
        });
    }
}

function createScansWorksheet(workbook, data) {
    let scanners = [];
    _.forEach(data, (app) => {
        _.forEach(app.sandboxes, (sandbox) => {
            _.forEach(sandbox.builds, (build) => {
                scanners.push({
                    User: build.submitter,
                    Application: app.app_name,
                    BuildDate: getBuildDate(build.date),
                    BuildID: build.build_id
                });
            });
        });
    });
    if(scanners.length) {
        let worksheet = workbook.addWorksheet('Scans');
        
        worksheet.columns = [
            {header: 'User', key: ''},
            {header: 'Application', key: ''},
            {header: 'BuildDate', key: ''},
            {header: 'BuildID', key: ''}
        ];
        _.forEach(scanners, (scanner) => {
            worksheet.addRow(scanner);
        });
    }
}

function createSpreadsheet(data) {
    let workbook = createWorkbook();
    createAggregateWorksheet(workbook, data);
    createScansWorksheet(workbook, data);
    return workbook;
}

function getBuildDate(dateString) {
    new Date(dateString.substring(0, dateString.lastIndexOf(' ')))
}

function hasValidBuilds(builds) {
    var isValid = false;
    _.any(builds, (build) => {
        let date = getBuildDate(build.date);
        if(moment(date).isAfter(moment().subtract(7, 'days'))) {
            isValid = true;
        }
    });
    return isValid;
}

async function main() {
    logger.info('Beginning sandbox report generation')
    let start = new Date();
    var spreadsheet;
    await getApps();
    await getSandboxes();
    await getSandboxBuilds();
    await getAllBuilds();
    let apps = _.reject(application_list, (application) => {
        return _.any(application.sandboxes, (sandbox) => {
            return !hasValidBuilds(sandbox.builds);
        });
        logger.info(application);
    });
    if(apps.length) {
        spreadsheet = createSpreadsheet(apps);
    }
    
    if(spreadsheet !== undefined) {
        spreadsheet.xlsx.writeFile('./output.xlsx')
            .then(() => {
                logger.info('Done writing output');
            }).catch((err) => {
                logger.error('Error writing file: {}'.format(err));
            });
    }

    let end = (new Date() - start) / 1000;
    logger.info('Total Execution time: {} seconds'.format(end));
}

main();
