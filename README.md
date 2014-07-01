html-front-template
===================

#简介
前端开发模板，自动化任务管理。html5 development template, auto task manager

本项目为笔戈科技开发团队前端开发模板。方便快速进行项目开发，打包发布。

#使用方式

```
	git clone https://github.com/kissliux/html-front-template.git
```


#前端技术

* html5
* bootstrap 3 模板
* jquery
* lazyload
* less
* grunt
* bower



## grunt任务：
```
   grunt.registerTask('default', ['less','cssmin','uglify','copy']);
    //执行 grunt bundle --最终输出的文件 < name-生成日期.zip > 文件
    grunt.registerTask('bundle', ['clean:pre','less:development','copy:images', 'copy:main','cssmin','copy:archive', 'clean:post','htmlmin','compress',]);
    
 ```
 
 * clean 清理文档格式
 * less 编译成css
 * cssmin css压缩
 * uglify js文件压缩
 * compress 压缩成 .zip文件
 * copy 把所有资源文件拷贝到 build目录，方便项目发布到CDN
 


#文档结构  

```
├── Gruntfile.js   //任务配置
├── assets			//静态资源
│   ├── css			
│   │   ├── base.less		//公用样式
│   │   ├── ie		//IE兼容性问题解决
│   │   │   └── index-ie.css
│   │   ├── index.css		//less编译后生成文件
│   │   ├── index.less		//主页样式
│   │   └── media			//媒体查询  响应式
│   │       └── index-media.css
│   ├── images		//图片资源
│   │   ├── favicon.ico
│   │   └── sprite		//图片精灵（多个小图放到一张大图里面，减少请求次数）
│   └── js		//javascript脚本
│       ├── base.js		//公用脚本
│       └── index.js		//主页脚本
├── bower.json		//包管理文件
├── build		//打包发布的文件，经过了编译、拼接，压缩等处理后的目录
├── index.html		//主页
└── package.json	

```

#Development
安装依赖

```
npm install
bower install

```
打包发布

```
grunt

```



