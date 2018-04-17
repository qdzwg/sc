$(function (){
    //优惠券
    $("#couponBtn").click(function () {
        var mold=$(this).data("mold"),code=$(this).data("code"),mobile=$("input[name=linkMobile]").val(),total=$("#sum").text().slice(1);
        var mobiletest = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if(mobile==""||mobile.length != 11 || !mobiletest.test(mobile)){
            alert("电话号码格式不正确！");
            return false;
        }else{
            couponlist(total,mobile,code,mold);
        }
    });

    function couponlist(totalprice,tel,id,mold) {
        $.get("/user/couponlist",{"mobile":tel,"paySum":totalprice,"ticketId":id,"ticketType":mold},function (data) {
            if(data.flag=="success"||data.datas.length>0){
                var html="";
                $.each(data.datas,function (i) {
                    
                    html+='<option data-price='+data.datas[i].cutSum+' value='+data.datas[i].id+'>'+data.datas[i].couponName+'</option>'
                });
                html='<select name="couponAccId"><option>请选择</option>'+html+'<select>';
                $("#couponBtn").empty();
                $("#couponPanel").html(html);
                $('select[name=couponAccId]').change(function (){
                    _couponPric = $(this).find("option:selected").data('price');
                    getFinPrice();
                });
            }else{
                $("#couponPanel").html("暂无优惠券");
            }
        });
    }

});

function getFinPrice(){
    var _a = $("#sum").text().slice(1),
        _b = _a - _couponPrice,
        _c = _b < 0 ? 0 : _b;

    $("#sum").text("￥" + _c);
}