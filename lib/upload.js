'use strict';

const requests = require('request-promise-native'),
    x = require('xml-js'),
    _ = require('underscore'),
    auth = require('./authentication'),
    sandboxes = require('./sandboxes'),
    applications = require('./applications'),
    format = require('string-format'),
    logger = require('./logger'),
    fs = require('fs'),
    endpoints = require('../config/endpoints.json');

format.extend(String.prototype);

class Upload {
    async uploadArchive(archive, appId, sandboxId) {
        try {
            if(!fs.existsSync(archive))
                logger.error('Archive does not exist: {}'.format(archive));
            let zip = fs.createReadStream(archive);
            let options = {
                method: 'POST',
                uri: endpoints.UploadApp,
                auth: {
                    user: auth.getUser(),
                    pass: auth.getPassword()
                },
                formData: {
                    app_id: appId,
                    sandbox_id: sandboxId,
                    file: zip
                }
            };

            let upload = await requests(options);
            let r = JSON.parse(x.xml2json(upload), {compact: false, spaces: 4});
            if(r !== undefined && r !== '' && r.elements.length && r.elements[0].attributes !== undefined && r.elements[0].attributes['build_id'] !== '') {
                return r.elements[0].attributes['build_id'];
            }
        } catch(err) {
            logger.error('{}'.format(err));
        }
    }
}

module.exports = new Upload();