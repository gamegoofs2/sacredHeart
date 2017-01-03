var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var del = require('del');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');


////////// Clean Up //////////
gulp.task('clean', function () {
  return del.sync('dist').then(function(cd){
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

////////// Optimization //////////
gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

////////// Browser Sync //////////
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'app',
      routes: {
        "/bower_components": "bower_components"
      }
    }
  })
});

////////// Styles //////////
gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: 'bower_components/bootstrap-sass/assets/stylesheets/bootstrap'
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


////////// Watches //////////
gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

////////// Build //////////
gulp.task('build', function (callBack) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callBack
  );
});

////////// Default //////////
gulp.task('default', function(callBack){
  runSequence(['sass', 'browserSync'], 'watch', callBack);
});
