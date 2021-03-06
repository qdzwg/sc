var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");

var workMold="";
router.get('/:mold/:orderId', function(req, res,next) {
    if(req.params.mold=="alipay"||req.params.mold=="wxpay"){
        next("route");
        return false;
    }
    var mold=req.params.mold,orderId=req.params.orderId,prourl=common.getUrl(mold,"pay").getpro+"?orderId="+orderId,query=req.query;
    workMold=mold;
    req.session.orderId=orderId;
    async.parallel([function(callback){
        common.needleGet(prourl,req,res,callback);
    }],function(err, results){
        var proitems=results[0];
        if(mold=="show"){
            proitems=results[0].datas;
        }
        var options={title:"宋城旅游",mold:mold,orderId:orderId,proitems:proitems,error:req.flash('error').toString()};
        common.viewPage("pay",options,req,res);
    });
});

router.get('/:paymold/:orderNos',function(req,res,next){
    var mold=req.params.paymold,orderNos=req.params.orderNos,posturl="",page="";
    switch (mold){
        case "alipay":
            posturl=common.getUrl("paymold","alipay");
            page="payAlipay";
            break;
        case "wxpay":
            posturl=common.getUrl("paymold","wxpay");
            page="zybWxPay";
            break;
    }
    common.needlePost(posturl,{orderNos:orderNos},req,res,function(error,result){
        var options="";
        switch (mold){
            case "alipay":
                options={mold:mold,proitems:result.datas};
                break;
            case "wxpay":
                options={mold:mold,proitems:result.payContent};
                break;
        }
        common.viewPage(page,options,req,res);
    });
});

// 支付完成
router.get('/payAlipay/sutatus/:module',function (req,res,next){
    var alipayData = req.query;
    alipayData.sutatus = req.params.module;
    console.log(alipayData);
    var options = {title:"宋城旅游",alipayData:alipayData};

    common.viewPage('payResult',options,req,res);
});
module.exports = router;
