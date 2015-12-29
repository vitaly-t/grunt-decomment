'use strict';

var decomment = require('decomment');

exports.handlers = {
    beforeParse: function (e) {
        e.source = fixLinks(e.source);
    }
};
