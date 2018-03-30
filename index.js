'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    logger = require('./lib/logger'),
    sandboxes = require('./lib/sandboxes'),
    uploader = require('./lib/upload'),
    prescan = require('./lib/prescan'),
    fs = require('fs'),
    builds = require('./lib/builds');

async function uploadApplication(archive, app_id, sandbox_id = '') {
    if(!fs.existsSync(archive)) {
        throw "Archive does not exist";
    }
    if(parseInt(app_id) === 'NaN') {
        throw "App ID must be an integer value";
    }

    let sandbox_list = await sandboxes.getSandboxes(app_id);
       let i = 0;
       let success = false;
    
    while(!success && i < sandbox_list.length) {
        success = await uploadAndScan(archive, app_id, sandbox_list[i].sandbox_id);
        i++;
    }
    if(!success) {
        logger.warning('Unable to upload and prescan using sandbox, no sandboxes available');
    }
}

async function uploadAndScan(archive, app_id, sandbox_id) {
    try {
        let build_id = await uploader.uploadArchive(archive, app_id, sandbox_id);
        if(build_id !== '' && parseInt(build_id) !== 'NaN') {
            let scan = await prescan.initiatePrescan(app_id, sandbox_id, build_id);
            if(scan) {
                logger.info('Upload and prescan successful');
                return true;
            } else {
                logger.info('Sandbox in use');
                return false;
            }
        }
    } catch(err) {
        logger.error('{}'.format(err));
    }
}

async function main(archive, app_id) {
    await uploadApplication(archive, app_id);
}

module.exports = main();