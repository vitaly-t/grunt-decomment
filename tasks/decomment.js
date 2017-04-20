'use strict';

var decomment = require('decomment');
var color = require('cli-color');
var path = require('path');

module.exports = function (grunt) {

    grunt.registerMultiTask('decomment', 'Removes comments from files.', function () {

        var type, method = 'decomment', opt = this.options();

        switch (opt.type) {
            case 'text':
                type = decomment.text;
                method += '.text';
                break;
            case 'html':
                type = decomment.html;
                method += '.html';
                break;
            default:
                type = decomment;
                break;
        }

        this.files.forEach(function (byDest) {
            var cwd = byDest.cwd || '';
            var dest = path.join(cwd, byDest.dest);

            var test = grunt.file.expand({nonull:true},byDest.orig.src);
            test.forEach(function(file){
                if(!file.match(/[\*\{\}\?\!]/) && !grunt.file.isFile(file)){
                    throw new Error("File '" + file + "' not found.");
                }
            })
            if(!byDest.src.length){
                throw new Error("Pattern '" + byDest.orig.src + "' matches no files.");
            }

            byDest.src.forEach(function (f) {
                var file = path.join(cwd, f);
                var outFile = grunt.file.isDir(dest) ? path.join(dest, f) : dest;
                var code = grunt.file.read(file);
                var result;
                try {
                    result = type(code, opt);
                } catch (e) {
                    grunt.log.writeln(color.cyan(method + '(') + file + color.cyan(')') + ' - ' + color.redBright("FAIL"));
                    throw e;
                }
                grunt.file.write(outFile, result);
                grunt.log.writeln(outFile + " - " + color.green("OK"));
            })
        });
        grunt.log.writeln(color.cyan(method + '()') + ' - ' + color.green("OK"));

    });
};

