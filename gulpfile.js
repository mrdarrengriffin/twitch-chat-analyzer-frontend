var gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");

var watchedBrowserify = watchify(
  browserify({
    basedir: ".",
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
);

function bundle() {
  return watchedBrowserify
    .bundle()
    .on("error", fancy_log)
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist/js"));
}

gulp.task('style', () => {
  return gulp.src('assets/scss/style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', () => {
  gulp.watch('assets/scss/**/*.scss', (done) => {
    gulp.series(['style'])(done);
  });
});
gulp.task("default", gulp.series(bundle, gulp.parallel(['style', 'watch'])));

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);