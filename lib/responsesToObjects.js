'use strict';

const _ = require('underscore'),
    reject = require('./rejectTextNodes');

exports.getObject = function(parsed) {
    let accepted = reject.rejectTextNodes(parsed);
    let list = _.map(accepted, (obj) => {
        return obj.attributes;
    });
    return list;
}