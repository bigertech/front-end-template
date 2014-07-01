module.exports=function(grunt){
    require('time-grunt')(grunt);//Grunt处理任务进度条提示
    var defaultPath = '',//content/themes/bigertech/
        destPath = defaultPath+'build';

    grunt.initConfig({
        //默认文件目录在这里
        paths:{
            assets:destPath,//输出的最终文件assets里面
            css:defaultPath+'assets/css', //若简单项目，可直接使用原生CSS，同样可以grunt watch:base进行监控
            js:defaultPath+'assets/js', //js文件相关目录
            img:defaultPath+'assets/images', //图片相关
        },
        buildType:'Build',
        pkg: grunt.file.readJSON('package.json'),
        archive_name: grunt.option('name') || 'bg',//此处可根据自己的需求修改

        //清理掉开发时才需要的文件
        clean: {
            pre: [defaultPath+'build/','build/'],//删除掉先前的开发文件
            post: ['<%= archive_name %>*.zip'] //先删除先前生成的压缩包
        },
        less: {
              development: {
                options: {
                  paths: ['<%= paths.css %>'],
                  cleancss: true    
                },
                files: [
                    {
                        expand: true,     // 启用动态扩展
                        cwd: '<%= paths.css %>/',      // 源文件匹配都相对此目录
                        src: ['**/*.less'], // 匹配模式
                        dest: '<%= paths.css %>',   // 目标路径前缀
                        ext: '.css',   // 目标文件路径中文件的扩展名
                    }
                ]
              }
            },

        uglify:{
            options:{
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' //js文件打上时间戳
            },
            dynamic_mappings: {
                // 动态文件映射，
                // 当任务运行时会自动在 "lib/" 目录下查找 "**/*.js" 并构建文件映射，
                // 添加或删除文件时不需要更新 Gruntfile
                files: [
                    {
                        expand: true,     // 启用动态扩展
                        cwd: '<%= paths.js %>/',      // 源文件匹配都相对此目录
                        src: ['*.js','!min/*.js'], // 匹配模式
                        dest: '<%= paths.assets %>/js',   // 目标路径前缀
                        ext: '.js',   // 目标文件路径中文件的扩展名
                        extDot: 'first'   // 扩展名始于文件名的第一个点号
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
                cwd: '<%= paths.css %>/',
                src: ['**/*.css', '!*.min.css'],
                dest: '<%= paths.assets %>/css',
                ext: '.css'
            }
        },
        //压缩最终Build文件夹
        compress:{
            main:{
                options:{
                    archive:'dist/<%= archive_name %>-<%= grunt.template.today("yyyy") %><%= grunt.template.today("mm") %><%= grunt.template.today("dd") %>_<%= grunt.template.today("HH") %>:<%= grunt.template.today("mm") %>.zip'
                },
                expand:true,
                cwd:'<%= paths.assets %>/',
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
                        {expand: true, src: ['<%= archive_name %>.zip'], dest: 'dist/'}
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

    grunt.registerTask('default', ['less','cssmin','uglify','copy']);
    //执行 grunt bundle --最终输出的文件 < name-生成日期.zip > 文件
    grunt.registerTask('bundle', ['clean:pre','less:development','copy:images', 'copy:main','cssmin','copy:archive', 'clean:post','htmlmin','compress',]);
    //执行 grunt publish 可以直接上传项目文件到指定服务器FTP目录

};
