var express = require('express');
var http = require("http");
var router = express.Router();
var iconv = require('iconv-lite');
var common=require("../common_modules/common");

router.get('/:mold',function (req,res) {
        var options={ title: '宋城旅游',mold:req.params.mold};
        common.viewPage("special",options,req,res);
});


module.exports = router;
