function doLogin()
{
    if ($.trim($('#login_name').val())==''){
        $('#login_error_w').html('<div id="login_error">用户名不能为空!</div>');
        $('#login_name').focus();
        return false;
    }
    if ($.trim($('#password').val())==''){
        $('#login_error_w').html('<div id="login_error">密码不能为空!</div>');
        $('#password').focus();
        return false;
    }
    if ($.trim($('#checkcode').val())==''){
        $('#login_error_w').html('<div id="login_error">验证码不能为空!</div>');
        $('#checkcode').focus();
        return false;
    }

    return true;
}


function changeCode() {
    $.get("/checkCard",function(data){
        $("#checkCodeImg").attr("src",data.code);
    });
}

function checkName() {
    var loginName = $("#login_name").val();
    $.ajax({
        type:'post',
        url:'http://www.51dmq.com/checkName.htm',
        data:'loginName='+loginName,
        dataType:'text',
        success:function(data){
            var obj = eval(data);
            var res = obj.flag;
            if(res == 'error'){
                $('#login_error_w').html('<div id="login_error">用户名不存在!</div>');
                $("#loginBtn").attr({"disabled":"disabled"});

            }else{
                $('#login_error_w').html('');
                $("#loginBtn").removeAttr("disabled");//将按钮可用
            }
        }
    });
}