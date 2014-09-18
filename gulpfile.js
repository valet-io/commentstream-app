'use strict';

var gulp        = require('gulp');
var runSequence = require('run-sequence');

tasks.use('lint', ['./src/**/*.js', './test/**/*.js', './gulpfile.js']);
tasks.use('clean', 'build');
tasks.use('templates', './src/**/views/*.html', 'build/views');
tasks.use('styles', './styles/main.scss', './build/styles');
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
tasks.use('server');

gulp.task('fonts', function () {
  return gulp.src('./fonts/*').pipe(gulp.dest('./build/fonts'));
});

gulp.task('build', ['clean'], function (done) {
  runSequence(['bundle', 'vendor', 'templates', 'styles', 'fonts'], 'index', done);
});

gulp.task('serve', ['watch', 'server']);
