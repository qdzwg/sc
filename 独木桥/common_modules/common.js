var needle = require('needle');
// var qiniu = require("qiniu");
var domian="",baseUrl="",cacheData="";
//获取配置文件的数据接口地址
exports.getUrl=function(mold,pagemold){
    var config=require('./config.json');
    return config[mold][pagemold];
};

//needle从数据接口get数据
exports.needleGet=function(url,req,res,callback){
    var option={ 
        headers:req.headers,
        rejectUnauthorized: false,
        open_timeout:0
    }; 
    var numargs = arguments.length,_arg=arguments;
    var newsUrl=changeURLPar(encodeURI(domian+url),"channel","WAP");
    console.log(newsUrl);
    var needleget=needle.get(newsUrl,option,function(error, response, data){
        console.log(data);
        //console.log(response.headers);
        if (!error && response.statusCode == 200) {
            var javacookei=response.headers["set-cookie"];
            var cook=srtinArray("/WAP/user_server_cookie_uid",javacookei);
            var result=typeof data=="string"?JSON.parse(data):data;
            if(cook!=""&&result.level!=5){
                res.cookie(cook[0],cook[1]);
            }
            if(numargs>4&&_arg[4]=="ajax"){
                callback(null, result);
            }else{
                if(result.flag=="error"){
                    switch (result.level){
                        case '1':
                        case 1:
                            viewPage("error",{"title":"错误页面",message:result.msg},req,res);
                            break;
                        case 5:
                        case '5':
                            req.session.curUrl=req.originalUrl;
                            res.redirect('/quickLogin');
                            return false;
                            break;
                        default:
                            res.redirect('/error');
                            break;
                    }
                }else{
                    callback(null, result);
                }
            }
        }else {
            res.redirect('/error');
        }
    });
    if(numargs>4&&arguments[4]!="ajax"){
        needleget.pipe(arguments[4]);
    }
};

//needle从数据接口post数据
exports.needlePost=function(url,data,req,res,callback){
    var option={
        headers:req.headers,
        "content-type":"text/html;charset=utf-8",
        open_timeout:0
    };
    var numargs = arguments.length;
    data.channel="WAP";
     console.log(url);
    console.log(data);
    needle.post(encodeURI(domian+url), data, option, function(err, resp) {
        console.log(resp.body);
        var result=typeof resp.body=="string"?JSON.parse(resp.body):resp.body;
        var javacookei=resp.headers["set-cookie"];
        var cook=srtinArray("/WAP/user_server_cookie_uid",javacookei);
        if(cook!=""){
            res.cookie(cook[0],cook[1]);
        }
        if(numargs>5){
            callback(null, result);
        }else{
            if(result.flag=="error"){
                switch (result.level){
                    case '1':
                    case 1:
                        req.flash('error',result.msg);
                        res.redirect(req.originalUrl);
                        break;
                    case '2':
                    case 2:
                        callback(null, result);
                        break;
                    case '5':
                    case 5:
                        req.session.curUrl=req.originalUrl;
                        res.redirect('/quickLogin');
                        break;
                    default:
                        res.redirect('/error');
                        break;
                }
            }else{
                callback(null, result);
            }
        }
    });
};

//网站公共信息
exports.pageCommon=function(mold){
    var title="",sortItem="";
    switch (mold){
        case "ticket":
            title="景区";
            sortItem=[{"title":"默认排序","sortType":""},{"title":"销售最高","sortType":1},{"title":"价格最低","sortType":4},{"title":"评分最高","sortType":5}];
            break;
        case "hotel":
            title="酒店";
            sortItem=[{"title":"默认排序","sortType":""},{"title":"销售最高","sortType":1},{"title":"价格最低","sortType":4},{"title":"距离最近","sortType":8}];
            break;
        case "route":
            title="跟团游";
            sortItem=[{"title":"默认排序","sortType":""},{"title":"销售最高","sortType":1},{"title":"价格最低","sortType":4}];
            break;
        case "line":
            title="自由行";
            sortItem=[{"title":"默认排序","sortType":""},{"title":"销售最高","sortType":1},{"title":"价格最低","sortType":4}];
            break;
        case "repast":
            title="餐饮";
            sortItem=[{"title":"默认排序","sortType":""},{"title":"销售最高","sortType":1},{"title":"人均最低","sortType":4},{"title":"人均最高","sortType":3},{"title":"距离最近","sortType":8},{"title":"评分最高","sortType":5}];
            break;
        case "goods":
            title="商品";
            sortItem=[{"title":"默认排序","sortType":""},{"title":"销售最高","sortType":1},{"title":"价格最低","sortType":4}];
            break;
        case "raiders":
            title="攻略";
            break;
        case "news":
            title="新闻";
        case "combo":
            title="套票";
            break;
        case "score":
            title="积分商城";
            break;
    }
    return {
        title:title,
        sortItem:sortItem
    };
};

//改变地址栏参数
function changeURLPar(destiny, par, par_value){
    var pattern = par+'=([^&]*)';
    var replaceText = par+'='+par_value;
    if (destiny.match(pattern))
    {
        var tmp = '/\\'+par+'=[^&]*/';
        tmp=tmp.replace(/\\/,"");
        tmp = destiny.replace(eval(tmp),replaceText);
        return (tmp);
    }
    else
    {
        if (destiny.match('[\?]'))
        {
            return destiny+'&'+ replaceText;
        }
        else
        {
            return destiny+'?'+replaceText;
        }
    }
    return destiny+'\n'+par+'\n'+par_value;
};
exports.changeURLPar=changeURLPar;

//渲染页面
function viewPage(page,data,req,res){
    data.baseUrl=baseUrl;
    //console.log(req.session);
    if(req.session&&req.session.logined){
        data.logined=req.session.logined;
        data.user=req.session.user;
        console.log(req.session.user);
    }else{
        data.logined=false;
    }
    res.render(page,data);
}
exports.viewPage=viewPage;

//设置数据
exports.setData=function(data){
    cacheData=data;
};

//获取子数据
exports.getItemData=function(id){
    var itemData={};
    for(var i= 0,len=cacheData.length;i<len;i++){
        if(cacheData[i].id==id){
            itemData=cacheData[i];
        }
    }
    return itemData;
};

//判断是否是微信环境
function is_weixn(req){
    var ua = req.headers["user-agent"].toLowerCase();
    return ua.match(/MicroMessenger/i)=="micromessenger";
}
exports.isWeixin=is_weixn;

function p(s){
    return s < 10 ? '0' + s: s;
}
exports.p=p;

exports.wxconfig=function () {
    return{
            appid: 'wxdb8ccff67f6ee551'
            ,secret: 'c12eb9e7a67db0ed4fc0c6b978ae454b'
        }
};
// exports.uploadFile=function (localFile,callback) {
//     qiniu.conf.ACCESS_KEY = 'vWh1Hdlnij20b-bTJVb9-0Ew88akCxPDn4U-WN9V';
//     qiniu.conf.SECRET_KEY = 'dzy607NBOX0yYRNilprN4_x78CiQX_2qsFgZmxxM';
//     var bucket = 'song-workspace',key = 'my-nodejs-logo.png';
//     var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
//     putPolicy.callbackUrl = 'https://static.51dmq.com/';
//     putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
//     var extra = new qiniu.io.PutExtra();
//     qiniu.io.putFile(putPolicy.token(), key, localFile, extra, function(err, ret) {
//         if(!err) {
//             // 上传成功， 处理返回值
//             callback(ret);
//             console.log(ret.hash, ret.key, ret.persistentId);
//         } else {
//             // 上传失败， 处理返回代码
//             console.log(err);
//         }
//     });
// };

function srtinArray(str,array) {
    var array=array||[];
    var len=array.length,cook="";
    for(var i=0;i<len;i++){
        var cookei=array[i].split(";")[0].split("=");
        if(cookei[0]==str){
            cook= cookei;
        }
    }
    return cook;
}