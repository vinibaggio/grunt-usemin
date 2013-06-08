'use strict';
var path = require('path');
var assert = require('assert');
var grunt = require('grunt');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

grunt.task.init([]);
grunt.config.init({});

var opts = grunt.cli.options;
opts.redirect = !opts.silent;

var directory = function directory(dir) {
  return function directory(done) {
    process.chdir(__dirname);
    rimraf(dir, function (err) {
      if (err) {
        return done(err);
      }
      mkdirp(dir, function (err) {
        if (err) {
          return done(err);
        }
        process.chdir(dir);
        done();
      });
    });
  };
};

describe('usemin', function () {
  describe('absolute paths', function () {
    beforeEach(directory('temp'));

    it('should replace with revved files when found', function () {
        grunt.file.mkdir('build');
        grunt.file.mkdir('build/images');
        grunt.file.mkdir('build/images/misc');
        grunt.file.write('build/images/test.23012.png', 'foo');
        grunt.file.write('build/images/bar.23012.png', 'foo');
        grunt.file.write('build/images/misc/test.2a436.png', 'foo');
        grunt.file.copy(path.join(__dirname, 'fixtures/htmlprocessor_absolute.html'), 'build/index.html');

        grunt.log.muted = true;
        grunt.config.init();
        grunt.config('usemin', {html: 'build/index.html'});
        // grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
        grunt.task.run('usemin');
        grunt.task.start();

        var changed = grunt.file.read('build/index.html');

        assert.ok(changed.match(/<img src="\/images\/test\.23012\.png">/));
        assert.ok(changed.match(/<img src="\/\/images\/bar\.23012\.png">/));
        assert.ok(changed.match(/<img src="\/images\/misc\/test\.2a436\.png">/));

      });

    it('should take into account alternate search path for assets', function () {
        grunt.file.mkdir('build');
        grunt.file.mkdir('foo');
        grunt.file.mkdir('foo/images');
        grunt.file.mkdir('foo/images/foo');
        grunt.file.write('foo/images/test.23012.png', 'foo');
        grunt.file.write('foo/images/bar.23012.png', 'foo');
        grunt.file.write('foo/images/misc/test.2a436.png', 'foo');
        grunt.file.copy(path.join(__dirname, 'fixtures/htmlprocessor_absolute.html'), 'build/index.html');

        grunt.log.muted = true;
        grunt.config.init();
        grunt.config('usemin', {html: 'build/index.html', options: { assetsDirs: ['foo']}});
        grunt.task.run('usemin');
        grunt.task.start();

        var changed = grunt.file.read('build/index.html');

        assert.ok(changed.match(/<img src="\/images\/test\.23012\.png">/));
        assert.ok(changed.match(/<img src="\/\/images\/bar\.23012\.png">/));
        assert.ok(changed.match(/<img src="\/images\/misc\/test\.2a436\.png">/));

      });

    it('should allow for several asset dirs', function () {
        grunt.file.mkdir('build');
        grunt.file.mkdir('foo');
        grunt.file.mkdir('foo/images');
        grunt.file.mkdir('foo/images/misc');
        grunt.file.write('foo/images/test.23012.png', 'foo');
        grunt.file.write('foo/images/bar.23012.png', 'foo');
        grunt.file.write('foo/images/misc/test.2a436.png', 'foo');
        grunt.file.mkdir('bar');
        grunt.file.mkdir('bar/scripts');
        grunt.file.write('bar/scripts/plugins.12345.js', 'bar');
        grunt.file.write('bar/scripts/amd-app.6789.js', 'bar');
        grunt.file.copy(path.join(__dirname, 'fixtures/htmlprocessor_absolute.html'), 'build/index.html');

        grunt.log.muted = true;
        grunt.config.init();
        grunt.config('usemin', {html: 'build/index.html',  options: { assetsDirs: ['foo', 'bar']}});
        grunt.task.run('usemin');
        grunt.task.start();

        var changed = grunt.file.read('build/index.html');

        assert.ok(changed.match(/<img src="\/images\/test\.23012\.png">/));
        assert.ok(changed.match(/<img src="\/\/images\/bar\.23012\.png">/));
        assert.ok(changed.match(/<img src="\/images\/misc\/test\.2a436\.png">/));
        assert.ok(changed.match(/<script src="\/scripts\/plugins\.12345\.js">/));
        assert.ok(changed.match(/<script data-main="\/scripts\/amd-app\.6789"/));

      });

  });

  describe('relative paths', function () {
    beforeEach(directory('temp'));

    it('should replace with revved files when found', function () {
        grunt.file.mkdir('build');
        grunt.file.mkdir('build/images');
        grunt.file.mkdir('build/foo');
        grunt.file.mkdir('build/images/misc');
        grunt.file.write('build/images/test.23012.png', 'foo');
        grunt.file.write('build/images/bar.23012.png', 'foo');
        grunt.file.write('build/images/misc/test.2a436.png', 'foo');
        grunt.file.copy(path.join(__dirname, 'fixtures/htmlprocessor_relative.html'), 'build/foo/index.html');

        grunt.log.muted = true;
        grunt.config.init();
        grunt.config('usemin', {html: 'build/foo/index.html'});
        grunt.task.run('usemin');
        grunt.task.start();

        var changed = grunt.file.read('build/foo/index.html');

        assert.ok(changed.match(/<img src="\.\.\/images\/test\.23012\.png">/));
        assert.ok(changed.match(/<link rel=\"stylesheet\" href=\"styles\/main\.min\.css\">/));
        assert.ok(changed.match(/<img src=\"\.\.\/images\/misc\/test\.2a436\.png\">/));

      });

    it('should take into account alternate path for assets', function () {
        grunt.file.mkdir('build');
        grunt.file.mkdir('foo');
        grunt.file.mkdir('foo/bar');
        grunt.file.mkdir('foo/images');
        grunt.file.mkdir('foo/images/foo');
        grunt.file.write('foo/images/test.23012.png', 'foo');
        grunt.file.write('foo/images/bar.23012.png', 'foo');
        grunt.file.write('foo/images/misc/test.2a436.png', 'foo');
        grunt.file.copy(path.join(__dirname, 'fixtures/htmlprocessor_relative.html'), 'build/index.html');

        grunt.log.muted = true;
        grunt.config.init();
        grunt.config('usemin', {html: 'build/index.html', options: { assetsDirs: ['foo/bar']}});
        grunt.task.run('usemin');
        grunt.task.start();

        var changed = grunt.file.read('build/index.html');

        assert.ok(changed.match(/<img src="\.\.\/images\/test\.23012\.png">/));
        assert.ok(changed.match(/<img src="\.\.\/images\/misc\/test\.2a436\.png">/));
      });

    it('should allow for several asset dirs', function () {
        grunt.file.mkdir('build');
        grunt.file.mkdir('foo/bar');
        grunt.file.mkdir('foo/images');
        grunt.file.mkdir('foo/images/misc');
        grunt.file.write('foo/images/test.23012.png', 'foo');
        grunt.file.write('foo/images/bar.23012.png', 'foo');
        grunt.file.write('foo/images/misc/test.2a436.png', 'foo');
        grunt.file.mkdir('bar');
        grunt.file.mkdir('bar/scripts');
        grunt.file.write('bar/scripts/plugins.12345.js', 'bar');
        grunt.file.write('bar/scripts/amd-app.6789.js', 'bar');
        grunt.file.copy(path.join(__dirname, 'fixtures/htmlprocessor_relative.html'), 'build/index.html');

        grunt.log.muted = true;
        grunt.config.init();
        grunt.config('usemin', {html: 'build/index.html',  options: { assetsDirs: ['foo/bar', 'bar']}});
        grunt.task.run('usemin');
        grunt.task.start();

        var changed = grunt.file.read('build/index.html');

        assert.ok(changed.match(/<img src="\.\.\/images\/test\.23012\.png">/));
        assert.ok(changed.match(/<img src="\.\.\/images\/misc\/test\.2a436\.png">/));
        assert.ok(changed.match(/<script src="scripts\/plugins\.12345\.js">/));
        assert.ok(changed.match(/<script data-main="scripts\/amd-app\.6789"/));

      });

  });

  before(directory('temp'));

  it('should work on CSS files', function () {
    grunt.file.mkdir('images');
    grunt.file.mkdir('images/misc');
    grunt.file.write('images/test.23012.png', 'foo');
    grunt.file.write('images/misc/test.2a436.png', 'foo');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {css: 'style.css'});
    grunt.file.copy(path.join(__dirname, 'fixtures/style.css'), 'style.css');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('style.css');

    // Check replace has performed its duty
    assert.ok(changed.match(/url\(\"images\/test\.23012\.png\"/));
    assert.ok(changed.match(/url\(\"images\/misc\/test\.2a436\.png\"/));
    assert.ok(changed.match(/url\(\"\/\/images\/test\.23012\.png\"/));
    assert.ok(changed.match(/url\(\"\/images\/test\.23012\.png\"/));
  });

  it('should not replace reference to file not revved', function () {
    grunt.file.write('foo.html', 'foo');
    grunt.file.write('bar-foo.html', 'foo');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {html: 'index.html'});
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('index.html');

    // Check replace has performed its duty
    assert.ok(changed.match('<a href="foo.html"></a>'));
  });

  it('should consider that data-main point to a JS file', function () {
    grunt.file.mkdir('scripts');
    grunt.file.write('scripts/main.23012.js', 'foo');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {html: 'index.html'});
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('index.html');

    // Check replace has performed its duty
    assert.ok(changed.match(/data-main="scripts\/main\.23012"/));
  });


  it('should use the furnished require.js source when replacing', function () {
    grunt.file.mkdir('scripts');
    grunt.file.write('scripts/amd-app.23012.js', 'foo');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {html: 'index.html'});
    grunt.file.copy(path.join(__dirname, 'fixtures/requirejs.html'), 'index.html');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('index.html');
    // Check replace has performed its duty
    assert.ok(changed.match(/data-main="scripts\/amd-app\.23012"\s+src="foo\/require\.js"/));

  });

  it('should allow for additional replacement patterns', function () {
    grunt.file.mkdir('images');
    grunt.file.write('images/image.2132.png', 'foo');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {
      js: 'misc.js',
      options: {
        assetsDirs: 'images',
        patterns: {
          js: [
            [/referenceToImage = '([^\']+)'/, 'Replacing image']
          ]
        }
      }
    });
    grunt.file.copy(path.join(__dirname, 'fixtures/misc.js'), 'misc.js');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('misc.js');

    // Check replace has performed its duty
    assert.ok(changed.match(/referenceToImage = 'image\.2132\.png'/));
  });

  it('should use revved summary file when given one', function() {
    grunt.file.mkdir('images');
    grunt.file.write('images/test.2132.png', 'foo');
    grunt.file.write('images/test.2134.png', 'foo');
    grunt.file.write('summary.js', '{"images/test.png": "images/test.2134.png"}');
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {html: 'index.html', options: { revmap: 'summary.js'}});
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('index.html');
    // Check replace has performed its duty
    assert.ok(changed.match('<img src="images/test.2134.png">'));

  });

  it('should use filerev map object when available', function() {
    // grunt.file.mkdir('images');
    // grunt.file.write('images/test.2132.png', 'foo');
    // grunt.file.write('images/test.2134.png', 'foo');
    grunt.filerev = {summary: {'images/test.png': 'images/test.2134.png'}};
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('usemin', {html: 'index.html'});
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('usemin');
    grunt.task.start();

    var changed = grunt.file.read('index.html');
    // Check replace has performed its duty
    assert.ok(changed.match('<img src="images/test.2134.png">'));
    grunt.filerev = null;
  });

});

describe('useminPrepare', function () {
  it('should update the config (HTML)', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'index.html'});
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var concat = grunt.config('concat');

    assert.ok(concat);
    assert.ok(concat[path.normalize('.tmp/concat/scripts/plugins.js')]);
    assert.equal(concat[path.normalize('.tmp/concat/scripts/plugins.js')].length, 13);
    assert.ok(concat[path.normalize('.tmp/concat/styles/main.min.css')]);
    assert.equal(concat[path.normalize('.tmp/concat/styles/main.min.css')].length, 1);

    var requirejs = grunt.config('requirejs');
    assert.ok(requirejs.default.options.baseUrl);
    assert.equal(requirejs.default.options.baseUrl, 'scripts');
    assert.ok(requirejs.default.options.name);
    assert.equal(requirejs.default.options.name, 'main');
    assert.equal(requirejs.default.options.out, path.normalize('dist/scripts/amd-app.js'));


    var uglify = grunt.config('uglify');
    assert.equal(uglify[path.normalize('dist/scripts/amd-app.js')], path.normalize('.tmp/concat/scripts/amd-app.js'));
    assert.equal(uglify[path.normalize('dist/scripts/plugins.js')], path.normalize('.tmp/concat/scripts/plugins.js'));
  });

  it('should use alternate search dir if asked to', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'index.html'});
    grunt.file.copy(path.join(__dirname, 'fixtures/alternate_search_path.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var concat = grunt.config('concat');
    assert.ok(concat);
    assert.ok(concat[path.normalize('.tmp/concat/scripts/foo.js')]);
    assert.equal(concat[path.normalize('.tmp/concat/scripts/foo.js')].length, 2);
    assert.equal(concat[path.normalize('.tmp/concat/scripts/foo.js')][0], path.normalize('build/scripts/bar.js'));
    assert.equal(concat[path.normalize('.tmp/concat/scripts/foo.js')][1], path.normalize('build/scripts/baz.js'));

    var uglify = grunt.config('uglify');
    assert.deepEqual(uglify[path.normalize('dist/scripts/foo.js')], [path.normalize('.tmp/concat/scripts/foo.js')]);
  });

  it('should update all requirejs multitask configs setting name and output', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'index.html'});
    grunt.config('requirejs', {
      task1: {},
      task2: {
        options: {
          baseUrl: 'base'
        }
      }
    });
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var requirejs = grunt.config('requirejs');

    assert.ok(requirejs.task1.options.name);
    assert.ok(requirejs.task2.options.name);

    assert.equal(requirejs.task1.options.name, 'main');
    assert.equal(requirejs.task2.options.name, 'main');

    assert.equal(requirejs.task1.options.out, path.normalize('dist/scripts/amd-app.js'));
    assert.equal(requirejs.task2.options.out, path.normalize('dist/scripts/amd-app.js'));

    assert.equal(requirejs.task1.options.baseUrl, 'scripts');
    assert.equal(requirejs.task2.options.baseUrl, 'base');

    assert.equal(requirejs.task1.options.mainConfigFile, path.normalize('scripts/main.js'));
    // assert.equal(requirejs.task2.options.mainConfigFile, 'base');
  });

  it('should handle correctly files in subdir (requirejs)', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'app/index.html'});
    grunt.config('requirejs', {
      task1: {}
    });
    grunt.file.mkdir('app');
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'app/index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var requirejs = grunt.config('requirejs');

    assert.ok(requirejs.task1.options);
    assert.ok(requirejs.task1.options.name);

    assert.equal(requirejs.task1.options.name, 'main');

    assert.equal(requirejs.task1.options.out, path.normalize('dist/scripts/amd-app.js'));

    assert.equal(requirejs.task1.options.baseUrl, path.normalize('app/scripts'));

    assert.equal(requirejs.task1.options.mainConfigFile, path.normalize('app/scripts/main.js'));
  });

  it('should create a requirejs multitask config setting with name and output if non settings exists', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'index.html'});

    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var requirejs = grunt.config('requirejs');

    assert.ok(requirejs.default.options.name);
    assert.equal(requirejs.default.options.name, 'main');
    assert.equal(requirejs.default.options.out, path.normalize('dist/scripts/amd-app.js'));
    assert.equal(requirejs.default.options.baseUrl, 'scripts');
  });

  it('output config for subsequent tasks (requirejs, concat, ..) should be relative to observed file', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'build/index.html'});
    grunt.file.mkdir('build');
    grunt.file.copy(path.join(__dirname, 'fixtures/relative_path.html'), 'build/index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var concat = grunt.config('concat');
    assert.ok(concat);
    assert.ok(concat[path.normalize('.tmp/concat/scripts/foo.js')]);
    assert.equal(concat[path.normalize('.tmp/concat/scripts/foo.js')].length, 2);

    var requirejs = grunt.config('requirejs');

    assert.ok(requirejs.default.options.baseUrl);
    assert.equal(requirejs.default.options.baseUrl, path.normalize('build/scripts'));
    assert.ok(requirejs.default.options.name);
    assert.equal(requirejs.default.options.name, 'main');
    assert.equal(requirejs.default.options.out, path.normalize('dist/scripts/amd-app.js'));

    var uglify = grunt.config('uglify');
    assert.deepEqual(uglify[path.normalize('dist/scripts/amd-app.js')], [path.normalize('.tmp/concat/scripts/amd-app.js')]);
    assert.deepEqual(uglify[path.normalize('dist/scripts/foo.js')], [path.normalize('.tmp/concat/scripts/foo.js')]);
  });

  it('should take dest option into consideration', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {html: 'index.html', options: { 'dest': 'foo'}});
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var uglify = grunt.config('uglify');

    assert.equal(uglify[path.normalize('foo/scripts/amd-app.js')], path.normalize('.tmp/concat/scripts/amd-app.js'));
    assert.equal(uglify[path.normalize('foo/scripts/plugins.js')], path.normalize('.tmp/concat/scripts/plugins.js'));

  });

  it('should have configurable flow', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {
      html: 'index.html',
      options: {
        flow: {
          steps: ['uglifyjs'],
          post: []
        }
      }
    });
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var uglify = grunt.config('uglify');
    var concat = grunt.config('concat');
    var requirejs = grunt.config('requirejs');

    assert.equal(concat, null);
    assert.equal(requirejs, null);
    assert.ok(uglify);

    assert.equal(uglify[path.normalize('dist/styles/main.min.css')], path.normalize('styles/main.css'));

  });

  it('should have configurable flow per target', function () {
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {
      html: 'index.html',
      options: {
        flow: {
          'html': {
            steps: ['uglifyjs'],
            post: []
          }
        }
      }
    });
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var uglify = grunt.config('uglify');
    var concat = grunt.config('concat');
    var requirejs = grunt.config('requirejs');

    assert.equal(concat, null);
    assert.equal(requirejs, null);
    assert.ok(uglify);

    assert.equal(uglify[path.normalize('dist/styles/main.min.css')], path.normalize('styles/main.css'));

  });


  it('should allow use to furnish new steps of the flow', function() {
    var copy = {
        name: 'copy',
        createConfig: function(context,block) {
            var cfg = {};
            var inFiles = [];
            context.inFiles.forEach(function(file) { inFiles.push(path.join(context.inDir, file));});
            cfg[path.join(context.outDir, block.dest)] = inFiles;
            return cfg;
          }
      };
    grunt.log.muted = true;
    grunt.config.init();
    grunt.config('useminPrepare', {
      html: 'index.html',
      options: {
        flow: {
            steps: [copy],
            post: []
          }
        }
      });
    grunt.file.copy(path.join(__dirname, 'fixtures/usemin.html'), 'index.html');
    grunt.task.run('useminPrepare');
    grunt.task.start();

    var copyCfg = grunt.config('copy');

    assert.ok(copyCfg);
    assert.ok(copyCfg[path.normalize('dist/styles/main.min.css')]);
    assert.ok(copyCfg[path.normalize('dist/scripts/plugins.js')]);
    assert.ok(copyCfg[path.normalize('dist/scripts/amd-app.js')]);

  });
});

