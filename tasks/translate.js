/* jshint node:true */
var _ = require('lodash');
var MarkdownParser = require('node-markup-markdown');

module.exports = function (grunt) {
  'use strict';

  function iterate (translations, options) {
    var isArray = _.isArray(translations);
    var result = isArray ? [] : {};

    _.each(translations, function (translation, key) {

      if (isArray && _.isString(translation)) {
        result.push(MarkdownParser.parse(translation, options));
      }
      else if (_.isString(translation)) {
        result[key] = MarkdownParser.parse(translation, options);
      }
      else {
        if (isArray) {
          result.push(iterate(translation, options))
        }
        else {
          result[key] = iterate(translation, options);
        }
      }
    });

    return result;
  }

  grunt.registerMultiTask(
    'grunt-markdown-translate',
    'Grunt plugin for processing translation files and parse any markdown included.',

    function() {
      var options = this.options({});

      this.files.forEach(function(file) {
        var translations = grunt.file.readJSON(file.src);
        var result = iterate(translations, options);
        grunt.file.write(file.dest, JSON.stringify(result));
      });
    }
  );
};