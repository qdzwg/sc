var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");

var mold="",pageUrl="";
router.get('/:mold',function(req, res, next){
    mold=req.params.mold;
    if(mold=="dropload"){
        next("route");
    }
    else{
        next();
    }
}, function(req, res,next) {
    if (mold=="raiders" || mold === 'promotion'||mold=="score"){
        next();
        return false;
    }
    var listurl=common.getUrl(mold,"list").page,title=common.pageCommon(mold).title+"列表",query=req.query;
    if(mold=="ticket"||mold=="hotel"){
        var city=query.city?query.city:"杭州";
        listurl+="?city="+city
    }
    pageUrl=listurl;
    async.parallel([function(callback){
        common.needleGet(listurl,req,res,callback);
    }],function(err, results){
        if(mold=="goods"){
            var options={title:title,mold:mold,listitems:results[0].datas};
        }else if(mold=="hotel"){
            var city=query.city?query.city:"杭州";
            var options={title:title,mold:mold,listitems:results[0].datas,city:city};
        }
        else if(mold=="line"){
            var options={title:title,mold:mold,listitems:results[0].datas};
        }
        else if(mold=="ticket"){
            var city=query.city?query.city:"杭州";
            var options={title:title,mold:mold,listitems:results[0].data,city:city};
        }
        else{
            var options={title:title,mold:mold,listitems:results[0].data};
            if(mold=="show"){
                common.setData(results[0].datas.items);
                options={title:title,mold:mold,listitems:results[0].datas.items};
            }
        }
        common.viewPage("list",options,req,res);
    });
},function(req, res,next){
    if (mold != 'raiders'){
        next();
        return false;
    }
    var listUrl=common.getUrl("raiders","list").page;
    common.needleGet(listUrl,req,res,function (err,result) {
        var options={title:'攻略',mold:"raiders",listitems:result.datas};
        for(var i=0,len=result.datas.length;i<len;i++){
            result.datas[i].content=escape(result.datas[i].content);
        }
        req.session.raiders=result.datas;
        common.viewPage("raiders",options,req,res);
    });
},function (req,res,next) {
    if (mold != 'score'){
        next();
        return false;
    }
    var listUrl=common.getUrl("score","list");
    pageUrl=listUrl;
    common.needleGet(listUrl,req,res,function (err,result) {
        var options={title:'积分商城',mold:"score",listitems:result.datas};
        common.viewPage("list",options,req,res);
    });
},function (req,res){
    var url01=common.getUrl('ticket','list').promotion + '?sales=1';
    var url02=common.getUrl('hotel','list').promotion + '?sales=1';
    var url03=common.getUrl('line','list').promotion + '?sales=1';
    var url04=common.getUrl('combo','list').page + '?sales=1';
    var url05=common.getUrl('goods','list').page + '?sales=1';
    var url06=common.getUrl('show','list').promotion + '?sales=1';
    async.parallel([function (callback) {
        common.needleGet(url06,req,res,callback);
    },function (callback) {
        common.needleGet(url01,req,res,callback);
    },function (callback) {
        common.needleGet(url02,req,res,callback);
    },function (callback) {
        common.needleGet(url03,req,res,callback);
    },function (callback) {
        common.needleGet(url04,req,res,callback);
    },function (callback) {
        common.needleGet(url05,req,res,callback);
    }],function (err,results) {
        var options = {title: '促销',listitems: results,mold:'promotion'};
        common.viewPage("list",options,req,res);
    });
});

router.get('/:mold',function(req,res){
    var query=req.query;
    for(var key in query){
        pageUrl=common.changeURLPar(pageUrl,key,query[key]);
    }
    async.parallel([function(callback){
        common.needleGet(pageUrl,req,res,callback);
    }],function(err, results){
        var result=results[0];
        if(result.flag=="success"&&typeof result.datas!="undefined"&&result.datas.items.length>0){
            res.json(result);
        }else{
            res.json({"flag":"error","msg":"暂无数据！"});
        }
    })
});

module.exports = router;