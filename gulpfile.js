let gulp = require('gulp'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleancss = require('gulp-clean-css'),
      rename = require("gulp-rename"),
      uglify = require("gulp-uglify"),
      concat = require('gulp-concat'),
      sourcemaps = require("gulp-sourcemaps");

gulp.task('sass', () => {
  gulp.src([
    './node_modules/bootstrap/scss/bootstrap.scss',
    './node_modules/sierra-library/src/sierra.scss',
    './src/scss/style.scss'])   
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 10 version'))
    .pipe(cleancss({level: {1: {specialComments: 0}}}))
    .pipe(concat('bundle.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/css'));
});


gulp.task('js', () => {
  return gulp.src([
    "./src/js/page.min.js",
    "./src/js/jquery.jplayer.js",
    "./src/js/draggabilly.pkgd.min.js",
    "./src/js/jquery.nicescroll.min.js",
    "./src/js/jquery.stickit.js",
    "./src/js/menu.min.js",
    "./src/js/jquery.validate.min.js",
    "./src/js/additional-methods.min.js",
    "./src/js/script.js"])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('sc.js'))
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./www/js/'));
});
