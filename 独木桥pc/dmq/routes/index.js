var express = require('express');
var router = express.Router();
var async = require('async');
var fs = require('fs');
var querystring = require('querystring');
var common=require("../common_modules/common");

var cardimgUrl="../public/images/login/logo.png";
/* GET home page. */
router.get('/', function(req, res, next) {
  var newsItems=[{"url":"http://www.51dmq.com/news/news_1062.htm","title":"小编带你去看《三亚千古情》"},{"url":"http://www.51dmq.com/news/news_1121.htm","title":"第一世界大酒店：东南亚热带雨林酒店"},{"url":"http://www.51dmq.com/news/news_1011.htm","title":"宋城美食大盘点"},{"url":"http://www.51dmq.com/news/news_1040.htm","title":"千古情主题酒店:杭城最大的主题酒店群"}];
  var specialItems=[{"url":"http://central.51dmq.com/huojijie/huojijie.html",imgUrl:"/images/demo/9836D5FE0BE9440C97A940E519E3011C.jpg","title":"印第安火鸡节","subtitle":"原始风情陪伴你狂欢过年"},{"url":"https://www.51dmq.com/sc_lxdr.html",imgUrl:"/images/demo/a036c819-33be-4a3e-b008-b1ded7b0f162.jpg","title":"三亚夏威夷，狂欢草裙舞！","subtitle":"三亚夏威夷，狂欢草裙舞！"},{"url":"https://www.51dmq.com/details/ticket/5304",imgUrl:"/images/demo/54c84de2-b0b7-448b-9d0d-e229ce8bf24e.jpg","title":"看三亚千古情—","subtitle":"免费游三亚浪浪浪水公园了！"},{"url":"https://www.51dmq.com/yunmanwenquan.html",imgUrl:"/images/demo/003d6442-8af8-42ac-83a5-97bcd72d826a.jpg","title":"杭州宋城云曼温泉","subtitle":"都市热带雨林，温泉养生天堂。"},{"url":"https://www.51dmq.com/ticket/ticket_1045.html",imgUrl:"/images/demo/b8a95963-c99b-4897-831b-7a2cf6f6f252.jpg","title":"自由行","subtitle":"宋城旅游，给你不一样的享受！"},{"url":"https://51dmq.com/yunmanhotel.html",imgUrl:"/images/demo/eeb869af-9731-41df-b2b9-b5850f6759cb.jpg","title":"云和湖宋城云曼酒店","subtitle":"中国的马尔代夫"},{"url":"https://www.51dmq.com/songcheng.html",imgUrl:"/images/demo/90263eba-6904-4a65-bee5-c9dfdeed892f.jpg","title":"杭州宋城景区","subtitle":"给我一天，还你千年！"},{"url":"https://www.51dmq.com/lanpingguo.html",imgUrl:"/images/demo/70c2df36-4f11-4d3a-8f4f-9fab80c31c8b.jpg","title":"杭州宋城烂苹果乐园","subtitle":"亲子狂欢，相聚烂苹果乐园！"},{"url":"https://www.51dmq.com/siyuanhebi.html",imgUrl:"/images/demo/ce39b624-8eb5-411b-bb0e-6a175b8c134a.jpg","title":"三亚宋城旅游区","subtitle":"一生必看的演出"},{"url":"https://www.51dmq.com/lijiang.html",imgUrl:"/images/demo/6b79fe75-972f-4fec-a92b-687e3d6917f8.jpg","title":"丽江宋城旅游区","subtitle":"玩的就是穿越，成全你的穿越梦"},{"url":"https://51dmq.com/zangmi.html",imgUrl:"/images/demo/23fa18e3-c64e-45aa-b5b2-2ee94a29b09b.jpg","title":"《藏谜》","subtitle":"艺术大舞台，神秘藏文化"},{"url":"http://www.51dmq.com/qianguqinghotel.html",imgUrl:"/images/demo/7869a30c-ee95-4aec-8a22-b5cc3ca1a748.jpg","title":"杭州宋城千古情主题酒店（西湖店）","subtitle":"含九寨千古情楼、丽江千古情楼、三亚千古情楼"},{"url":"https://www.51dmq.com/details/hotel/5246",imgUrl:"/images/demo/6c71a5dc-94d4-4405-b79d-b41f15e7b6f9.jpg","title":"杭州宋城千古情主题酒店（湘湖店）","subtitle":"欧式家具、埃及风情"},{"url":"https://www.51dmq.com/thefirstworldhotel.html",imgUrl:"/images/demo/bbddd724-8175-4bc3-bc7f-35770e6529dc.jpg","title":"杭州乐园湘湖宋城景区","subtitle":"杭州乐园湘湖宋城景区例行休园，2017年3月8日欢乐重聚！"},{"url":"https://www.51dmq.com/jiuzhai.html",imgUrl:"/images/demo/f08361cd-2b30-4946-8629-d288460c5ac4.jpg","title":"九寨千古情","subtitle":"我在这等你！ 九寨宋城藏羌古城！"},{"url":"https://www.51dmq.com/ticket/ticket_1366.html",imgUrl:"/images/demo/74746e52-2dad-4c5b-a4c9-1b4d3b7d5c45.jpg","title":"泰山千古情","subtitle":"文化视觉盛宴，一生必看的演出"},{"url":"https://www.51dmq.com/1929.html",imgUrl:"/images/demo/b2ab1f5d-b7ef-4d74-a827-7829a3317280.jpg","title":"宋城龙泉山旅游区","subtitle":"登高悟人生"},{"url":"http://www.songcn.com/Show/index.aspx",imgUrl:"/images/demo/afff63f5-41f4-4717-bfeb-ef8e4cf1cc5e.jpg","title":"宋城中国演艺谷","subtitle":"让生活有戏！"}];
  var options={ title: '宋城旅游',newsItems:newsItems,specialItems:specialItems};
  common.viewPage("index",options,req,res);
});

router.get('/login',function(req, res, next){
  var url=common.getUrl("login","checkCode");
  var rs = fs.createWriteStream(cardimgUrl);
  common.needleGet(url,req,res,function(err,results){
    var options={ title: '宋城旅游',code:"../images/login/logo.png",error:req.flash('error').toString()};
    common.viewPage("login",options,req,res);
  },rs);
}).post('/login',function(req, res){
  var users={},url=common.getUrl("login","post");
  users.loginName=req.body.loginName;
  users.loginPass=req.body.password;
  users.checkCode=req.body.checkCode;
  common.needlePost(url,users,req,res,function(error,result){
    req.session.member=result.user;
    if(!req.session.curUrl){
      res.redirect("/user/order?currPage=1&orderType=ticket");
    }else{
      res.redirect(req.session.curUrl);
    }
  });
});

//ajax获取验证码
router.get("/checkCard",function(req,res){
  var url=common.getUrl("login","checkCode");
  var rs = fs.createWriteStream(cardimgUrl);
  async.parallel([function(callback){
    common.needleGet(url,req,res,callback,rs);
  }],function(err, results){
    res.json({code:"../images/login/logo.png?img="+Math.random()});
  });
});


// 注册
router.get('/register',function(req, res, next){
  var options={ title: '宋城旅游',error:req.flash('error').toString()};
  common.viewPage("register",options,req,res);
});

// 发送手机验证码
router.get('/mobileCode', function(req, res, next) {
  var query=req.query;
  console.log(query);
  if(query.flag=="reg"){
    var url = common.getUrl('register','checkCode') + '?mobile='+query.mobile;
    common.needleGet(url,req,res,function (err,results){
      console.log(results);
      res.json(results);
    },"ajax");
  }else{
    var url = common.getUrl('forgetPassword','mobile').checkCode + '?mobile='+query.mobile;
    common.needleGet(url,req,res,function (err,results){
      res.send(results);
    });
  }  
});

// 注册
router.post('/register',function(req, res, next){
  var url = common.getUrl('register','post');
  var data = req.body;

  common.needlePost(url,data,req,res,function (err,results){
    res.redirect('/login');
  });
});

//手机找回
router.get('/findByMobile',function(req, res, next){
  var options={ title: '宋城旅游',error:req.flash('error').toString()};
  common.viewPage("findByMobile",options,req,res);
}).post('/findByMobile',function (req, res, next) {
  var url=common.getUrl('forgetPassword','mobile').post,data={
    checkCode:req.body.mobileCode,
    mobile:req.body.access,
    loginPass:req.body.loginPass
  };
  common.needlePost(url,data,req,res,function (err,result) {
    req.session.member=result.user;
    res.redirect("/user/order?currPage=1&orderType=ticket");
  });
});

//邮箱找回
router.get('/findByEmail',function(req, res, next){
  var options={ title: '宋城旅游',error:req.flash('error').toString()};
  common.viewPage("findByEmail",options,req,res);
}).post('/findByEmail',function (req, res, next) {
  var url=common.getUrl('forgetPassword','email').post,data={
    checkCode:req.body.mobileCode,
    email:req.body.access,
    loginPass:req.body.loginPass
  };
  common.needlePost(url,data,req,res,function (err,result) {
    req.session.member=result.user;
    res.redirect("/user/order?currPage=1&orderType=ticket");
  });
});

router.get('/emailCode',function (req, res, next) {
  var query=req.query;
  var url = common.getUrl('forgetPassword','email').checkCode + '?email='+query.email;
  common.needleGet(url,req,res,function (rerr,results){
    res.send(results);
  });
});

// 注销
router.get('/logout', function(req, res, next) {
  var url = common.getUrl('login','logout');
  common.needleGet(url,req,res,function (rerr,esults){
    delete req.session.member;
    res.redirect('/login');
  });
  
});

// 帮助中心
router.get('/help/:page',function (req,res,next){
    var page = req.params.page;

    common.viewPage("help/" + page,{title: '独木桥旅游网',page: page},req,res);
});

// 帮助中心详情
router.get('/help/helpcenter/:qutype',function (req,res,next){
    var qutype = req.params.qutype;

    common.viewPage("help/helpcenter/" + qutype,{title: '独木桥旅游网',page: 'helpcenter'},req,res);
});

// 404
router.get("/nofound",function (req,res) {
    common.viewPage("nofound",{title: '404'},req,res);
});

//推广码
router.post('/spreadCode',function (req,res) {
    var url=common.getUrl("spreadCode","main");
    console.log(url);
    common.needlePost(url,{spreadCode:req.body.spreadCode},req,res,function (err,result) {
        res.json({"msg":"操作成功！"});
    });
});

//测试路由
router.get('/test',function (req,res) {
  var ticketItems=[{"imgUrl":"/images/demo/a5f88d48-f9f1-4d77-9359-18b178721f60.jpg","title":"杭州宋城浪浪浪水公园","desc":"杭州宋城浪浪浪水公园6月24日火热开园！","price":"105","id":""},{"imgUrl":"/images/demo/f89c06d7-c95d-4b0c-997a-4b4466b256d9.jpg","title":"杭州乐园湘湖宋城景区","desc":"杭州乐园湘湖宋城景区是将原湘湖宋城景区和杭州乐园合二为一，更大优惠更多体验！","price":"160","id":5301},{"imgUrl":"/images/demo/8ece6ca7-8444-4cfc-8b6f-13f123f5b68d.jpg","title":"三亚宋城旅游区","desc":"2016年，三亚宋城旅游区四大公园，三亚千古情景区，宋城浪浪浪水公园，宋城冰雪世界，宋城彩色动物园开园，优惠联票等你抢购","price":"250","id":5304},{"imgUrl":"/images/demo/72cf5991-f3b0-4fd8-9c84-131717cfad5a.jpg","title":"丽江宋城旅游区","desc":"大型歌舞《丽江千古情》，是一生必看的演出。","price":"260","id":""},{"imgUrl":"/images/demo/badbdc7d-1290-41c6-bc79-430ed7b39abd.jpg","title":"九寨宋城藏羌古城","desc":"九寨宋城藏羌古城是九寨沟唯一的主题公园，是一座活着的藏羌古城，是九寨的城市文化中心和夜游首选之地。","price":"260","id":5321},{"imgUrl":"/images/demo/55e649f1-ba81-486f-9c81-20428d599f53.jpg","title":"泰山千古情","desc":"大型歌舞《泰山千古情》是由宋城演艺打造的文化视觉盛宴，带给观众无与伦比的视觉体验和心灵震撼。","price":"200","id":""},{"imgUrl":"/images/demo/9629ef84-3037-4e3a-aad6-20f4e2ac2e51.jpg","title":"杭州宋城景区","desc":"杭州宋城景区是中国人气最旺的主题公园，秉承&quot;建筑为形，文化为魂&quot;的经营理念，《宋城千古情》创造了世界演艺史上的奇迹，是杭州宋城景区的灵魂，与拉斯维加斯的&quot;O&quot;秀、巴黎红磨坊并称&quot;世界三大名秀&quot;。","price":"280","id":5300},{"imgUrl":"/images/demo/b93b6084-9e1a-45f6-9791-688361e00701.jpg","title":"宋城中国演艺谷","desc":"","price":"80","id":""}];
    var hotelItems=[{"imgUrl":"/images/demo/da068877-c73a-4ea8-ba67-aa96ed3f4774.jpg","title":"杭州宋城千古情主题酒店（湘湖店）","desc":"杭州宋城千古情主题酒店（湘湖店）以埃及风情为主题，可眺望休博园的尼斯湖和海盗街，景观独特，拥有各式精致客房，其内象牙白的欧式家具、埃及风情的装饰，为客人营造出惬意而神秘的度假氛围。","price":"550","id":""},{"imgUrl":"/images/demo/811eb381-9cde-44ba-8e83-ffdda95049eb.jpg","title":"宋城龙泉山猎户山庄","desc":"宋城龙泉山猎户山庄座落于浙江丽水龙泉4A级景区——龙泉山景区内，海拔1500米，周边环境优美，是理想的避暑胜地。","price":"380","id":""}]
    var options={ title: '宋城旅游',ticketItems:ticketItems,hotelItems:hotelItems};
    common.viewPage("test",options,req,res);
});

//linux测试
router.get('/testjson',function (req,res) {
   var items=[];
   for(var i=0;i<100000;i++){
     var obj={
       name:"a"+i,
       num:i
     };
     items.push(obj);
   }
   res.json(items);
});

module.exports = router;
