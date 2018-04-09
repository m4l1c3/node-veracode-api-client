'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
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
    async uploadArchive(archive, appId, sandboxId = '') {
        try {
            if(!fs.existsSync(archive))
                logger.error('Archive does not exist: {}'.format(archive));
            let zip = fs.createReadStream(archive),
                options = this.getOptions(appId, sandboxId, zip),
                upload = await requests(options),
                parsed = parseXml(upload, {
                    ignoreUndefinedEntities: true
                });
            
            if(this.parsedDataIsValid(parsed)) {
                return parsed.children[0].attributes['build_id'];
            }
            return false;
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    async uploadApplication(archive, app_id, use_sandbox) {
        if(!fs.existsSync(archive)) {
            throw "Archive does not exist";
        }
        if(parseInt(app_id) === 'NaN') {
            throw "App ID must be an integer value";
        }
        
        try {
            if(use_sandbox) {
                let sandbox_list = await sandboxes.getSandboxes(app_id),
                    i = 0,
                    success = false;
                
                while(!success && i < sandbox_list.length) {
                    success = await this.uploadAndScan(archive, app_id, sandbox_list[i].sandbox_id);
                    i++;
                }
                if(!success) {
                    logger.warning('Unable to upload and prescan using sandbox, no sandboxes available');
                }
            } else {
                let success = await this.uploadAndScan(archive, app_id);
                if(success) {
                    logger.info('Upload and prescan successful');
                    return true;
                }
            }
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    async uploadAndScan(archive, app_id, sandbox_id = '') {
        try {
            let build_id = await this.uploadArchive(archive, app_id, sandbox_id);
            if(!build_id) {
                return false;
            }
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

    async upload(archive, app_id, use_sandbox) {
        await this.uploadApplication(archive, app_id, use_sandbox);
    }

    getOptions(appId, sandboxId, zip) {
        let form = {
            app_id: appId,
            file: zip
        };
        if(sandboxId !== '') {
            form['sandbox_id'] = sandboxId
        }
        return {
            method: 'POST',
            uri: endpoints.UploadApp,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            },
            formData: form
        };
    }

    parsedDataIsValid(parsed) {
        return parsed !== undefined && parsed !== '' && parsed.children.length && parsed.children[0].attributes !== undefined 
            && parsed.children[0].attributes['build_id'] !== '' && parsed.children[0].attributes['build_id'] !== undefined
            && parsed.children[0].name !== 'error';
    }
}

module.exports = new Upload();