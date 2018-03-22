'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    _ = require('underscore'),
    sandboxes = require('./lib/sandboxes'),
    builds = require('./lib/builds');

let apps = applications.getApps();
apps.then((response) => {
    console.log(response);
    _.forEach(response, (item) => {
        let boxes = sandboxes.getSandboxes(item.app_id);
        boxes.then((sandbox) => {
            _.forEach(sandbox, (box) => {
                let build = builds.getBuilds(item.app_id, box.sandbox_id);
                build.then((b) => {
                    console.log(build);
                    _.forEach(b, (bb) => {
                        let bui = builds.getBuild(item.app_id, bb.build_id);
                        bui.then((objBuild) => {
                            console.log(objBuild);
                        });
                    });
                });
            });
        });
    });
});

