'use strict';
var assert = require('assert');
var helpers = require('./helpers');
var ConfigWriter = require('../lib/configwriter.js');

describe('ConfigWriter', function () {
  before(helpers.directory('temp'));

  describe('constructor', function() {
    it('should check it\'s input');
    it('should allow for user-defined steps', function() {
      var copy = {
        name: 'copy',
        createConfig: function() { return {}; }
      };

      var cfgw = new ConfigWriter(['concat', 'uglifyjs', copy], [], {input: 'app', dest: 'dist', staging: '.tmp'});
      var stepNames = [];
      cfgw.steps.forEach(function(s) { stepNames.push(s.name);});
      assert.deepEqual(stepNames, ['concat', 'uglify', 'copy']);
    });
    it('should use in and out dirs');
  });

  describe('process', function() {
    var blocks = helpers.blocks();

    it('should check for input parameters');

    it('should output a set of config', function () {
      var flow = ['concat', 'uglifyjs'];
      var file = helpers.createFile('foo', 'app', blocks);
      var c = new ConfigWriter( flow, [], {input: 'app', dest: 'dist', staging: '.tmp'} );
      var config = c.process(file);
      assert.deepEqual(config, helpers.normalize({
        'concat':{ generated: {'.tmp/concat/scripts/site.js': ['app/foo.js', 'app/bar.js', 'app/baz.js']}},
        'uglify':{ generated: {'dist/scripts/site.js': ['.tmp/concat/scripts/site.js']}}
      }));
    });

    it('should have a configurable destination directory', function() {
      var flow = ['concat', 'uglifyjs'];

      var file = helpers.createFile('foo', 'app', blocks);
      var c = new ConfigWriter( flow, [], {input: 'app', dest: 'destination', staging: '.tmp'} );
      var config = c.process(file);
      assert.deepEqual(config, helpers.normalize({
        'concat': {generated: {'.tmp/concat/scripts/site.js': ['app/foo.js', 'app/bar.js', 'app/baz.js']}},
        'uglify': { generated: {'destination/scripts/site.js': ['.tmp/concat/scripts/site.js']}}
      }));
    });

    it('should have a configurable staging directory', function() {
      var flow = ['concat', 'uglifyjs'];

      var file = helpers.createFile('foo', 'app', blocks);
      var c = new ConfigWriter( flow, [], {input: 'app', dest: 'dist', staging: 'staging'} );
      var config = c.process(file);
      assert.deepEqual(config, helpers.normalize({
        'concat': {generated: { 'staging/concat/scripts/site.js': ['app/foo.js', 'app/bar.js', 'app/baz.js'] }},
        'uglify': {generated: { 'dist/scripts/site.js': ['staging/concat/scripts/site.js'] }}
      }));
    });

    it('should allow for single step flow', function() {
      var flow = ['uglifyjs'];

      var file = helpers.createFile('foo', 'app', blocks);
      var c = new ConfigWriter( flow, [], {input: 'app', dest: 'dist', staging: 'staging'} );
      var config = c.process(file);
      assert.deepEqual(config, helpers.normalize({'uglify': { 'generated': {'dist/scripts/site.js': ['app/foo.js', 'app/bar.js', 'app/baz.js']}}}));
    });

    it('should allow for a configuration of the flow\'s step order', function() {
      var flow = ['uglifyjs', 'concat'];

      var file = helpers.createFile('foo', 'app', blocks);
      var c = new ConfigWriter( flow, [], {input: 'app', dest: 'dist', staging: 'staging'} );
      var config = c.process(file);

      assert.deepEqual(config, helpers.normalize({
        'uglify': {'generated' : {'staging/uglify/foo.js': ['app/foo.js'], 'staging/uglify/bar.js': ['app/bar.js'], 'staging/uglify/baz.js': ['app/baz.js']}},
        'concat': {'generated' : {'dist/scripts/site.js': ['staging/uglify/foo.js', 'staging/uglify/bar.js', 'staging/uglify/baz.js']}}
      }));
    });

    it('should augment the furnished config', function() {
      var flow = ['concat', 'uglifyjs'];
      var config = {concat: {misc:{'foo.js': 'bar.js'}}};
      var file = helpers.createFile('foo', 'app', blocks);
      var c = new ConfigWriter( flow, [], {input: 'app', dest: 'destination', staging: '.tmp'} );
      config = c.process(file, config);
      assert.deepEqual(config, helpers.normalize({
        'concat': {'generated': {'.tmp/concat/scripts/site.js': ['app/foo.js', 'app/bar.js', 'app/baz.js']}, 'misc': {'foo.js': 'bar.js'}},
        'uglify': {'generated': {'destination/scripts/site.js': ['.tmp/concat/scripts/site.js']}}
      }));
    });

    it('should allow for an empty flow');
    it('should allow for a filename as input');
  });
});
