var gulp = require('gulp');
var clean = require('gulp-clean');
var Fontmin = require('fontmin');
var fs = require("fs");

var srcPath = 'src/font/*.ttf'; // 字体源文件
var destPath = 'build/font'; 


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
    var fontmin = new Fontmin()
        .src(srcPath)               
        .use(Fontmin.glyph({        
            text: text              
        }))
        .use(Fontmin.ttf2eot())     
        .use(Fontmin.ttf2woff())    
        .use(Fontmin.ttf2svg())    
        .dest(destPath); 
    
    fontmin.run(function (err, files, stream) {
        if (err) {                  
            console.error(err);
        }
        console.log('done');
        cb();        
    });
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
