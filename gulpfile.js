var gulp = require("gulp");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rimraf = require("rimraf");
var runSequence = require("run-sequence");
var sourceDir = "src";
var buildDir = "dist";

gulp.task("clean", function(done) {
  rimraf(buildDir, done);
});

gulp.task("build-content-script", function() {
  return browserify("./" + sourceDir + "/main.js")
    .transform(babelify)
    .bundle()
    .pipe(source("content-script.js")) // Convert from Browserify stream to vinyl stream.
    .pipe(buffer()) // Convert from streaming mode to buffered mode.
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(buildDir));
});

gulp.task("build-manifest", function() {
  return gulp
    .src(sourceDir + "/manifest.json")
    .pipe(gulp.dest(buildDir));
});

gulp.task("build", ["clean"], function(done) {
  runSequence("build-content-script", "build-manifest", done);
});

gulp.task("watch", ["build"], function() {
  return watch(sourceDir, function() { gulp.start("build") });
});

gulp.task("default", ["build"]);
