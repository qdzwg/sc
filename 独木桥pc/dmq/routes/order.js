var express = require('express');
var router = express.Router();
var async = require('async');

var querystring = require('querystring');
var common=require("../common_modules/common");

/* GET users listing. */
router.get('/:mold/:code', function(req, res, next) {
    if(req.params.mold=="getStock"||req.params.mold=="score"){
        next();
        return false;
    }
    var mold=req.params.mold,
        code=req.params.code==5423?5428:req.params.code,
        prourl=common.getUrl(mold,"order").getpro+"?id="+code,
        query=req.query,
        title=common.pageCommon(mold).title+"订单";
    if(mold=="line"){
        if(query.step==1){
            var imgUrl=common.getUrl(mold,"details").img+"?zyxId="+code;
            async.parallel([function(callback){
                common.needleGet(imgUrl,req,res,callback);
            },function(callback){
                common.needleGet(prourl,req,res,callback);
            }],function(err, results){
                req.session.lineData=results[1];
                var options={title:title,mold:mold,item:results[1],code:code,imgItems:results[0].datas,hrefquery:query};
                common.viewPage("zyxorderstep1",options,req,res);
            });
        }else if(query.step==2){
            var lineData=req.session.lineData;
            console.log(lineData);
            var priceMap=lineData.stockPriceMap,date=lineData.nowDate;
            for(var i=0;i<priceMap.length;i++){
                if(priceMap[i].date==date){
                    lineData.costPrice=priceMap[i].price;
                }
            }
            var options={ title: '独木桥旅游网',mold:mold,items:lineData,costinfo:req.session.costinfo,error:req.flash('error').toString()};
            common.viewPage("zyxorderstep2",options,req,res);
        }
    }else{
        async.parallel([function(callback){
            common.needleGet(prourl,req,res,callback);
        }],function(err, results){
            var options={ title: '独木桥旅游网',mold:mold,code:code,item:results[0],error:req.flash('error').toString()};
            if(mold=="hotel"){
                options.beginDate=req.session.beginDate;
                options.endDate=req.session.endDate;
            }
            common.viewPage(mold+"order",options,req,res);
        });
    }
}).get("/:mold/:code",function (req,res,next) {
    if(req.params.mold!="score"){
        next();
        return false;
    }
    var code=req.params.code,prourl=common.getUrl("score","order").getpro+"?id="+code,title=common.pageCommon("score").title+"订单";
    var proitems="";
    async.waterfall([function (callback) {
        common.needleGet(prourl,req,res,function (err,result) {
            if(result.datas.productType=="goods"||result.datas.productType=="entity"||result.datas.productType=="coupon"){
                var userdata=req.session.user;
                var civ=result.civ||"";
                var options={title:title,mold:"score",code:code,userdata:userdata,proitems:result.datas,error:req.flash('error').toString(),civ:civ};
                    common.viewPage("order",options,req,res);
            }else{
                var calendarUrl=common.getUrl(result.datas.productType,"order").getpro+"?modelCode="+result.datas.productCode;
                proitems=result;
                callback(null,calendarUrl);
            }
        });
    },function (calendarUrl,callback) {
        common.needleGet(calendarUrl,req,res,callback);
    }],function (err,results) {
        var userdata=req.session.user,stockPriceMap="";
        if(proitems.datas.productType!="show"){
            req.session.stockPriceMap=results.stockPriceMap;
            stockPriceMap=results.stockPriceMap;
        }else{
            req.session.stockPriceMap=results.datas.stockPriceMap;
            stockPriceMap=results.datas.stockPriceMap;
        }
        var _a = proitems.datas.beginDate.replace(/\s.*/ig, ''),
            _b = proitems.datas.endDate.replace(/\s.*/ig, '');
        
        sliceDate(stockPriceMap ? stockPriceMap : [], _a, _b);
        var options={title:title,mold:"score",code:code,userdata:userdata,proitems:proitems.datas,stockPriceMap:stockPriceMap,error:req.flash('error').toString()};
        common.viewPage("order",options,req,res);
    });
    // common.needleGet(prourl,req,res,function (err,result) {
    //     var userdata=req.session.user;
    //     var options={title:title,mold:"score",code:code,userdata:userdata,proitems:result.datas,error:req.flash('error').toString()};
    //     common.viewPage("order",options,req,res);
    // });
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
            }else if(query.id==5360||query.id==5361||query.id==5362){
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
                        if(session[i].playTime=="12:30"){
                            changeArray.push(session[i]);
                        }
                    }
                }
                resobj[0].datas.session=[];
                resobj[0].datas.session.push.apply(resobj[0].datas.session,changeArray);
            }
        }
        res.json(resobj);
    });
}).post('/:mold/:code',function(req, res, next){
    var code=req.params.code==5423?5428:req.params.code,mold=req.params.mold,posturl=common.getUrl(mold,"order").postpro,formdata={},lineData=req.session.lineData,query=req.query,address="";
    if (req.body.toType === 'cart'){
        if(typeof req.body.area!="undefined"){
            address=req.body.area+req.body.address;
        }else{
            address=req.body.address;
        }
        posturl=common.getUrl('cart',"add");
        switch (mold){
            case "ticket":
                formdata={
                    beginDate:req.body.playDate,
                    endDate:req.body.endDate,
                    price:req.body.price,
                    amount:req.body.amount,
                    certificateType:req.body.certificateType,
                    idcard:req.body.linkIdcard,
                    idCard:req.body.linkIdcard,
                    remark:req.body.remark,
                    modelId:code,
                    bnsType:mold,
                    userName:req.body.linkMan,
                    mobile:req.body.linkMobile,
                    showTicketIds:req.body.zyxShowIds,
                    ticketIds:req.body.zyxTicketIds,
                    hotelIds:req.body.hotelIds,
                    stockId:req.body.stockId,
                    address:address,
                    postId:req.body.postId,
                    sinceId:req.body.postId
                };
                break;
            case "hotel":
                formdata={
                    beginDate:req.body.begDate,
                    endDate:req.body.endDate,
                    price:req.body.price,
                    amount:req.body.amount,
                    certificateType:req.body.certificateType,
                    idcard:req.body.linkIdcard,
                    idCard:req.body.linkIdcard,
                    remark:req.body.remark,
                    modelId:code,
                    bnsType:mold,
                    userName:req.body.linkMan,
                    mobile:req.body.linkMobile
                };
                break;
            case "line":
                formdata={
                    beginDate:req.body.playDate,
                    price:req.body.price,
                    amount:req.body.amount,
                    certificateType:req.body.certificateType,
                    idcard:req.body.linkIdcard,
                    idCard:req.body.linkIdcard,
                    remark:req.body.remark,
                    modelId:code,
                    bnsType:'zyx',
                    userName:req.body.linkMan,
                    mobile:req.body.linkMobile,
                    //showTicketIds:req.body.zyxShowIds,
                    //ticketIds:req.body.zyxTicketIds,
                    hotelIds:req.body.hotelIds,
                    stockId:req.body.kid
                };

                if(typeof req.body.zyxShowIds!="undefined"){
                    var zyxShowIds=req.body.zyxShowIds.split(","),scis=req.body.sci.split(",");
                    console.log(zyxShowIds);
                    if(zyxShowIds.length==0){
                        if(req.body.zyxShowIds=="djx"){
                            formdata.changci=req.body.sci;
                        }else{
                            formdata.showTicketIds=req.body.zyxShowIds;
                        }
                    }else{
                        for(var i=0,len=zyxShowIds.length;i<len;i++){
                            if(i==0){
                                if(zyxShowIds[i]=="djx"){
                                    posturl+="?changci="+scis[i];
                                }else{
                                    posturl+="?showTicketIds="+zyxShowIds[i];
                                }
                            }else{
                                if(zyxShowIds[i]=="djx"){
                                    posturl+="&changci="+scis[i];
                                }else{
                                    posturl+="&showTicketIds="+zyxShowIds[i];
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
                                posturl+="?ticketIds="+req.body.zyxTicketIds[i];
                            }else{
                                posturl+="&ticketIds="+req.body.zyxTicketIds[i];
                            }
                        }
                    }
                }
                break;
            case "combo":
                formdata={
                    beginDate:req.body.playDate,
                    endDate:req.body.endDate,
                    price:req.body.price,
                    amount:req.body.amount,
                    certificateType:req.body.certificateType,
                    idcard:req.body.linkIdcard,
                    idCard:req.body.linkIdcard,
                    remark:req.body.remark,
                    modelId:code,
                    bnsType:mold,
                    userName:req.body.linkMan,
                    mobile:req.body.linkMobile,
                    //showTicketIds:req.body.sessionIds,
                    //ticketIds:req.body.zyxTicketIds,
                    hotelIds:req.body.hotelIds,
                    stockId:req.body.showIds,
                    address:address
                };
                if(typeof req.body.sessionIds!="undefined"){
                    if(typeof req.body.sessionIds=="string"){
                        formdata.showTicketIds=req.body.sessionIds;
                    }else{
                        for(var i=0,len=req.body.sessionIds.length;i<len;i++){
                            if(i==0){
                                posturl+="?showTicketIds="+req.body.sessionIds[i];
                            }else{
                                posturl+="&showTicketIds="+req.body.sessionIds[i];
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
                                posturl+="?ticketIds="+req.body.zyxTicketIds[i];
                            }else{
                                posturl+="&ticketIds="+req.body.zyxTicketIds[i];
                            }
                        }
                    }
                }
                break;
            case "show":
                formdata={
                    beginDate:req.body.playDate,
                    endDate:req.body.endDate,
                    price:req.body.price,
                    amount:req.body.amount,
                    certificateType:req.body.certificateType,
                    idcard:req.body.linkIdcard,
                    idCard:req.body.linkIdcard,
                    remark:req.body.remark,
                    modelId:code,
                    bnsType:mold,
                    userName:req.body.linkMan,
                    mobile:req.body.linkMobile,
                    showTicketIds:req.body.zyxShowIds,
                    ticketIds:req.body.zyxTicketIds,
                    hotelIds:req.body.hotelIds,
                    stockId:req.body.sessionId,
                    address:address,
                    postId:req.body.postId,
                    sinceId:req.body.postId
                };

                break;
            case "goods":
                formdata={
                    beginDate:req.body.playDate,
                    endDate:req.body.endDate,
                    price:req.body.price,
                    amount:req.body.amount,
                    certificateType:req.body.certificateType,
                    idcard:req.body.linkIdcard,
                    idCard:req.body.linkIdcard,
                    remark:req.body.remark,
                    modelId:code,
                    bnsType:mold,
                    userName:req.body.linkMan,
                    mobile:req.body.linkMobile,
                    showTicketIds:req.body.zyxShowIds,
                    ticketIds:req.body.zyxTicketIds,
                    hotelIds:req.body.hotelIds,
                    stockId:req.body.stockId,
                    address:address,
                    postId:req.body.postId,
                    sinceId:req.body.postId
                };
                break;
        }
    }else{
        switch (mold){
            case "ticket":
                formdata.stockDate=req.body.playDate;
                formdata.price=req.body.price;
                formdata.amount=req.body.amount;
                formdata.certificateType=req.body.certificateType;
                formdata.idcard=req.body.linkIdcard;
                formdata.idCard=req.body.linkIdcard;
                break;
            case "hotel":
                formdata.beginDate=req.body.begDate;
                formdata.endDate=req.body.endDate;
                formdata.price=req.body.price;
                formdata.amount=req.body.amount;
                formdata.certificateType=req.body.certificateType;
                formdata.idcard=req.body.linkIdcard;
                formdata.idCard=req.body.linkIdcard;
                formdata.remark=req.body.remark;
                break;
            case "line":
                lineData.kid=req.body.kid;
                lineData.zyxTicketIds=req.body.zyxTicketIds;
                lineData.hotelIds=req.body.room_id;
                lineData.zyxShowIds=req.body.ticket_play_date;
                lineData.nowDate=req.body.playDate;
                lineData.price=req.body.price;
                lineData.amount=req.body.ordNum;
                lineData.cangci=req.body.cangci;
                lineData.sci=req.body.sci;
                break;
            case "combo":
                formdata.kid=req.body.showIds;
                formdata.nowDate=req.body.playDate;
                formdata.price=req.body.price;
                formdata.amount=req.body.amount;
                formdata.certificateType=req.body.certificateType;
                formdata.idcard=req.body.linkIdcard;
                formdata.idCard=req.body.linkIdcard;
                formdata.linkName=req.body.linkMan;
                if(typeof req.body.sessionIds!="undefined"){
                    if(typeof req.body.sessionIds=="string"){
                        formdata.showTicketIds=req.body.sessionIds;
                    }else {
                        for (var i = 0, len = req.body.sessionIds.length; i < len; i++) {
                            if (i == 0) {
                                posturl += "?showTicketIds=" + req.body.sessionIds[i];
                            } else {
                                posturl += "&showTicketIds=" + req.body.sessionIds[i];
                            }
                        }
                    }
                }
                // if(typeof req.body.sessionIds!="undefined"){
                //     formdata.showTicketIds=req.body.sessionIds
                // }
                break;
            case "show":
                formdata.ticketId=req.body.ticketId;
                formdata.stockId=req.body.sessionId;
                formdata.nowDate=req.body.playDate;
                formdata.price=req.body.price;
                formdata.amount=req.body.amount;
                formdata.certificateType=req.body.certificateType;
                formdata.idcard=req.body.linkIdcard;
                formdata.idCard=req.body.linkIdcard;
                formdata.linkName=req.body.linkMan;
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
                formdata.productId=code;
                formdata.initAmount=req.body.amount;
                formdata.linkMobile=req.body.linkMobile;
                formdata.linkName=req.body.linkMan;
                formdata.remark=req.body.remark;
                formdata.linkAddr=req.body.province+req.body.province+req.body.city+req.body.district+req.body.address;
                formdata.linkIdcard=req.body.linkIdcard;
                formdata.travelDate=req.body.stockDate;
                formdata.leaveDate=req.body.endDate;
                formdata.showTime=req.body.sessionId;
                break;
        }
        formdata.id=code;
        formdata.userName=req.body.linkMan;
        formdata.mobile=req.body.linkMobile;
    }
        if(mold=="line"&&query.step==1){
            res.redirect('/order/line/'+code+'?step=2');
            return false;
        }
        if(mold=="line"&&query.step==2){
            formdata.kid=req.body.kid;
            //formdata.zyxTicketIds=req.body.zyxTicketIds;
            //formdata.hotelIds=req.body.hotelIds;
            //formdata.zyxShowIds=req.body.zyxShowIds;
            formdata.nowDate=req.body.playDate;
            formdata.price=req.body.price;
            formdata.amount=req.body.ordNum;
            formdata.certificateType=req.body.certificateType;
            formdata.idcard=req.body.linkIdcard;
            formdata.idCard=req.body.linkIdcard;
            formdata.linkName=req.body.linkMan;
            if(typeof req.body.hotelIds!="undefined"){
                if(typeof req.body.hotelIds=="string"){
                    if(req.body.hotelIds!=""){
                        formdata.hotelIds=req.body.hotelIds;
                    }
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
            if(typeof req.body.zyxTicketIds!="undefined"){
                if(typeof req.body.zyxTicketIds=="string"){
                    formdata.zyxTicketIds=req.body.zyxTicketIds;
                }else {
                    //formdata.zyxTicketIds=req.body.zyxTicketIds;
                    for (var i = 0, len = req.body.zyxTicketIds.length; i < len; i++) {
                        if (i == 0) {
                            posturl += "?zyxTicketIds=" + req.body.zyxTicketIds[i];
                        } else {
                            posturl += "&zyxTicketIds=" + req.body.zyxTicketIds[i];
                        }
                    }
                }
            }
            // if(typeof req.body.zyxShowIds!="undefined"){
            //     var zyxShowIds=req.body.zyxShowIds.split(","),scis=req.body.sci.split(",");
            //     if(zyxShowIds.length==0){
            //         if(req.body.zyxShowIds!=""){
            //             formdata.zyxShowIds=req.body.zyxShowIds;
            //         }else if(req.body.zyxShowIds=="djx"){
            //             formdata.changci=req.body.sci;
            //         }
            //     }else {
            //         //formdata.zyxShowIds=req.body.zyxShowIds;
            //         for (var i = 0, len = zyxShowIds.length; i < len; i++) {
            //             if (i == 0) {
            //                 if(zyxShowIds[i]=="djx"){
            //                     posturl += "?changci=" + scis[i];
            //                 }else{
            //                     posturl += "?zyxShowIds=" + zyxShowIds[i];
            //                 }
            //             } else {
            //                 if(zyxShowIds[i]=="djx"){
            //                     posturl += "&changci=" + scis[i];
            //                 }else{
            //                     posturl += "&zyxShowIds=" + zyxShowIds[i];
            //                 }
            //             }
            //         }
            //     }
            // }
        }
        common.needlePost(posturl,formdata,req,res,function(error,result){
            if(mold!="score"){
                if (req.body.toType === 'cart'){
                    res.redirect('/cart/list');
                }else{
                    res.redirect('/pay/'+mold+'/'+result.orderId);
                }
            }
            else {
                var options={title:'商城结果',items:result.datas,error:req.flash('error').toString()};
                common.viewPage("scoreResult",options,req,res);
            }
        });
});

// 下单
router.get('/cart/info/:code',function(req,res,next){  
    var orderNos = req.params.code;
    var url = common.getUrl('cart','reorder') + '?orderNos=' + orderNos;

    common.needleGet(url,req,res,function (err,results){
        var options={ title: '独木桥旅游网',listData:results.orderInfoVoList,orderNos:orderNos};

        common.viewPage("orderInfo",options,req,res);
    });
});

// 支付
router.get('/pay', function(req, res, next) {  
    var url = common.getUrl('cart','pay') + '?' + unescape(querystring.stringify(req.query));

    common.needleGet(url,req,res,function (err,results){
        res.send(results.datas);
    });
});

router.get('/hotel/room/:id',function (req,res,next) {
    var id=req.params.id,query=req.query,roomUrl=common.getUrl("hotel","order").rooms+"?id="+id+"&beginDate="+query.beginDate+"&endDate="+query.endDate;
    common.needleGet(roomUrl,req,res,function (err,result) {
        res.json(result);
    });
});

// 获取日期库存
router.post('/score/:mold/:code',function (req,res,next) {
    var mold = req.params.mold,
        url = common.getUrl(mold,"order").getpro,
        code = req.params.code;

    common.needlePost(url,mold === 'hotel' ? {id:code} : {modelCode:code},req,res,function(error,result){
        res.json(result);
    },'ajax');
});

module.exports = router;


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

function sliceDate(_a, _b, _c){
    _a.map(function (item, index){
        if (formatDate(item.date) > formatDate(_c) || formatDate(item.date) < formatDate(_b)){
            _a.splice(index,1);
        }
    });
}
function formatDate(_a){
    var  _b = _a.split('-');

    return new Date(_b[0], _b[1], _b[2]).getTime();
}

