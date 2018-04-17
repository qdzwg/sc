var winWidth=$(window).width();
$("html").css("fontSize",(winWidth/640)*40+"px");

//var browser={
//    versions:function(){
//        var u = navigator.userAgent, app = navigator.appVersion;
//        return {//移动终端浏览器版本信息
//            trident: u.indexOf('Trident') > -1, //IE内核
//            presto: u.indexOf('Presto') > -1, //opera内核
//            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
//            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
//            mobile: !!u.match(/AppleWebKit.*Mobile.*/)||u.indexOf('iPad') > -1, //是否为移动终端
//            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
//            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
//            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
//            iPad: u.indexOf('iPad') > -1, //是否iPad
//            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
//        };
//    }(),
//    language:(navigator.browserLanguage || navigator.language).toLowerCase()
//};
//
//var detectBrowser = function(name) {
//	if(navigator.userAgent.toLowerCase().indexOf(name) > -1) {
//	    return true;
//	} else {
//	    return false;
//	}
//};
//var width = parseInt(window.screen.width);
//var scale = width/640;
//var userScalable = 'no';
//if(detectBrowser("qq/")) userScalable = 'yes';
//browser.versions.iPad ? document.getElementById('viewport').setAttribute( 'content', 'width=640, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1') : document.getElementById('viewport').setAttribute( 'content', 'target-densitydpi=device-dpi,width=640,user-scalable='+userScalable+',initial-scale=' + scale);



$(function () {
    // 轮播
    if($('#home_slider').size()>0){
        $('#home_slider').flexslider({
            animation : 'slide',
            controlNav : true,
            directionNav : true,
            animationLoop : true,
            slideshow : false,
            useCSS : false,
            slideshow:true,
            slideshowSpeed: 3000
        });
    }
    if($('#tab').size()>0){
        tabs.init("tab");
    }
    if($('.number').size()>0){
        var mold=$('.number').data("mold");
        if(mold=="hotel"){
            $("#totalprice").text($("#cost-total").data("total")).data("price",$("#cost-total").data("total"));
        }else if(mold=="score"){
            $("#totalprice").text($("#price").text()*$(".number").text()).data("price",$("#price").text()*$(".number").text());
        }else{
            if($("#route-list").length>0){
                var totalp= 0;
                $(".route-price").each(function(){
                    var price=$(this).find("strong").text();
                    totalp=operation.accAdd(totalp,operation.accMul(price,$(this).find(".number").val()));
                });
                $("#totalprice").text(totalp).data("price",totalp);
            }
            else{
                totalprice($(".number").data("min"));
            }
        }

        $("input.number").each(function(){
            var min=$(this).data("min"),max=$(this).data("max"),mold=$(this).data("mold");
            $(this).numSpinner({
                min:min,
                max:max,
                onChange:function(evl,value){
                    if(mold=="hotel"){
                        var unitPrice=0;
                        $("#cost").find("li:not(:last)").each(function () {
                            unitPrice+=Number($(this).find(".price").find("strong").text());
                        });
                        console.log(unitPrice);
                        // var total=$("#cost-total").data("total"),num=$("#differDay").text(),price=$("#price").text();
                        $("#cost-total").find("span").find("strong").text(operation.accMul(unitPrice,value));
                        // console.log(operation.accMul(num,operation.accMul(value,price)));
                        $("#totalprice").text(operation.accMul(unitPrice,value)).data("price",operation.accMul(unitPrice,value));
                        $(".cost-num").text("*"+value);
                    }
                    else if(mold=="line"){
                        var quantity=$('.number').val(),price=$("#price").text();
                        $('.cNum').text(quantity);
                        $('#totalprice').text(operation.accMul(value,price)).data("price",operation.accMul(value,price));
                    }
                    else if(mold=="refund"){
                        refund(value);
                    }
                    else{
                        if($("#route-list").length>0){
                            if($(evl).hasClass("adult-number")){
                                $(".adult-number").numSpinner("max",max-$(".children-number").val());
                            }else{
                                $(".children-number").numSpinner("max",max-$(".adult-number").val());
                            }
                            routetotalprice();
                        }
                        else{
                            totalprice(value);
                        }
                    }
                }
            });
        });
    }
    $("#mask").height($(document).height());
    $(".tips-wrapper").css("min-height",$(window).height());

    $(".article-btn").click(function(){
        var div=$(this).data("url"),title=$(this).parent().prev().text();
        $(".article-panel").hide();
        $("#layer,#mask").show();
        $("#layer").find(".article-title").text(title);
        $.get('/detail/article/'+div,function (data) {
            $("#layer").find(".article-content").html(data.info);
        })
    });
    $("#detailsList").on("click",".pro-item-btn",function(){
        var title=$(this).data("title"),desc=$(this).next().val();
        $(".article-panel").hide();
        $("#layer").show().find(".article-title").text(title).end().find(".article-content").html(desc);
        $("#mask").show();
    });
    $("#detailsList").on("click",".article-btn",function(){
        var div=$(this).data("url");
        $(".article-panel").hide();
        $("#"+div).show();
        $("#mask").show();
    });
    $(".zyx-article-btn").click(function () {
        var div=$(this).data("url");
        $(".article-panel").hide();
        $("#"+div).show();
        $("#mask").show();
    });
    $("#mask").click(function(){
        $(".article-panel,#mask,.season-box,#winningBox,#errorBox,#couponPanel,#shareLayer,.coupon-dialog,.articleLayer-panel").hide();
        $("#comments,#refund").removeClass("comment-show");
        $("#goodsPanel").removeClass("goods-show");
    });
    $("#warningClose").click(function () {
        $("#tipsWarning,#maskWarning,#warningClose").hide();
    });
    //touch.on('#mask', 'touchstart', function(ev){
    //	ev.preventDefault();
    //});
    $(".close").click(function(){
        $(".article-panel,#mask").hide();
        $("#comments").removeClass("comment-show");
    });
    $("#detailsList").on("click",".close",function(){
        $(".article-panel,#mask").hide();
        $("#comments").removeClass("comment-show");
    });
    setTimeout(function(){
        $("#msgTips").removeClass("fadeOut-common");
    },3000);

    if($("#calendar").size()>0){
        $("#calendar-btn").click(function(){
            $("#calendar-box").addClass("calendar-show");
            var service=$(this).data("service");
            if(service=="detail"){
                var code=$(this).data("code");
                $("#calendar").calendar({
                    onClick:function(evl,date,price){
                        $("#calendar-box").removeClass("calendar-show");
                        $("#beginDate").text(date[0]);
                        $("#endDate").text(date[1]);
                        var num=date[0]==date[1]?"1":dateDiff(date[0],date[1]);
                        $("#days").text(num);
                        $.get("/detail/itemlist",{BeginDate:date[0],endDate:date[1],code:code},function(data){
                            if(data.itemdata.length>0){
                                $(".hotel-detailsList").html(list(data.itemdata));
                                $(".swiper-wrapper").height($(".hotel-detailsList").outerHeight(true)+$(".page-calendar").outerHeight(true));
                            }else{
                                $("#detailsList").html("<div class='no-info'>暂无信息！</div>");
                            }
                        },"json");
                    },
                    multiselect:true,
                    selecteday:[$("#beginDate").text(),$("#endDate").text()]
                });
            }
            else if($(this).data("type")=="score"){
                var mold=$(this).data("mold");
                $.get("/calendar/score",{code:$(this).data("code"),mold:mold},function(data){
                    var optionsdays=[];
                    var termBegin=$('#termBegin').text(),termEnd=$("#termEnd").text();
                    $.each(data,function (i) {
                        if((data[i].date>termBegin||data[i].date==termBegin)&&(data[i].date<termEnd||data[i].date==termEnd)){
                            delete data[i].price;
                            optionsdays.push(data[i]);
                        }
                    });
                    var options={
                        onClick:function (evl,date,price) {
                            $("#calendar-box").removeClass("calendar-show");
                            switch (mold){
                                case "ticket":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#totalprice").text($(".number").val()*$("#price").text()).data("price",$(".number").val()*$("#price").text());
                                    break;
                                case "hotel":
                                    $("#beginDate").text(date[0]);
                                    $('#hid-beginDate').val(date[0]);
                                    $("#endDate").text(date[1]);
                                    $('#hid-endDate').val(date[1]);
                                    var num=date[0]==date[1]?"1":dateDiff(date[0],date[1]);
                                    $("#differDay").text(num);
                                    var html="",prices=0;
                                    for(var i= 0,len=price.length;i<len-1;i++){
                                        html+='<li><span class="cost-data">'+GetDateStr(date[0],i)+'</span><span class="price"><em>￥</em><strong>'+price[i]+'</strong></span><span class="cost-num">*'+$(".number").val()+'</span></li>';
                                        prices=operation.accAdd(prices,price[i]);
                                    }
                                    html+="<li data-total="+$(".number").val()*prices+" id='cost-total'>订单总额：<span><em>￥</em><strong>"+$(".number").val()*prices+"</strong></span></li>";
                                    $("#cost").find("ul").html(html).end().css({
                                        bottom:-$("#cost").height()
                                    });
                                    $("#totalprice").text($(".number").val()*$("#price").text()*$("#differDay").text()).data("price",$(".number").val()*$("#price").text()*$("#differDay").text());
                                    break;
                                case "line":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#totalprice").text($(".number").val()*$("#price").text()).data("price",$(".number").val()*$("#price").text());
                                    $("#hid-kid").val($(evl).find(".price").data("kid"));
                                    getStock(date);
                                case "combo":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#totalprice").text($(".number").val()*$("#price").text()).data("price",$(".number").val()*$("#price").text());
                                    $("#hid-kid").val($(evl).find(".price").data("kid"));
                                    getStock(date);
                                    break;
                                case "show":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#totalprice").text($(".number").val()*$("#price").text()).data("price",$(".number").val()*$("#price").text());
                                    getStock(date);
                                    break;
                            }
                        },
                        selecteday:$("#calendar-btn").find(".order-time").text(),
                        optionsdays:optionsdays
                    };
                    if(mold=="hotel"){
                        options.multiselect=true;
                    }
                    $("#calendar").calendar(options);
                });
            }
            else{
                var mold=$(this).data("mold");
                $.get("/calendar/"+mold,{code:$(this).data("code")},function(data){
                    console.log(data);
                    var options={
                        onClick:function(evl,date,price){
                            $("#calendar-box").removeClass("calendar-show");
                            switch (mold){
                                case "ticket":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#hid-price").val(price);
                                    $("#price").text(price);
                                    _localPrice = $(".number").val()*price;
                                    $("#totalprice").text(operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0).data("price",operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0);
                                    break;
                                case "hotel":
                                    $("#beginDate").text(date[0]);
                                    $('#hid-beginDate').val(date[0]);
                                    $("#endDate").text(date[1]);
                                    $('#hid-endDate').val(date[1]);
                                    var num=date[0]==date[1]?"1":dateDiff(date[0],date[1]);
                                    $("#differDay").text(num);
                                    $("#hid-price,#price").val(svgPrice(price));
                                    var html="",prices=0;
                                    for(var i= 0,len=price.length;i<len-1;i++){
                                        html+='<li><span class="cost-data">'+GetDateStr(date[0],i)+'</span><span class="price"><em>￥</em><strong>'+price[i]+'</strong></span><span class="cost-num">*'+$(".number").val()+'</span></li>';
                                        prices=operation.accAdd(prices,price[i]);
                                    }
                                    html+="<li data-total="+$(".number").val()*prices+" id='cost-total'>订单总额：<span><em>￥</em><strong>"+$(".number").val()*prices+"</strong></span></li>"
                                    $("#cost").find("ul").html(html).end().css({
                                        bottom:-$("#cost").height()
                                    });
                                    _localPrice = $(".number").val()*prices;
                                    $("#totalprice").text(operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0).data("price",operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0);
                                    break;
                                case "line":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#hid-price").val(price);
                                    $("#price").text(price);
                                    _localPrice = $(".number").val()*price;
                                    $("#totalprice").text(operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0).data("price",operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0);
                                    $("#hid-kid").val($(evl).find(".price").data("kid"));
                                    getStock(date);
                                case "combo":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#hid-price").val(price);
                                    $("#price").text(price);
                                    _localPrice = $(".number").val()*price;
                                    $("#totalprice").text(operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0).data("price",operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0);
                                    $("#hid-kid").val($(evl).find(".price").data("kid"));
                                    getStock(date);
                                    break;
                                case "show":
                                    $("#calendar-btn").find(".order-time").text(date);
                                    $("#hid-stockDate").val(date);
                                    $("#hid-price").val(price);
                                    $("#price").text(price);
                                    _localPrice = $(".number").val()*price;
                                    $("#totalprice").text(operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0).data("price",operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0);
                                    getStock(date);
                                    break;
                            }
                        },
                        optionsdays:data,
                        selecteday:$("#calendar-btn").find(".order-time").text()
                    };
                    if(mold=="hotel"){
                        options.multiselect=true;
                    }
                    $("#calendar").calendar(options);
                },"json");
            }
        });
    }
    $(".calendar-colse").click(function(){
        $("#calendar-box").removeClass("calendar-show");
    });
    if($("#route-item").length>0){
        var routetotal=0;
        $("#route-item").find(".order-copies").each(function(){
            var price=$(this).find(".price").find("strong").text(),num=$(this).find(".num").text();
            routetotal=operation.accAdd(routetotal,operation.accMul(price,num));
        });
        $("#totalprice").text(routetotal).data("price",routetotal);
    }

    $(window).scroll(function () {
        if($(document).scrollTop() > $(window).height()/4){
            $('.toTop').fadeIn(300);
        }
        if($(document).scrollTop() < $(window).height()/4){
            $('.toTop').fadeOut(300);
        }
    });
    $('.toTop span').click(function(){
        $('html,body').animate({scrollTop: '0px'}, 300);
    });
    //if($("#line-item").length>0){
    //	var routetotal=operation.accMul($("#price").text(),$("#line-item").find(".num").text());
    //	$("#totalprice").text(routetotal);
    //}

    // $("#socialShare").socialShare({
    //     content: $("p").text().trim(),
    //     url: "http://blog.csdn.net/libin_1/article/details/51935944",
    //     titile: $("h1").text().trim()
    // });

    //智能浮动效果
    if($("#detailmenu").length>0){
        var detailmenuh=$("#detailmenu").outerHeight(true);//菜单高
        $("#detailmenu").find("a").click(function(){
            $("html, body").animate({
                scrollTop: ($($(this).attr("href")).offset().top-detailmenuh+1) + "px"
            }, {
                duration: 400,
                easing: "swing"
            });
            return false;
        });

        var obj = document.getElementById("detailmenu"),eq=0;
        var isIE6 = /msie 6/i.test(navigator.userAgent);
        var navTar = $("#detailmenu");
        $(window).on('scroll touchmove',function(){
            var bodyScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            //$(".toTop").text(bodyScrollTop);
            //console.log("元素顶部"+top);
            //console.log("滚动高度"+bodyScrollTop);
            if (bodyScrollTop > top){
                obj.style.position = (isIE6) ? "absolute" : "fixed";
                obj.style.top = (isIE6) ? bodyScrollTop + "px" : "0";
            } else {
                obj.style.position = "static";
            }
            navTar.find("a").removeClass("active");
            $(".menu-module").each(function(i){
                var scrolltop=$(this).offset().top;
                if( scrolltop-bodyScrollTop+$(this).height()-detailmenuh+1>0){ //当前元素离body顶部的高-被滚动条卷去的高
                    eq=i;
                    return false;
                }
            });
            navTar.find("li:eq("+eq+")").find("a").addClass("active");
        });
    }

    if(getUrlParams()[0].spreadCode){
        $.post('/spreadCode',{spreadCode:getUrlParams()[0].spreadCode},function (data) {
            
        });
    }

    $(".cancel-btn").click(function(){
        $("#tipsLayer,#mask").hide();
    });
    $(".tips-layer-header").find("a").click(function () {
        $(".tips-layer,#mask").hide();
    });
    //$("img").LoadImage(true,640,'auto',"../images/common/loading.gif");
});

function getUrlParams()
{
    var search = window.location.search ;
    // 写入数据字典
    var tmparray = search.substr(1,search.length).split("&");
    var paramsArray = new Array;
    if( tmparray != null)
    {
        for(var i = 0;i<tmparray.length;i++)
        {
            var reg = /[=|^==]/;    // 用=进行拆分，但不包括==
            var set1 = tmparray[i].replace(reg,'&');
            var tmpStr2 = set1.split('&');
            var array = new Array ;
            array[tmpStr2[0]] = tmpStr2[1] ;
            paramsArray.push(array);
        }
    }
    // 将参数数组进行返回
    return paramsArray ;
}

function GetCookieValue(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        //console.log(document.cookie);
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            //PYYH=USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                //USERNAME=steven&PASSWORD=111111&UserID=1&UserType=1
                break;
            }
        }
    }
    return cookieValue;
}
function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
    var cval = GetCookieValue(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

var tabs={
    init:function(divid){
        $("#"+divid).find("a").click(function(e){
            var itmeId=$(this).attr("href");
            if(itmeId.substr(0,1)=="#"){
                e.preventDefault();
            }
            $(itmeId).addClass('active').siblings().removeClass("active");
            $(this).parent().addClass('active').siblings().removeClass("active");
        });
    }
};

function totalprice(num){
    var price=$("#price").text();
    _localPrice = operation.accMul(price,num);
    if($("#postPrice").length){
        _localPrice=operation.accAdd($("#postPrice").text(),_localPrice);
    }
    $("#totalprice").text(operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0).data("price",operation.accSub( _localCouponPrice,_localPrice)>0?operation.accSub( _localCouponPrice,_localPrice):0);
}

function routetotalprice(){
    var totalprice=0;
    $(".number").each(function(){
        var val=$(this).val();
        var price=$(this).parent().parent().siblings(".price").find("strong").text();
        totalprice=operation.accAdd(totalprice,operation.accMul(val,price));
    });
    $("#totalprice").text(totalprice).data("price",totalprice);
}

function dateDiff(strDateStart,strDateEnd){
    var strSeparator = "-"; //日期分隔符
    var oDate1;
    var oDate2;
    var iDays;
    oDate1= strDateStart.split(strSeparator);
    oDate2= strDateEnd.split(strSeparator);
    var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
    var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
    iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数
    return iDays ;
}

//四则运算
var operation={
    accMul:function(arg1,arg2){
        var m=0,s1=arg1.toString(),s2=arg2.toString();
        try{m+=s1.split(".")[1].length}catch(e){}
        try{m+=s2.split(".")[1].length}catch(e){}
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    },
    accDiv:function(arg1,arg2){
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split(".")[1].length}catch(e){}
        try{t2=arg2.toString().split(".")[1].length}catch(e){}
        with(Math){
            r1=Number(arg1.toString().replace(".",""));
            r2=Number(arg2.toString().replace(".",""));
            return (r1/r2)*pow(10,t2-t1);
        }
    },
    accAdd:function(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
        try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
        m=Math.pow(10,Math.max(r1,r2));
        return (arg1*m+arg2*m)/m;
    },
    accSub:function(arg1,arg2){
        var r1,r2,m,n;
        try{
            r1=arg1.toString().split(".")[1].length;
        }catch(e){
            r1=0;
        }
        try{
            r2=arg2.toString().split(".")[1].length;
        }catch(e){
            r2=0;
        }
        m=Math.pow(10,Math.max(r1,r2));
        //last modify by deeka
        //动态控制精度长度
        n=(r1>=r2)?r1:r2;
        return ((arg2*m-arg1*m)/m).toFixed(n);
    }
};

function ispc(){
    var flag=true;
    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad:false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
    //跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
    if (system.win || system.mac || system.xll||system.ipad) {
        flag=true;
    } else {
        flag=false;
    }
    return flag;
}

function differDate(d1,d2){
    var time1=new Date(d1).getTime(),time2=new Date(d2);
    return Math.floor((time2-time1)/(24*3600*1000));
}
function svgPrice(price){
    var totalprice= 0,length=price.length;
    $.each(price,function(i){
        totalprice+=parseInt(price[i]);
    });
    return operation.accDiv(totalprice,length)
}

function GetDateStr(date,AddDayCount) {
    var dd = new Date(date);
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    return y+"-"+p(m)+"-"+p(d);
}

function p(s){
    return s < 10 ? '0' + s: s;
}
//身份证校验
function IdentityCodeValid(num) {
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
    {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15)
    {
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay)
        {
            //alert('输入的身份证号里出生日期不对！');
            return false;
        }
        else
        {
            //将15位身份证转成18位
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
            for(i = 0; i < 17; i ++)
            {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            num += arrCh[nTemp % 11];
            return true;
        }
    }
    if (len == 18)
    {
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay)
        {
            //alert('输入的身份证号里出生日期不对！');
            return false;
        }
        else
        {
            //检验18位身份证的校验码是否正确。
            //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
            var valnum;
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var nTemp = 0, i;
            for(i = 0; i < 17; i ++)
            {
                nTemp += num.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[nTemp % 11];
            if (valnum != num.substr(17, 1))
            {
                //alert('18位身份证的校验码不正确！应该为：' + valnum);
                return false;
            }
            return true;
        }
    }
    return false;
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}