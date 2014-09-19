/* jshint node:true */
var _ = require('lodash');
var MarkdownParser = require('node-markup-markdown');

module.exports = function (grunt) {
  'use strict';

  function iterate (translations, options) {
    var result = {};
    translations.forEach(function (translation, key) {
      if (_.isString) {
        result[key] = MarkdownParser.parse(translation, options);
      }
      else {
        result[key] = iterate(translation, options);
      }
    });

    return result;
  };

  console.log('MARKDOWN-TRANSLATE');

  grunt.registerMultiTask(
    'markdown-translate',
    'Grunt plugin for processing translation files and parse any markdown included.',

    function() {
      var renderer = new TemplateRenderer();

      var options = this.options({});

      this.files.forEach(function(file) {
        var translations = grunt.file.readJSON(file.src);
        var result = iterate(translations, options);
        grunt.file.write(file.dest, result);
      });
    }
  );
};