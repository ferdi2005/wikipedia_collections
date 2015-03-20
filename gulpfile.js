var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less_frontend', function() {
  gulp.src(['web/less/**/*.less'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(concat('frontend.css'))
      .pipe(autoprefixer({ browsers: ['> 5%'] }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/compiled'))
  ;
});

gulp.task('js', function() {
  gulp.src(['web/js/**/*.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('frontend.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/compiled'))
    .pipe(livereload())
  ;
});

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch('web/less/**/*.less', ['less']);
    gulp.watch('web/js/**/*.js', ['js']);

    gulp.watch([
      'src/**/*',
      'app/config/*',
      'web/**/*.html',
      'web/compiled/**/*.css',
      'web/css/**/*.css',
      'web/compiled/**/*.js',
      'web/img/**/*',
    ], livereload.reload);
    
    gulp.watch('gulpfile.js', process.exit);
});

gulp.task('less', ['less_frontend']);
gulp.task('default', ['less_frontend', 'js']);