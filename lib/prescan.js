'use strict';

const requests = require('request-promise-native'),
    parseXml = require('@rgrove/parse-xml'),
    auth = require('./authentication'),
    logger = require('./logger'),
    format = require('string-format'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Prescan {
    async initiatePrescan(appId, sandboxId, buildId) {
        try {
            let options = {
                method: 'POST',
                uri: endpoints.Prescan,
                auth: {
                    user: auth.getUser(),
                    pass: auth.getPassword()
                },
                formData: {
                    app_id: appId,
                    sandbox_id: sandboxId,
                    auto_scan: 'true'
                }
            };

            let scan = await requests(options),
                parsed = parseXml(sandboxes, {
                    ignoreUndefinedEntities: true
                });
            // let r = JSON.parse(x.xml2json(scan), {compact: false, spaces: 4});
            return this.isValidResponse(parsed, buildId);
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }

    isValidResponse(r, buildId) {
        return (r !== undefined && r !== '' && r.elements.length && r.elements[0].attributes !== undefined &&
                r.elements[0].attributes['build_id'] === buildId && r.elements[0].elements.length &&
                r.elements[0].elements[0].elements[0].attributes['status'] === 'Pre-Scan Submitted');
    }
}

module.exports = new Prescan();