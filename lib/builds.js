'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    auth = require('./authentication'),
    logger = require('./logger'),
    responsesToObject = require('./responsesToObjects'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Builds {
    async getBuilds(applicationId, sandboxId, user, password) {
        try {
            let options = this.getOptions(applicationId, sandboxId, endpoints.GetSandboxBuildList, user, password),
                build_list = await requests(options),
                parsed = parseXml(build_list, {
                    ignoreUndefinedEntities: true
                });

            if(this.buildsParsedIsValid(parsed)) {
                return responsesToObject.getObject(parsed);
            }
        } catch (err) {
            logger.error('{}'.format(err));
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
            formData: this.getFormDataForBuilds(applicationId, sandboxId) 
        };
    }

    getBuildOptions(applicationId, buildId, endpoint, user, password) {
        return {
            method: 'POST',
            uri: endpoint,
            auth: auth.getAuthObject(user, password),
            formData: this.getFormDataForBuild(applicationId, buildId) 
        };
    }

    getFormDataForBuilds(applicationId, sandboxId) {
        return {
            app_id: applicationId,
            sandbox_id: sandboxId
        };
    }

    getFormDataForBuild(applicationId, buildId) {
        return {
            app_id: applicationId,
            build_id: buildId
        };
    }

    async getBuild(applicationId, buildId, user, password) {
        try {
        let options = this.getBuildOptions(applicationId, buildId, endpoints.GetBuildInfo, user, password),
            builds = await requests(options),
            parsed = parseXml(builds, {
                ignoreUndefinedEntities: true
            });

        if(this.buildParsedIsValid(parsed)) {
            return responsesToObject.getObject(parsed);
        }
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    buildParsedIsValid(parsed) {
        return parsed !== undefined && parsed !== '';
    }
}

module.exports = new Builds();
