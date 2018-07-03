'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    responsesToObject = require('./responsesToObjects'),
    _ = require('underscore'),
    logger = require('./logger'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Sandboxes {
    async getSandboxes(applicationId, user, password) {
        try {
            let options = this.getOptions(applicationId, user, password),
                sandboxes = await requests(options),
                parsed = parseXml(sandboxes, {
                    ignoreUndefinedEntities: true
                });
            if(this.parsedIsValid(parsed)) {
                return responsesToObject.getObject(parsed);
            }
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    parsedIsValid(parsed) {
        return parsed !== undefined && parsed.children.length;
    }

    getOptions(applicationId, user, password) {
        return {
            method: 'POST',
            uri: endpoints.GetSandboxes,
            auth: auth.getAuthObject(user, password),
            formData: {
                app_id: applicationId
            }
        };
    }
}

module.exports = new Sandboxes();
