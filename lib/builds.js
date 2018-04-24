'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    auth = require('./authentication'),
    responsesToObject = require('./responsesToObjects'),
    endpoints = require('../config/endpoints.json');

class Builds {
    async getBuilds(applicationId, sandboxId, user, password) {
        let options = this.getOptions(applicationId, sandboxId, endpoints.GetSandboxBuildList, user, password),
            build_list = await requests(options),
            parsed = parseXml(build_list, {
                ignoreUndefinedEntities: true
            });
        
        if(this.buildsParsedIsValid(parsed)) {
            return responsesToObject.getObject(parsed);
        }
    }

    buildsParsedIsValid(parsed) {
        return parsed !== undefined && parsed !== '';
    }

    getOptions(applicationId, sandboxId, endpoint, user, password) {
        return {
            method: 'POST',
            uri: endpoint,
            auth: auth.getAuthObject(user, password),
            formData: {
                app_id: applicationId,
                sandbox_id: sandboxId
            }
        };
    }

    async getBuild(applicationId, buildId, user, password) {
        let options = this.getOptions(applicationId, buildId, endpoints.GetBuildInfo, user, password),
            builds = await requests(options),
            parsed = parseXml(builds, {
                ignoreUndefinedEntities: true
            });

        if(this.buildParsedIsValid(parsed)) {
            return responsesToObject.getObject(parsed);
        }
    }
    
    buildParsedIsValid(parsed) {
        return parsed !== undefined && parsed !== '';
    }
}

module.exports = new Builds();
