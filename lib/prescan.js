'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    auth = require('./authentication'),
    logger = require('./logger'),
    format = require('string-format'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Prescan {
    async initiatePrescan(appId, sandboxId, buildId, user, password) {
        try {
            let options = this.getOptions(appId, sandboxId, user, password),
                scan = await requests(options),
                parsed = parseXml(scan, {
                    ignoreUndefinedEntities: true
                });
            return this.isValidResponse(parsed, buildId);
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    isValidResponse(r, buildId) {
        try {
            return (r !== undefined && r !== '' && r.children.length && r.children[0].attributes !== undefined &&
                    r.children[0].attributes['build_id'] === buildId && r.children[0].children.length &&
                    r.children[0].children[0].children[1].attributes['status'] === 'Pre-Scan Submitted');
        } catch(err) {
            logger.error('{}'.format(err));
        }
        return false;
    }

    getOptions(appId, sandboxId, user, password) {
        return {
            method: 'POST',
            uri: endpoints.Prescan,
            auth: auth.getAuthObject(user, password),
            formData: {
                app_id: appId,
                sandbox_id: sandboxId,
                auto_scan: 'true'
            }
        };
    }
}

module.exports = new Prescan();
