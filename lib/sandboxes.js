'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    _ = require('underscore'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

class Sandboxes {
    async getSandboxes(applicationId) {
        let options = this.getOptions(applicationId);
        
        let sandboxes = await requests(options),
            parsed = parseXml(sandboxes, {
                ignoreUndefinedEntities: true
            });
        if(parsed !== undefined && parsed.children.length) {
            let sandboxes = _.reject(parsed.children[0].children, (obj) => {
                return obj.type === 'text';
            });
            return _.map(sandboxes, (obj) => {
                return obj.attributes;
            });
        }
    }

    getOptions(applicationId) {
        return {
            method: 'POST',
            uri: endpoints.GetSandboxes,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            },
            formData: {
                app_id: applicationId
            }
        };
    }
}

module.exports = new Sandboxes();

