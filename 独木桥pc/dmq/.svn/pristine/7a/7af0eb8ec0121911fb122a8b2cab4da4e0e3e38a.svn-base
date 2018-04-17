var express = require('express');
var router = express.Router();
var async = require('async');
var common=require("../common_modules/common");

/* GET users listing. */
router.get('/:mold', function(req, res, next) {
    var mold=req.params.mold;
    if(mold=="score"){
        var listUrl=common.getUrl("score","list");
        common.needleGet(listUrl,req,res,function (err,result) {
            var options={title:'积分商城',mold:"score",listitems:result.datas};
            common.viewPage("list"+mold,options,req,res);
        });
    }else{
        var options={ title: '宋城旅游',mold:mold};
        common.viewPage("list"+mold,options,req,res);
    }
});

module.exports = router;

