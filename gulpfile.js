'use strict';

const gulp = require('gulp'),
    argv = require('yargs').argv,
    mocha = require('gulp-mocha'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif = require('gulp-if'),
    isProduction = (argv.mode != undefined) ? true : false,
    eslint = require('gulp-eslint');


gulp.task('mocha', ['eslint'], function() {
    return gulp.src('./test/test.js')
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('eslint', function() {
    return gulp.src(['src/**/*.js', '!.node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['mocha']);
});
