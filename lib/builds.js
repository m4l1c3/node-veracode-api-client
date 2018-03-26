'use strict';

const requests = require('request-promise-native'),
    x = require('xml-js'),
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

        let build_list = await requests(options);
        let r = JSON.parse(x.xml2json(build_list, {compact: false, spaces: 4}));
        if(r !== undefined && r !== '') {
            let builds = _.map(r.elements[0].elements, (obj) => {
                return obj.attributes;
            });
            return builds;
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

        let builds = await requests(options)
        let r = JSON.parse(x.xml2json(builds, {compact: false, spaces: 4}));
        if(r !== undefined && r !== '') {
            let build = _.map(r.elements[0].elements, (obj) => {
                return obj.attributes;
            });
            return build;
        }
    }
    uploadBuild() {

    }
}

module.exports = new Builds();
