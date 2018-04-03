'use strict';

const requests = require('request-promise-native'),
    auth = require('./authentication'),
    _ = require('underscore'),
    parseXml = require('@rgrove/parse-xml'),
    endpoints = require('../config/endpoints.json');

class Applications {
    async getApps() {
        let options = {
            uri: endpoints.RequestApps,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            }
        };

        let apps = await requests(options),
            parsed = parseXml(apps, {
                ignoreUndefinedEntities: true
            });
        if(parsed !== undefined && parsed.children.length) {
            let applications = _.reject(parsed.children[0].children, (app) => {
                return app.type === 'text';
            });
            return _.map(applications, (obj) => {
                return obj.attributes;
            });
        }
    }
}

module.exports = new Applications();
