module.exports=function(grunt){

    //Grunt处理任务进度条提示
    require('time-grunt')(grunt);
    var defaultPath = '/assets/',
        destPath = defaultPath + 'build',
        archiveName = 'bigertech';

    grunt.initConfig({
        //默认文件目录在这里
        paths: {
            //输出的最终文件assets里面
            assets: destPath,
            //若简单项目，可直接使用原生CSS，同样可以grunt watch:base进行监控
            css: defaultPath + 'css/',
            //js文件相关目录
            js: defaultPath +' js/',
            //图片相关
            img: defaultPath + 'images/',
        },
        buildType: 'Build',
        pkg: grunt.file.readJSON('package.json'),
        //此处可根据自己的需求修改
        archiveName: grunt.option('name') || archiveName,
        //清理掉开发时才需要的文件
        clean: {
            //删除掉先前的开发文件
            pre: [defaultPath + 'build/', '/build/'],
            //先删除先前生成的压缩包
            post: ['<%= archiveName %>*.zip']
        },

        // less编译成css
        less: {
            development: {
                options: {
                    paths: ['<%= paths.css %>'],
                    cleancss: true
                },
                files: [
                    {
                        // 启用动态扩展
                        expand: true,
                        // 源文件匹配都相对此目录
                        cwd: '<%= paths.css %>',
                        // 匹配模式
                        src: ['**/*.less'],
                        // 目标路径前缀
                        dest: '<%= paths.css %>',
                        // 目标文件路径中文件的扩展名
                        ext: '.css',
                    }
                ]
            }
        },

        // uglify压缩文件
        uglify:{
            options:{
                //js文件打上时间戳
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            // 动态文件映射，
            // 当任务运行时会自动在 "lib/" 目录下查找 "**/*.js" 并构建文件映射，
            // 添加或删除文件时不需要更新 Gruntfile
            dynamic_mappings: {
                files: [
                    {
                        // 启用动态扩展
                        expand: true,
                        // 源文件匹配都相对此目录
                        cwd: '<%= paths.js %>',
                        // 匹配模式
                        src: ['*.js', '!min/*.js'],
                        // 目标路径前缀
                        dest: '<%= paths.assets %>/js',
                        // 目标文件路径中文件的扩展名
                        ext: '.js',
                        // 扩展名始于文件名的第一个点号
                        extDot: 'first'
                    }
                ]
            }
        },

        //压缩 css
        cssmin:{
            options:{
                keepSpecialComments: 0
            },
            minify: {
                expand: true,
                cwd: '<%= paths.css %>',
                src: ['**/*.css', '!*.min.css'],
                dest: '<%= paths.assets %>/css',
                ext: '.css'
            }
        },

        // 压缩最终Build文件夹
        compress:{
            main:{
                options:{
                    archive:'dist/<%= archiveName %>-<%= grunt.template.today("yyyy") %><%= grunt.template.today("mm") %><%= grunt.template.today("dd") %>_<%= grunt.template.today("HH") %>:<%= grunt.template.today("mm") %>.zip'
                },
                expand:true,
                cwd:'<%= paths.assets %>',
                src:['**'],
                dest:'dist/'
            }
        },

        copy:{
            images:{
                expand: true,
                cwd:'<%= paths.img %>',
                src: ['**','!*.mkm'],
                dest: '<%=paths.assets %>/images/',
                flatten:true,
                filter:'isFile'
            },
            minJs:{
                expand: true,
                cwd:'<%= paths.js %>/min',
                src: ['*.js'],
                dest: '<%=paths.assets %>/js/min/',
                flatten:true,
                filter:'isFile'
            },
            archive:{
                files:[
                    {
                        expand: true,
                        src: ['<%= archiveName %>.zip'],
                        dest: 'dist/'
                    }
                ]
            }
        },

        //监听变化 默认grunt watch 监测所有开发文件变化
        watch:{
            options:{
                //开启 livereload
                livereload:true,
                //显示日志
                dateFormate:function(time){
                    grunt.log.writeln('编译完成,用时'+time+'ms ' + (new Date()).toString());
                    grunt.log.writeln('Wating for more changes...');
                }
            },
            css:{
                files:'<%= paths.css %>/**/*.css',
                tasks:['cssmin']
            },
            js:{
                files:'<%= paths.js %>/**/*.js',
                tasks:['uglify']
            },
            //若不使用Sass，可通过grunt watch:base 只监测style.css和js文件
            base:{
                files:['<%= paths.css %>/**/*.css','<%= paths.js %>/**/*.js','images/**'],
                tasks:['cssmin','uglify','copy:images']
            }

        }
    });

    //输出进度日志
    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + '文件: '+filepath + ' 变动状态: ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 注册default任务
    grunt.registerTask('default', ['less','cssmin','uglify','copy']);
    //执行 grunt bundle --最终输出的文件 < name-生成日期.zip > 文件
    grunt.registerTask('bundle', ['clean:pre','less:development','copy:images', 'copy:main','cssmin','copy:archive', 'clean:post','htmlmin','compress',]);

    //执行 grunt publish 可以直接上传项目文件到指定服务器FTP目录
};
