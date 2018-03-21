'use strict';

const requests = require('request-promise-native'),
    x = require('xml-js'),
    auth = require('./authentication'),
    _ = require('underscore'),
    endpoints = require('../config/endpoints.json');

class Applications {
    async getApps() {
        let options = {
            uri: endpoints.RequestApps,
            auth: {
                user: auth.getUser(),
                pass: auth.getPassword()
            }
        }, self = this;
        return requests(options)
            .then((response) => {
                let r = JSON.parse(x.xml2json(response, {compact: false, spaces: 4}));
                let apps = _.mapObject(r.elements[0].elements, (obj) => {
                    return obj.attributes;
                });
                return apps;
            })
            .catch((err) => {
                console.log('error: ' + err);
            });
    }
}

module.exports = new Applications();
