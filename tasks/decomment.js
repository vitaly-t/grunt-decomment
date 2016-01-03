'use strict';

var decomment = require('decomment');

module.exports = function (grunt) {

    grunt.registerMultiTask('decomment', 'Removes comments from files.', function () {

        var files = this.files.filter(function (f) {
            if (grunt.file.exists(f.src[0])) {
                return true;
            }
            grunt.log.warn('Source file "' + f.src + '" not found.');
        });

        if (!files.length) {
            return;
        }

        var type, opt = this.options();

        switch (opt.method) {
            case 'text':
                type = decomment.text;
                break;
            case 'html':
                type = decomment.html;
                break;
            default:
                type = decomment;
                break;
        }

        files.forEach(function (f) {
            var src = f.src[0];
            var code = grunt.file.read(src);
            var result;
            try {
                result = type(code, opt);
            } catch (e) {
                grunt.log.warn("Failed to decomment file '" + src + "'");
                throw e;
            }
            grunt.file.write(f.dest, result);
        });
    });
};
