<link rel="stylesheet" href="http://yandex.st/highlightjs/8.0/styles/solarized_dark.min.css">

# ljyclear
<p style="border-bottom: 1px solid #eaecef"></p>

### 说明

在更新一个项目的时候，总是会重新拉取一个分支，然后再把代码download下来。在本地每次都会<b> npm install </b>一次，造成我的项目文件夹中总是会有很多重复的<b> node_modules </b>,时间长了，这些无用且体积庞大的<b> node_modules </b>占用了我巨大的硬盘内存，所以我在node的环境中结合 <b style="color:green">rimraf </b>做了一个批次清理的插件。

### Installation
<p style="border-bottom: 1px solid #eaecef"></p>

```javascript
$ npm i -g npm
$ npm i ljyclear --save  
```
### repositories 
<p style="border-bottom: 1px solid #eaecef"></p>

<b>仓库地址 :</b>

<b>https://github.com/ljylhm/ljyTools.git</b>

<p style="font-weight:600">git@github.com:ljylhm/ljyTools.git</p>

### 使用说明
<p style="border-bottom: 1px solid #eaecef"></p>


<p><li><b>引入代码</b></li></p>

```javascript

   // 将包引入
   // 1. main是主函数 在主函数中结合了 findModules 和 clear函数
   // 2. findModules是寻找指定模块的函数
   // 3. clear函数是清除的函数 

   const { main, findModules, clear} = require("ljyclear");
```
<p style="color:red">============================================================<p>

<p><li><b>执行主函数的方法</b></li></p>

```javascript

   /**
    * @description 主函数
    * @param {String} path 路径
    * @param {String} target 目标路径
    * @param {Object} opts 配置
    * {
    *   filter { String | Array } 过滤条件 
    *   => 过滤的文件夹不会遍历下去 例如node_modules
    *   externals { Array }  数组中的内容不会被删除
    * }
    * @return {Void} 
    */
   main(path,target,opts)

   // 以下代码的意思是删除 D:\\我的项目2这个文件夹中所有的node_modules
   main("D:\\我的项目2", "node_modules", {
      filter: ["node_modules"],
      externals: ["test1 - 副本 (2)", "test1 - 副本 (3)"]
   })
``` 

<b>执行主函数的方法</b>
<img src="http://file.40017.cn/huochepiao/activity/MyPic/img/mainModules.png?181212160825" style="width:400px;height:400px">

<p style="color:red">============================================================<p>

<p><li><b>执行查找函数的方法</b></li></p>

```javascript
   /**
    * @description 查找函数
    * @param {String} path 路径
    * @param {String} target 目标路径
    * @param {Object} opts 配置
    * {
    *   filter { String | Array } 过滤条件 
    *   => 过滤的文件夹不会遍历下去 例如node_modules
    * }
    * @return {Array}
    */

   // 以下代码的意思是查找 D:\\我的项目2这个文件夹中所有的dist
   findModules("D:\\我的项目2", "dist", {
    filter: ["node_modules"],
    // externals: ["test1 - 副本 (2)", "test1 - 副本 (3)"]
   })
```
<p><b>执行查找函数的截图</b></p>

<img src="http://file.40017.cn/huochepiao/activity/MyPic/img/findModules.png?181212153731" style="width:400px;height:400px"> 

<p style="color:red">============================================================<p>

<li><b>执行清除函数的方法</b></li>

```javascript
   /**
    * @description 查找函数
    * @param {String} path 路径
    * @param {Array} externals 排除条件 
    * => 包含在其中文件夹不会被删除
    * @return {Void}
    */

   // 以下代码的意思是清除 
   // "D:\\testClear\\test1 "D:\\testClear\\test2" "D:\\testClear\\test3" 这三个文件夹 
   // 忽略文件夹名字中含有test2的文件夹
   clear(["D:\\testClear\\test1", "D:\\testClear\\test2", "D:\\testClear\\test3"], ["test2"])
```
<b>执行清除函数的截图</b>
<img src="http://file.40017.cn/huochepiao/activity/MyPic/img/clearModules.png?181212155333" >


































  




