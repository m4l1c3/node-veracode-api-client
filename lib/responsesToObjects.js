'use strict';

exports.getBuildsObject = function(parsed) {
    let builds = _.reject(parsed.children[0].children, (build) => {
        return build.type === 'text';
    });
    let build_list = _.map(builds, (obj) => {
        return obj.attributes;
    });
    return build_list;
}