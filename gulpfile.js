var gulp = require('gulp');
var clean = require('gulp-clean');
var fontmin = require('gulp-fontmin');
var fs = require('fs');
var otfToTtf = require('gulp-otf2ttf');


gulp.task('clean', function () {
    return gulp.src('build/', {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean-font', function () {
    return gulp.src('build/font', {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean-otf', function () {
    return gulp.src('build/font/*.otf', {
            read: false
        })
        .pipe(clean());
});

gulp.task('copy', ['clean'], function () {
    return gulp.src('src/**/*.*')        
        .pipe(gulp.dest('build/'));
});

function minifyFont(text, cb) {
    gulp
        .src('src/font/*.ttf')
        .pipe(fontmin({
            text: text
        }))
        .pipe(gulp.dest('build/font/'))
        .on('end', cb);
}

gulp.task('otf2ttf', function(cb) {
    return gulp
        .src('src/font/*.otf')
        .pipe(otfToTtf())
 
});
 
gulp.task('fonts', function(cb) {
 
    var buffers = [];
 
    gulp
        .src('src/index.html')
        .on('data', function(file) {
            buffers.push(file.contents);
        })
        .on('end', function() {
            var text = Buffer.concat(buffers).toString('utf-8');
            minifyFont(text, cb);
        });
 
});

gulp.task('build', ['copy',"clean-font"], function () {
    gulp.start(['fonts', 'clean-otf']);
});

gulp.task('default', ['build']);
