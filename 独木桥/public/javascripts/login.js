var wait=60;
$(function(){
    //注册验证码获取
    $("#cardBtn").click(function(){
        var length = $("input[name=tel]").val().length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if($("input[name=tel]").val()==""){
            alert("电话号码不能为空！");
            return false;
        }
        if(length != 11 || !mobile.test($("input[name=tel]").val())){
            alert("电话号码格式不正确！");
            return false;
        }
        $.ajax({
            url:"/card",
            type:"post",
            data:{"tel":$("input[name=tel]").val()},
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
    //快速登录验证码获取
     $("#qcardBtn").click(function(){
        var length = $("input[name=mobile]").val().length,type=$(this).data("type");
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if($("input[name=mobile]").val()==""){
            alert("电话号码不能为空！");
            return false;
        }
        if(length != 11 || !mobile.test($("input[name=mobile]").val())){
            alert("电话号码格式不正确！");
            return false;
        }
        $.ajax({
            url:"/qgetCheckCode",
            type:"post",
            data:{"mobile":$("input[name=mobile]").val()},
            success:function(data){
                if(data.flag=="error"){
                    alert(data.msg);
                }else{
                    if(type!="coupon"){
                        time($("#qcardBtn")[0]);
                    }
                    //$("input[name=cardcode]").val(data.checkCode);
                }
            }
        });
    });
    //忘记密码验证码获取
    $("#passwordCardBtn").click(function(){
        var length = $("input[name=tel]").val().length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if($("input[name=tel]").val()==""){
            alert("电话号码不能为空！");
            return false;
        }
        if(length != 11 || !mobile.test($("input[name=tel]").val())){
            alert("电话号码格式不正确！");
            return false;
        }
        $.ajax({
            url:"/passwordcard",
            type:"post",
            data:{"tel":$("input[name=tel]").val()},
            success:function(data){
                if(data.flag=="error"){
                    alert(data.msg);
                }else{
                    time($("#passwordCardBtn")[0]);
                    //$("input[name=cardcode]").val(data.checkCode);
                }
            }
        });
    });
    $("#saveBtn").click(function(){
        if(validator.form()){
            $("#myform").attr("action","/register").submit();
        }
    });
    $("#savePasswBtn").click(function(){
        if(validator.form()){
            $("#myform").attr("action","/forgetPassword").submit();
        }
    });

    //表单验证
    var validator=$("#myform").validate({
        rules: {
            tel:{
                required:true,
                isMobile:true
            },
            mobile:{
                required:true,
                isMobile:true
            },
            password: {
                required:true,
                rangelength:[6,20],
                numandchar:true
            },
            loginpassword:{
                required:true,
                rangelength:[6,20]
            },
            checkCode:{
                required:true,
            },
            enterpassword:{
                equalTo:"#password"
            }
        },
        messages: {
        }
    });

    $("#check").click(function(){
        var checked=$(this).is(":checked");
        if(checked){
            $("#saveBtn").removeAttr("disabled").removeClass("disabled");
        }else{
            $("#saveBtn").attr("disabled","disabled").addClass("disabled");
        }
    });

    $("#checkCard").click(function(){
        $.get("/checkCard",function(data){
            $("#checkCard").find("img").attr("src",data.code);
        })
    });

    $("#getcoupon").click(function(){
        var idcard=$(this).data("idcard");
        $.get('/coupon/user',{},function (res) {
           if(res.idCardBundFlag=="1"){
               $.post('/coupon/getcoupon',{},function (data) {
                   if(data.flag=="success"){
                       $("#success-coupon,#mask").show();
                   }else{
                       $("#prompt,#mask").show();
                       $("#prompt").find(".tips-content").html(data.msg);
                   }
               },"json");
           }else{
               $("#bindIdcard,#mask").show();
           }
        },'json');
    });

    $("#bindIdcard-btn").click(function () {
        if(IdentityCodeValid($("#accIdentification").val())){
            $.post('/coupon/getcouponAndbindIdcard', {accIdentification: $("#accIdentification").val()}, function (data) {
                console.log(data);
                if(data.flag=="success"){
                    $("#bindIdcard").hide();
                    $("#success-coupon,#mask").show();
                }
            },"json");
        }else{
            alert("身份证格式错误！");
        }
    });
});

function time(o) {
    if (wait == 0) {
        o.removeAttribute("disabled");
        o.value="获取验证码";
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