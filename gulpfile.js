const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const purgecss = require('@fullhuman/postcss-purgecss');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
sass.compiler = require('node-sass');

gulp.task('babel', () =>
  gulp.src('scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'))
    .pipe(reload({ stream: true }))
);

gulp.task('browser-sync', function() {
  const files = ['./styles/*.scss', './*.php', './scripts/*.js',];
  browserSync.init(files, {
    proxy: 'localhost/theme-boilerplate',
    notify: true
  });
  gulp.watch('./styles/**/*.scss', gulp.series(css));
  gulp.watch('./scripts/*.js'), gulp.series('babel');
  gulp.watch('./*.php').on('change', browserSync.reload);
});

const css = function() {
  return gulp
    .src('./styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(postcss([
      require('tailwindcss'),
      purgecss({
        content: ['./*.php'],
        defaultExtractor: content =>
          content.match(/[\w-/:]+(?<!:)/g) || []
      }),
      cssnano()
    ]))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./'))
    .pipe(reload({ stream: true }));
};

const watch = function(cb) {
  gulp.watch('./styles/**/*.scss', gulp.series(css));
  gulp.watch('./scripts/*.js'), gulp.series('babel');
  gulp.watch('./*.php').on('change', browserSync.reload);
  cb();
};

exports.css = css;
exports.watch = watch;
exports.default = gulp.series(css, 'babel', watch, 'browser-sync');

// gulp.series // one by one
// gulp.parallel // altogether