var needle = require('needle');
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
        open_timeout:0
    };
    var numargs = arguments.length,_arg=arguments;
    var newsUrl=changeURLPar(encodeURI(domian+url),"channel","PC");
    console.log(newsUrl);
    var needleget=needle.get(newsUrl,option,function(error, response, data){
        console.log(data);
        if (!error && response.statusCode == 200) {
            var javacookei=response.headers["set-cookie"];
            var cook=srtinArray("/PC/user_server_cookie_uid",javacookei);
            if(cook!=""){
                res.cookie(cook[0],cook[1]);
            }
            var result=typeof data=="string"?JSON.parse(data):data;
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
                            res.redirect('/login');
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
        headers:req.headers
    };
    var numargs = arguments.length;
    data.channel="PC";
    console.log(encodeURI(domian+url));
    console.log(data);
    needle.post(encodeURI(domian+url), data, option, function(err, resp) {
        var result=typeof resp.body=="string"?JSON.parse(resp.body):resp.body;
        console.log(result);
        var javacookei=resp.headers["set-cookie"];
        var cook=srtinArray("/PC/user_server_cookie_uid",javacookei);
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
                        viewPage("error",{"title":"错误页面",message:result.msg},req,res);
                        // req.flash('error',result.msg);
                        // res.redirect(req.originalUrl);
                        break;
                    case '5':
                    case 5:
                        req.session.curUrl=req.originalUrl;
                        res.redirect('/login');
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
    data.member=req.session.member;
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

exports.formatData = function(date){
    Date.prototype.format = function (format) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return format;
    };
};

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