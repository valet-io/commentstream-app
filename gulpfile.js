'use strict';

var gulp        = require('gulp');
var tasks       = require('gulp-tasks');
var plugins     = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var streamqueue = require('streamqueue');
var browserify  = require('browserify');
var superstatic = require('superstatic');
var watchify    = require('watchify');
var through     = require('through2');
var path        = require('path');
var internals   = {};

var env = plugins.util.env.env || 'development';
var isEnv = function () {
  return Array.prototype.slice.call(arguments, 0).indexOf(env) !== -1;
};

var paths = {
  src: './src/**/*.js',
  main: './src/index.js',
  index: './src/index.html',
  templates: './src/**/*.html',
  test: './test/**/*.js',
  styles: './styles/main.scss',
  build: './build'
};

plugins.util.log('Environment:', plugins.util.colors.cyan(env));

tasks.use('lint', ['./src/**/*.js', './test/**/*.js', './gulpfile.js']);
tasks.use('clean', 'build');

internals.stripViewsFromPath = function () {
  return through.obj(function (file, enc, callback) {
    file.path = file.path.replace('/views', '');
    this.push(file);
    callback();
  });
};

tasks.use('templates', './src/**/views/*.html', 'build/views');

internals.hashes = {};

internals.manifest = function () {
  return through.obj(function (file, enc, callback) {
    internals.hashes[path.basename(file.revOrigPath)] = path.basename(file.path);
    this.push(file);
    callback();
  });
};

tasks.use('styles', './styles/main.scss', './build/styles');

gulp.task('fonts', function () {
  return gulp.src('./fonts/*')
    .pipe(gulp.dest('./build/fonts'));
});

tasks.use('vendor', [
  './components/angular/angular.js',
  './node_modules/angular-ui-router/release/angular-ui-router.js',
  './components/firebase/firebase.js',
  './components/angularfire/dist/angularfire.js'
], './build/scripts');

tasks.use('bundle', './src/index.js', './build/scripts', {
  templates: './src/**/views/*.html',
  module: 'CommentStream'
});

tasks.use('index', './src/index.html', './build');

gulp.task('build', ['clean'], function (done) {
  runSequence(['bundle', 'vendor', 'templates', 'styles', 'fonts'], 'index', done);
});

gulp.task('watch', ['index', 'vendor', 'styles', 'templates', 'fonts'], function () {
  var bundler = watchify(paths.main);
  var bundle = function () {
    internals.browserify(bundler).pipe(gulp.dest(paths.build + '/scripts'));
  };
  bundler.on('update', bundle);

  gulp.watch(paths.index, ['index']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch('./styles/**/*.scss', ['styles']);

  plugins.livereload.listen();
  gulp.watch(paths.build + '/**/*', plugins.livereload.changed);

  return bundle();
});

tasks.use('server');

gulp.task('serve', ['watch', 'server']);
