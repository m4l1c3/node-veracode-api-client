'use strict';

const requests = require('request-promise-native'),
    x = require('xml-js'),
    _ = require('underscore'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

class Builds {
    getBuilds(applicationId, sandboxId) {
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
        }, self = this;

        return requests(options)
            .then((response) => {
                let r = JSON.parse(x.xml2json(response, {compact: false, spaces: 4}));
                if(r !== undefined && r !== '') {
                    let builds = _.mapObject(r.elements[0].elements, (obj) => {
                        return obj.attributes;
                    });
                    return builds;
                }
            })
            .catch((err) => {
                console.log('error: ' + err);
            });
    }

    getBuild(applicationId, buildId) {
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

        return requests(options)
            .then((response) => {
                // console.log(response);
                let r = JSON.parse(x.xml2json(response, {compact: false, spaces: 4}));
                if(r !== undefined && r !== '') {
                    let builds = _.mapObject(r.elements[0].elements, (obj) => {
                        return obj.attributes;
                    });
                    return builds;
                }
            })
            .catch((err) => {
                console.log('error: ' + err);
            });
    }
    uploadBuild() {

    }
}

module.exports = new Builds();
