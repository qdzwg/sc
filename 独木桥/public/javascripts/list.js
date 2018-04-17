/**
 * Created by admin on 2016/04/06.
 */
//列表页头部tab下拉
var listtab={
    currentDiv:"",
    oldDiv:'',
    dialogshow:function(element){
        if($(element).hasClass("c-base")){
            this.dialogclose();
        }
        else{
            this.dialogclose();
            this.currentDiv=$(element).parent().data("div");
            $(element).addClass("c-base");
            if(this.dodiv()){
                setTimeout(function(){
                    $("#"+listtab.currentDiv).stop().animate({
                        top:$("#searchtab").outerHeight(true)+$("#searchtab").position().top
                    },300);
                },300);
            }else{
                $("#"+this.currentDiv).stop().animate({
                    top:$("#searchtab").outerHeight(true)+$("#searchtab").position().top
                },300);
            }
            $("#mask").fadeIn();
        }
    },
    dialogclose:function(){
        this.oldDiv=this.currentDiv;
        var height=$("#"+this.oldDiv).outerHeight(true);
        $("#"+this.oldDiv).stop().animate({
            top:-height+"px"
        },300);
        $("#mask").hide();
        $("#searchtab").find("a").removeClass("c-base");
    },
    panelhandle:function(obj){
        var text="",objurl="";
        $(obj).each(function(){
            text+=$(this).text()+",";
            objurl+=$(this).data("url");
        });
        text=text.replace(/,$/g,"");
        objurl=objurl.replace(/&$/g,"");
        var height=$("#"+this.currentDiv).outerHeight(true);
        //$(".page-list").find("a").addClass("prevent");
        $("#searchtab").find("li[data-div="+this.currentDiv+"]").find("a").find("span").text(text);
        $(obj).parent().siblings().find("a").removeClass("c-base");
        $(obj).addClass("c-base");
        this.dialogclose();
        return objurl;
    },
    dodiv:function(){
        var flag=false;
        $(".tab-search-panel").each(function(){
            var top=$(this).position().top;
            if(top>0){
                flag=true;
                return false;
            }
        });
        return flag;
    }
};

$(function(){
    var touchobj=$("#searchtab").find("a"),tabpanel=$(".tab-search-panel").find("a"),filterItem=$(".filter-item").find("p").find("span");
    $(".tab-search-panel").each(function(){
        var height=$(this).outerHeight(true);
        $(this).css("top",-height+"px");
    });
    touch.on(touchobj,'tap',function(event){
        listtab.dialogshow($(this));
    });
    touch.on(touchobj.find("span,i"),'tap',function(event){
        listtab.dialogshow($(this).parent());
        event.stopPropagation();
    });
    touch.on(tabpanel,'tap',function(ev){
        var url="";
        if($(this).hasClass("c-base")){
            url=listtab.panelhandle($(".filter-item").find("p").find("span.c-base"));
        }else{
            url=listtab.panelhandle($(this));
        }
        var oldurl=window.location.href,newsUrl="";
        if(oldurl.split("?").length>1){
            var parame=oldurl.split("?")[1].split("&");
            var urlArrar=url.split("&");
            var newArray=merge(parame,urlArrar);
            newsUrl=oldurl.split("?")[0]+"?"+newArray.join("&");
        }else{
            newsUrl=window.location.href+"?"+url;
        }
        if(newsUrl.indexOf("sortType=8")>-1||newsUrl.indexOf("sortType=7")>-1){
            if (window.navigator.geolocation&&!ispc()) {
                var options = {
                    enableHighAccuracy: true,
                };
                navigator.geolocation.getCurrentPosition(function(position){
                    newsUrl=changeUrl(newsUrl,"lonlat",[position.coords.longitude,position.coords.latitude]);
                    window.location.href=newsUrl;
                }, handleError, options);
            } else {
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function(r){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        newsUrl=changeUrl(newsUrl,"lonlat",[r.point.lng,r.point.lat]);
                        window.location.href=newsUrl;
                    }
                    else {
                        alert('failed'+this.getStatus());
                    }
                },{enableHighAccuracy: true});
            }
        }else{
            newsUrl=newsUrl.replace(/&lonlat=[^&]*/,"");
            window.location.href=newsUrl;
        }

        ev.preventDefault();
    });
    touch.on("#mask","tap",function(){
        listtab.dialogclose();
    });
    touch.on(tabpanel,'touchend',function(event){
        event.preventDefault();
    });
    touch.on(filterItem,'tap',function(){
        $(this).addClass("c-base").siblings().removeClass("c-base");
    });

    var counter = 0;
    // 每页展示6个
    var num = 6;
    var pageStart = $("#offset").val(), pageEnd = 0,currPage=2;
    var inner=$(".inner"), mold=inner.data("mold"),droploadUrl="",type=inner.data("type");
    var pram={currPage:currPage};
    if(mold=="order"){
        droploadUrl='/user/order/dropload';
    }else if(mold=="scoreDetails"){
        droploadUrl='/user/scoreDetails/dropload';
    }else if(mold=="coupon"){
        droploadUrl='/user/coupon/dropload';
        pram.useflag=inner.data("useflag");
    }else{
        droploadUrl='/list/dropload';
    }
    // dropload
    if(inner.find(".opacity").length>5){
        inner.dropload({
            scrollArea : window,
            loadDownFn : function(me){
                pram.currPage=currPage;
                $.ajax({
                    type: 'GET',
                    url: droploadUrl,
                    data:pram,
                    dataType: 'json',
                    success: function(data){
                        console.log(data);
                        if(data.flag=="success"){
                            if(mold=="order"){
                                if(type=="score"){
                                    var result =scoreOrderHtml(data.datas.items);
                                }else{
                                    var result =orderHtml(data.datas.items);
                                }
                                $('.inner').find(".opacity:last").after(result);
                            }
                            else if(mold=="raiders"){
                                var result =raidersListHtml(data.data);
                                $('.page-list').append(result);
                            }
                            else if(mold=="scoreDetails"){
                                var result =scoreDetails(data.datas.items);
                                $('.inner').find(".opacity:last").after(result);
                            }
                            else if(mold=="coupon"){
                                var result =couponList(data.datas.items);
                                $('.inner').find(".opacity:last").after(result);
                            }else if(mold=="score"){
                                var result =scoreList(data.datas.items);
                                $('.inner').find(".opacity:last").after(result);
                            }
                            else{
                                var result =listHtml(mold,data.data);
                                $('.page-list').append(result);
                            }
                            pageStart=data.offset;
                            currPage++;
                        }else{
                            me.lock();
                            me.noData();
                        }
                        // 每次数据加载完，必须重置
                        me.resetload();
                    },
                    error: function(xhr, type){
                        //alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                });
            }
        });
    }

    $(".list-panel").css({
        "padding-top":$(".list-tab").outerHeight(true)
    });
    $(".line-panel").css({
        "padding-top":$(".list-tab").outerHeight(true)+$(".line-tab").outerHeight(true)
    });
    $(".list-tab").find("a").click(function(){
        var index=$(this).index(".list-tab a");
        $(".list-tab").find("a").removeClass("active");
        $(this).addClass("active");
        $(".list-panel").find(".list-panel-item").removeClass("active");
        $(".list-panel").find(".list-panel-item:eq("+index+")").addClass("active");
    });
});

function isEmptyObject(obj){
    for(var n in obj){return false}
    return true;
}

function merge(first, second){
    for(var j= 0,slen=second.length;j<slen;j++){
        first.push(second[j]);
        for(var i= 0,flen=first.length;i<flen;i++){
            if(first[i].split("=")[0]==second[j].split("=")[0]){
                first.splice(i,1,second[j]);
            }
        }
    }
     return first=uniQueue(first);
}
function uniQueue(array){
    var arr=[];
    var m;
    while(array.length>0){
        m=array[0];
        arr.push(m);
        array=$.grep(array,function(n,i){
            return n==m;
        },true);
    }
    return arr;
}

function listHtml(mold,data){
    var html="";
    $.each(data,function(i){
        html+="<li class='opacity'>";
        html+="<a href='../details/"+mold+"/"+data[i].id+"'>";
        html+="<div class='page-list-img'><img src='"+data[i].mainUrl+"' width='100%'></div>";
        html+="<div class='page-list-info'>";
        html+="<h3 class='page-list-title'>"+listtitle(mold,data[i])+"</h3>";
        html+=listexplian(mold,data[i]);
        html+="</div></a></li>";
    });
    return html;
}

function scoreList(data){
    var html="";
    $.each(data,function(i){
        var scoreobj={};
        if(data[i].canBuy==0){
            scoreobj={"className":"unbuy","url":"javascript:;"}
        }
        else{
            scoreobj={"className":"","url":"../order/score/" + data[i].id}
        }
        html+="<li class='opacity "+scoreobj.className+"'>";
        html+="<a href="+scoreobj.url+">";
        html+="<div class='page-list-img'><img src='"+data[i].imgurl+"' width='100%'></div>";
        html+="<div class='page-list-info'>";
        html+="<h3 class='page-list-title'>"+data[i].productName+"</h3>";
        html+="<p class='page-list-explian'><span class='price'><em>积分：</em><strong></strong>"+data[i].price+"</span><span class='fr exchange-btn'>立即兑换</span></p>";
        html+="</div></a></li>";
    });
    return html;
}


//攻略列表
function raidersListHtml(data){
    var html="";
    $.each(data,function(i){
        html+="<li class='opacity'>";
        html+="<a href='../details/raiders/"+data[i].id+"'>";
        html+="<img src='"+data[i].titleImgUrl+"' width='100%'>";
        html+="<div class='raiders-info'>";
        html+="<h3 class='raiders-title'>"+data[i].title+"</h3>";
        html+="</div></a></li>";
    });
    return html;
}

//我的订单列表
function orderHtml(data){
    var html="";
    $.each(data,function(i){
        html+="<div class='page-line'></div>";
        html+="<div class='myorder-item opacity'>";
        html+="<div class='myorder-header'>";
        html+="<span class='order-info'><i class='font-icon icon-iconfont-"+iconClass(data[i].orderType)[0]+"'></i><em>"+iconClass(data[i].orderType)[1]+"</em>|<em class='"+payClass(data[i].orderStatus)+"'>"+checkStatusname(data[i].orderStatus)+"</em></span>";
        html+="<span>下单日期："+ndate(data[i].createTime)+"</span>";
        html+="<span class='price fr'><em>￥"+data[i].finalSum+"</em></span>";
        html+="</div>";
        html+="<a href='/user/myorderDetails/"+data[i].orderType+"/"+data[i].id+"'>"
        html+="<h3 class='myorder-item-title'>"+data[i].info+"</h3>";
        html+="<p><em>"+ndate(data[i].startDate)+"</em>"+checkStatus(data[i].checkStatus)+"</p>";
        html+="<p><i class='font-icon fr icon-iconfont-jiantou'></i>"+data[i].num+iconClass(data[i].orderType)[2]+"</p></a>";
        html+="</div>";
    });
    return html;
}
// 积分明细翻页
function scoreDetails(data) {
    var html="";
    $.each(data,function(i){
        var contype="";
        switch (data[i].mtype){
            case "ORDER":
                contype="下单赠送";
                break;
            case "PRESENT":
                contype="客服赠送";
                break;
            case "CONVERT":
                contype="兑换";
                break;
            case "CUT":
                contype="冲减";
                break;
            case "WIN_CUT":
                contype="转盘中奖扣除";
                break;
            case "COMMENT":
                contype="评论";
                break;
            case "SHARE":
                contype="分享";
                break;
            case "PERFECTINFORMATION":
                contype="完善信息";
                break;
        }
        html+='<li class="opacity">';
        html+='<div class="scored-left">';
        html+='<p>'+contype+'</p>';
        html+='<p>'+data[i].createTime+'</p>';
        html+='</div>';
        html+='<div class="scored-center">';
        html+='<img src="/images/list/score-list.jpg">';
        html+='</div>';
        html+='<div class="scored-info">';
        var mark=""
        if(data[i].mtype=="CONVERT"||data[i].mtype=="CUT"||data[i].mtype=="WIN_CUT")
            mark="-"
        else
            mark="+"
        html+='<h3>'+mark+data[i].opScore+'</h3>';
        html+='<p>'+data[i].leftScore+'</p>';
        html+='</div>';
        html+='</li>';
    });
    return html;
}

function scoreOrderHtml(data) {
    var html="";
    $.each(data,function(i){
        html+="<li class='opacity'>";
        html+="<a href='/user/scoreorderDetails/"+data[i].id+"'>";
        html+="<div class='score-list-left'>";
        html+="<h3 class='score-list-title'>"+data[i].info+"</h3>";
        html+="<p >兑换日期："+data[i].createTime+"</p>";
        html+="</div>";
        html+="<div class='score-list-right'>+<span>"+data[i].paySum+"</span>分</div>";
        html+="</a></li>";
    });
    return html;
}

function listtitle(mold,data){
    var title="";
    switch (mold){
        case "ticket":
            title=data.parkName;
            break;
        default :
            title=data.productName;
            break;
    }
    return title;
}
function listexplian(mold,data){
    var html="";
    switch (mold){
        case "ticket":
            html+="<p class='page-list-article'>"+substring(data.subTitle,15)+"</p>";
            html+="<p class='page-list-explian'>"+tag(data.tags)+"</p>";
            html+="<p class='page-list-explian'><span>"+data.saleNum+"</span>人已购买<span class='price fr'><em>￥</em><strong>"+data.startingPrice+"</strong></span></p>";
            break;
        case "hotel":
            html+="<p class='page-list-article'>"+substring(data.subTitle,15)+"</p>";
            html+="<p class='page-list-explian'>"+tag(data.tags)+"</p>";
            html+="<p class='page-list-explian'><span class='price fr'><em>￥</em><strong>"+data.startingPrice+"</strong></span></p>";
            break;
        case "route":
            html+="<p class='page-list-article'>"+substring(data.subTitle,30)+"</p>";
            html+="<p class='page-list-explian'><span>"+data.saleNum+"</span>人出游<span class='price fr'><em>￥</em><strong>"+data.startingPrice+"</strong></span><span class='original-price fr'><em>￥</em><strong>"+data.originalPrice+"</strong></span></p>";
            break;
        case "line":
            html+="<p class='page-list-article'>"+substring(data.subTitle,30)+"</p>";
            html+="<p class='page-list-explian'><span>"+data.mockSale+"</span>人出游<span class='price fr'><em>￥</em><strong>"+data.startingPrice+"</strong></span><span class='original-price fr'><em>￥</em><strong>"+data.originalPrice+"</strong></span></p>";
            break;
        case "repast":
            html+="<p class='page-list-article'>"+substring(data.addr,15)+"</p>";
            html+="<p class='page-list-explian'>"+tag(data.tags)+"<span class='price fr'><em>￥</em><strong>"+data.startingPrice+"</strong></span></p>";
            break;
        case "goods":
            html+="<p class='page-list-explian'><span class='price'><em>￥</em><strong>"+data.startingPrice+"</strong></span><span class='fr'><em class='c-base'>"+data.mockSale+"</em>件已售</span></p>";
            break;
    }
    return html;
}

//优惠券列表
function couponList(datas) {
    var html="";
    $.each(datas,function (i) {
        var useflag={}
        switch (datas[i].status){
            case "unuse":
                useflag={"text":"未使用","className":"coupon-unuse"};
                break;
            case "used":
                useflag={"text":"已使用","className":"coupon-used"};
                break;
            case "expired":
                useflag={"text":"已过期","className":"coupon-expired"};
                break;
        }
        var info=datas[i].info?datas[i].info:"";
        html+="<li class='opacity'>";
        html+="<div class='coupon-left'><span class='cost-num'><em>￥</em>"+datas[i].cutSum+"</span><p>"+useflag.text+"</p></div>";
        html+="<div class='"+useflag.className+" coupon-right'>";
        html+="<h4 class='coupon-title'>"+datas[i].couponName+"</h4>";
        html+="<p class='coupon-subtitle'>"+info+"</p>";
        html+="<p class='coupon-explian'>有效期："+(new Date(datas[i].useBegDate)).Format("yyyy-MM-dd")+"至"+(new Date(datas[i].useEndDate)).Format("yyyy-MM-dd")+"</p>";
        html+="</div>";
        html+="</li>";
    });
    return html;
}

function tag(obj){
    var html="";
    $.each(obj,function(i){
        if(i<2){
            html+="<span class='pro-flag c-base border-base'>"+obj[i]+"</span>";
        }
    });
    return html;
}

function substring(str,num){
    var string="";
    if(str.length>num){
        string=str.substr(0, num)+"..."
    }else{
        string=str;
    }
    return string;
}

function iconClass(status){
    var classname="",text="",unit="份";
    switch (status){
        case "ticket":
            classname="menpiao";
            text="景区";
            unit="张";
                break;
        case "hotel":
            classname="jiudian";
            text="酒店";
            unit="间";
            break;
        case "show":
            classname="meishi";
            text="演艺";
            break;
        case "combo":
            classname="gentuanyou";
            text="套票";
            break;
        case "zyx":
            classname="ziyouxing";
            text="自由行";
            break;
        case "goods":
            classname="shangping";
            text="商品";
            break;
    }
    return [classname,text,unit];
}

function payClass(status){
    var calssname="";
    switch (status){
        case "0":
            calssname="unpay";
            break;
        case "1":
            calssname="payed";
            break;
        case "3":
            calssname="uesd";
            break;
    }
    return calssname;
}

function checkStatus(status){
    var calssname="";
    switch (status){
         case "0":
            calssname="未核销";
            break;
        case "1":
            calssname="核销中";
            break;
        case "2":
            calssname="已核销";
            break;
        case "3":
            calssname="已过期";
            break;
        case "4":
            calssname="到付";
            break;
    }
    return calssname;
}
function scoreStatus(status) {
    var text="";
    switch (status){
        case "0":
            text="未处理";
        case "1":
            text="已处理";
        default:
            text="未处理"
    }
    return text;
}
function checkStatusname(status){
    var text="";
    switch (status){
        case "0":
        case 0:
            text="待支付";
            break;
        case "1":
        case 1:
            text="已支付";
            break;
        case "2":
        case 2:
            text="已支付";
            break;
        case "3":
        case 3:
            text="已完成";
            break;
        case "4":
        case 4:
            text="已关闭";
            break;
        case "110":
        case 110:
            text="未核销";
            break;
        case "210":
        case 210:
            text="退款中";
            break;
    }
    return text;
}

//毫秒转日期
function ndate(time){
    var date=new Date(time);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
}

function changeUrl(destiny, par, par_value){
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
}
function handleError(error){
    switch(error.code)
    {
        case error.PERMISSION_DENIED:
            alert("用户拒绝对获取地理位置的请求。");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("位置信息是不可用的。");
            break;
        case error.TIMEOUT:
            alert("请求用户地理位置超时。");
            break;
        case error.UNKNOWN_ERROR:
            alert("未知错误。");
            break;
    }
}