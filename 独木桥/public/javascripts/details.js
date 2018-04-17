$(function(){
    if($(".swiper-container").length>0){
        var tabsSwiper = new Swiper('.swiper-container', {
            paginationClickable: true,
            loop : true,
            autoHeight: true,
            onSlideChangeStart: function(Swiper){
                $(".tabs .active").removeClass('active');
                $(".tabs a").eq($('.swiper-slide-active').attr('data-swiper-slide-index')).addClass('active');
            }
        });
    }

    $(".tabs a").on('click',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.slideTo($(this).index()+1);
    });
    $(".tabs a").click(function(e){
        e.preventDefault()
    });
    $("#goods-btn,#sort-btn").click(function(){
        $("#goodsPanel").addClass("goods-show");
        $("#mask").show();
    });
    $("#goods-mold").find("a").click(function(){
        var imgurl=$(this).data("img"),price=$(this).data("price"),text=$(this).text(),skuId=$(this).data("skuid");
        $(this).addClass("c-base").siblings().removeClass("c-base");
        $(".goods-header-img").find("img").attr("src",imgurl);
        $(".goods-header-info").find(".price").find("strong").text(price);
        $("#moldName").text(text).data("skuid",skuId);
    });
    $("#delivery").find("a").click(function(){
        $(this).addClass("cur").siblings().removeClass("cur");
    });
    $("#pay-btn").click(function(){
        var url=$(this).data("url");
        var skuId=$("#moldName").data("skuid"),freight=$("#delivery").find("a.cur").data("freight");
        freight=typeof freight=="undefined"?0:freight;
        if(typeof skuId=="undefined"){
            url+="?freight="+freight;
        }else{
            url+="?skuId="+skuId+"&freight="+freight;
        }
        window.location.href=url;
    });
    $('#sharebtn').click(function() {
        Share();
    });
    $("#sharetip").click(function () {
        $(this).removeClass("weixin-sharetip-show");
    });
    $("#shareLayer").find(".ent-btn").click(function () {
        $("#shareLayer,#mask").hide();
    });
    $("#shareClose").click(function () {
        $("#shareLayer,#mask").hide();
    });
    setTimeout("hidelayer()",2000);

    ischecked();
    $("#checkedBtn").click(function(){
        var checked=$("#check").attr('checked');
        if(checked){
            $("#check").attr("checked",false);
            $("#checkedBtn").removeClass("checked-btn");
            $("#enter-btn").addClass("btn-disabled");
        }else{
            $("#check").attr("checked",true);
            $("#checkedBtn").addClass("checked-btn");
            $("#enter-btn").removeClass("btn-disabled");
        }
    });
    $("#enter-btn").click(function () {
        if(!$(this).hasClass("btn-disabled")){
            window.location.href=$(this).data("url");
        }
    });

    $("#cancel-btn").click(function () {
        $(".articleLayer-panel,.mask").hide();
    });

    $(".details-list").find(".pro-price").find("a").click(function () {
        var _this=$(this);
        $.get('/detail/article/ydxz',function (data) {
            var info=data.info=="null"?"":data.info;
            $(".articleLayer-panel").find(".articleLayer-content").html(info);
            $("#enter-btn").data("url",_this  .attr("href"));
            $(".articleLayer-panel,.mask").show();
        })
        return false;
    });
});

function hidelayer() {
    $("#adv-layer,#mask").hide();
}
function ischecked() {
    var checked=$("#checkedBtn").find("input[type='checkbox']").is(':checked');
    if(checked){
        $("#checkedBtn").addClass("checked-btn");
        $("#enter-btn").removeClass("btn-disabled");
    }else{
        $("#checkedBtn").removeClass("checked-btn");
        $("#enter-btn").addClass("btn-disabled");
    }
}

function breakfast(num){
    var s="";
    switch (num){
        case "0":
            s="无早";
            break;
        case "1":
            s="单早";
            break;
        case "2":
            s="双早";
            break;
        case "3":
            s="三早";
            break;
    }
    return s;
}
function list(data){
    var html="<ul class='details-list'>";
    $.each(data,function(i){
        var val=typeof data[i].roomDetail=='undefined'?'':data[i].roomDetail;
        html+="<li>";
        html+="<div class='pro-info'><div class='pro-img'>";
        html+="<a href='javascript:;' data-url='hotelList"+i+"' class='article-btn'>";
        html+="<img src='"+data[i].img+"' />";
        html+="</a>";
        html+="</div>";
        html+="<div class='hotel-info'>";
        html+="<h4 class='pro-info-title'>"+data[i].roomName+"</h4>";
        html+="<p class='pro-info-explian'><span>"+breakfast(data[i].isBreakfast)+"</span><span><i class='font-icon'></i><i class='font-icon'></i></span></p>";
        html+="<p class='pro-info-explian'><a href='javascript:;' data-title='"+data[i].roomName+"' class='c-base pro-item-btn'>房型介绍></a><input type='hidden' value='"+val+"'/></p>";
        html+="</div>";
        html+="</div>";
        html+="<div class='pro-price'>";
        html+="<span class='price'><em>￥</em><strong>"+data[i].avgPrice+"</strong></span>";
        html+="<span class='original-price'><em>￥"+data[i].marketPrice+"</em></span>";
        html+="</div>";
        html+="<div class='pro-price'>";
        html+="<a href='/order/hotel/"+data[i].id+"'>预订</a>";
        html+="</div>";
        html+="</li>";
    });
    html+="</ul>";
    return html;
}
function Share() {
    var shareUrl = "";  //分享的URL地址
    var shareTitle = ""; //分享的标题
    var shareImage = ""; //分享的图片地址
    var shareDesc = ""; //分享的描述信息
    $.get("/detail/wxshare",{url: location.href.split('#')[0]},function (data) {
        if(data.msg=="unload"){
            window.location.href="/quickLogin";
            return false;
        }
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1
            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        if(data.iswx){
            $("#sharetip").addClass("weixin-sharetip-show");
        }
    },'json');
}
var shareObj={
    title:$(".details-title").text(),
    desc:$("#subTitle").text(),
    link:location.href.split('#')[0],
    imgUrl:$(".slide:first").find("img").attr("src")
};
wx.ready(function () {
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: shareObj.title, // 分享标题
        desc: shareObj.desc, // 分享描述
        link: shareObj.link, // 分享链接
        imgUrl: shareObj.imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            shareCallback(location.href.split('#')[0]);
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    //分享到朋友圈
    wx.onMenuShareTimeline({
        title: shareObj.title, // 分享标题
        desc: shareObj.desc, // 分享描述
        link: shareObj.link, // 分享链接
        imgUrl: shareObj.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            shareCallback(location.href.split('#')[0]);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });


    //分享到QQ
    wx.onMenuShareQQ({
        title: shareObj.title, // 分享标题
        desc: shareObj.desc, // 分享描述
        link: shareObj.link, // 分享链接
        imgUrl: shareObj.imgUrl, // 分享图标
        success: function () {
            shareCallback(location.href.split('#')[0]);
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    //分享到QQ空间
    wx.onMenuShareQZone({
        title: shareObj.title, // 分享标题
        desc: shareObj.desc, // 分享描述
        link: shareObj.link, // 分享链接
        imgUrl: shareObj.imgUrl, // 分享图标
        success: function () {
            shareCallback(location.href.split('#')[0]);
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});

function shareCallback(url) {
    var flag=$("#sharebtn").data('flag');
    if(flag){
        $.post("/detail/getShareScore",{wapUrl:url},function (data) {
            $("#sharetip").removeClass("weixin-sharetip-show");
            if(data.flag=="success"){
                $("#shareNum").text(data.datas.singleScore);
                $("#shareLayer,#mask").show();
            }else{
                if(data.msg=="unload"){
                    window.location.href="/quickLogin";
                }
            }
        })
    }
}