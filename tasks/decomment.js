'use strict';

var decomment = require('decomment');

module.exports = function (grunt) {

    grunt.registerMultiTask('decomment', 'Removes comments from files.', function () {

        var files = this.files.map(function (f) {
                var result = {
                    src: f.orig.src.length ? f.orig.src[0] : '',
                    dest: f.dest
                }
                if (grunt.file.exists(result.src)) {
                    return result;
                }
                grunt.log.warn('Source file "' + result.src + '" not found.');
                return null;
            })
            .filter(function (f) {
                return !!f;
            });

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
            var code = grunt.file.read(f.src);
            var result;
            try {
                result = type(code, opt);
            } catch (e) {
                grunt.log.warn("Failed to decomment file '" + f.src + "'");
                throw e;
            }
            grunt.file.write(f.dest, result);
        });
    });
};
