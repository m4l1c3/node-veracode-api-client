'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    responsesToObject = require('./responsesToObjects'),
    _ = require('underscore'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

class Sandboxes {
    async getSandboxes(applicationId) {
        try {
            let options = this.getOptions(applicationId),
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

    getOptions(applicationId) {
        return {
            method: 'POST',
            uri: endpoints.GetSandboxes,
            auth: auth.getAuthObject(),
            formData: {
                app_id: applicationId
            }
        };
    }
}

module.exports = new Sandboxes();