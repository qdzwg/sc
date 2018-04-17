var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");

//跟团游和自由行日历信息页面
router.get('/calendar/:mold/:code',function(req, res){
    var mold=req.params.mold,code=req.params.code,prourl=common.getUrl(mold,"order").getdate+"?id="+code,title=common.pageCommon(mold).title+"订单";
    async.parallel([function(callback){
        common.needleGet(prourl,req,res,callback);
    }],function(err, results){
        if(!req.session.logined){
            req.session.curUrl=req.originalUrl;
            res.redirect('/login');
        }else{
            var result1=results[0];
            if(mold=="route"){
                for(var i= 0,len=result1.dates.length;i<len;i++){
                    result1.dates[i].price=result1.dates[i].adultPrice;
                    result1.dates[i].ticket=result1.dates[i].adultLeftNum;
                }
            }else{
                for(var i= 0,len=result1.dates.length;i<len;i++){
                    result1.dates[i].ticket=result1.dates[i].leftNum;
                }
            }
            var num={
                minNum:req.session.min,
                maxNum:req.session.max
            }
            var options={title:title,mold:mold,code:code,dates:result1.dates,beforeDay:req.session.beforeDay,num:num};
            common.viewPage("travelCalendar",options,req,res);
        }
    });
});

//商品自提地址
router.get('/address',function(req,res){
    var addressurl=common.getUrl("goods","order").addressUrl+"?id="+req.query.id+"&lonlat="+req.query.lonlat;
    async.parallel([function(callback){
        common.needleGet(addressurl,req,res,callback);
    }],function(err, results){
            res.json(results[0]);
    });
});

//构造下单页面
router.get('/:mold/:code', function(req, res, next) {
    if(req.params.mold=="getStock"||req.params.mold=="score"){
        next();
        return false;
    }
    if(req.params.mold=="cart"){
        next("route");
        return false;
    }
    var mold=req.params.mold,code=req.params.code,prourl=common.getUrl(mold,"order").getpro+"?id="+code,query=req.query,title=common.pageCommon(mold).title+"订单";
    switch (mold){
        case "route":
            prourl+="&stockDate="+query.stockDate;
            break;
        case "line":
            prourl+="&stockDate="+query.stockDate;
            break;
        case "goods":
            if(typeof query.skuId=="undefined"){
                prourl+="&freight="+query.freight;
            }else{
                prourl+="&skuId="+query.skuId+"&freight="+query.freight;
            }
            break;
    }
    async.parallel([function(callback){
        common.needleGet(prourl,req,res,callback);
    }],function(err, results){
            var result1=results[0];
            if(req.session.logined){
                var userdata={
                    user:req.session.user.realName,
                    tel:req.session.user.mobile,
                    card:req.session.user.idCard
                };
            }else{
                var loginName=typeof req.session.loginName=="undefined"?"":decodeURI(req.session.loginName);
                var userdata={
                    user:loginName,
                    tel:req.session.mobile,
                    card:req.session.idCard,
                    certificateType:req.session.certificateType
                };
            }
            req.session.strutstokenname=result1.strutstokenname;
            switch (mold){
                case "route":
                    result1.adult=query.adult;
                    result1.children=query.children;
                    break;
                case "line":
                    result1.num=query.num;
                    break;
                case "goods":
                    result1.freight=query.freight;
                    req.session.postage=result1.datas.postageData;
                    break;
            }
            if(mold!="show"){
                req.session.stockPriceMap=result1.stockPriceMap;
            }else{
                req.session.stockPriceMap=result1.datas.stockPriceMap;
            }
            var options={title:title,mold:mold,code:code,userdata:userdata,proitems:result1,error:req.flash('error').toString()};
            if(mold=="hotel"){
                options.defaultDate={
                    beginDate:req.session.beginDate,
                    endDate:req.session.endDate
                };
                options.proId=req.session.proId;
            }
        if(mold=="ticket"){
            options.proId=req.session.proId;
        }
        console.log(options.defaultDate);
            common.viewPage("order",options,req,res);
    });
}).get("/:mold/:code",function (req,res,next) {
    if(req.params.mold!="score"){
        next();
        return false;
    }
    console.log(common.getUrl("score","order").getpro);
    var code=req.params.code,prourl=common.getUrl("score","order").getpro+"?id="+code,title=common.pageCommon("score").title+"订单";
    var proitems="";
    async.waterfall([function (callback) {
        common.needleGet(prourl,req,res,function (err,result) {
            if(result.datas.productType=="entity"){
                var userdata=req.session.user;
                console.log(userdata);
                if(userdata){
                    var options={title:title,mold:"score",code:code,userdata:userdata,proitems:result,error:req.flash('error').toString()};
                    common.viewPage("order",options,req,res);
                }else{
                    res.redirect('/quickLogin');
                }
            }else{
                if(result.datas.productType=="goods"){
                    var calendarUrl=common.getUrl(result.datas.productType,"order").getpro+"?modelCode="+result.datas.productCode+"&freight=0";
                }
                else if(result.datas.productType=="coupon"||result.datas.productType=="specialGoods"){
                    var calendarUrl="";
                }
                else{
                    var calendarUrl=common.getUrl(result.datas.productType,"order").getpro+"?modelCode="+result.datas.productCode;
                }

                proitems=result;
                callback(null,calendarUrl);
            }
        });
    },function (calendarUrl,callback) {
        if(calendarUrl!=""){
            common.needleGet(calendarUrl,req,res,callback);
        }else{
            callback(null,"");
        }
    }],function (err,results) {
        var userdata=req.session.user,stockPriceMap="";
        if(proitems.datas.productType!="show"&&proitems.datas.productType!="goods"){
            req.session.stockPriceMap=results.stockPriceMap;
            stockPriceMap=results.stockPriceMap;
        }
        else if(proitems.datas.productType=="goods"){
            stockPriceMap=results.datas;
        }
        else if(proitems.datas.productType=="coupon"||proitems.datas.productType=="specialGoods"){
            stockPriceMap="";
        }
        else {
            req.session.stockPriceMap=results.datas.stockPriceMap;
            stockPriceMap=results.datas.stockPriceMap;
        }
        var options={title:title,mold:"score",code:code,userdata:userdata,proitems:proitems,stockPriceMap:stockPriceMap,error:req.flash('error').toString()};
        common.viewPage("order",options,req,res);
    });
}).get("/getStock/:mold",function(req,res){
    var mold=req.params.mold,query=req.query,url=common.getUrl(mold,"order").getdate;
    for(var key in query){
        url=common.changeURLPar(url,key,query[key]);
    }
    async.parallel([function(callback){
        common.needleGet(url,req,res,callback);
    }],function(err, results){
        //特定5247大学生票的场次
        var resobj=results;
        if(mold=="show"){
            var session=resobj[0].datas.session;
            if(query.id==5274){
                for(var i=0;i<session.length;i++){
                    if(validTime(session[i].playTime,"16:00")){
                        session.splice(i,session.length-i);
                    }
                }
            }else if(query.id==5361||query.id==5362){
                for(var i=0;i<session.length;i++){
                    if(validTime(session[i].playTime,"18:00")){
                        session.splice(i,session.length-i);
                    }
                }
            }
            //特定99元票场次贵宾票
            if(query.id==5520){
                var changeArray=[];
                if(CompareDate(query.nowDate,"2017-07-29")&&CompareDate("2017-08-06",query.nowDate)){
                    for(var i=0;i<session.length;i++){
                        if(session[i].playTime=="16:00"){
                            changeArray.push(session[i]);
                        }
                    }
                }
                if(CompareDate(query.nowDate,"2017-07-31")&&CompareDate("2017-08-04",query.nowDate)){
                    for(var i=0;i<session.length;i++){
                        if(session[i].playTime=="11:00"){
                            changeArray.push(session[i]);
                        }
                    }
                }
                resobj[0].datas .session=[];
                resobj[0].datas.session.push.apply(resobj[0].datas.session,changeArray);
            }
        }
        res.json(resobj);
    });
});

//比较两个时间的大小
function validTime(t1,t2) {
    var t1Array=t1.split(":");
    var t2Array=t2.split(":");
    if(t1Array[0]<t2Array[0]){
        return false;
    }else if(t1Array[0]>t2Array[0]){
        return true;
    }else{
        if(t1Array[1]<t2Array[1]){
            return false;
        }else{
            return true;
        }
    }
}

//日期比较
function CompareDate(d1,d2)
{
    return ((new Date(d1.replace(/-/g,"\/"))) >= (new Date(d2.replace(/-/g,"\/"))));
}

router.get('/cart/del',function(req,res){
    var url=common.getUrl("cart","del"),query=req.query;
    console.log(req.query.ids);
    common.needlePost(url,query,req,res,function(err,result){
        res.json(result);
    });
});

//下单页面表单提交
router.post('/:mold/:code',function(req,res,next){
    var code=req.params.code,mold=req.params.mold,posturl=common.getUrl(mold,"order").postpro,formdata={},query=req.query;
    switch (mold){
        case "ticket":
            formdata.stockDate=req.body.stockDate;
            formdata.price=req.body.price;
            formdata.amount=req.body.number;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.accIdentification;
            break;
        case "hotel":
            formdata.beginDate=req.body.stockDate;
            formdata.endDate=req.body.endDate;
            formdata.price=req.body.price;
            formdata.amount=req.body.number;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.accIdentification;
            formdata.remark=req.body.remark;
            break;
        case "route":
            formdata.stockDate=req.body.stockDate;
            formdata.adultLeftNum=req.body.adultLeftNum;
            formdata.childrenLeftNum=req.body.childrenLeftNum;
            formdata.adultPrice=req.body.adultPrice;
            formdata.childrenPrice=req.body.childrenPrice;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.accIdentification;
            break;
        case "line":
            formdata.kid=req.body.kid;
            if(typeof req.body.zyxTicketIds!="undefined"){
                if(typeof req.body.zyxTicketIds=="string"){
                    formdata.zyxTicketIds=req.body.zyxTicketIds;
                }else {
                    //formdata.zyxTicketIds=req.body.zyxTicketIds;
                    for (var i = 0, len = req.body.zyxTicketIds.length; i < len; i++) {
                        if (i == 0) {
                            posturl=common.changeURLPar(posturl,"zyxTicketIds",req.body.zyxTicketIds[i]);
                        } else {
                            posturl += "&zyxTicketIds=" + req.body.zyxTicketIds[i];
                        }
                    }
                }
            }
            //formdata.hotelIds=req.body.hotelIds;
            if(typeof req.body.hotelIds!="undefined"){
                if(typeof req.body.hotelIds=="string"){
                    formdata.hotelIds=req.body.hotelIds;
                }else {
                    //formdata.zyxShowIds=req.body.zyxShowIds;
                    for (var i = 0, len = req.body.hotelIds.length; i < len; i++) {
                        if (i == 0) {
                            posturl=common.changeURLPar(posturl,"hotelIds",req.body.hotelIds[i]);
                            //posturl += "?hotelIds=" + req.body.hotelIds[i];
                        } else {
                            posturl += "&hotelIds=" + req.body.hotelIds[i];
                        }
                    }
                }
            }
            if(typeof req.body.zyxShowIds!="undefined"){
                if(typeof req.body.zyxShowIds=="string"){
                    if(req.body.zyxShowIds=="djx"){
                        formdata.changci=req.body.sci;
                    }else{
                        formdata.zyxShowIds=req.body.zyxShowIds;
                    }
                }else {
                    //formdata.zyxShowIds=req.body.zyxShowIds;
                    for (var i = 0, len = req.body.zyxShowIds.length; i < len; i++) {
                        if (i == 0) {
                            if(req.body.zyxShowIds[i]=="djx"){
                                posturl=common.changeURLPar(posturl,"changci",req.body.sci[i]);
                            }else{
                                posturl=common.changeURLPar(posturl,"zyxShowIds",req.body.zyxShowIds[i]);
                            }
                        } else {
                            if(req.body.zyxShowIds[i]=="djx"){
                                posturl += "&changci=" + req.body.sci[i];
                            }else{
                                posturl += "&zyxShowIds=" + req.body.zyxShowIds[i];
                            }
                        }
                    }
                }
            }
            formdata.nowDate=req.body.stockDate;
            formdata.price=req.body.price;
            formdata.amount=req.body.number;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.accIdentification;
            formdata.linkName=req.body.consumer;
            break;
        case "combo":
            formdata.kid=req.body.kid;
            if(typeof req.body.zyxShowIds!="undefined"){
                if(typeof req.body.zyxShowIds=="string"){
                    formdata.showTicketIds=req.body.zyxShowIds;
                }else {
                    //formdata.showTicketIds=req.body.zyxShowIds;
                    for (var i = 0, len = req.body.zyxShowIds.length; i < len; i++) {
                        if (i == 0) {
                            posturl += "?showTicketIds=" + req.body.zyxShowIds[i];
                        } else {
                            posturl += "&showTicketIds=" + req.body.zyxShowIds[i];
                        }
                    }
                }
            }
            formdata.nowDate=req.body.stockDate;
            formdata.price=req.body.price;
            formdata.amount=req.body.number;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.accIdentification;
            formdata.linkName=req.body.consumer;
            break;
        case "show":
            formdata.ticketId=code;
            formdata.stockId=req.body.zyxShowIds;
            formdata.nowDate=req.body.stockDate;
            formdata.price=req.body.price;
            formdata.amount=req.body.number;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.accIdentification;
            formdata.linkName=req.body.consumer;
            break;
        case "repast":
            formdata.price=req.body.price;
            formdata.amount=req.body.number;
            break;
        case "goods":
            formdata.price=req.body.price;
            formdata.stockId=req.body.stockId;
            formdata.amount=req.body.number;
            formdata.remark=req.body.remark;
            if(query.freight==0){
                formdata.address=req.body.area+req.body.address;
                formdata.postId=req.body.postId;
            }else{
                formdata.sinceId=req.body.sinceId;
            }
            break;
        case "score":
            var area=typeof req.body.area=="undefined"?"":req.body.area;
            var address=typeof req.body.address=="undefined"?"":req.body.address;
            formdata.productId=code;
            if(req.body.productType=="coupon"){
                formdata.initAmount=1;
            }else{
                formdata.initAmount=req.body.number;
            }
            formdata.linkMobile=req.body.mobile;
            formdata.linkName=req.body.consumer;
            formdata.remark=req.body.remark;
            formdata.linkAddr=area+address;
            formdata.linkIdcard=req.body.accIdentification;
            formdata.travelDate=req.body.stockDate;
            formdata.leaveDate=req.body.endDate;
            formdata.showTime=req.body.zyxShowIds;
            formdata.productType=req.body.productType;
            break;
    }
    formdata.id=code;
    formdata.userName=req.body.consumer;
    formdata.mobile=req.body.mobile;
    formdata.couponAccId=req.body.couponAccId;

    common.needlePost(posturl,formdata,req,res,function(error,result){
        if(mold!="score"){
            req.session.loginName=encodeURI(req.body.consumer);
            req.session.mobile=req.body.mobile;
            req.session.certificateType=req.body.certificateType;
            req.session.idCard=req.body.accIdentification;
            res.redirect('/pay/'+mold+'?orderId='+result.orderId);
        }else{
            req.session.scoreResult=result.datas;
            res.redirect('/pay/scoreResult');
            // var options={title:'商城结果',items:result.datas,error:req.flash('error').toString()};
            // common.viewPage("scoreResult",options,req,res);
        }
    });
});


router.get('/cart/:mold/:code',function(req,res){
    var mold=req.params.mold,code=req.params.code;
    res.redirect('/order/'+mold+'/'+code);
});

router.post('/cart/:mold/:code',function(req,res){
    var address="";
    if(typeof req.body.area!="undefined"){
        address=req.body.area+req.body.address;
    }else{
        address=req.body.address;
    }
    var code=req.params.code,mold=req.params.mold,posturl=common.getUrl("cart","order"),formdata={
        beginDate:req.body.stockDate,
        price:req.body.price,
        amount:req.body.number,
        certificateType:req.body.certificateType,
        idCard:req.body.accIdentification,
        endDate:req.body.endDate,
        remark:req.body.remark,
        modelId:code,
        bnsType:mold=="line"?"zyx":mold,
        userName:req.body.consumer,
        mobile:req.body.mobile,
        stockId:req.body.stockId,
        address:address,
        postId:req.body.postId,
        sinceId:req.body.postId,
        couponAccId:req.body.couponAccId
    };
    if(typeof req.body.zyxShowIds!="undefined"){
        if(typeof req.body.zyxShowIds=="string"){
            if(req.body.zyxShowIds=="djx"){
                formdata.changci=req.body.zyxShowIds;
            }else{
                formdata.showTicketIds=req.body.zyxShowIds;
            }
        }else{
            for(var i=0,len=req.body.zyxShowIds.length;i<len;i++){
                if(i==0){
                    if(req.body.zyxShowIds[i]=="djx"){
                        posturl=common.changeURLPar(posturl,"changci",req.body.sci[i]);
                    }else{
                        posturl=common.changeURLPar(posturl,"showTicketIds",req.body.zyxShowIds[i]);
                    }
                }else{
                    if(req.body.zyxShowIds[i]=="djx"){
                        posturl+="&changci="+req.body.sci[i];
                    }else{
                        posturl+="&showTicketIds="+req.body.zyxShowIds[i];
                    }
                }
            }
        }
    }
    if(typeof req.body.zyxTicketIds!="undefined"){
        if(typeof req.body.zyxTicketIds=="string"){
            formdata.ticketIds=req.body.zyxTicketIds;
        }else{
            for(var i=0,len=req.body.zyxTicketIds.length;i<len;i++){
                if(i==0){
                    posturl=common.changeURLPar(posturl,"ticketIds",req.body.zyxTicketIds[i]);
                }else{
                    posturl+="&ticketIds="+req.body.zyxTicketIds[i];
                }
            }
        }
    }
    if(typeof req.body.hotelIds!="undefined"){
        if(typeof req.body.hotelIds=="string"){
            formdata.hotelIds=req.body.hotelIds;
        }else{
            for(var i=0,len=req.body.hotelIds.length;i<len;i++){
                if(i==0){
                    posturl=common.changeURLPar(posturl,"hotelIds",req.body.hotelIds[i]);
                }else{
                    posturl+="&hotelIds="+req.body.hotelIds[i];
                }
            }
        }
    }
    if(mold=="show"){
        formdata.stockId=req.body.zyxShowIds;
    }
    else if(mold=="goods"){

    }else{
        formdata.stockId=req.body.kid;
    }
    common.needlePost(posturl,formdata,req,res,function(error,result){
        req.session.loginName=encodeURI(req.body.consumer);
        req.session.mobile=req.body.mobile;
        req.session.certificateType=req.body.certificateType;
        req.session.idCard=req.body.accIdentification;
        res.redirect('/order/cart');
    });
});

router.get("/postage",function(req,res){
    res.json(req.session.postage);
});

router.get("/cart",function(req,res){
    var url=common.getUrl("cart","list");
    common.needleGet(url,req,res,function(err,results){
        var options={title:'购物车',items:results.datas,error: req.flash('error').toString()};
        common.viewPage("cart",options,req,res);
    });
}).post('/cart',function(req,res){
    var url=common.getUrl("cart","accounts");
    common.needlePost(url,{ids:req.body.ids},req,res,function(err,results){
        if(results.finalSum==0){
            var url=common.getUrl("paymold","zeroPay");
            common.needlePost(url,{orderNos:results.orderNos},req,res,function (err,result) {
                var resu=result.datas,name=encodeURIComponent(resu.name);
                res.redirect('/pay/payResult/0?orderId='+resu.orderId+"&name="+name+"&num="+resu.num);
            });
        }else{
            res.redirect('/pay/cart/?orderNos='+results.orderNos+"&finalSum="+results.finalSum);
        }
    })
});

module.exports = router;