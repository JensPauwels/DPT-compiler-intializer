const gulp = require('gulp');
const shell = require('gulp-shell');
const babel = require("gulp-babel");
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const notifier = require('node-notifier');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const config = require('./compiler_config.json');

const onError = function (err) {
  gutil.log(err)
  notifier.notify({
    'title': 'FileWatcher',
    'message': 'Error!!'
  })
};

gulp.task('build',(cb) => {
  gulp.src(`${config.project_path}es6/*.js`)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest(`${config.project_path}script`))
  gutil.log('build')
  setTimeout(() => {
    cb()
  },1500)
});

gulp.task('style', () => {
  gulp.src('./scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css/'))
      .pipe(connect.reload());
      notifier.notify({
      'title': 'FileWatcher',
      'message': 'Compiled!'
    });
});

gulp.task('replaceStrict',['build'], () => {
  gulp.src(`${config.project_path}script/*.js`)
    .pipe(replace("'use strict';",''))
    .pipe(replace('"use strict";',''))
    .pipe(gulp.dest(`${config.project_path}script/`));
    gutil.log('replaceStrict')
    notifier.notify({
      'title': 'FileWatcher',
      'message': 'Compiled!'
    });
});

gulp.task('compile',['build','replaceStrict'],
  shell.task([`java -jar ${config.compiler_path} compile ${config.compile_type} ${config.project_path}`]), () => {
    gutil.log('reloading');
  }
);

gulp.task('reload',['build','replaceStrict','compile'], () => {
  gulp.src('./*')
    .pipe(connect.reload());
});


gulp.task('connect', function() {
  connect.server({
      livereload: true
  });
});

gulp.task('watch',() => {
  gulp.watch(`${config.project_path}scss/*`,['style'])
  gulp.watch(`${config.project_path}css/*`,['reload'])
  gulp.watch(`${config.project_path}es6/*`, ['reload']);
  gulp.watch(`${config.project_path}html/*`,['reload']);
});

gulp.task('default',['connect','watch']);
