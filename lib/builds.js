'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    _ = require('underscore'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

class Builds {
    async getBuilds(applicationId, sandboxId) {
        let options = {
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

        let build_list = await requests(options),
            parsed = parseXml(build_list, {
                ignoreUndefinedEntities: true
            });
        // let r = JSON.parse(x.xml2json(build_list, {compact: false, spaces: 4}));
        if(parsed !== undefined && parsed !== '') {
            let builds = _.reject(parsed.children[0].children, (build) => {
                return build.type === 'text';
            });
            let build_list = _.map(builds, (obj) => {
                return obj.attributes;
            });
            return build_list;
        }
    }

    async getBuild(applicationId, buildId) {
        let options = {
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
        }, self = this;

        let builds = await requests(options),
            parsed = parseXml(builds, {
                ignoreUndefinedEntities: true
            });
        // let r = JSON.parse(x.xml2json(builds, {compact: false, spaces: 4}));
        if(parsed !== undefined && parsed !== '') {
            let builds = _.reject(parsed.children[0].children, (build) => {
                return build.type === 'text';
            });
            let build = _.map(builds, (obj) => {
                return obj.attributes;
            });
            return build;
        }
    }
    uploadBuild() {

    }
}

module.exports = new Builds();
