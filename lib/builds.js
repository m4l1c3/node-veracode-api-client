'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    _ = require('underscore'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

class Builds {
    async getBuilds(applicationId, sandboxId) {
        let options = this.getBuildsOptions(applicationId, sandboxId),
            build_list = await requests(options),
            parsed = parseXml(build_list, {
                ignoreUndefinedEntities: true
            });
        
        if(this.buildsParsedIsValid(parsed)) {
            let builds = _.reject(parsed.children[0].children, (build) => {
                return build.type === 'text';
            });
            let build_list = _.map(builds, (obj) => {
                return obj.attributes;
            });
            return build_list;
        }
    }

    buildsParsedIsValid(parsed) {
        return parsed !== undefined && parsed !== '';
    }

    getBuildOptions(applicationId, sandboxId) {
        return {
            method: 'POST',
            uri: endpoints.GetSandboxBuildList,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            },
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
            let builds = _.reject(parsed.children[0].children, (build) => {
                return build.type === 'text';
            });
            let build = _.map(builds, (obj) => {
                return obj.attributes;
            });
            return build;
        }
    }
    
    getBuildOptions(applicationId, buildId) {
        return {
            method: 'POST',
            uri: endpoints.GetBuildInfo,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            },
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
