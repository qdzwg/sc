var express = require('express');
var router = express.Router();
var async = require('async');

var querystring = require('querystring');
var common=require("../common_modules/common");

// 购物车列表
router.get('/list', function(req, res, next) {  
    var url = common.getUrl('cart','list');

    common.needleGet(url,req,res,function (err,results){
        var options={ title: '宋城旅游购物车',listData: results.datas};

        common.viewPage("cart/list",options,req,res);
    });
});

// 加入购物车
/*router.post('/add', function(req, res, next) { 
    var data = req.body; 
    var url = common.getUrl('cart','add');
 
    common.needlePost(url,data,req,res,function (err,results){
        res.send(results);
    });
});
*/
// 购物车删除
router.get('/dele', function(req, res, next) {  
    var url = common.getUrl('cart','del') + '?' + querystring.stringify(req.query);

    common.needleGet(url,req,res,function (err,results){
        var options={ title: '宋城旅游购物车',message: results.msg};

        common.viewPage("error",options,req,res);
    });
});

// 购物车结算
router.get('/order', function(req, res, next) {  
    var url = common.getUrl('cart','accounts') + '?' + unescape(querystring.stringify(req.query));

    common.needleGet(url,req,res,function (err,results){
        res.send(results.orderNos);
    });
});


module.exports = router;