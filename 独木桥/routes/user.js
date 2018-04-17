var express = require('express');
var router = express.Router();
var async = require('async');
var multer = require('multer');
var fs = require('fs');
var common=require("../common_modules/common");
var qn = require('qn');
var upload = require('./upload/multerUtil');
var config = require('./upload/config').qiniu_config;
var serverURL = require('./upload/config').serverUrl;

var droploadUrl="",orderId="";
/* GET users listing. */
router.get('/', function(req, res) {
  var url=common.getUrl("user","member"),rightsUrl=common.getUrl("user","lengal"),couponUrl=common.getUrl("user","coupon").mycoupon+"?useFlag=1";
  //console.log(req.headers.cookie);
  async.series([function(callback){
    common.needleGet(url,req,res,callback);
  },function(callback){
      common.needleGet(rightsUrl,req,res,callback);
  },function(callback){
      common.needleGet(couponUrl,req,res,callback);
  }],function(err, results){
    var result=results[0];
    if(result.flag){
        req.session.usersdata=result.user;
        var options={title:'个人中心',users:result.user,mold:"user",rightItems:results[1].datas,couponItems:results[2].datas};
        common.viewPage("user",options,req,res);
    }else{
      res.redirect("/quickLogin");
    }
  });
});

//我的订单列表
router.get('/myorder/:mold', function(req, res) {
  var mold=req.params.mold=="all"?"":req.params.mold, searchUrl=common.getUrl("user","list").search,listurl=common.getUrl("user","list").page+"?orderStatus="+mold;
  if(mold=="210"){
      listurl=common.getUrl("user","list").page+"?refundStatus=1";
  }
  droploadUrl=listurl;
  async.series([function(callback){
    common.needleGet(listurl,req,res,callback);
  }],function(err, results){
    var result=results[0];
    var options={title:'订单中心',items:result.datas,mold:mold,flag:req.query.flag};
    common.viewPage("myorder",options,req,res);
  });
});

router.get('/scoreorder',function (req,res) {
    var scoreUrl=common.getUrl("score","orderList");
    droploadUrl=scoreUrl;
    common.needleGet(scoreUrl,req,res,function (err,result) {
        var options={title:'订单中心',items:result.datas};
        common.viewPage("scoreorder",options,req,res);
    });
});

router.get('/order/dropload',function(req,res){
  var query=req.query;
  for(var key in query){
    droploadUrl=common.changeURLPar(droploadUrl,key,query[key]);
  }
  async.series([function(callback){
    common.needleGet(droploadUrl,req,res,callback);
  }],function(err, results){
    if(results[0].flag=="success"&&results[0].datas.items.length>0){
      res.json(results[0]);
    }else{
      res.json({"flag":"error","msg":"暂无数据！"});
    }
  });
});

//我的订单--订单详情
router.get("/myorderDetails/:mold/:id",function(req,res){
  var id=req.params.id,mold=req.params.mold, detaisUrl=common.getUrl("user","details")+"?orderId="+id,goodsUrl=common.getUrl("goods","orderDetails").getpro+"?orderId="+id,iscomment=common.getUrl("user","comment").isshow+"?orderId="+id,seatsUrl=common.getUrl("seats","isshow")+"?orderId="+id,seatDetailsUrl=common.getUrl("seats","orderDetail")+"?orderId="+id;
  var funArray=[function(callback){
    common.needleGet(detaisUrl,req,res,callback);
  },function(callback){
      common.needleGet(seatDetailsUrl,req,res,callback);
  }];
  if(mold=="goods"){
    funArray.push(function(callback){
      common.needleGet(goodsUrl,req,res,callback);
    });
  }
  async.parallel(funArray,function(err, results){
      var result1=results[0],seatsinfo=[];
    mold=mold=="zyx"?"line":mold;
      req.session.orderId=id;
      if(results[1].datas.returnShowList.length>0&&results[1].datas.returnShowList[0].seatInfo){
      for(var j=0;j<results[1].datas.returnShowList.length;j++){
          var result2=results[1].datas.returnShowList[j].seatInfo.split("#"),seatName=results[1].datas.returnShowList[j].seatName.split("#");
          for(var i=0,len=result2.length;i<len;i++){
              seatsinfo.push({
                  ticketName:results[1].datas.returnShowList[j].ticketName,
                  seatInfo:result2[i],
                  seatName:seatName[i]
              });
          }
      }
      }
    var refundStatus=result1.datas.refundStatus;
  var sendFlag=result1.datas.sendFlag;
    common.needleGet(seatsUrl,req,res,function (err,r) {
        if(typeof r.datas.orderNo!="undefined"){
            var b=new Buffer(r.datas.orderNo);
            var s = b.toString('base64');
            r.datas.orderNo=s;
        }
        common.needleGet(iscomment,req,res,function (err,rest) {
            if(refundStatus=="1"){
                var refundUrl=common.getUrl("user","refund").get+"?orderId="+id;
                common.needleGet(refundUrl,req,res,function(err,result){
                    if(result1.datas.qrCode.length>0&&sendFlag||typeof sendFlag=="undefined"){
                        var rs = fs.createWriteStream("../public/images/common/qrCode.png");
                        common.needleGet(result1.datas.qrCode[0].url, req, res, function (err, reimg) {
                            var options={title:'订单详情',mold:mold,orders:result1.datas,retreatNum:result.datas.retreatNum,iscomment:rest.data,error:req.flash('error').toString(),qrCodeimg:"http://"+req.host+"/images/common/qrCode.png",isshow:r.datas,seatsinfo:seatsinfo,isshowseat:results[1].datas.isShowSeat};
                            if(results[2]){
                                options.orders.goodsItem=results[2].datas;
                            }
                            common.viewPage("orderDetails",options,req,res);
                        }, rs);
                    }else{
                        var options={title:'订单详情',mold:mold,orders:result1.datas,retreatNum:result.datas.retreatNum,iscomment:rest.data,error:req.flash('error').toString(),qrCodeimg:false,isshow:r.datas,seatsinfo:seatsinfo,isshowseat:results[1].datas.isShowSeat};
                        if(results[2]){
                            options.orders.goodsItem=results[2].datas;
                        }
                        common.viewPage("orderDetails",options,req,res);
                    }
                });
            }else{
                if(result1.datas.qrCode.length>0&&sendFlag||typeof sendFlag=="undefined") {
                    var rs = fs.createWriteStream("../public/images/common/qrCode.png");
                    common.needleGet(result1.datas.qrCode[0].url, req, res, function (err, reimg) {
                        var options = {
                            title: '订单详情',
                            mold: mold,
                            orders: result1.datas,
                            iscomment: rest.data,
                            qrCodeimg: "http://" + req.host + "/images/common/qrCode.png",
                            isshow:r.datas,
                            seatsinfo:seatsinfo,
                            isshowseat:results[1].datas.isShowSeat
                        };
                        if (results[2]) {
                            options.orders.goodsItem = results[2].datas;
                        }
                        common.viewPage("orderDetails", options, req, res);
                    }, rs);
                }else{
                    var options = {
                        title: '订单详情',
                        mold: mold,
                        orders: result1.datas,
                        iscomment: rest.data,
                        qrCodeimg: false,
                        isshow:r.datas,
                        seatsinfo:seatsinfo,
                        isshowseat:results[1].datas.isShowSeat
                    };
                    if (results[2]) {
                        options.orders.goodsItem = results[2].datas;
                    }
                    common.viewPage("orderDetails", options, req, res);
                }
            }
        });
    });
  });
});

//取消订单
router.get('/cancelOrder',function (req,res) {
    var url=common.getUrl("user","cancelOrder")+"?id="+req.query.id;
    common.needleGet(url,req,res,function (err,result) {
        if(result.flag=="success"){
            res.json(result);
        }else{
            res.json({"msg":"订单取消失败！","flag":"error"});
        }
    },"ajax");
});

router.get('/scoreorderDetails/:id',function (req,res) {
    var id=req.params.id,url=common.getUrl("score","orderDetail")+"?id="+id;
    common.needleGet(url,req,res,function (err,result) {
        var options={title:'积分订单详情',mold:"score",orders:result.datas};
        common.viewPage("orderDetails", options, req, res);
    })
});

//订单详细页面 提交评论及提交退款申请
router.post('/myorderDetails/:mold/:id',function(req,res){
  var id=req.params.id,mold=req.params.mold,query=req.query,formdata={},posturl="";
  switch (query.status){
    case "comment":
      posturl=common.getUrl("user","comment").post;
      formdata.starNum=req.body.score;
      formdata.content=req.body.content;
      break;
    case "refund":
      posturl=common.getUrl("user","refund").post;
      formdata.refundNum=req.body.number;
      break;
  }
  formdata.orderId=id;
  common.needlePost(posturl,formdata,req,res,function(error,result){
    switch (query.status){
      case "comment":
        res.redirect('/user/myorderDetails/'+mold+'/'+id);
            break;
      case "refund":
        res.redirect('/user/myorderDetails/'+mold+'/'+id);
            break;
    }

  });
});

//个人中心页面
router.get("/member",function(req,res){
  var url=common.getUrl("user","member");
  async.parallel([function(callback){
    common.needleGet(url,req,res,callback);
  }],function(err, results){
    var result=results[0];
      req.session.user=result.user;
    var options={title:'个人中心',users:result.user,finishNum:req.session.finishNum};
    common.viewPage("member",options,req,res);
  });
});

//积分明细
router.get("/scoreDetails",function (req,res) {
    var url=common.getUrl("user","integralDetail");
    common.needleGet(url,req,res,function (err,result) {
        var options={title:'积分明细',items:result.datas};
        common.viewPage("scoreDetails",options,req,res);
    });
});
//积分明细翻页
router.get("/scoreDetails/dropload",function (req,res) {
    var url=common.getUrl("user","integralDetail") + '?currPage=' + req.query.currPage;
    common.needleGet(url,req,res,function (err,result) {
        if (result.datas.currentPage > result.datas.totalPage){
            result ={flag: 'error'}
        }
        res.json(result);
    });
});


//会员权益
router.get("/userRights",function (req,res) {
    var userUrl=common.getUrl("user","member"),rightsUrl=common.getUrl("user","lengal");
    async.parallel([function(callback){
        common.needleGet(userUrl,req,res,callback);
    },function(callback){
        common.needleGet(rightsUrl,req,res,callback);
    }],function (err, results) {
        var options={title:'会员权益',users:results[0].user,items:results[1].datas};
        common.viewPage("userRights",options,req,res);
    });
});

//会员权益详情
router.get("/userRights/details",function (req,res) {
    var query=req.query.mold;
    var options={title:'会员权益详情',mold:query};
    common.viewPage("userRightDetails",options,req,res);
});

//会员权益书吧
router.get("/userRights/book",function (req,res) {
    var query=req.query.mold;
    var options={title:'会员书吧',mold:query};
    common.viewPage("book",options,req,res);
});

//会员申请
router.post("/grade",function (req,res) {
    var userUrl=common.getUrl("score","grade");
    common.needleGet(userUrl,req,res,function (err,result) {
        res.json(result);
    },"ajax");
});

//积分任务
router.get("/task",function (req,res) {
    var url=common.getUrl("user","task");
    common.needleGet(url,req,res,function (err,result) {
        for(var i=0;i<result.datas.memberTask.length;i++){
            if(result.datas.memberTask[i].taskType=="2"){
                req.session.finishNum=result.datas.memberTask[i].finishNum;
            }
        }
        var options={title:'积分任务',items:result.datas};
        common.viewPage("task",options,req,res);
    });
});

//抽将转盘
router.get("/turntable/:id",function (req,res) {
    var url=common.getUrl("user","turntable").get+"?activityId="+req.params.id;
    common.needleGet(url,req,res,function (err,result) {
        var user=req.session.user;
        req.session.prize=result.datas.dialProduct;
        var options={title:'抽奖转盘',items:result.datas,id:req.params.id,user:user};
        common.viewPage("turntable",options,req,res);
    });
}).post("/turntable/:id",function (req,res) {
    var url=common.getUrl("user","turntable").post+"?activityId="+req.params.id;
    common.needlePost(url,{},req,res,function (err,result) {
        if(result.flag=="success"){
            var prize=req.session.prize;
            for(var i=0,len=prize.length;i<len;i++){
                if(prize[i].id==result.datas.dialProduct.id){
                    res.json({"msg":"成功!","flag":"success","datas":{"index":i,"text":prize[i].productName,"productType":prize[i].productType}});
                    return false;
                }
            }
        }else{
            res.json(result);
        }
    },"ajax");
});

//奖品列表
router.get("/prizelist",function (req,res){
    var prizeurl=common.getUrl("user","turntable").list;
    common.needleGet(prizeurl,req,res,function (err,result) {
        var options={title:'奖品列表',items:result.datas};
        common.viewPage("prizelist",options,req,res);
    });
});

//优惠券列表--个人中心
router.get("/mycoupon",function (req,res) {
    var couponUrl=common.getUrl("user","coupon").mycoupon+"?useFlag="+req.query.useflag;
    common.needleGet(couponUrl,req,res,function (err,result) {
        var options={title:'我的优惠券',items:result.datas,useFlag:req.query.useflag};
        common.viewPage("mycoupon",options,req,res);
    })
});

//优惠券列表翻页
router.get("/coupon/dropload",function (req,res) {
    var url=common.getUrl("user","coupon").mycoupon + '?currPage=' + req.query.currPage+"&useFlag="+req.query.useflag;
    common.needleGet(url,req,res,function (err,result) {
        if (result.datas.currentPage > result.datas.totalPage){
            result ={flag: 'error'}
        }
        res.json(result);
    });
});

//可用优惠券列表--表单页面
router.get('/couponlist',function (req,res) {
    var url=common.getUrl("user","coupon").usecouponlist,query=req.query;
    if(req.session.logined){
        query.mobile=req.session.user.mobile;
    }
    for(var key in query){
        url=common.changeURLPar(url,key,query[key]);
    }
    common.needleGet(url,req,res,function (err,result) {
        res.json(result);
    },"ajax");
});

//绑定身份证
router.post("/idCard",function(req,res){
  var posturl=common.getUrl("user","bindIdCard"),getScore=common.getUrl("user","getScore");
    async.waterfall([function(callback){
        common.needlePost(posturl,req.body,req,res,function (err,result) {
            callback(null,result);
        },"ajax");
    },function(resultcard,callback){
        if(resultcard.flag=="error"){
            callback(null,resultcard);
        }else{
            common.needlePost(getScore,{},req,res,function (err,result) {
                if(result.flag=="error"){
                    callback(null,result);
                }else{
                    callback(null,resultcard);
                }
            },"ajax");
        }
    }],function (err,results) {
        if(results.flag=="error"){
            res.json({"flag":results.flag,"msg":results.msg});
        }else{
            req.session.user.idCardBundFlag=1;
            res.json({"flag":results.flag});
        }
    });
});

//优惠码兑换
router.get("/convertCoupon",function (req,res) {
    var options={title:'优惠码兑换',error: req.flash('error').toString()};
    common.viewPage("convertCoupon",options,req,res);
}).post("/convertCoupon",function (req,res){
    var url=common.getUrl("user","coupon").convert;
    common.needlePost(url,req.body,req,res,function (err,result) {
        res.redirect('/user/mycoupon?useflag=1');
    });
});

//图片上传到七牛
router.post('/upload',function (req,res) {
    // 七牛相关配置信息
    var client = qn.create(config);
    // 上传单个文件
    // 这里`avatar`对应前端form中input的name值
    upload.single('file')(req, res, function(err) {
        if (err) {
            return console.error(err);
        }
        if (req.file && req.file.buffer) {

            //获取源文件后缀名
            var fileFormat = (req.file.originalname).split(".");
            //设置上传到七牛云的文件命名
            var filePath = '/upload/node/' + req.file.fieldname + '-' +new Date().getTime() + '.' +fileFormat[fileFormat.length - 1];
            // 上传到七牛
            client.upload(req.file.buffer, {
                key: filePath
            }, function(err, result) {
                if (err) {
                    res.status(200).send({
                        statu:0,
                        msg:'上传失败'

                    });
                }
                res.status(200).send({
                    statu:1,
                    result:{
                        //将保存路径传递给页面(我用的 markdon 编辑器)
                        path:serverURL+filePath
                    }
                })
            });
        }
    });
});

//头像保存
router.post('/headProtrait',function (req,res) {
    var url=common.getUrl("user","headProtrait");
    common.needlePost(url,req.body,req,res,function (err,result) {
        if(result.flag=="error"){
            res.json({"flag":result.flag,"msg":result.msg});
        }else{
            res.json({"flag":result.flag});
        }
    },"ajax");
});

//个人资料构造页面
router.get("/userForm/:mold",function(req,res){
  var mold=req.params.mold,formdata={},usersdata=req.session.user;
    switch (mold){
      case "base":
        formdata.realName=usersdata.realName;
        formdata.sex=usersdata.sex;
        break;
      case "tel":
        formdata.mobile=usersdata.mobile;
        break;
      case "idcard":
        formdata.accIdentification=usersdata.accIdentification;
        formdata.idCardBundFlag=usersdata.idCardBundFlag;
        break;
      case "addr":
          if(!usersdata.addr){
              formdata.address=usersdata.addr;
          }else{
              var areaArray=usersdata.addr.split("_");
              if(areaArray.length>1){
                  formdata.area=areaArray[0]+" "+areaArray[1]+" "+areaArray[2];
                  formdata.address=areaArray[3];
              }else{
                  formdata.area="";
                  formdata.address=areaArray[0];
              }
          }

        break;
      case "carNumber":
        formdata.carNumber=usersdata.carNumber;
        break;
      case "email":
        formdata.email=usersdata.email;
        break;
      case "password":
          formdata.mobile=usersdata.mobile;
        break;
    }
    var options={title: '个人中心', mold: mold,formdata:formdata,error:req.flash('error').toString()};
    common.viewPage("userItem",options,req,res);
});

//个人资料修改页面
router.post("/userForm/:mold",function(req,res){
  var mold=req.params.mold,posturl=common.getUrl("user","post"),formdata={};
  formdata.loginId=req.session.user.loginId;
    switch (mold){
      case "base":
        formdata.realName=req.body.realName;
        formdata.sex=req.body.sex;
        common.needlePost(posturl,formdata,req,res,function(error,result){
            req.session.user=result.user;
            res.redirect('/user/member');
        });
        break;
      case "tel":
        formdata.mobile=req.body.mobile;
        formdata.checkCode=req.body.checkCode;
        posturl=common.getUrl("user","bindPhone").post;
        common.needlePost(posturl,formdata,req,res,function(error,result){
            req.session.user=result.user;
            res.redirect('/user/member');
        });
        break;
      case "idcard":
        posturl=common.getUrl("user","bindIdCard");
        formdata.accIdentification=req.body.accIdentification;
        common.needlePost(posturl,formdata,req,res,function(error,result){
            req.session.user=result.user;
            res.redirect('/user/member');
        });
        break;
      case "addr":
          var areaArray=req.body.area.split(" ");
          if(areaArray[0]==""){
              formdata.address=req.body.address;
          }else{
              formdata.address=areaArray.join("_")+"_"+req.body.address;
          }
        common.needlePost(posturl,formdata,req,res,function(error,result){
            req.session.user=result.user;
            res.redirect('/user/member');
        });
        break;
      case "carNumber":
            formdata.carNumber=req.body.carNumber;
            common.needlePost(posturl,formdata,req,res,function(error,result){
                req.session.user=result.user;
                res.redirect('/user/member');
            });
            break;
      case "email":
        formdata.email=req.body.email;
        formdata.checkCode=req.body.checkCode;
        posturl=common.getUrl("user","bindEmail").post;
        common.needlePost(posturl,formdata,req,res,function(error,result){
            req.session.user=result.user;
            res.redirect('/user/member');
        });
        break;
      case "password":
        formdata.mobileCode=req.body.mobileCode;
        formdata.loginPass=req.body.loginPass;
        posturl=common.getUrl("user","password").post;
        common.needlePost(posturl,formdata,req,res,function(error,result){
            res.redirect('/login');
        });
        break;
    }
});

router.get('/refund',function(req,res){
  var refundUrl=common.getUrl("user","refund").fee,query=req.query;
  common.needlePost(refundUrl,{orderId:req.session.orderId,refundNum:query.refundNum},req,res,function(err,result){
    if(result.flag=="error"){
      res.json({"flag":result.flag,"msg":result.msg});
    }else{
      res.json({"flag":result.flag,"datas":result.datas});
    }
  },'ajax');
});

//获取手机及邮箱的验证码
router.post('/:mold',function (req,res) {
    var mold=req.params.mold,url="",data={};
    switch (mold){
        case "telcode":
          url=common.getUrl("user","bindPhone").getCode;
          data.mobile=req.body.mobile;
          break;
        case "emailcode":
          url=common.getUrl("user","bindEmail").getCode;
          data.email=req.body.email;
          break;
        case "passwordcode":
            url=common.getUrl("user","password").checkCode;
            break;
    }
    common.needlePost(url,data,req,res,function (err,result) {
        if(result.flag=="error"){
            res.json({"flag":result.flag,"msg":result.msg});
        }else{
            res.json({"flag":result.flag,"checkCode":result.checkCode});
        }
    },'ajax')
});

router.get('/memberInfo',function (req,res) {
    var options={title:'会员攻略'};
    common.viewPage("memberInfo",options,req,res);
});
////退款页面
//router.get("/refundApply/:mold/:id",function(req,res){
//  var orderId=req.params.id,mold=req.params.mold,refundUrl=common.getUrl("user","refundApply");
//  common.needlePost(refundUrl,{orderId:orderId},req,res,function(result){
//    res.redirect('/user/myorderDetails/'+mold+'/'+orderId);
//  });
//});
module.exports = router;
