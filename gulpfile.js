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

gulp.task('vendor', function () {
  return gulp.src([
    './components/angular/angular.js',
    './node_modules/angular-ui-router/release/angular-ui-router.js',
    './components/firebase/firebase.js',
    './components/angularfire/dist/angularfire.js'
  ])
  .pipe(plugins.concat('vendor.js'))
  .pipe(plugins.if(isEnv('production', 'staging'), plugins.uglify()))
  .pipe(plugins.if(isEnv('production', 'staging'), plugins.rev()))
  .pipe(plugins.if(isEnv('production', 'staging'), internals.manifest()))
  .pipe(gulp.dest('./build/scripts'));
});

internals.browserify = function (bundler) {
  bundler
    .transform('browserify-shim');

  if (isEnv('production', 'staging')) { 
    bundler.transform('uglifyify');
  }

  return bundler
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer());
};

internals.templates = function () {
  return gulp.src(paths.templates)
    .pipe(plugins.if(isEnv('production', 'staging'), plugins.htmlmin({
      collapseWhitespace: true
    })))
    .pipe(internals.stripViewsFromPath())
    .pipe(plugins.angularTemplatecache({
      module: 'PledgeApp',
      root: '/views'
    }));
};

gulp.task('bundle', function () {
  return streamqueue({objectMode: true},
    internals.browserify(browserify(paths.main)),
    internals.templates()
  )
  .pipe(plugins.concat('app.js'))
  .pipe(plugins.if(isEnv('production', 'staging'), plugins.uglify()))
  .pipe(plugins.if(isEnv('production', 'staging'), plugins.rev()))
  .pipe(plugins.if(isEnv('production', 'staging'), internals.manifest()))
  .pipe(gulp.dest(paths.build + '/scripts'));
});

gulp.task('index', function () {
  return gulp.src(paths.index)
    .pipe(plugins.if(isEnv('production', 'staging'), plugins.htmlmin({
      collapseWhitespace: true
    })))
    .pipe(plugins.if(isEnv('production', 'staging'), through.obj(function (file, enc, callback) {
      var contents = String(file.contents);
      for (var original in internals.hashes) {
        contents = contents.replace(original, internals.hashes[original]);
      }
      file.contents = new Buffer(contents);
      this.push(file);
      callback();
    })))
    .pipe(gulp.dest('build'));
});

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
