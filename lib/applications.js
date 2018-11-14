'use strict';

const requests = require('request-promise-native'),
    auth = require('./authentication'),
    _ = require('underscore'),
    parseXml = require('@rgrove/parse-xml'),
    logger = require('./logger'),
    responsesToObject = require('./responsesToObjects'),
    format = require('string-format'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Applications {
    async getApps(user, password) {
        try {
        let options = this.getOptions(user, password),
            apps = await requests(options),
            parsed = parseXml(apps, {
                ignoreUndefinedEntities: true
            });
        
        if(this.parsedIsValid(parsed)) {
            return responsesToObject.getObject(parsed);
        }
        } catch(err) {
            logger.error('{}'.format(err));
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
