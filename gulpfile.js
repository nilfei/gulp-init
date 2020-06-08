// 定义依赖项和插件
const gulp = require('gulp');
const uglify = require('gulp-uglify'); //js压缩
const concat = require('gulp-concat'); //文件合并
const jshint = require('gulp-jshint'); //js语法检测
const rename = require('gulp-rename'); // 重命名
const sass = require('gulp-sass'); // 编译scss
const minifycss = require('gulp-minify-css'); // 压缩css
// const livereload = require('gulp-livereload'); // 自动刷新页面
const del = require('del'); //文件删除
const connect = require('gulp-connect'); // 自动刷新页面
const fileinclude = require('gulp-file-include');
gulp.task('server', function () {
    return connect.server({
        port: 8080, //指定端口号，在浏览器中输入localhost:8080就可以直接访问生成的html页面
        root: './dist', //指定html文件起始的根目录
        livereload: true //启动实时刷新功能（配合上边的connect.reload()方法同步使用）
    });
});

// 定义名为 "js" 的任务压缩js
gulp.task('js', function () {
    return gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(connect.reload())
});


// 定义名为 "css" 的任务编译scss压缩css
gulp.task('css', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('all.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(connect.reload())
        .pipe(gulp.dest('./dist/css'))

});

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload())
})
//执行压缩前，先删除以前压缩的文件
gulp.task('clean', function () {
    return del(['./dist/css/all.css', './dist/css/all.min.css', './dist/all.js', './dist/all.min.js', './dist/*.html'])
});

// 任务监听
gulp.task('watch', function () {
    // Watch.js files
    gulp.watch('./js/*.js', gulp.series('js'));
    // Watch .scss files
    gulp.watch('./css/*.scss', gulp.series('css'));
    // Watch .html files
    gulp.watch('./*.html', gulp.series('html'));
    // Watch any files in dist/, reload on change
    // gulp.watch(['dist/!**']).on('change', livereload.changed);
});
// 定义默认任务

gulp.task('default', gulp.series('clean',gulp.parallel('js', 'css', 'html','server','watch')));
