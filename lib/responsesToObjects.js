'use strict';

const _ = require('underscore'),
    reject = require('./rejectTextNodes');

exports.getBuildsObject = function(parsed) {
    let builds = reject.rejectTextNodes(parsed);
    let build_list = _.map(builds, (obj) => {
        return obj.attributes;
    });
    return build_list;
}