var gulp = require('gulp');
var clean = require('gulp-clean');
var fontmin = require('gulp-fontmin');
var fs = require("fs");

gulp.task('clean', function () {
    return gulp.src('build/', {
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

gulp.task('build', ['copy'], function () {
    gulp.start(['fonts']);
});

gulp.task('default', ['build']);
