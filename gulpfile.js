const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const es = require('event-stream');
const sourcemaps = require("gulp-sourcemaps");

gulp.task('sass', function () {
  gulp.src(['./node_modules/bootstrap/scss/bootstrap.scss',
    './node_modules/sierra-library/src/sierra.scss',
    './src/scss/style.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      sourceComments: false
    }))
    .pipe(minifycss())
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
    "./src/js/jquery.parallax-1.1.3.js",
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
