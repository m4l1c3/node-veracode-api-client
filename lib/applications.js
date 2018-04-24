'use strict';

const requests = require('request-promise-native'),
    auth = require('./authentication'),
    _ = require('underscore'),
    parseXml = require('@rgrove/parse-xml'),
    responsesToObject = require('./responsesToObjects'),
    endpoints = require('../config/endpoints.json');

class Applications {
    async getApps(user, password) {
        let options = this.getOptions(user, password),
            apps = await requests(options),
            parsed = parseXml(apps, {
                ignoreUndefinedEntities: true
            });
        
        if(this.parsedIsValid(parsed)) {
            return responsesToObject.getObject(parsed);
        }
    }

    getOptions(user, password) {
        return {
            uri: endpoints.RequestApps,
            auth: auth.getAuthObject(user, password)
        };
    }

    parsedIsValid(parsed) {
        return parsed !== undefined && parsed.children.length;
    }
}

module.exports = new Applications();
