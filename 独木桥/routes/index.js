var express = require('express');
var path = require('path');
var router = express.Router();
var async = require('async');
var fs = require('fs');
var moment = require('moment');
var common = require("../common_modules/common");

var cardimgUrl =path.resolve('../')+"/public/images/login/logo.png";

//测试
router.get('/test',function (req,res) {
    common.needlePost("http://192.168.70.89:10080",{"METHOD":"GetSeatAreaMain","PPerformDate":"2017-03-06","PSeatAreaCode":1067,"PPerformtime":"14:00"},req,res,function (err,result) {
        console.log(result);
    })
});

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.cookie('/WAP/user_server_cookie_uid', "", { maxAge: 0 });
    var indexUrl = common.getUrl("index", "list");
    var url01 = common.getUrl('ticket','list').page + '?sales=1';
    var url02 = common.getUrl('hotel','list').page + '?sales=1';
    var url03 = common.getUrl('line','list').page + '?sales=1';
    var url04 = common.getUrl('goods','list').page + '?sales=1';
    async.parallel([function (callback) {
        common.needleGet(indexUrl,req,res,callback);
    },function (callback) {
        common.needleGet(url01,req,res,callback);
    },function (callback) {
        common.needleGet(url02,req,res,callback);
    },function (callback) {
        common.needleGet(url03,req,res,callback);
    },function (callback) {
        common.needleGet(url04,req,res,callback);
    }],function (err,results) {
        var options = { title: '宋城旅游', items: results[0][0],ticketItems:results[1].data,hotelItems:results[2].datas,lineItems:results[3].datas,goodsItems:results[4].datas };
        common.viewPage("index", options, req, res);
    });
});

//注册页面
router.get("/register", function (req, res) {
  var options = { title: '注册', success: req.flash('success').toString(), error: req.flash('error').toString() };
  common.viewPage("register", options, req, res);
});

//注册页面获取验证码信息
router.post("/card", function (req, res) {
  var url = common.getUrl("register", "checkCode"), data = {};
  data.mobile = req.body.tel;
  common.needlePost(url, data, req, res, function (error, result) {
    if (result.flag == "error") {
      res.json({ "flag": result.flag, "msg": result.msg });
    } else {
      res.json({ "flag": result.flag, "checkCode": result.checkCode });
    }
  }, "ajax");
});

//注册页面提交
router.post("/register", function (req, res) {
  var url = common.getUrl("register", "post"), data = {};
  data.mobile = req.body.tel;
  data.mobileCode = req.body.cardcode;
  data.loginPass = req.body.password;
  common.needlePost(url, data, req, res, function (error, result) {
    req.session.logined = true;
    req.session.user = result.user;
    res.redirect('/user');
  });
});

//登录页面
router.get("/login", function (req, res) {
  var url = common.getUrl("login", "checkCode");
  var rs = fs.createWriteStream(cardimgUrl);
  common.needleGet(url, req, res, function (err, results) {
    var options = { title: '登录', code: "../images/login/logo.png", success: req.flash('success').toString(), error: req.flash('error').toString() };
    common.viewPage("login", options, req, res);
  }, rs);
});

//ajax获取验证码
router.get("/checkCard", function (req, res) {
  var url = common.getUrl("login", "checkCode");
  var rs = fs.createWriteStream(cardimgUrl);
  async.parallel([function (callback) {
    common.needleGet(url, req, res, callback, rs);
  }], function (err, results) {
    res.json({ code: "../images/login/logo.png?img=" + Math.random() });
  });
});

//登录提交
router.post('/login', function (req, res) {
  var users = {}, url = common.getUrl("login", "post");
  users.loginName = req.body.tel;
  users.loginPass = req.body.loginpassword;
  users.checkCode = req.body.checkCode;
  common.needlePost(url, users, req, res, function (error, result) {
    req.session.logined = true;
    req.session.user = result.user;
    if (!req.session.curUrl) {
      res.redirect("/user");
    } else {
      res.redirect(req.session.curUrl);
    }
  });
});

//快捷登录
router.get('/quickLogin', function (req, res) {
  var options = { title: '快捷登录', error: req.flash('error').toString() };
  common.viewPage("quickLogin", options, req, res);
}).post('/quickLogin', function (req, res) {
  var url = common.getUrl("login", "qpost");
  common.needlePost(url, req.body, req, res, function (err, result) {
    req.session.logined = true;
    req.session.user = result.user;
    if (!req.session.curUrl) {
      res.redirect("/user");
    } else {
      res.redirect(req.session.curUrl);
    }
  })
});

//快捷登录验证码获取
router.post('/qgetCheckCode', function (req, res) {
  var url = common.getUrl("login", "qcheckCode");
  common.needlePost(url, { mobile: req.body.mobile }, req, res, function (err, result) {
    if (result.flag == "error") {
      res.json({ "flag": result.flag, "msg": result.msg });
    } else {
      res.json({ "flag": result.flag, "checkCode": result.checkCode });
    }
  }, "ajax");
});

//忘记密码页面
router.get("/forgetPassword", function (req, res) {
  var options = { title: '忘记密码', success: req.flash('success').toString(), error: req.flash('error').toString() };
  common.viewPage("forgetPassword", options, req, res);
});

//忘记密码验证码获取
router.post("/passwordcard", function (req, res) {
  var url = common.getUrl("forgetPassword", "checkCode"), data = {};
  data.mobile = req.body.tel;
  common.needlePost(url, data, req, res, function (error, result) {
    if (result.flag == "error") {
      res.json({ "flag": result.flag, "msg": result.msg });
    } else {
      res.json({ "flag": result.flag, "checkCode": result.checkCode });
    }
  });
});

//忘记密码页面提交
router.post("/forgetPassword", function (req, res) {
  var url = common.getUrl("forgetPassword", "post"), data = {};
  data.mobile = req.body.tel;
  data.checkCode = req.body.cardcode;
  data.loginPass = req.body.password;
  common.needlePost(url, data, req, res, function (error, result) {
    res.redirect('/login');
  });
});

router.get('/map', function (req, res) {
  var options = { title: '地图定位' };
  common.viewPage("map", options, req, res);
});

router.get('/error', function (req, res) {
  var options = { title: '错误页面' };
  common.viewPage("error", options, req, res);
});

router.get('/logout', function (req, res) {
  var logouturl = common.getUrl("login", "logout");
  async.parallel([function (callback) {
    common.needleGet(logouturl, req, res, callback);
  }], function (err, results) {
    req.session.logined = false;
    req.session.user = {};
    res.redirect('/login');
  });
});

router.get("/calendar/:mold", function (req, res) {
    // if(req.params.mold=="score"){
    //     var mold=req.query.mold, calendarUrl=common.getUrl(mold,"order").getpro+"?modelCode="+req.query.code;
    //     common.needleGet(calendarUrl,req,res,function (err,result) {
    //         if(result.flag=="success"){
    //             var stockPriceMap=result.datas.stockPriceMap;
    //             for(var i=0,len=stockPriceMap.length;i<len;i++){
    //                 delete stockPriceMap[i].price;
    //             }
    //             res.json(stockPriceMap);
    //         }else{
    //             res.json([]);
    //         }
    //     },"ajax");
    // }else{
    //     res.json(req.session.stockPriceMap);
    // }
 res.json(req.session.stockPriceMap);

});

//"info":"http://scshow.sendinfo.com.cn/wap/show/querySeatInfo.htm",
router.get("/seats",function (req,res) {
    var query=req.query;
    var b = new Buffer(query.orderNo, 'base64');
    var s = b.toString();
    var areaUrl=common.getUrl("seats","area")+"?orderCode="+s,orderInfo={};
    if(!query.seatCode){
        res.redirect('/seatArea?orderNo='+query.orderNo);
    }
    req.session.seatCode=query.seatCode;
    common.needleGet(areaUrl, req, res, function (err,result) {
        var showOrderList=result.datas.showOrderList;
        orderInfo=showOrderList;
        if(result.datas.isRefund){
            res.redirect('/seats/seatWarning?flag=0');
        }else if(result.datas.isToday){
            res.redirect('/seats/seatInfo');
        }else{
            var flag=false;
            for(var n=0,nlen=showOrderList.length;n<nlen;n++){
                if(typeof showOrderList[n].seatInfo=="undefined"){
                    flag=true;
                }
            }
            if(flag){
                var seatData=[],funArray=[];
                showOrderList.map(function (value, index) {
                    var seatitem={
                        syncUrl:showOrderList[index].syncUrl,
                        theaterId:showOrderList[index].theaterId,
                        syncParame:{
                            "PPerformDate":moment(showOrderList[index].travelDate).format('YYYY-MM-DD'),
                            "PSeatAreaCode":showOrderList[index].areaCode,
                            "PPerformtime":showOrderList[index].showSessionTime
                        }
                    };
                    seatData.push(seatitem);
                    var fun=function (callback) {
                        var infoUrl=showOrderList[index].syncUrl,seatParame={
                            "PPerformDate":moment(showOrderList[index].travelDate).format('YYYY-MM-DD'),
                            "PSeatAreaCode":showOrderList[index].areaCode,
                            "PPerformtime":showOrderList[index].showSessionTime
                        };
                        seatParame.METHOD="GetSeatAreaMain";
                        common.needlePost(infoUrl, seatParame, req, res, callback, "ajax");
                    };
                    funArray.push(fun);
                });
                async.series(funArray,function (err,results) {
                    req.session.seatData=seatData;
                    var options = { title: '选座' ,orderInfo:showOrderList,areaInfo:results,error: req.flash('error').toString(),mold:"seat"};
                    common.viewPage("seats", options, req, res);
                });
            }else{
                var seatinfo=[];
                for(var j=0;j<showOrderList.length;j++){
                    var obj=showOrderList[j].seatInfo.split("#"),seatName=showOrderList[j].seatName.split("#");
                    var seatItem={
                        travelDate:moment(showOrderList[j].travelDate).format('YYYY-MM-DD'),
                        showSessionTime:showOrderList[j].showSessionTime,
                        seatName:[],
                        seats:[]
                    };
                    for(var i=0,len=obj.length;i<len;i++){
                        var seat={};
                        seat.row=obj[i].split(",")[0];
                        seat.col=obj[i].split(",")[1];
                        seatItem.seats.push(seat);
                        seatItem.seatName.push(seatName[i]);
                    }
                    seatinfo.push(seatItem);
                }
                req.session.seatinfo=seatinfo;
                res.redirect('/seats/seatResult');
            }
        }
    });
}).post('/seats',function (req,res) {
    var postUrl=common.getUrl("seats","post");
    common.needlePost(postUrl,req.body,req,res,function (err,results) {
        var seatinfo=[];
        for(var j=0;j<results.datas.returnShowList.length;j++){
            var obj=results.datas.returnShowList[j].seatInfo.split("#"),seatName=results.datas.returnShowList[j].seatName.split("#");
            var seatItem={
                travelDate:results.datas.returnShowList[j].travelDateStr,
                showSessionTime:results.datas.returnShowList[j].showSessionTime,
                seatName:[],
                seats:[]
            };
            for(var i=0,len=obj.length;i<len;i++){
                var seat={};
                seat.row=obj[i].split(",")[0];
                seat.col=obj[i].split(",")[1];
                seatItem.seats.push(seat);
                seatItem.seatName.push(seatName[i]);
            }
            seatinfo.push(seatItem);
        }
        req.session.seatinfo=seatinfo;
        res.redirect('/seats/seatResult');
    });
});

router.get('/seats/seatBooking',function (req,res) {
    var query=req.query,infoUrl=req.session.seatData[0].syncUrl;
    var seatData={
        METHOD:"GetSeatAreaDetail",
        PPerformDate:query.travelDate,
        PSeatAreaCode:query.areaCode,
        PPerformtime:query.showSessionTime,
        PSeatNameCode:req.session.seatCode
    };
        common.needlePost(infoUrl,seatData,req,res,function (err,result) {
            // var seatJson={},seatInfo=JSON.parse(result.datas.seatInfo.replace(/'/g, '"')).DATA,seatLength=seatInfo.length;
            // seatJson.DATA=seatInfo.splice(index*500,500);
            res.json({"msg":"数据获取成功！","flag":"success",datas:result.DATA});
        },"ajax");
});

router.get('/seats/seatResult',function (req,res) {
    console.log(req.session.seatinfo);
    var options={title: '选座结果',seatInfo:req.session.seatinfo,mold:"seat"};
    common.viewPage("seatResult", options, req, res);
});

router.get('/seats/seatWarning',function (req,res) {
    var options={title: '选座结果',mold:"seat",flag:req.query.flag};
    common.viewPage("seatWaring", options, req, res);
});

router.get('/seats/seatInfo',function (req,res) {
    var options={title: '选座结果',mold:"seat"};
    common.viewPage("seatInfo", options, req, res);
});

router.get('/getcoupon',function (req,res) {
    var url=common.getUrl("user","coupon").getcoupon+"?id="+req.query.id;
    common.needleGet(url,req,res,function (err,result) {
        var options={title: '领取优惠券',mold:"coupon",item:result.datas,user:req.session.user,error: req.flash('error').toString()};
        common.viewPage("getcoupon", options, req, res);
    });
}).post('/getcoupon',function (req,res) {
    var url=common.getUrl("user","coupon").post+"?id="+req.query.id;
    common.needlePost(url,{},req,res,function (err,result) {
        var couponinfo=result.datas;
        couponinfo.id=req.query.id;
        req.session.couponinfo=couponinfo;
        res.redirect("/couponinfo");
    });
});

router.get('/couponinfo',function (req,res) {
    var options={title: '领取优惠券',mold:"coupon",item:req.session.couponinfo};
    common.viewPage("couponinfo", options, req, res);
});

//推广码
router.post('/spreadCode',function (req,res) {
    var url=common.getUrl("spreadCode","main");
    common.needlePost(url,{spreadCode:req.body.spreadCode},req,res,function (err,result) {
        res.json({"msg":"操作成功！"});
    });
});

router.get('/seatArea',function(req,res){
    var query=req.query;
    var b = new Buffer(query.orderNo, 'base64');
    var s = b.toString();
    var areaUrl=common.getUrl("seats","area")+"?orderCode="+s;
    common.needleGet(areaUrl, req, res, function (err,result) {
        if(result.datas.isRefund){
            res.redirect('/seats/seatWarning?flag=0');
        }else if(result.datas.isToday){
            res.redirect('/seats/seatInfo');
        }else{
            var flag=false,showOrderList=result.datas.showOrderList;
            for(var n=0,nlen=showOrderList.length;n<nlen;n++){
                if(typeof showOrderList[n].seatInfo=="undefined"){
                    flag=true;
                }
            }
            if(flag) {
                var options = {
                    title: '剧院区域',
                    mold: "seat",
                    orderNo: query.orderNo,
                    theaterId: result.datas.showOrderList[0].theaterId,
                    areaCode: result.datas.showOrderList[0].areaCode
                };
                common.viewPage("seatArea", options, req, res);
            }else{
                var seatinfo=[];
                for(var j=0;j<showOrderList.length;j++){
                    var obj=showOrderList[j].seatInfo.split("#"),seatName=showOrderList[j].seatName.split("#");
                    var seatItem={
                        travelDate:showOrderList[j].travelDateStr,
                        showSessionTime:showOrderList[j].showSessionTime,
                        seatName:[],
                        seats:[]
                    };
                    for(var i=0,len=obj.length;i<len;i++){
                        var seat={};
                        seat.row=obj[i].split(",")[0];
                        seat.col=obj[i].split(",")[1];
                        seatItem.seats.push(seat);
                        seatItem.seatName.push(seatName[i]);
                    }
                    seatinfo.push(seatItem);
                }
                req.session.seatinfo=seatinfo;
                res.redirect('/seats/seatResult');
            }
        }
    });
});

module.exports = router;
