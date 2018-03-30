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
        };

        let apps = await requests(options);
        let r = JSON.parse(x.xml2json(apps, {compact: false, spaces: 4}));
        if(r !== undefined && r !== '') {
            let applist = _.map(r.elements[0].elements, (obj) => {
                return obj.attributes;
            });
            return applist;
        }
    }
}

module.exports = new Applications();
