var lonlat="";
var wait=60;
var _localCouponPrice=0,_localPrice=0;
$(function(){
    var validateOption={
        ignore: [],
        rules: {
            consumer:{
                maxlength:11,
                isIllegalChar:true
            },
            mobile: {
                isMobile: true
            },
            email: {
                email: true
            },
            remark:{
                maxlength:200,
                isIllegalChar:true
            },
            area:{
                required:true
            },
            address:{
                maxlength:50,
                required:true,
                isIllegalChar:true
            },
            content:{
                isIllegalChar:true
            },
            oldPass:{
                required:true
            },
            loginPass:{
                required:true,
                rangelength:[6,20],
                numandchar:true
            },
            enterPass:{
                equalTo:'#newsPass'
            },
            zyxShowIds:{
                required:true
            },
            code:{
                required:true
            },
            carNumber:{
                required:true,
                isVehicleNumber:true
            }
        },
        messages: {
        }
    };
    if($("#orderForm").length>0){
        var validator=$("#orderForm").validate(validateOption);
    }
    $("#saveBtn").click(function(){
        var canbuy=$(this).data("canbuy"),isyw=$(this).data("type");
        if(canbuy=="false"){
            $("#tipsLayer,#mask").show();
        }else{
            if(validator.form()){
                if(isyw=="yw"&&$("#couponBtn").find("span").text()!="优惠券选择"){
                    $.get("/user/couponlist",{"mobile":$("input[name=mobile]").val(),"paySum":$("#totalprice").text(),"ticketId":$("#couponBtn").data("code"),"ticketType":$("#couponBtn").data("mold"),"idcard":$("input[name=accIdentification]").val()},function (data) {
                        if(data.flag=="success"){
                            $("#orderForm").submit();
                            $(this).attr("disabled","disabled").off("click");
                        }else{
                            alert(data.msg);
                            if($("#idcard").data("idcard")){
                                $("input[name='accIdentification']").val($("#idcard").data("idcard"));
                            }
                        }
                    });
                }else{
                    $("#orderForm").submit();
                    $(this).attr("disabled","disabled").off("click");
                }
            }
        }
    });
    _postPrice=0;
    if($("#txt_area").length>0){
        var selectArea = new MobileSelectArea();
        selectArea.init({trigger:'#txt_area',value:"",data:'../../javascripts/select-area/areaData.json',eventName:'click',callback:function(scroller,text,value){
            var code=value[0];
            $.get("/order/postage",{},function(data){
                console.log(data);
                $.each(data,function(i){
                    if(data[i].areaCode==code){
                        var price=$("#price").text(),num=$(".number").val(),total=operation.accMul(price,num);
                        $("#postPrice").text(data[i].postFee);
                        $("#hid-postId").val(data[i].id);
                        if($("#postPrice").length>0){
                            $("#totalprice").text(operation.accAdd(data[i].postFee,total)).data("price",operation.accAdd(data[i].postFee,total));
                            _postPrice=operation.accAdd(data[i].postFee,total);
                        }
                    }else{
                        if(data[i].isAll=="1"){
                            var price=$("#price").text(),num=$(".number").val(),total=operation.accMul(price,num);
                            $("#postPrice").text(data[i].postFee);
                            $("#hid-postId").val(data[i].id);
                            if($("#postPrice").length>0){
                                $("#totalprice").text(operation.accAdd(data[i].postFee,total)).data("price",operation.accAdd(data[i].postFee,total));
                                _postPrice=operation.accAdd(data[i].postFee,total);
                            }
                        }
                    }
                });
            },"json");
        }});
    }

    if($("#area").length>0){
        var selectArea = new MobileSelectArea();
        selectArea.init({trigger:'#area',value:"",data:'../../javascripts/select-area/areaData.json',eventName:'click',callback:function(scroller,text,value){

        }});
    }
    //性别选择
    $(".sex").click(function(){
        $(".sex").removeClass("selected");
        $(this).addClass("selected");
        $("input[name='sex']").val($(this).data("value"));
    });

    $("#btn-comment").click(function(){
        $("#comments").addClass("comment-show");
        $("#mask").show();
    });

    $("#btn-refund").click(function(){
        $("#refund").addClass("comment-show");
        $("#mask").show();
        refund($("#retreatNum").text());
    });

    $(".refund-handle").find(".btn").click(function () {
        $("#refund").find("form").submit();
        $(this).attr("disabled","disabled");
    });

    $("#comments").find(".comment-score").find(".icon-iconfont-aixin").click(function(){
        var index=$(this).index();
        $("#comments").find(".comment-score").find(".icon-iconfont-aixin").removeClass("c-base");
        $("#comments").find(".comment-score").find(".icon-iconfont-aixin:lt("+index+")").addClass("c-base");
        $("#score").val(index);
    });
    $("#differDay").text(dateDiff($("#beginDate").text(),$("#endDate").text()));
    var travelcalendar=$("#travelcalendar");
    if(travelcalendar.length>0){
        var dates=travelcalendar.data("dates"),mold=travelcalendar.data("mold");
        travelcalendar.calendar({
            onClick:function(evl,date,price,ticket){
                $("#ordertime").text(date);
                var url=$("#next-btn").data("url").split("?");
                $("#next-btn").data("url",url[0]+"?stockDate="+date);
                if(mold=="route"){
                    $.each(dates,function(i){
                        if(dates[i].date==date){
                            $("#adultprice").text(dates[i].adultPrice).parent().next().find(".number").data("max",dates[i].adultLeftNum);
                            $("#childrenprice").text(dates[i].childrenPrice).parent().next().find(".number").data("max",dates[i].childrenLeftNum);
                        }
                    });
                }
                else{
                    $.each(dates,function(i){
                        if(dates[i].date==date){
                            $("#price").text(dates[i].price).parent().next().find(".number").data("max",dates[i].adultLeftNum);
                        }
                    });
                    totalprice($(".number").val());
                }
            },
            settingdata:dates,
            selecteday:$("#ordertime").text()
        });
    }
    $("#next-btn").click(function(){
        var url=$(this).data("url");
        if(mold=="route"){
            url+="&adult="+$("#adultprice").parent().next().find(".number").val()+"&children="+$("#childrenprice").parent().next().find(".number").val();
        }else{
            url+="&num="+$("#price").parent().next().find(".number").val();
        }
        window.location.href=url;
    });

    if (window.navigator.geolocation) {
        var options = {
            enableHighAccuracy: true,
        };
        window.navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    } else {
        alert("浏览器不支持html5来获取地理位置信息");
    }

    $("#address-btn").click(function(){
        $("#address,#mask").show();
        lonlat="120.112679,30.291856";
        $.get("/order/address",{id:$(this).data("id"),lonlat:lonlat},function(data){
            $("#address").find(".address-content").html(addressList(data.datas));
        },"json");
    });
    $("#address").on("click",".btn-small",function(){
        var objli=$(this).parent().parent();
        var address=$(this).siblings(".address-info").text(),beginTime=objli.data("begintime"),endTime=objli.data("endtime"),id=objli.data("id");
        $("#add").val(address);
        $("#time").text(beginTime+"~"+endTime);
        $("#hid-sinceId").val(id);
        $("#address,#mask").hide();
    });
    $("#cost").css({
        bottom:-$("#cost").height()
    });
    $("#costDetail").click(function(){
        $("#cost").css({
            bottom:"2.2rem"
        });
        $("#mask").show();
        $(".float-layer").css("z-index",21);
    });
    $(".close").click(function(){
        $("#mask").hide();
        $("#cost").show().css({
            bottom:-$("#cost").height()
        });
    });
    $("#mask").click(function(){
        $("#mask").hide();
        $("#cost").show().css({
            bottom:-$("#cost").height()
        });
    });
    if($("#calendar-btn").length>0){
        var mold=$("#calendar-btn").data("mold");
        if(mold!="ticket"&&mold!="hotel"&&mold!="goods"){
            getStock($("#calendar-btn").find(".order-time").text());
        }
    }

    $("#addCart").click(function(){
        var code=$("#calendar-btn").data("code"),mold=$("#calendar-btn").data("mold");
        $("#orderForm").attr("action","/order/cart/"+mold+"/"+code);
        if(validator.form()){
            $.get("/user/couponlist",{"mobile":$("input[name=mobile]").val(),"paySum":$("#totalprice").text(),"ticketId":$("#couponBtn").data("code"),"ticketType":$("#couponBtn").data("mold"),"idcard":$("input[name=accIdentification]").val()},function (data) {
                if(data.flag=="success"){
                    $("#orderForm").submit();
                }else{
                    alert(data.msg);
                }
            });
        }
    });
    $(".season-btn").click(function () {
        $(this).parent().next().css({
            "margin-top":-$(this).parent().next().height()*0.5
        }).show();
        $("#mask").show();
    });
    $(".season-list").on("click","a",function () {
        $(this).addClass("active").find("i").addClass("icon-dg").end().siblings().removeClass("active").find("i").removeClass("icon-dg");
    });
    //场次选择
    $(".season-handle").find("a.btn-save").click(function () {
        var val=$(this).parent().prev().find("a.active").data("sessionid"),text=$(this).parent().prev().find("a.active").find("span:first").find("em").text();
        if(typeof val=="undefined"){
            val="";
            text="请选择场次";
        }
        $(this).parent().parent().prev().find("input[type=hidden]").val(val);
        if(val!="djx"){
            $(this).parent().parent().prev().find("a").find("span").text(text+"场");
        }else{
            $(this).parent().parent().prev().find("a").find("span").text("到店选");
        }
        $("#showtimes").val(text);
        $(".season-box,#mask").hide();
    }).end().find("a.btn-cancel").click(function () {
        $(".season-box,#mask").hide();
    });
    //优惠券选择
    $(".coupon-handle").find("a.btn-save").click(function () {
        var _checked=$("#couponPanel").find('.coupon-checked').parent();
        _localCouponPrice =_checked.length==0?"0": _checked.data('price');
        _localPrice=_postPrice==0?$("#totalprice").data("price"):_postPrice;
        console.log($("#totalprice").data("price"));
        $("#totalprice").text(operation.accSub(_localCouponPrice,_localPrice)>0?operation.accSub(_localCouponPrice,_localPrice):0);
        $('#couponId').val(_checked.data("id"));
        $("#couponBtn").find("span").text(_checked.length==0?"优惠券选择":_checked.find(".coupon-title").text());
        $(".coupon-layer,#mask").hide();
    }).end().find("a.btn-cancel").click(function () {
        $(".coupon-layer,#mask").hide();
    });
    $("#cardBtn").click(function(){
        var mold=$(this).data("mold"),url="",data={};
        switch (mold){
            case "tel":
                var length = $("input[name=mobile]").val().length;
                var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
                if($("input[name=mobile]").val()==""){
                    alert("电话号码不能为空！");
                    return false;
                }
                if(length != 11 || !mobile.test($("input[name=mobile]").val())){
                    alert("电话号码格式不正确！");
                    return false;
                }
                url="/user/telcode";
                data.mobile=$("input[name=mobile]").val();
                break;
            case "email":
                var email = /^\\w+([-_.]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,6})+$/;
                if($("input[name=email]").val()==""){
                    alert("邮箱不能为空！");
                    return false;
                }
                url="/user/emailcode";
                data.email=$("input[name=email]").val();
                break;
            case "password":
                url="/user/passwordcode";
                break;
        }

        $.ajax({
            url:url,
            type:"post",
            data:data,
            success:function(data){
                if(data.flag=="error"){
                    alert(data.msg);
                }else{
                    time($("#cardBtn")[0]);
                    //$("input[name=cardcode]").val(data.checkCode);
                }
            }
        });
    });
    $(".notice-btn").click(function () {
        var div=$(this).data("url");
        $(".article-panel").hide();
        $("#"+div).show();
        $("#mask").show();
    });
    $("select[name='certificateType']").change(function () {
        var val=$(this).val(),zjh=$("*[data-mold='zjh']");
        zjh.find("input[name=accIdentification]").removeAttr("isIdCardNo isPassport isHKMacao isTaiwan");
        switch (val){
            case "0":
                zjh.find(".lab-title").text("身份证");
                zjh.find("input[name=accIdentification]").attr({
                    "placeholder":"请填写身份证",
                    "isIdCardNo":"true"
                });
                break;
            case "1":
                zjh.find(".lab-title").text("护照");
                zjh.find("input[name=accIdentification]").attr({
                    "placeholder":"请填写护照",
                    "isPassport":"true"
                });
                break;
            case "2":
                zjh.find(".lab-title").text("港澳通行证");
                zjh.find("input[name=accIdentification]").attr({
                    "placeholder":"请填写港澳通行证",
                    "isHKMacao":"true"
                });
                break;
            case "3":
                zjh.find(".lab-title").text("台湾通行证");
                zjh.find("input[name=accIdentification]").attr({
                    "placeholder":"请填写台湾通行证",
                    "isTaiwan":"true"
                });
                break;
        }
    });
    //优惠券
    $("#couponBtn").click(function () {
        var mold=$(this).data("mold")=="line"?"zyx":$(this).data("mold"),code=$(this).data("code"),mobile=$("input[name=mobile]").val(),total=operation.accMul($("#price").text(),$(".number").val()),idcard=$("input[name=accIdentification]").val();
        if(mold=="hotel"){
            total=$("#cost-total").find("strong").text();
        }
        if(mold!="goods"&&idcard==""){
            alert("身份证不能为空！");
            return false;
        }
        var mobiletest = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if(mobile==""||mobile.length != 11 || !mobiletest.test(mobile)){
            alert("电话号码格式不正确！");
            return false;
        }else{
            couponlist(total,mobile,code,mold,idcard);
        }
    });
    $("#couponPanel").on("click","li",function () {
        if($(this).hasClass("coupon-unchecked")){
            return false;
        }
        if($(this).find(".coupon-right").hasClass("coupon-checked")){
            $(this).find(".coupon-right").removeClass("coupon-checked");
        }else{
            $("#couponPanel").find(".coupon-right").removeClass("coupon-checked");
            $(this).find(".coupon-right").addClass("coupon-checked");
        }
    });
    //取消订单
    $("#cancelOrder").click(function () {
        if(confirm('确定取消该订单吗?'))
        {
            $.get('/user/cancelOrder',{id:$(this).data("orderid")},function (data) {
                if(data.flag=="error"){
                    alert(data.msg);
                }else {
                    //window.location.reload();
                    $(".btn-handle").remove();
                }
                return true;
            });

        }
        return false;
    });
    $("input[name=carNumber]").blur(function(event){
        var text=$(this).val();
        $(this).val(text.toUpperCase());
    });

});



function handleSuccess(position){
    // 获取到当前位置经纬度  本例中是chrome浏览器取到的是google地图中的经纬度
    var lng = position.coords.longitude;
    var lat = position.coords.latitude;
    lonlat=lng+","+lat;
}

function handleError(error){

}

//自提地址信息
function addressList(data){
    var html="<ul class='address-list'>";
    $.each(data,function(i){
        html+="<li data-id="+data[i].sinceId+" data-begintime='"+data[i].beginTime+"' data-endtime='"+data[i].endTime+"'>";
        html+="<div><a href='tel:"+data[i].telephone+"' class='address-tel'><i class='page-icon icon-iconfont-dianhua'></i></a><h3 class='address-title'>"+data[i].name+"<span>"+data[i].distance+"km</span></h3></div>";
        html+="<div><a href='javascript:;' class='btn btn-small'>选择</a><p class='address-info'>"+data[i].address+"</p></div>";
        html+="</li>";
    });
    html+="</ul>";
    return html;
}

//日历信息
function getStock(date){
    var mold=$("#calendar-btn").data("mold"),id=$("#calendar-btn").data("code"),type=$("#calendar-btn").data("type"),param={};
    if(type=="score"){
        param.modelCode=id;
    }else{
        param.id=id;
    }
    param.nowDate=date;
    $.get('/order/getStock/'+mold,param,function(data){
        $(".season-btn").find("span").text("请选择场次").end().next().val("");
        var obj="";
        if(mold=="line"||mold=="combo"){
            $(".number").numSpinner("max",data[0].num.max);
            $(".number").numSpinner("min",data[0].num.min);
            if((typeof data[0].tickets!="undefined")&&data[0].tickets.length!==0){
                $("input[name=zyxTicketIds]").each(function (i) {
                    console.log(i);
                    $(this).val(data[0].tickets[i].value);
                });
            }
            $(".season-btn").each(function () {
                var time=$(this).data("ticketid"),html="";
                if(mold=="line"){
                    html+="<a href='javascript:;' data-sessionId='djx' class='djx'>";
                    html+="<span>到店选</span>";
                    html+="<i class='page-icon'></i>";
                    html+="</a>";
                }
                $.each(data[0].shows,function(i){
                    var leftAmount=data[0].shows[i].leftAmount>100?"充足":data[0].shows[i].leftAmount;
                    if(time==data[0].shows[i].cid){
                        html+="<a href='javascript:;' data-sessionId='"+data[0].shows[i].value+"'>";
                        html+="<span><em>"+data[0].shows[i].changci+"</em>场</span>";
                        html+="<span>余位"+leftAmount+"</span>";
                        html+="<i class='page-icon'></i>";
                        html+="</a>";
                    }
                });
                if(html==""){
                    $(this).parent().next().find(".season-list").html("暂无场次！");
                }else{
                    $(this).parent().next().find(".season-list").html(html);
                }
            });

        }else if(mold=="show"){
            var html="";
            $.each(data[0].datas.session,function(i){
                var leftAmount=data[0].datas.session[i].leftAmount>100?"充足":data[0].datas.session[i].leftAmount;
                html+="<a href='javascript:;' data-sessionId='"+data[0].datas.session[i].stockId+"'>";
                html+="<span><em>"+data[0].datas.session[i].playTime+"</em>场</span>";
                html+="<span>余位"+leftAmount+"</span>";
                html+="<i class='page-icon'></i>";
                html+="</a>";
            });
            if(html==""){
                $(".season-list").html("暂无场次！");
            }else{
                $(".season-list").html(html);
            }
        }
    },"json");
}

//退款信息
function refund(value){
    $.get('/user/refund',{refundNum:value},function(data){
        if(data.flag=="success"){
            $("#fee").text(data.datas.costs);
        }else{
            alert(data.msg);
        }
    },'json');
}

function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.value="免费获取验证码";
        wait = 60;
    } else {
        o.setAttribute("disabled", true);
        o.value="重新发送(" + wait + ")";
        wait--;
        setTimeout(function() {
                time(o)
            },
            1000)
    }
}

function couponlist(totalprice,tel,id,mold,idcard) {
    $.get("/user/couponlist",{"mobile":tel,"paySum":totalprice,"ticketId":id,"ticketType":mold,"idcard":idcard},function (data) {
        if(data.flag=="success"){
            $("#couponPanel,#mask").show();
            if(data.datas.length>0){
                var html="";
                $.each(data.datas,function (i) {
                    var id=$('#couponId').val(),className='',liClassName="";
                    if(id==data.datas[i].id){
                        className="coupon-checked"
                    }
                    if(!data.datas[i].flag){
                        liClassName="coupon-unchecked"
                    }
                    html+="<li data-id='"+data.datas[i].id+"' data-price='"+data.datas[i].cutSum+"' class='"+liClassName+"'>";
                    html+="<div class='coupon-left'><span class='cost-num'><em>￥</em>"+data.datas[i].cutSum+"</span><p>未使用</p></div>";
                    html+="<div class='coupon-right "+className+"'>";
                    html+="<h4 class='coupon-title'>"+data.datas[i].couponName+"</h4>";
                    html+="<p class='coupon-subtitle'>"+typeof data.datas[i].info=="undefined"?data.datas[i].info:""+"</p>";
                    html+="<p class='coupon-explian'>"+data.datas[i].useBegDate.substring(0,10)+"至"+data.datas[i].useEndDate.substring(0,10)+"</p>";
                    html+="</div >";
                    html+="</li>";
                });
                $("#couponPanel").find("ul").html(html);
            }else{
                $("#couponPanel").find("ul").html("暂无优惠券");
            }
        }else{
            if(data.msg=="未绑定身份证无法使用优惠券"){
                $("#couponLayer,#mask").show();
            }else{
                alert(data.msg);
            }
        }

    });
}