'use strict';

var decomment = require('decomment');
var color = require('cli-color');
var path = require('path');

module.exports = function (grunt) {

    grunt.registerMultiTask('decomment', 'Removes comments from files.', function () {

        var type, name = 'decomment', opt = this.options();

        switch (opt.type) {
            case 'text':
                type = decomment.text;
                name += '.text';
                break;
            case 'html':
                type = decomment.html;
                name += '.html';
                break;
            default:
                type = decomment;
                break;
        }

        this.files.forEach(function (byDest) {
            var cwd = byDest.cwd || '';
            var dest = path.join(cwd, byDest.dest);

            byDest.src.forEach(function (f) {
                var file = path.join(cwd, f);
                var outFile = grunt.file.isDir(dest) ? path.join(dest, f) : dest;
                var code = grunt.file.read(file);
                var result;
                try {
                    result = type(code, opt);
                } catch (e) {
                    grunt.log.writeln(color.cyan(name + '(') + file + color.cyan(')') + ' - ' + color.redBright("FAIL"));
                    throw e;
                }
                grunt.file.write(outFile, result);
                grunt.log.writeln(outFile + " - " + color.green("OK"));
            })
        });
        grunt.log.writeln(color.cyan(name + '()') + ' - ' + color.green("OK"));

    });
};
