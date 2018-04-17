var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");


//酒店房型数据
router.get("/itemlist",function(req,res){
    var prourl=common.getUrl("hotel","details").pro;
    var data={
        hotelId:req.query.code,
        beginDate:req.query.BeginDate,
        endDate:req.query.endDate
    };
    req.session.beginDate=req.query.BeginDate;
    req.session.endDate=req.query.endDate;
    common.needlePost(prourl,data,req,res,function(error,result){
        if(result.flag=="error"){
            res.json({"flag":result.flag,"msg":result.msg});
        }else{
            res.json({"flag":result.flag,"itemdata":result.datas.rooms});
        }
    },"ajax");
});

/* GET users listing. */
router.get('/:mold/:code', function(req, res, next) {
    if (req.params.mold === 'djbl'){
        next();
        return false;
    }
    var mold=req.params.mold,
        code=req.params.code,
        title=common.pageCommon(mold).title+"详情",
        imgUrl=common.getUrl(mold,"details").img,
        ticketUrl=common.getUrl(mold,"details").pro,
        commentUrl=common.getUrl("user","comment").get;
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
                common.needleGet(comboUrl,req,res,callback);
            },function(callback){
                common.needleGet(showUrl,req,res,callback);
            }],function(err, results){
                req.session.proId=code;
                commentUrl+="?productCode="+results[1].datas.productCode+"&productType="+mold;
                common.needleGet(commentUrl,req,res,function(err,result){
                    var resoption={title:'独木桥旅游网',mold:mold,item:results[1].datas,code:code,imgItems:results[0].datas,comboItems:results[2].data,commentItems:result,showItems:results[3].datas};
                    common.viewPage(mold+"details",resoption,req,res);
                });
            });
            break;
        case "hotel":
            var lineUrl=common.getUrl("line","list").page+"?hotelId="+code;
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
                    var resoption={title:title,mold:mold,hotelitem:results[1].datas,code:code,imgItems:results[0].datas,lineItems:results[2].data,commentItems:result,dates:[getday(0),getday(1)]};
                    common.viewPage(mold+"details",resoption,req,res);
                });
            });
            break;
        case "line":
            imgUrl+="?zyxId="+code;
            ticketUrl+="?zyxId="+code;
            async.parallel([function(callback){
                common.needleGet(imgUrl,req,res,callback);
            },function(callback){
                common.needleGet(ticketUrl,req,res,callback);
            }],function(err, results){
                commentUrl+="?productCode="+results[1].datas.zyxCode+"&productType=zyx";
                common.needleGet(commentUrl,req,res,function(err,result){
                    req.session.costinfo=results[1].datas.costInfo;
                    var resoption={title:title,mold:mold,item:results[1].datas,code:code,imgItems:results[0].datas,commentItems:result};
                    common.viewPage("zyxdetails",resoption,req,res);
                });
            });
            break;
        case "goods":
            var proUrl=common.getUrl("goods","details").main+"?id="+code;
            common.needleGet(proUrl,req,res,function(err,results){
                commentUrl+="?productCode="+results.datas.modelCode+"&productType="+mold;
                common.needleGet(commentUrl,req,res,function(err,result){
                    var resoption={title:title,mold:mold,item:results.datas,commentItems:result};
                    common.viewPage("detail",resoption,req,res);
                });
            });
            break;
    }
}).get('/djbl/:code',function (req,res){
    var options = {title:'独木桥旅游网'};

    common.viewPage('djbldetails',options,req,res);
});

module.exports = router;

function getday(num){
    var date=new Date();
    date.setDate(date.getDate()+num);
    var month=(date.getMonth()+1)>9?(date.getMonth()+1):"0"+(date.getMonth()+1);
    var day=date.getDate()>9?date.getDate():"0"+date.getDate();
    return date.getFullYear()+"-"+month+"-"+day
}