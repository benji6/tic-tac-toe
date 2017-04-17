var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');

gulp.task('js', function () {
  var bundler = watchify(browserify('./js/main.js', watchify.args));

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task("watch", function () {
  gulp.start('js');
  gulp.watch('js/**/*.js', ["js"]);
});

gulp.task("build", ["js"]);

gulp.task("default", ["watch"]);
