var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less_frontend', function() {
  gulp.src(['web/less/frontend/**/*.less'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(concat('frontend.css'))
      .pipe(autoprefixer({ browsers: ['> 5%'] }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/compiled'))
  ;
});

gulp.task('less_backend', function() {
  gulp.src([
      'web/vendor/bootstrap/dist/css/bootstrap.css',
      'web/css/crud.css',
      'web/less/backend/**/*.less',
    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(concat('backend.css'))
      .pipe(autoprefixer({ browsers: ['> 5%'] }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/compiled'))
  ;
});

gulp.task('js_frontend', function() {
  gulp.src([
      'web/bundles/fosjsrouting/js/router.js',
      'web/vendor/jquery/dist/jquery.js',
      'web/vendor/twig.min.js',
      'web/vendor/velocity.min.js',
      'web/vendor/jquery.waitforimages.min.js',
      'web/vendor/fastclick.js',
      'web/js/frontend/**/*.js',
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('frontend.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/compiled'))
  ;
});

gulp.task('js_backend', function() {
  gulp.src([
      'web/vendor/jquery/dist/jquery.js',
      'web/js/backend/**/*.js',
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('backend.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('web/compiled'))
  ;
});

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch('web/less/frontend/**/*.less', ['less_frontend']);
    gulp.watch('web/less/backend/**/*.less', ['less_backend']);
    gulp.watch('web/js/backend/**/*.js', ['js_backend']);
    gulp.watch('web/js/frontend/**/*.js', ['js_frontend']);

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

gulp.task('js', ['js_backend', 'js_frontend']);
gulp.task('less', ['less_frontend', 'less_backend']);
gulp.task('default', ['less', 'js']);
