'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    auth = require('./authentication'),
    responsesToObject = require('./responsesToObjects'),
    endpoints = require('../config/endpoints.json');

class Builds {
    async getBuilds(applicationId, sandboxId) {
        let options = this.getBuildsOptions(applicationId, sandboxId),
            build_list = await requests(options),
            parsed = parseXml(build_list, {
                ignoreUndefinedEntities: true
            });
        
        if(this.buildsParsedIsValid(parsed)) {
            return responsesToObject.getBuildsObject(parsed);
        }
    }

    buildsParsedIsValid(parsed) {
        return parsed !== undefined && parsed !== '';
    }

    getBuildsOptions(applicationId, sandboxId) {
        return {
            method: 'POST',
            uri: endpoints.GetSandboxBuildList,
            auth: auth.getAuthObject(),
            formData: {
                app_id: applicationId,
                sandbox_id: sandboxId
            }
        };
    }

    async getBuild(applicationId, buildId) {
        let options = this.getBuildOptions(applicationId, buildId),
            builds = await requests(options),
            parsed = parseXml(builds, {
                ignoreUndefinedEntities: true
            });

        if(this.buildParsedIsValid(parsed)) {
            return responsesToObject.getBuildsObject(parsed);
        }
    }
    
    getBuildOptions(applicationId, buildId) {
        return {
            method: 'POST',
            uri: endpoints.GetBuildInfo,
            auth: auth.getAuthObject(),
            formData: {
                app_id: applicationId,
                build_id: buildId
            }
        };
    }

    buildParsedIsValid(parsed) {
        return parsed !== undefined && parsed !== '';
    }
}

module.exports = new Builds();
