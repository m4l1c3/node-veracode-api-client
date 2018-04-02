'use strict';

const requests = require('request-promise-native'),
    x = require('xml-js'),
    _ = require('underscore'),
    auth = require('./authentication'),
    sandboxes = require('./sandboxes'),
    applications = require('./applications'),
    format = require('string-format'),
    logger = require('./logger'),
    fs = require('fs'),
    prescan = require('./prescan'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Upload {
    async uploadArchive(archive, appId, sandboxId) {
        try {
            if(!fs.existsSync(archive))
                logger.error('Archive does not exist: {}'.format(archive));
            let zip = fs.createReadStream(archive);
            let options = {
                method: 'POST',
                uri: endpoints.UploadApp,
                auth: {
                    user: auth.getUser(),
                    pass: auth.getPassword()
                },
                formData: {
                    app_id: appId,
                    sandbox_id: sandboxId,
                    file: zip
                }
            };

            let upload = await requests(options);
            let r = JSON.parse(x.xml2json(upload), {compact: false, spaces: 4});
            if(r !== undefined && r !== '' && r.elements.length && r.elements[0].attributes !== undefined && r.elements[0].attributes['build_id'] !== '') {
                return r.elements[0].attributes['build_id'];
            }
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    async uploadApplication(archive, app_id, sandbox_id = '') {
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
            success = await this.uploadAndScan(archive, app_id, sandbox_list[i].sandbox_id);
            i++;
        }
        if(!success) {
            logger.warning('Unable to upload and prescan using sandbox, no sandboxes available');
        }
    }

    async uploadAndScan(archive, app_id, sandbox_id) {
        try {
            let build_id = await this.uploadArchive(archive, app_id, sandbox_id);
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

    async upload(archive, app_id) {
        await this.uploadApplication(archive, app_id)
    }
}

module.exports = new Upload();