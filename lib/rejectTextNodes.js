'use strict';

const _ = require('underscore');

exports.rejectTextNodes = function(parsed) {
    return _.reject(parsed.children[0].children, (obj) => {
        return obj.type === 'text';
    });
}