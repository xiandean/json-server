http://www.jianshu.com/p/5bb86a770e23?winzoom=1
一、json-server介绍及安装

1、介绍

json-server是一个超级实用的服务器。写少量数据即可使用，而且功能足够强大，支持CORS和JSONP跨域请求，支持GET, POST, PUT, PATCH 和 DELETE 方法，更提供了一系列的查询方法，如limit，order等。
2、安装

1） 新建一个项目 mkdir json-server-demo && cd json-server-demo；
2） 初始化项目，npm init生成package.json文件；
3） 安装所需模块

npm install json-server --save-dev  //安装json-server服务
npm install nodemon --save-dev  //安装nodemon，修改配置无需重启服务
npm install mockjs --save-dev  //安装批量生成数据
3、在package.json中配置脚本

说明：本文将讲解两种方式；其一是静态数据（db.json文件），其二是动态数据（通过mockjs生成）

"scripts": {
    "server": "cd static && nodemon server.js",
    "dserver": "cd dynamic && nodemon server.js"
  }
4、目录结构

|--dynamic  //动态数据方式
    |--config.js   //配置文件
    |--db.js  //动态数据文件
    |--routes.js  //路由规则
    |--server.js  //服务文件
|--static  //静态数据方式
    |--config.js  //配置文件
    |--db.json   //静态数据文件
    |--server.js  //服务文件
|--node_modules //安装依赖包
package.json  //配置文件
二、使用静态数据

1）config.js文件内容——配置端口等

module.exports = {
  SERVER:"127.0.0.1",  
  //定义端口号
  PORT: 3003,
  //定义数据文件
  DB_FILE:"db.json"
};
2）db.json——静态数据文件

{
  "list":[
      {
        "id": 1,
        "name": "张三",
        "tel": "15223810923"
      },
      {
        "id": 2,
        "name": "李四",
        "tel": "15223810923"
      },
      {
        "id": 3,
        "name": "王二",
        "tel": "15223810923"
      }
    ],
  "list2": [
    {
      "name": "abcde",
      "tel": "123454323",
      "id": 5
    },
    {
      "id": 4,
      "name": "你好2121",
      "tel": "15223810923"
    }
  ]
}
3）server.js——服务文件

const path = require('path');
const config = require('./config');
const jsonServer = require('json-server');

const ip = config.SERVER;
const port = config.PORT;
const db_file = config.DB_FILE;

const server = jsonServer.create();
//根据db.json文件自动生成路由规则
const router = jsonServer.router(path.join(__dirname, config.DB_FILE));
//中间件
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);
//设置增加一个响应头信息“从server到前端”
server.use((req, res, next) => {
 res.header('X-Hello', 'World');
 next();
})
//数据发送到前端之前包一层
router.render = (req, res) => {
    res.jsonp({
        code: 0,
        body: res.locals.data//res.locals.data这个是真正的数据
    })
}
server.use("/api",router);//模拟api接口，就是访问api的时候给制定路由规则

server.use(router);
server.listen({
    host: ip,
    port: port,
}, function() {
    console.log(JSON.stringify(jsonServer));
    console.log(`JSON Server is running in http://${ip}:${port}`);
});
4）启动服务

npm run server
打开浏览器，在地址栏中输入http://localhost:3003/，出现如下图页面代表成功：


5）数据操作——增删改

这里我们会用到chrome浏览器一个插件github地址，可以进行发送请求。——这个插件很有用

a. 查询列表

http://localhost:3003/list  | GET  | 请求消息列表

b. 其他接口

说明：下面就不一一截图了。

请求接口    请求方式    请求说明
http://localhost:3003/list/2    GET 查询id为2的数据
http://localhost:3003/list?tel=15223810923  GET 查询tel为15223810923的数据
http://localhost:3003/list?id=2&tel=15223810923 GET 查询id位2并且tel为15223810923的数据
http://localhost:3003/list?_page=1&_limit=2 GET 查询第一页的两条数据
http://localhost:3003/list 数据是{"title": "111","desc": "222","tag": "常是价六","views": 4178}    POST    添加一条数据
http://localhost:3003/list/6    DELECT  删除id为6的数据
ps:其他更多的就不在详述了

三、使用动态数据

1） db.js ——批量生产数据文件

//引入mockjs文件
let Mock  = require('mockjs');
let Random = Mock.Random;
module.exports = function() {
  var data = { 
      news: [],//定义接口名称为news
      type:{
        a:"a",
        b:"b"
      }
  };
  var images = [1,2,3].map(x=>Random.image('200x100', Random.color(), Random.word(2,6)));
//动态生成10条新闻数据
  for (var i = 0; i < 10; i++) {
    var content = Random.cparagraph(0,10);
    data.news.push({
         "id": i,
        "title": Random.cword(8,20),
        "desc": content.substr(0,40),
        "tag": Random.cword(2,6),
        "views": Random.integer(100,5000),
        "images": images.slice(0,Random.integer(1,3))
    })
  }

  return data
}
2） routes.js ——动态路由规则

//自己定义一个动态路由规则
module.exports= {
    "/api/": "/",
    "/:id": "/news/:id",
    "/news/:id/show": "/news/:id",
    "/topics/:id/show": "/news/:id"
}
3） server.js——服务模块

const path = require('path');
const config = require('./config');
const jsonServer = require('json-server');
const rules = require('./routes');
const dbfile = require(config.DB_FILE);

const ip = config.SERVER;
const port = config.PORT;
const db_file = config.DB_FILE;

const server = jsonServer.create();
const router = jsonServer.router(dbfile());
const middlewares = jsonServer.defaults();

//console.log(dbfile())
//console.log(rules);

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.use((req, res, next) => {
 res.header('X-Hello', 'World');
 next();
})

router.render = (req, res) => {
    res.jsonp({
        code: 0,
        body: res.locals.data
    })
}

server.use("/api",router);
server.use(jsonServer.rewriter(rules));
server.use(router);

server.listen({
    host: ip,
    port: port,
}, function() {
    console.log(JSON.stringify(jsonServer));
    console.log(`JSON Server is running in http://${ip}:${port}`);
});
