'use strict';

var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    sourcemaps     = require('gulp-sourcemaps'),
    browserSync    = require('browser-sync'),
    rename         = require('gulp-rename'),
    del            = require('del'),
    imagemin       = require('gulp-imagemin'),
    pngquant       = require('imagemin-pngquant'),
    cache          = require('gulp-cache'),
    autoprefixer   = require('gulp-autoprefixer'),
    csscomb        = require('gulp-csscomb'),
    notify         = require('gulp-notify'),
    plumber        = require('gulp-plumber'),
    gcmq           = require('gulp-group-css-media-queries');

gulp.task('scss', function() {
  return gulp.src('dev/scss/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError({
      message: "Error: <%= error.message %>",
      title: "Error running something"
     })}))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
  return gulp.src('dev/images/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "../",
      index: "index.html",
      directory: true
    },
    notify: true
  });
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearAll();
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('dev/scss/**/*.scss', ['scss']);
  gulp.watch('dev/*.html', browserSync.reload);
  gulp.watch('dev/js/**/*.js', browserSync.reload);
});

gulp.task('cssbeautiful', function() {
  return gulp.src('dev/css/**/*.css')
    .pipe(autoprefixer())
    .pipe(gcmq())
    .pipe(csscomb())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('dist', ['clean', 'img', 'cssbeautiful'], function() {
  var buildFonts = gulp.src('dev/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

  var buildJs = gulp.src('dev/js/**/*')
    .pipe(gulp.dest('dist/js'))

  var buildHtml = gulp.src('dev/inc/**/*')
    .pipe(gulp.dest('dist/inc'))

  var buildHtml = gulp.src('dev/*.html')
    .pipe(gulp.dest('dist'));
});
