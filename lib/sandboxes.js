'use strict';

const requests = require('request-promise-native'),
    x = require('xml-js'),
    _ = require('underscore'),
    auth = require('./authentication'),
    endpoints = require('../config/endpoints.json');

class Sandboxes {
    async getSandboxes(applicationId) {
        let options = {
            method: 'POST',
            uri: endpoints.GetSandboxes,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            },
            formData: {
                app_id: applicationId
            }
        }, self = this;
        
        return requests(options)
            .then((response) => {
                console.log(response);
                let r = JSON.parse(x.xml2json(response, {compact: false, spaces: 4}));
                let sandboxes = _.mapObject(r.elements[0].elements, (obj) => {
                    return obj.attributes;
                });
                return sandboxes;
            })
            .catch((err) => {
                console.log('error: ' + err);
            });
    }
}

module.exports = new Sandboxes();

