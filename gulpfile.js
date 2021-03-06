'use strict';

const gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint');


gulp.task('mocha', ['eslint'], function() {
    return gulp.src('./test/test.js')
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('eslint', function() {
    return gulp.src(['**/*.js', '!.node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['mocha']);
});
