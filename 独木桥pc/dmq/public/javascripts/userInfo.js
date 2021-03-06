$(function(){
		/*var area1 = new area();
        var v = $("#areaCode").val();
        area1.setupById("country","city","province","areaCode",1,v);
        $('.chang_pw_op').click(function(){
        addShowObj($('#change_pw_box'));
        });
        $('.u_img_txt').click(function(){
        addShowObj($('#change_pic_box'));
        });*/

		$('.info_cw .c_op').each(function() {
			$(this).click(function() {
				$('.info_cw .info_list').show();
				$('.info_cw .info_edit').hide();
				$('.info_cw .c_op').show();
				$(this).hide();
				var pare = $(this).parents('.info_cw').eq(0);
				pare.find('.info_list').hide();
				pare.find('.info_edit').show();
			});
		});

		$('.info_cw .cancel_btn').each(function(){
			$(this).click(function(){
				var pare = $(this).parents('.info_cw').eq(0);
				pare.find('.c_op').show();
				pare.find('.info_list').show();
				pare.find('.info_edit').hide();
			});
		});
		
		//绑定手机
		/*$('.getCode').click(function(){
			var mobile_bind = $("#mobile_bind").val();
			window.location.href="/user/bindMobile.htm?mobile="+mobile_bind;
		});*/

		$('#validatePhoneForm').on('click','.getCode',function (){
			var mobile = $('#validatePhoneForm input[name=mobile]').val();
			var _this = $(this);
			$.post('/user/mobileCode',{mobile:mobile})
				.success(function (data){
					if (data.flag === 'success'){
						_this.prev('input').val(data.checkCode);
						var s = 5 * 60, t;
						function times(){
							s--;
							_this.text(s).css('background','#ccc').prop('disabled','true');
							t = setTimeout(times, 1000);
							if ( s <= 0 ){
								s = 60;
								_this.text('免费获取').css('background','#0066cc').prop('disabled','false');
								clearTimeout(t);
							}
						}
						 
						times();
					}else{
						alert(data.msg)
					}
				})
				.error(function (err){
					console.log(err)
				});
		});

		$('#validateEmailForm').on('click','.getCode',function (){
			var email = $('#validateEmailForm input[name=email]').val();
			var _this = $(this);

			$.post('/user/emailCode',{email:email})
				.success(function (data){
					if (data.flag === 'success'){
						_this.prev('input').val(data.checkCode);
						var s = 5 * 60, t;
						function times(){
							s--;
							_this.text(s).css('background','#ccc').prop('disabled','true');
							t = setTimeout(times, 1000);
							if ( s <= 0 ){
								s = 60;
								_this.text('免费获取').css('background','#0066cc').prop('disabled','false');
								clearTimeout(t);
							}
						}
						 
						times();
					}else{
						alert(data.msg)
					}
					
				})
				.error(function (err){});
		});

    $('#changePass').on('click','.getCode',function (){
        var _this = $(this);
        $.post('/user/passwordCode',{})
            .success(function (data){
                if (data.flag === 'success'){
                    _this.prev('input').val(data.checkCode);
                    var s = 5 * 60, t;
                    function times(){
                        s--;
                        _this.text(s).css('background','#ccc').prop('disabled','true');
                        t = setTimeout(times, 1000);
                        if ( s <= 0 ){
                            s = 60;
                            _this.text('免费获取').css('background','#0066cc').prop('disabled','false');
                            clearTimeout(t);
                        }
                    }

                    times();
                }else{
                    alert(data.msg)
                }

            })
            .error(function (err){});
    });
		/*$("#validateForm").validate();
		$("#validatePhoneForm").validate();
		$("#validateEmailForm").validate();*/
		$("#bindIdCard").click(function () {
			$("#layer,#mask").show();
        });
		$("#cancel-btn,#mask,#layerClose").click(function () {
            $("#layer,#mask").hide();
        });
		$("#idCard-btn").click(function(){
			if(IdentityCodeValid($("#accIdentification").val())){
				$.post('/user/idCard', {accIdentification: $("#accIdentification").val()}, function (data) {
					if (data.flag == "error") {
						alert(data.msg);
					} else {
						window.location.reload();
					}
				});
			}
		});
	});
//身份证校验
function IdentityCodeValid(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }

    else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(parity[sum % 11] != code[17]){
                tip = "校验位错误";
                pass =false;
            }
        }
    }
    if(!pass) alert(tip);
    return pass;
}