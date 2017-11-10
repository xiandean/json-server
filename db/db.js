const Mock = require('mockjs');
const Random = Mock.Random;
// var data = { 
//   news: [],
//   type: [{
//     id: 0,
//     a:"a"
//   },{
//     id: 1,
//     b:"b"
//   }]
// };
// var images = [1,2,3].map(x=>Random.image('200x100', Random.color(), Random.word(2,6)));
// for (var i = 0; i < 10; i++) {
//   var content = Random.cparagraph(0,10);
//   data.news.push({
//     "id": i,
//     "title": Random.cword(8,20),
//     "desc": content.substr(0,40),
//     "tag": Random.cword(2,6),
//     "views": Random.integer(100,5000),
//     "images": images.slice(0,Random.integer(1,3))
//   })
// }
const data = Mock.mock({
    'sliders|3-5': [{
        'id|+1': 1,
        'img': '@image(350x100, @color, @word)',
        'url': '#'
    }],
    'products|6': [{
        "id|+1": 1,
        "src": "@image(500x500, @color, image)",
        "url": "detail/",
        "title|8-20": "@cword",
        "newPrice": "￥@integer(100, 5000)",
        "oldPrice": "￥@integer(100, 5000)"
    }],
    'news|5-10': [{
        'id|+1': 1,
        'title|8-20': '@cword',
        'desc|0-10': '@cparagraph',
        'views': '@integer(100, 5000)',
        'images': '@image(200x100, @color, @word)',
        'productId|+1': 1
    }]
});
  
module.exports = data;
