var express = require('express');
var router = express.Router();
var async = require('async');

var querystring = require('querystring');
var common=require("../common_modules/common");

// 订单
router.get('/order', function(req, res, next) {
	if(req.query.orderType=="score"){
        var url = common.getUrl('score','orderList') + '?' + querystring.stringify(req.query);
	}else{
        var url = common.getUrl('user','list').page + '?' + querystring.stringify(req.query);
	}
 	common.needleGet(url,req,res,function (err,results){
 		var options={ title: '宋城旅游个人中心',nativePage:req.query.orderType,orderList:results.datas};
        if(req.query.orderType=="score") {
            common.viewPage("scoreorder", options, req, res);
        }else{
            common.viewPage("user/order", options, req, res);
		}
 	});
});

// 订单详情
router.get('/order/:module/:id', function(req, res, next) {
	var module = req.params.module;
	var id = req.params.id;
	if(module=="score"){
        var url = common.getUrl('score','orderDetail') + '?id=' + id;
	}else{
        var url = common.getUrl('user','details') + '?orderId=' + id;
	}
 	common.needleGet(url,req,res,function (err,results){
 		var options={ title: '宋城旅游订单详情',detailData:results.datas,nativePage:module};
 		common.viewPage("user/orderDetail",options,req,res);
 	});
 	
});

//修改密码验证码
router.post('/passwordCode',function (req,res,next) {
	console.log(1);
    var url = common.getUrl('user','password').checkCode;
    common.needlePost(url,{},req,res,function (err,results){
        res.send(results);
    },"ajax");
});

// 修改密码
router.get('/changePass',function (req,res,next){
	var url = common.getUrl('user','password').post + '?' + querystring.stringify(req.query);

	common.needleGet(url,req,res,function (err,results){
		var options={ title: '宋城旅游友情提示',message:results.msg};
		common.viewPage("error",options,req,res);
	});
});

// 图片上传
router.get('/imgUpload', function(req, res, next) {
 	var options={ title: '宋城旅游图片上传'};
 	common.viewPage("user/imgUpload",options,req,res);
});

// 个人资料
router.get('/userInfo', function(req, res, next) {
	var flag = req.query.flag;
 	var options={ title: '宋城旅游个人资料',nativePage: 'userInfo',flag: flag};
 	
 	common.viewPage("user/userInfo",options,req,res);
});

// 个人资料修改
router.post('/userInfo/change', function(req, res, next) {
	var url = common.getUrl('user','post');
	var data = req.body;

	for (var key in data){
		req.session.member[key] = data[key];
	}
	common.needlePost(url,data,req,res,function (err,results){
		var options={ title: '宋城旅游个人资料',message:results.msg};
		common.viewPage("error",options,req,res);
	});
});

// 个人资料
/*router.get('/userInfo', function(req, res, next) {
	var flag = req.query.flag;
 	var options={ title: '独木桥旅游网个人资料',nativePage: 'userInfo',flag: flag};
 	
 	common.viewPage("user/userInfo",options,req,res);
});*/

// 绑定手机
router.get('/mobile', function(req, res, next) {
	var url = common.getUrl('user','mobile') + '?' + querystring.stringify(req.query);

	common.needleGet(url,req,res,function (err,results){
		req.session.member.mobile=req.query.mobile;
		var options={ title: '宋城旅游友情提示',message: results.msg};
 		common.viewPage("error",options,req,res);
	});
 	
});


// 发送手机验证码
router.post('/mobileCode', function(req, res, next) {
	var data = req.body;
	var url = common.getUrl('register','checkCode');

	common.needlePost(url,data,req,res,function (err,results){
		res.send(results);
	},"ajax");
 	
});



// 绑定邮箱验证码
router.post('/emailCode', function(req, res, next) {
	var data = req.body;
	var url = common.getUrl('user','email').checkCode;

	common.needlePost(url,data,req,res,function (err,results){
			res.send(results);
	},"ajax");
 	
});

// 绑定邮箱
router.post('/email', function(req, res, next) {
	var data = req.body;
	var url = common.getUrl('user','email').bind;

	common.needlePost(url,data,req,res,function (err,results){
		req.session.member.email=req.body.email;
		var options={ title: '宋城旅游友情提示',message: results.msg};
 		common.viewPage("error",options,req,res);
	});
 	
});

// 常用联系人
router.get('/concat', function(req, res, next) {
	var url = common.getUrl('user','linkMan').list;

	common.needleGet(url,req,res,function (err,results){
		var options={ title: '宋城旅游常用联系人',nativePage: 'concat',listData: results};

 		common.viewPage("user/concat",options,req,res);
	});
});

// 常用联系人编辑
router.get('/concat/edit', function(req, res, next) {
	var url = common.getUrl('user','linkMan').edit + '?' + querystring.stringify(req.query);

	common.needleGet(url,req,res,function (err,results){
		var options={ title: '宋城旅游常用联系人编辑',nativePage: 'concat',linkMan:results.datas};
 		common.viewPage("user/concatEdit",options,req,res);
	});
});

// 编辑
router.post('/concat/edit', function(req, res, next) {
	var data = req.body;
	var url = common.getUrl('user','linkMan').add;

	if (data['link.sex'] === 'ture'){
		data['link.sex'] = 0;
	}else{
		data['link.sex'] = 1;
	}
	common.needlePost(url,data,req,res,function (err,results){
		var options={ title: '宋城旅游常用联系人编辑',message:results.msg};
 		common.viewPage("error",options,req,res);
	});
});

// 常用联系人添加
router.get('/concat/add', function(req, res, next) {
 	var options={ title: '宋城旅游常用联系人添加',nativePage: 'concat'};
 	common.viewPage("user/concatAdd",options,req,res);
});

// 常用联系人删除
router.get('/concat/dele', function(req, res, next) {
	var url = common.getUrl('user','linkMan').dele + '?' + querystring.stringify(req.query);

	common.needleGet(url,req,res,function (err,results){
		var options={ title: '宋城旅游常用联系人添加',message:results.msg};
 		common.viewPage("error",options,req,res);
	});
});


// 评论
router.get('/comment/:type', function(req, res, next) {
	var type = req.params.type;
	var url = common.getUrl('user','comments')[type] + '?' + querystring.stringify(req.query);

	common.needleGet(url,req,res,function (err,results){
		var options={ title: '宋城旅游常用联系人添加',nativePage: 'comment',listDta: results.datas};
 		common.viewPage("user/" + type,options,req,res);
	});
});

// 添加评论
router.get('/comment/listComment/:orderId', function(req, res, next) {
	var orderId = req.params.orderId;
	var url = common.getUrl('user','details') + '?orderId=' + orderId;

 	common.needleGet(url,req,res,function (err,results){
 		var options={ title: '宋城旅游网添加评论',nativePage: 'comment',orderDetail: results.datas};
 		common.viewPage("user/commentWrite",options,req,res);
 	});
 	
});

// 评论
router.post('/comment/listComment/write', function(req, res, next) {
 	var data = req.body;
 	var url = common.getUrl('user','comments').add;

 	common.needlePost(url,data,req,res,function (err,results){
 		var options={ title: '宋城旅游网友情提示',message: results.msg};
 		common.viewPage("error",options,req,res);
 	});
 	
});
var orderId='';
// 退款页面
router.get('/refund/:orderId', function(req, res, next) {
	orderId = req.params.orderId;
	var url = common.getUrl('user','refund').get + '?orderId=' + orderId;

 	common.needleGet(url,req,res,function (err,results){
 		var options={ title: '宋城旅游网退款',refundData: results.datas};
 		common.viewPage("user/refund",options,req,res);
 	});
 	
});

// 退款手续费
router.get('/refund',function(req,res){
  var refundUrl=common.getUrl("user","refund").fee,query=req.query;
  common.needlePost(refundUrl,{orderId:orderId,refundNum:query.refundNum},req,res,function(err,result){
    if(result.flag=="error"){
      res.json({"flag":result.flag,"msg":result.msg});
    }else{
      res.json({"flag":result.flag,"datas":result.datas});
    }
  },'ajax');
});

//订单详细页面 提交评论及提交退款申请
router.post('/myorderDetails',function(req,res){
  var formdata={},posturl="";
  posturl=common.getUrl("user","refund").post;
  formdata.refundNum=req.body.number;
  formdata.orderId=orderId;
  common.needlePost(posturl,formdata,req,res,function(error,results){
    var options={ title: '宋城旅游友情提示',message: results.msg};
 		common.viewPage("error",options,req,res);
  });
});

//绑定身份证
router.post("/idCard",function(req,res){
    var posturl=common.getUrl("user","bindIdCard");
    common.needlePost(posturl,req.body,req,res,function(error,result){
        if(result.flag=="error"){
            res.json({"flag":result.flag,"msg":result.msg});
        }else{
            res.json({"flag":result.flag});
        }
    },"ajax");
});

// 积分订单
router.get('/scoreorder',function (req,res) {
    var scoreUrl=common.getUrl("score","orderList");
    droploadUrl=scoreUrl;
    common.needleGet(scoreUrl,req,res,function (err,result) {
        var options={title:'订单中心',orderList:result.datas,nativePage:'scoreorder'};
        common.viewPage("scoreorder",options,req,res);
    });
});

// 积分订单详情
router.get('/scoreorderDetails/:id',function (req,res) {
    var id=req.params.id,url=common.getUrl("score","orderDetail")+"?id="+id;
    common.needleGet(url,req,res,function (err,result) {
        var options={title:'积分订单详情',mold:"score",orders:result.datas};
        common.viewPage("orderDetails", options, req, res);
    })
});

//积分明细
router.get("/scoreDetails",function (req,res) {
    var url=common.getUrl("user","integralDetail");
    common.needleGet(url,req,res,function (err,result) {
        var options={title:'积分明细',orderList:result.datas,nativePage:'scoreDetails'};
        common.viewPage("scoreDetails",options,req,res);
    });
});

//优惠券列表--个人中心
router.get("/mycoupon",function (req,res) {
    var couponUrl=common.getUrl("user","coupon").mycoupon+"?useFlag="+req.query.useflag;
    common.needleGet(couponUrl,req,res,function (err,result) {
        var options={title:'我的优惠券',orderList:result.datas,nativePage:'mycoupon',useFlag:req.query.useflag};
        common.viewPage("mycoupon",options,req,res);
    })
});

//优惠码兑换
router.get("/convertCoupon",function (req,res) {
    var options={title:'优惠码兑换',nativePage:'convertCoupon',error: req.flash('error').toString()};
    common.viewPage("convertCoupon",options,req,res);
}).post("/convertCoupon",function (req,res){
    var url=common.getUrl("user","coupon").convert;
    common.needlePost(url,req.body,req,res,function (err,result) {
        res.redirect('/user/mycoupon?useflag=1');
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
        var options={title:'会员权益',nativePage:'userRights',users:results[0].user,items:results[1].datas};
        common.viewPage("userRights",options,req,res);
    });
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
		res.json(result);
    },"ajax");
});

//奖品列表
router.get("/prizelist",function (req,res){
    var prizeurl=common.getUrl("user","turntable").list;
    common.needleGet(prizeurl,req,res,function (err,result) {
        var options={title:'奖品列表',nativePage:'prizelist',items:result.datas};
        common.viewPage("prizelist",options,req,res);
    });
});

//可用优惠券列表--表单页面
router.get('/couponlist',function (req,res) {
    var url=common.getUrl("user","coupon").usecouponlist;
    var query=req.query;
    for(var key in query){
        url=common.changeURLPar(url,key,query[key]);
    }
    common.needleGet(url,req,res,function (err,result) {
        if(result.flag=="success"){
            res.json(result);
        }else{
            res.json({"msg":"产品数据不存在","flag":"error"});
        }
    },"ajax");
});

//抽将转盘
router.get("/turntable/:id",function (req,res) {
	var url=common.getUrl("user","turntable").get+"?activityId="+req.params.id;
	common.needleGet(url,req,res,function (err,result) {
		var user=req.session.member;
		req.session.prize=result.datas.dialProduct;
		var options={title:'抽奖转盘',items:result.datas,id:req.params.id,user:req.session.member};
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


module.exports = router;
