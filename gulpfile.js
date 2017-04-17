const browserify = require('browserify')
const gulp = require('gulp')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
const watchify = require('watchify')

gulp.task('js', () => {
  const bundler = watchify(browserify('./js/main.js', watchify.args))

  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./js'))
})

gulp.task('watch', () => {
  gulp.start('js')
  gulp.watch('js/**/*.js', ['js'])
})

gulp.task('build', ['js'])

gulp.task('default', ['watch'])
