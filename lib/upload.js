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
    async uploadArchive(archive, appId, sandboxId = '', user = '', password = '') {
        try {
            if(!fs.existsSync(archive)) {
                logger.error('Archive does not exist: {}'.format(archive));
                return false;
            }
            let zip = fs.createReadStream(archive),
                options = this.getOptions(appId, sandboxId, zip, user, password);
            let upload = await requests(options),
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

    async uploadApplication(archive, app_id, use_sandbox, user, password) {
        if(!fs.existsSync(archive)) {
            throw 'Archive does not exist';
        }
        if(parseInt(app_id) === 'NaN') {
            throw 'App ID must be an integer value';
        }
        
        try {
            if(use_sandbox) {
                return await this.uploadToNextSandbox(archive, app_id, user, password);
            } else {
                return await this.uploadToApplicationProfile(archive, app_id, user, password);
            }
        } catch(err) {
            logger.error('{}'.format(err));
            return false;
        }
    }

    async uploadToApplicationProfile(archive, app_id, user, password) {
        let success = await this.uploadAndScan(archive, app_id, user, password);
        if(success) {
            logger.info('Upload successful');
        }
        return success;
    }

    async uploadToNextSandbox(archive, app_id, user, password) {
        let sandbox_list = await sandboxes.getSandboxes(app_id, user, password),
            i = 0,
            success = false;
        
        while(!success && i < sandbox_list.length) {
            success = await this.uploadAndScan(archive, app_id, user, password, sandbox_list[i].sandbox_id);
            i++;
        }
        if(!success) {
            logger.warning('Unable to upload and prescan using sandbox, no sandboxes available');
            return false;
        }
        return true;
    }

    async uploadAndScan(archive, app_id, user = '', password = '', sandbox_id = '') {
        try {
            let build_id = await this.uploadArchive(archive, app_id, sandbox_id, user, password);

            if(build_id && build_id !== '' && parseInt(build_id) !== 'NaN') {
                let scan = await prescan.initiatePrescan(app_id, sandbox_id, build_id, user, password);
                if(scan) {
                    logger.info('Prescan successfully invoked.');
                    return true;
                }
            }
            return false;
        } catch(err) {
            logger.error('{}'.format(err));
            return false;
        }
    }

    async upload(archive, app_id, use_sandbox, user, password) {
        return await this.uploadApplication(archive, app_id, use_sandbox, user, password);
    }

    getOptions(appId, sandboxId, zip, user, password) {
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
            auth: auth.getAuthObject(user, password),
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
