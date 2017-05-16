/**
 * Created by Administrator on 2017/5/9.
 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');// js的压缩
const concat = require('gulp-concat');// 文件合并
const rename = require('gulp-rename');// 文件重命名
const browserify = require('gulp-browserify');// 模块化的打包
const sass = require('gulp-sass');// sass编译
const clean = require('gulp-clean-css');// css压缩
const webserver = require('gulp-webserver');// web服务热启动
const img = require('gulp-imagemin');// 压缩图片
const rev = require('gulp-rev');// 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');// 路径替换
const url = require('url');
const datajson = require('./data/main.js');
const mockjson = require('./data/mock.js');
const searchjson = require('./data/search.js');

gulp.task('jsmin', function(){
    // 压缩js
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat('common.js'))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        // .pipe(rename('main.js'))
        .pipe(rev())
        .pipe(gulp.dest('./build/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'))
});

gulp.task('commonjs', function(){
    // 复制公共js框架到build中
    gulp.src('src/js/common/*.js')
        .pipe(gulp.dest('./build/js/common'));
});

gulp.task('cssmin', function(){
    // 压缩css
    gulp.src('src/css/*.sass')
        .pipe(sass())
        .pipe(clean())
        .pipe(rev()) // 文件名加MD5后缀
        .pipe(gulp.dest('./build/css')) // 输出文件路径
        .pipe(rev.manifest()) // 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev/css')); // 将rev-manifest.json保存到rev目录内
});

gulp.task('commoncss', function(){
    // 复制公共js框架到build中
    gulp.src('src/css/common/*.css')
        .pipe(gulp.dest('./build/css/common'));
});

gulp.task('rev', function(){
    // MD5文件名的替换
    setTimeout(function(){
        gulp.src(['./rev/**/*.json','src/html/*.html'])
            // 读取rev-manifest.json文件以及需要进行css名替换的文件
            .pipe(revCollector({
                replaceReved: true, // 设置replaceReved标识，用来说明模板中已经被替换的文件是否还能再被替换，默认是false
                dirReplacements: {
                    'css': '../css',
                    'js': '../js'
                }
                // 标识目录替换的集合, 因为gulp-rev创建的manifest文件不包含任何目录信息
            })) // 执行文件内css名的替换
            .pipe(gulp.dest('./build/html'))
    },1000);

});

gulp.task('imgmin', function(){
    // 压缩图片
    gulp.src('src/images/*.jpg')
        .pipe(img())
        .pipe(gulp.dest('./build/images'))
});

gulp.task('html', function(){
    // 复制html文件到build中
    gulp.src('src/html/*.html')
        .pipe(gulp.dest('./build/html'))
});

gulp.task('build',['jsmin','commonjs','cssmin','commoncss','html','imgmin','rev']);

gulp.task('webserver',['build'], function(){
    // 启动热服务
    gulp.watch('./src/css/*.sass',['cssmin']);
    // 监测文件
    gulp.watch('./src/html/*.html', ['html']);
    setTimeout(function(){
        gulp.src('./build')
            .pipe(webserver({
                livereload: true,
                directoryListing: true,
                middleware: function (req,res,next){
                    const reqPath = url.parse(req.url).pathname;
                    var arr = [datajson,mockjson,searchjson];
                    for(var i=0;i<arr.length;i++){
                        const routes = arr[i].data();
                        routes.forEach(function(i){
                            console.log(i.route);
                            console.log(reqPath);
                            if(i.route == reqPath){
                                i.handle (res,req,next);
                            }
                        });
                    }
                    next();
                },
                open: 'html/defer.html'
                // 需要进行热启动的文件的路径
            }))
    },1000);

});
gulp.task('default', function() {
    // 将你的默认的任务代码放在这
});

