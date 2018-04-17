var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");
var querystring=require("querystring");

//支付页面构造
router.get('/:mold', function(req, res,next) {
        if(req.params.mold=="returnUserCheck"||req.params.mold=="payAlipay"||req.params.mold=="payWx"||req.params.mold=="scoreResult"){
            next("route");
            return false;
        }
        if(req.params.mold=="cart"){
            next();
            return false;
        }
        var mold=req.params.mold,code=req.params.code,orderId=req.query.orderId,prourl=common.getUrl(mold,"pay").getpro+"?orderId="+orderId;
        req.session.workMold=mold;
        //workMold=mold;
        //req.session.code=code;
        req.session.orderId=orderId;
        async.parallel([function(callback){
            common.needleGet(prourl,req,res,callback);
        }],function(err, results){
            var proitems=results[0];
            var isWechat=common.isWeixin(req);
            if(mold=="show"){
                proitems=results[0].datas;
            }
            if(proitems.finalSum==0){
                var url=common.getUrl("paymold","zeroPay")+"?orderNos="+proitems.orderNo;
                common.needleGet(url,req,res,function (err,results) {
                    var resu=results.datas,name=encodeURIComponent(resu.name);
                    res.redirect('/pay/payResult/0?orderId='+resu.orderId+"&name="+name+"&num="+resu.num);
                })
            }else{
                var options={title:"订单支付",mold:mold,isWechat:isWechat,orderId:orderId,proitems:proitems,error:req.flash('error').toString()};
                common.viewPage("pay",options,req,res);
            }
        });
},function(req,res){
    var query=req.query;
    req.session.workMold="cart";
    var r=/^\d+(\.\d+)?$/;
    if(!r.test(query.finalSum)){
        res.redirect('/error');
        return false;
    }
    //workMold="cart";
    query.orderNo=query.orderNos;
    var options={title:"购物车支付结果",item:query,workMold:req.session.workMold,error:req.flash('error').toString(),isWechat:common.isWeixin(req)};
    common.viewPage("payCart",options,req,res);
}).post('/:mold', function(req, res){
    var mold=req.params.mold,state=req.body.state,orderId=req.query.orderId,orderNos=req.body.orderNos,posturl="",page="";
    req.session.orderNo=orderNos;
    switch (state){
        case "0":
            posturl=common.getUrl("paymold","alipay");
            page="payAlipay";
            break;
        case "1":
            posturl=common.getUrl("paymold","wxpay");
            page="wxpay";
            break;
    }
    common.needlePost(posturl+"?orderNos="+orderNos,{},req,res,function(error,result){
        var options="";
        switch (state){
            case "0":
                options={mold:mold,proitems:result.datas};
                break;
            case "1":
                if(result.flag=="error"){
                    res.redirect(result.url);
                    return false;
                }else{
                    req.session.wxReturnUrl=result.returnUrl;
                    options={mold:mold,item:result};
                }
                break;
        }
        common.viewPage(page,options,req,res);
    });
});

//微信授权接受
router.get("/returnUserCheck",function (req, res) {
    var query=req.query,userUrl=common.getUrl("paymold","wxUserCheck");
    //var wx={ code: '011igSN11z6b1L1LhuQ11DQwN11igSNW', state: '1' };
    common.needlePost(userUrl,query,req,res,function (err,result) {
        var postUrl=common.getUrl("paymold","wxpay");
        common.needlePost(postUrl+"?orderNos="+req.session.orderNo,{},req,res,function(error,result){
            req.session.wxReturnUrl=result.returnUrl;
            var options={mold:req.session.workMold,item:result};
            common.viewPage('wxpay',options,req,res);
        });
    });
});

//支付宝支付信息接受
router.get("/payAlipay",function (req,res) {
    var query=req.query;
    var returnUrl=common.getUrl("paymold","alipayReturn");
    common.needlePost(returnUrl,query,req,res,function (err,result) {
        if(result.flag=="success"){
            req.session.payResult=result.datas;
            var param=querystring.stringify(result.datas);
            res.redirect("/pay/payResult/0?"+param);
        }else{
            res.redirect("/pay/payResult/1");
        }
    },"ajax");
});

//微信支付信息接受
router.get("/payWx",function (req,res) {
    common.needlePost(req.session.wxReturnUrl,{},req,res,function (err,result) {
        if(result.flag=="success"){
            req.session.payResult=result.datas;
            var param=querystring.stringify(result.datas);
            res.redirect("/pay/payResult/0?"+param);
        }else{
            res.redirect("/pay/payResult/1");
        }
    },"ajax");
});

//兑换结果页
router.get("/scoreResult",function (req,res) {
    var options={title:'商城结果',items:req.session.scoreResult};
    common.viewPage("scoreResult",options,req,res);
});

//支付结果页面
router.get("/payResult/:mold",function(req, res){
    var mold=req.params.mold,query=req.query,seatsUrl=common.getUrl("seats","isshow")+"?orderId="+query.orderId;
    //console.log(decodeURIComponent(query.name));
    var name=unescape(decodeURI(query.name));
    query.name=name;
    console.log(req.session.workMold);
    common.needleGet(seatsUrl,req,res,function (err,results) {
        if(typeof results.datas.orderNo!="undefined") {
            var b = new Buffer(results.datas.orderNo);
            var s = b.toString('base64');
            results.datas.orderNo = s;
        }
        var options={title:"支付结果",mold:mold,orderitem:query,workMold:req.session.workMold,isshow:results.datas};
        common.viewPage("payResult",options,req,res);
    });

});

module.exports = router;
