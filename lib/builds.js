'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    auth = require('./authentication'),
    responsesToObject = require('./responsesToObjects'),
    endpoints = require('../config/endpoints.json');

class Builds {
    async getBuilds(applicationId, sandboxId) {
        let options = this.getOptions(applicationId, sandboxId, endpoints.GetSandboxBuildList),
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

    getOptions(applicationId, sandboxId, endpoint) {
        return {
            method: 'POST',
            uri: endpoint,
            auth: auth.getAuthObject(),
            formData: {
                app_id: applicationId,
                sandbox_id: sandboxId
            }
        };
    }

    async getBuild(applicationId, buildId) {
        let options = this.getOptions(applicationId, buildId, endpoints.GetBuildInfo),
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
