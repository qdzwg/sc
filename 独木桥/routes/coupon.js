var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");

router.get('/',function (req, res, next) {
    var options={title: '优惠券',mold:"coupon",error: req.flash('error').toString(),user:req.session.user};
    common.viewPage("coupon/index", options, req, res);
}).post('/',function (req,res) {
    var url = common.getUrl("login", "qpost");
    common.needlePost(url, req.body, req, res, function (err, result) {
        req.session.logined = true;
        req.session.user = result.user;
        res.redirect("/coupon");
    })
});

router.post('/getcoupon',function (req,res) {
    var url=common.getUrl("user","coupon").post+"?id=1162";
    common.needlePost(url,{},req,res,function (err,result) {
        res.json(result);
    },"ajax");
});

router.post('/getcouponAndbindIdcard',function (req,res) {
    var idcardUrl=common.getUrl("user","bindIdCard"),couponUrl=common.getUrl("user","coupon").post+"?id=1162";
    async.parallel([
            function(callback){
                common.needlePost(idcardUrl,req.body,req,res,function (err,result) {
                    req.session.user = result.user;
                    callback(null, result);
                });
            },
            function(callback){
                common.needlePost(couponUrl,{},req,res,function (err,result) {
                    callback(null, result);
                });
            }
        ],
        function(err, results){
            res.json(results[1]);
        });
});

router.get('/user',function (req,res) {
   res.json(req.session.user);
});
module.exports = router;