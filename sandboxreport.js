'use strict';

const requests = require('request-promise-native'),
    endpoints = require('./config/endpoints.json'),
    applications = require('./lib/applications'),
    _ = require('underscore'),
    sandboxes = require('./lib/sandboxes'),
    builds = require('./lib/builds');

let application_list = [];

async function main() {
    let apps = await applications.getApps();
    console.log(apps);

    _.forEach(apps, (app) => {
        console.log(app.app_id);
        if(application_list[app.app_id] === undefined) {
            console.log('here');
            application_list.push({
                app_id
            });
        }
    });
        // _.forEach(boxes, (box) => {
        //     if(application_list[app.app_id]) {
        //         if(application_list[app.app_id].sandboxes[box.sandbox_id] === undefined) {
        //             application_list[app.app_id].sandboxes[box.sandbox_id] = {
        //                 builds: []
        //             };
        //         }
        //     }
            // let build = await builds.getBuilds(item.app_id, box.sandbox_id);
            // build.then(async (b) => {
            //     // console.log(build);
            //     _.forEach(b, (bb) => {
            //         let bui = await builds.getBuild(item.app_id, bb.build_id);
            //         bui.then((objBuild) => {
            //             if(application_list[item.app_id].sandboxes[box.sandbox_id].builds[bb.build_id] === undefined) {
            //                 application_list[item.app_id].sandboxes[box.sandbox_id].builds[bb.build_id] = objBuild;
            //             }
            //             // console.log(application_list);
            //         });
            //     });
            // });
        // });

    // });
    console.log(application_list);
    // _.forEach(application_list, async (app) => {
    //     console.log('here');
    //     // let sandboxes = await sandboxes.getSandboxes(app.app_id);
    //     // console.log(sandboxes);
    // });
    // _.forEach(application_list, async (app) => {
    //     let boxes = await sandboxes.getSandboxes(app.app_id);
    //     console.log(boxes);
    // });
        // let boxes = await sandboxes.getSandboxes(app.app_id);
        // console.log(boxes);
}
main();

// apps.then((response) => {
//     // console.log(response);
//     _.forEach(response, (item) => {
//         if(application_list[item.app_id] === undefined) {
//             application_list[item.app_id] = {
//                 sandboxes: []
//             };
//         }
//         let boxes = sandboxes.getSandboxes(item.app_id);
//         boxes.then((sandbox) => {
//             _.forEach(sandbox, (box) => {
//                 if(application_list[item.app_id]) {
//                     if(application_list[item.app_id].sandboxes[box.sandbox_id] === undefined) {
//                         application_list[item.app_id].sandboxes[box.sandbox_id] = {
//                             builds: []
//                         };
//                     }
//                 }
//                 let build = builds.getBuilds(item.app_id, box.sandbox_id);
//                 build.then((b) => {
//                     // console.log(build);
//                     _.forEach(b, (bb) => {
//                         let bui = builds.getBuild(item.app_id, bb.build_id);
//                         bui.then((objBuild) => {
//                             if(application_list[item.app_id].sandboxes[box.sandbox_id].builds[bb.build_id] === undefined) {
//                                 application_list[item.app_id].sandboxes[box.sandbox_id].builds[bb.build_id] = objBuild;
//                             }
//                             // console.log(application_list);
//                         });
//                     });
//                 });
//             });
//         });
//     });
// });
//
