/**
 * 公用方法
 */
var common = new function(){
	/**
	 * 提交url，完成后刷新页面
	 * message为提交的确认信息。
	 */
	this.doPost = function(url,message){
		if(confirm(message)){
			var url=url;
			var options={};
			options.url=url;
			options.dataType="text";
			options.success=function(text){
					var obj=eval(text);
					alert(obj.message[0]); 
					if(obj.flag=="success"){
						location.reload();
						}
					};
			$.ajax(options);
		}
	}
}


$(function(){
	if($('.dat tbody tr').length != 0){
		$('.dat tbody tr').hover(function(){
	        $(this).addClass('tuchu');
	    },function(){
	        $(this).removeClass('tuchu');
	    });
	}

	//优惠券
    $("#couponList").click(function () {
        var mold=$(this).data("mold"),id=$(this).data("proid"),mobile=$("input[name=linkMobile]").val(),total=$("#totalprice").text();
        var mobiletest = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        if(mobile==""||mobile.length != 11 || !mobiletest.test(mobile)){
            alert("电话号码格式不正确！");
            return false;
        }else{
			$.get("/user/couponlist",{"mobile":tel,"paySum":totalprice,"ticketId":id,"ticketType":mold},function (data) {

			})

        }
    });
});
