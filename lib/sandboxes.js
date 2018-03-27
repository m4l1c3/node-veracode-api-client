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
        
        let sandboxes = await requests(options);
        let r = JSON.parse(x.xml2json(sandboxes, {compact: false, spaces: 4}));
        if(r !== undefined && r !== '') {
            let sandboxes_list = _.map(r.elements[0].elements, (obj) => {
                return obj.attributes;
            });
            return sandboxes_list;
        }
    }
}

module.exports = new Sandboxes();

