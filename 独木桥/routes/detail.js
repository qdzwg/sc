var express = require('express');
var router = express.Router();
var async = require('async');
var jsSHA = require('jssha');
var common=require("../common_modules/common");

router.get('/:mold/:code',function(req,res,next){
    if(req.params.mold=="article"){
        next("route");
        return false;
    }
    if(req.params.code==null||req.params.code=="null"||typeof req.params.code=="undefined"||req.params.code=="undefined"){
        return false;
    }
    var mold=req.params.mold,code=req.params.code,item=common.getItemData(code),title=common.pageCommon(mold).title+"详情",imgUrl=common.getUrl(mold,"details").img,ticketUrl=common.getUrl(mold,"details").pro,commentUrl=common.getUrl("user","comment").get,query=req.query;
    switch (mold){
        case "ticket":
            var showUrl=common.getUrl("show","list").page+"?parkId="+code,comboUrl=common.getUrl("combo","list").page+"?parkId="+code;
                imgUrl+="?id="+code;
                ticketUrl+="?parkId="+code;
            async.parallel([function(callback){
                common.needleGet(imgUrl,req,res,callback);
            },function(callback){
                common.needleGet(ticketUrl,req,res,callback);
            },function(callback){
                common.needleGet(showUrl,req,res,callback);
            },function(callback){
                common.needleGet(comboUrl,req,res,callback);
            }],function(err, results){
                req.session.proId=code;
                commentUrl+="?productCode="+results[1].datas.productCode+"&productType="+mold;
                common.needleGet(commentUrl,req,res,function(err,result){
                    var location={
                        "lonlat":results[1].datas.location,
                        "address":results[1].datas.address
                    };
                    if(typeof location.lonlat=="string"){
                        location.lonlat=location.lonlat.split(",");
                    }
                    req.session.location=location;
                    req.session.jqjs=encodeURI(results[1].datas.desc);
                    req.session.ydxz=encodeURI(results[1].datas.ordrNotice);
                    var resoption={title:title,mold:mold,item:results[1].datas,code:code,imgItems:results[0].datas,showItems:results[2].datas,comboItems:results[3].data,commentItems:result.datas,flag:query.flag};
                    common.viewPage("detail",resoption,req,res);
                });
            });
            break;
        case "hotel":
            var lineUrl=common.getUrl("line","list").promotion+"?hotelId="+code;
            imgUrl+="?hotelId="+code;
            ticketUrl+="?hotelId="+code;
            req.session.beginDate=getday(0);
            req.session.endDate=getday(1);
            async.parallel([function(callback){
                common.needleGet(imgUrl,req,res,callback);
            },function(callback){
                common.needleGet(ticketUrl,req,res,callback);
            },function(callback){
                common.needleGet(lineUrl,req,res,callback);
            }],function(err, results){
                req.session.proId=code;
                commentUrl+="?productCode="+results[1].datas.productCode+"&productType="+mold;
                common.needleGet(commentUrl,req,res,function(err,result){
                    var location={
                        "lonlat":results[1].datas.location,
                        "address":results[1].datas.addr
                    };
                    if(typeof location.lonlat=="string"){
                        location.lonlat=location.lonlat.split(",");
                    }
                    req.session.location=location;
                    req.session.jdjs=encodeURI(results[1].datas.desc);
                    req.session.ydxz=encodeURI(results[1].datas.orderNoticeString);
                    var resoption={title:title,mold:mold,item:results[1].datas,code:code,imgItems:results[0].datas,lineItems:results[2].data,commentItems:result,flag:query.flag};
                    common.viewPage("detail",resoption,req,res);
                });
            });
            break;
        case "line":
            imgUrl+="?zyxId="+code;
            ticketUrl+="?temId="+code;
            async.parallel([function(callback){
                common.needleGet(ticketUrl,req,res,callback);
            }],function(err, results){
                req.session.ydxz=encodeURI(results[0].notice);
                req.session.xcjs=encodeURI(results[0].tripIntroduce);
                req.session.jtxx=encodeURI(results[0].traffic);
                req.session.jj=encodeURI(results[0].introduction);
                var curl=common.getUrl("line","details").comment+"?temId="+results[0].temId;
                common.needleGet(curl,req,res,function(err,result){
                    var resoption={title:title,mold:mold,item:results[0],code:code,commentItems:result,flag:query.flag};
                    common.viewPage("detail",resoption,req,res);
                });
            });
            break;
        case "combo":
            imgUrl+="?id="+code;
            ticketUrl+="?id="+code;
            async.parallel([function(callback){
                common.needleGet(imgUrl,req,res,callback);
            },function(callback){
                common.needleGet(ticketUrl,req,res,callback);
            }],function(err, results){
                commentUrl+="?productCode="+results[1].datas.modelCode+"&productType="+mold;
                common.needleGet(commentUrl,req,res,function(err,result){
                    var resoption={title:title,mold:mold,item:results[1].datas,code:code,imgItems:results[0].datas,commentItems:result,flag:query.flag};
                    common.viewPage("detail",resoption,req,res);
                });
            });
            break;
        case "goods":
            var proUrl=common.getUrl("goods","details").main+"?id="+code;
            common.needleGet(proUrl,req,res,function(err,results){
                commentUrl+="?productCode="+results.datas.modelCode+"&productType="+mold;
                common.needleGet(commentUrl,req,res,function(err,result){
                    var resoption={title:title,mold:mold,item:results.datas,code:code,commentItems:result.datas,flag:query.flag};
                    common.viewPage("detail",resoption,req,res);
                });
            });
            break;
        case "raiders":
            var raiders=req.session.raiders;
            for(var i=0,len=raiders.length;i<len;i++){
                if(raiders[i].id==code){
                    raiders[i].content=unescape(raiders[i].content);
                    var resoption={title:title,mold:mold,item:raiders[i],flag:query.flag};
                    common.viewPage("articleDetails",resoption,req,res);
                }
            }
            break;
    }
});

//酒店房型数据
router.get("/itemlist",function(req,res){
    var prourl=common.getUrl("hotel","details").pro+"?hotelId="+req.query.code+"&beginDate="+req.query.BeginDate+"&endDate="+req.query.endDate;
    req.session.beginDate=req.query.BeginDate;
    req.session.endDate=req.query.endDate;
    common.needleGet(prourl,req,res,function(error,result){
        if(result.flag=="error"){
            res.json({"flag":result.flag,"msg":result.msg});
        }else{
            res.json({"flag":result.flag,"itemdata":result.datas.rooms});
        }
    },"ajax");
});

//地图数据
router.get("/map",function(req,res){
    var location=req.session.location;
    res.json(location);
});

//微信分享
var cachedSignatures = {};
var expireTime = 7200 - 100;
router.get("/wxshare",function(req,res){
    if(!req.session.logined){
        res.json({"msg":"unload","flag":"error"});
        return false;
    }
    var appIds=common.wxconfig();
    var _url = req.query.url,
        tokenurl='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ appIds.appid +'&secret=' + appIds.secret;
    var signatureObj = cachedSignatures[_url];
    // 如果缓存中已存在签名，则直接返回签名
    if(signatureObj && signatureObj.timestamp){
        var t = createTimeStamp() - signatureObj.timestamp;
        // 未过期，并且访问的是同一个地址
        // 判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
        if(t < expireTime && signatureObj.url == _url){
            res.json({
                nonceStr: signatureObj.nonceStr
                ,timestamp: signatureObj.timestamp
                ,appid: signatureObj.appid
                ,signature: signatureObj.signature
                ,url: signatureObj.url
                ,iswx:common.isWeixin(req)
            });
            return false;
        }
        // 此处可能需要清理缓存当中已过期的数据
    }
    async.waterfall([function (callback) {
        common.needleGet(tokenurl,req,res,function (err,result) {
            var getticketUrl='https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ result.access_token +'&type=jsapi';
            callback(null,getticketUrl);
        });
    },function (url,callback) {
        common.needleGet(url,req,res,callback);
    }],function (err,result) {
        var appid = appIds.appid;
        var ts = createTimeStamp();
        var nonceStr = createNonceStr();
        var ticket = result.ticket;
        var signature = calcSignature(ticket, nonceStr, ts, _url);
        cachedSignatures[_url] = {
            nonceStr: nonceStr
            ,appid: appid
            ,timestamp: ts
            ,signature: signature
            ,url: _url
        };
        res.json({nonceStr: nonceStr,timestamp: ts,appid: appid,signature: signature,url: _url,iswx:common.isWeixin(req)});
    });
});

router.post('/getShareScore',function (req,res) {
   var url=common.getUrl("user","wxshare").post;
   common.needlePost(url,req.body,req,res,function (err,result) {
       if(result.flag=="error"){
            if(result.level=="1"){
                res.json({"msg":"error","flag":"error"});
            }else if(result.level=="5"){
                res.json({"msg":"unload","flag":"error"});
            }
       }else{
           res.json(result);
       }
   },"ajax");
});

function getday(num){
    var date=new Date();
    date.setDate(date.getDate()+num);
    var month=(date.getMonth()+1)>9?(date.getMonth()+1):"0"+(date.getMonth()+1);
    var day=date.getDate()>9?date.getDate():"0"+date.getDate();
    return date.getFullYear()+"-"+month+"-"+day
}

//评论页面
router.get("/comment/:mold/:code",function(req, res){
    var mold=req.params.mold,code=req.params.code,commentUrl=common.getUrl("user","comment").get+"?productCode="+code+"&productType="+mold;
    async.parallel([function(callback){
        common.needleGet(commentUrl,req,res,callback);
    }],function(err, results){
        var options={title:"评论列表",mold:mold,code:code,comment:results[0].datas};
        common.viewPage("comment",options,req,res);
    });
});

//文章信息获取
router.get("/article/:mold",function (req,res) {
    var mold=req.params.mold;
    var info=req.session[mold];
    console.log(decodeURI(info));
    res.json({info:decodeURI(info)});
});

// 随机字符串产生函数
var createNonceStr = function() {
    return Math.random().toString(36).substr(2, 15);
};

// 时间戳产生函数
var createTimeStamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

// 计算签名
var calcSignature = function (ticket, noncestr, ts, url) {
    var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp='+ ts +'&url=' + url;
    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(str);
    return shaObj.getHash('HEX');
}
module.exports = router;