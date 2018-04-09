'use strict';

const requests = require('request-promise-native'),
    auth = require('./authentication'),
    _ = require('underscore'),
    parseXml = require('@rgrove/parse-xml'),
    reject = require('./rejectTextNodes'),
    endpoints = require('../config/endpoints.json');

class Applications {
    async getApps() {
        let options = this.getOptions(),
            apps = await requests(options),
            parsed = parseXml(apps, {
                ignoreUndefinedEntities: true
            });
        
        if(this.parsedIsValid(parsed)) {
            let applications = reject.rejectTextNodes(parsed);
            return _.map(applications, (obj) => {
                return obj.attributes;
            });
            
        }
    }

    getOptions() {
        return {
            uri: endpoints.RequestApps,
            auth: auth.getAuthObject()
        };
    }

    parsedIsValid(parsed) {
        return parsed !== undefined && parsed.children.length;
    }
}

module.exports = new Applications();
