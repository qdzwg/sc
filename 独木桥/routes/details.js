var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");

function p(s) {
    return s < 10 ? '0' + s: s;
}

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+"-"+p(m)+"-"+p(d);
}

//详细页面构造
router.get('/:mold/:code', function(req, res,next) {
    var mold=req.params.mold,code=req.params.code,imgdataurl=common.getUrl(mold,"details").img+"?id="+code,prourl=common.getUrl(mold,"details").pro+"?id="+code,mainurl=common.getUrl(mold,"details").main+"?id="+code,commentUrl=common.getUrl("user","comment").get,query=req.query,title=common.pageCommon(mold).title+"详情",sresult=[];
    if(mold=="raiders"){
        next();
        return false;
    }
    var funarray=[function(callback){
        common.needleGet(imgdataurl,req,res,callback);//详细页面的图片数据
    },function(result,callback){
        sresult.push(result);
        common.needleGet(mainurl,req,res,callback);//详细页面的主题数据
    },function(result,callback){
        sresult.push(result);
        commentUrl+="?productCode="+result.productCode+"&productType="+mold;
        common.needleGet(commentUrl,req,res,callback);//详细页面评论数据
    }];
    switch (mold){
        case "ticket":
            funarray.push(function(result,callback){
                sresult.push(result);
                common.needleGet(prourl,req,res,callback);
            });
            break;
        case "hotel":
            prourl+="&BeginDate="+GetDateStr(0)+"&endDate="+GetDateStr(1);
            funarray.push(function(result,callback){
                sresult.push(result);
                common.needleGet(prourl,req,res,callback);
            });
            break;
        case "repast":
            funarray.push(function(result,callback){
                sresult.push(result);
                common.needleGet(prourl,req,res,callback);
            });
            break;
    };
    async.waterfall(funarray,function(err, results){
        sresult.push(results);
        var resoption={title:title,mold:mold,imgitems:sresult[0],mainitem:sresult[1],comment:sresult[2],code:code};
        var location={
            "lonlat":resoption.mainitem.location,
            "address":resoption.mainitem.addr
        };
        if(typeof location.lonlat=="string"){
            location.lonlat=location.lonlat.split(",");
        }
        var beforeDay=resoption.mainitem.beforeDay;
        //getNeedle.setinfo(beforeDay);
        req.session.location=location;
        req.session.beforeDay=beforeDay;
        req.session.min=resoption.mainitem.minNum;
        req.session.max=resoption.mainitem.maxNum;
        if(mold=="ticket"){
            resoption.proitem=results;
        }
        if(mold=="hotel"){
            resoption.mainitem.BeginDate=GetDateStr(0);
            resoption.mainitem.endDate=GetDateStr(1);
            resoption.mainitem.code=code;
            resoption.proitem=results;
        }
        if(mold=="repast"){
            resoption.proitem=results;
        }
        common.viewPage("details",resoption,res);
    });
},function(req, res){
    var mold=req.params.mold,code=req.params.code,mainurl=common.getUrl(mold,"details").main+"?id="+code,title=common.pageCommon(mold).title+"详情";
    async.waterfall([function(callback){
        common.needleGet(mainurl,req,res,callback);
    }],function(err, results){
        var options={title:title,main:results.data};
        common.viewPage("details",options,res);
    });
});

//评论页面
router.get("/comment/:mold/:code",function(req, res){
    var mold=req.params.mold,code=req.params.code,commentUrl=common.getUrl("user","comment").get+"?productCode="+code+"&productType="+mold;
    async.parallel([function(callback){
        common.needleGet(commentUrl,req,res,callback);
    }],function(err, results){
        var options={title:"评论列表",mold:mold,code:code,comment:results[0]};
        common.viewPage("comment",options,res);
    });
});

//酒店房型数据
router.get("/itemlist",function(req,res){
    var prourl=common.getUrl("hotel","details").pro+"?hotelId="+req.query.code+"&begDate="+req.query.BeginDate+"&endDate="+req.query.endDate;
    async.parallel([function(callback){
        common.needleGet(prourl,req,res,callback);
    }],function(err, results){
        res.json({itemdata:results[0].datas.rooms});
    });
});

//地图数据
router.get("/map",function(req,res){
    var location=req.session.location;
    res.json(location);
});

module.exports = router;