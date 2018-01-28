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
  gulp.src(`${config.project_path}/assets/js/*.js`)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(babel({presets: ['es2015']}))
    .pipe(gulp.dest(`${config.project_path}/dist/js/`))
  gutil.log('build')
  setTimeout(() => {
    cb()
  },1500)
});

gulp.task('style', () => {
  gulp.src('./assets/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css/'))
      .pipe(connect.reload());
      notifier.notify({
      'title': 'FileWatcher',
      'message': 'Compiled!'
    });
});

gulp.task('replaceStrict',['build'], () => {
  gulp.src(`${config.project_path}/dist/js/*.js`)
    .pipe(replace("'use strict';",''))
    .pipe(replace('"use strict";',''))
    .pipe(gulp.dest(`${config.project_path}/dist/js/`));
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
  gulp.watch(`${config.project_path}/assets/scss/*`,['style'])
  gulp.watch(`${config.project_path}/dist/css/*`,['reload'])
  gulp.watch(`${config.project_path}/assets/js/*`, ['reload']);
  gulp.watch(`${config.project_path}html/*`,['reload']);
  gulp.watch(`${config.project_path}partials/*`,['reload']);
});

gulp.task('default',['style', 'reload', 'connect', 'watch']);
