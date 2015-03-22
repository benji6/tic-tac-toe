var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('js', function () {
  var bundler = watchify(browserify('./js/main.js', watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task('sass', function () {
  gulp.src('sass/style.scss')
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest('css'));
});

gulp.task("watch", function () {
  gulp.start('sass', 'js');
  gulp.watch('sass/style.scss', ["sass"]);
  gulp.watch('js/**/*.js', ["js"]);
});

gulp.task("build", ["js", "sass"]);

gulp.task("default", ["watch"]);
