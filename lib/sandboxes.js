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
        
        let sandboxes = await requests(options)
            // .then((response) => {
        let r = JSON.parse(x.xml2json(sandboes, {compact: false, spaces: 4}));
        if(r !== undefined && r !== '') {
            let sandboxes_list = _.mapObject(r.elements[0].elements, (obj) => {
                return obj.attributes;
            });
            return sandboxes_list;
        }
            // })
            // .catch((err) => {
            //     console.log('error: ' + err);
            // });
    }
}

module.exports = new Sandboxes();

