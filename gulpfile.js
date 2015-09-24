'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var path = require('path');
var semver = require('semver');
var sh = require('shelljs');

var PATH = {
  bower_components: 'bower_components',
  build: '.',
  source: 'src',
  test: 'test'
};
var TESTS = [
  path.join('.', PATH.test, 'cloudinary.spec.js')
];
var BANNER = path.join('.', PATH.source, 'header.txt');
var MAIN = 'util.js';
var FILES = [
  path.join('.', PATH.source, 'header.ts'),
  path.join('.', PATH.source, 'export.ts'),
  path.join('.', PATH.source, 'cloudinary', 'cloudinary.ts'),
  path.join('.', PATH.source, 'test', 'test.ts')
];

gulp.task('bump', function() {
  var bump = plugins.util.env.bump || false;

  if (bump) {
    pkg.version = semver.inc(pkg.version, 'patch');
  }

  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.if(bump, plugins.bump({
      version: pkg.version
    })))
    .pipe(gulp.dest('.'));
});

gulp.task('header', ['bump'], function() {
  return gulp.src(BANNER)
    .pipe(plugins.rename({extname: '.ts'}))
    .pipe(plugins.replace(/<%= pkg\.(\w+)\.?(\w+)? %>/g, function(chars, major, minor) {
      return minor?pkg[major][minor]:pkg[major];
    }))
    .pipe(gulp.dest(PATH.source));
});

gulp.task('tslint', ['header'], function () {
  return gulp.src(FILES)
    .pipe(plugins.tslint())
    .pipe(plugins.tslint.report('verbose'));
});

gulp.task('build', ['tslint'], function() {
  var ts = gulp.src(FILES)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.typescript({
      target: 'ES5',
      declarationFiles: false,
      module: 'commonjs'
    }));

  return ts.js
    .pipe(plugins.concat(MAIN))
    .pipe(plugins.wrapper({
      header: '(function() {',
      footer: '})();'
    }))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.build));
});

gulp.task('minify', ['build'], function() {
  return gulp.src(path.join('.', PATH.build, MAIN))
    .pipe(plugins.sourcemaps.init({loadMaps: true}))
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.build));
});

gulp.task('develop', ['minify'], function() {
  gulp.watch(FILES, ['minify']);
  gulp.watch(TESTS, ['test']);
});

gulp.task('test', function() {
  return gulp.src(TESTS, {read: false})
    .pipe(plugins.mocha({reporter: 'spec'}));
});
