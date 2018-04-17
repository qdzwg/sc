	jQuery.extend(jQuery.validator, {
		messages:{
	        required: "必输字段",
		  	remote: "请修正该字段",
	  		email: "请输入正确格式的电子邮件",
		  	url: "请输入合法的网址",
		  	date: "请输入合法的日期",
		  	dateISO: "请输入合法的日期 (ISO).",
		  	number: "请输入合法的数字",
		  	digits: "只能输入整数",
		  	creditcard: "请输入合法的信用卡号",
		  	equalTo: "请再次输入相同的值",
		  	accept: "请输入拥有合法后缀名的字符串",
		  	maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
		  	minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
		  	rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		  	range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		  	max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
		  	min: jQuery.validator.format("请输入一个最小为 {0} 的值"),
		  	password: jQuery.validator.format("请输入一致的密码"),
		  	ip:"请输入有效的IP地址",
		  	chrnum:"只能输入数字、字母或者它们的组合",
		  	phone:"电话号码格式不对",
		  	mobile:"手机号码格式不对",
		  	zipcode:"邮政编码格式不对",
		  	idcardno:"请正确输入身份证号码",
		  	chcharacter:"请输入汉字",
		  	regstr:"请输入有效的数据",
		  	fck:"数据不能为空!",
		  	maxTo:"输入数据有误!",
		  	minTo:"输入数据有误!"
		}
	});
	
	jQuery.validator.addMethod("ip", function(value, element) {        
	    return this.optional(element) || (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));        
	});
	
	// 增加只能是字母和数字的验证
	  jQuery.validator.addMethod("chrnum", function(value, element) {        
	    return this.optional(element) || (/^([a-zA-Z0-9]+)$/.test(value));        
	  });        
	    
	// 自定义验证规则——对电话号码进行验证
	$.validator.addMethod("phone",function(value, element){           
	   // "/\(?0\d{2,3}[)
		// -]?\d{7,8}/"匹配电话号码的格式多种：010-82839278、(010)82839278、01082839278等，但是，这样有一个问题
	   // 如：(01082839278这样的也会匹配。当然可以用分支条件"|"解决，比较麻烦。而且以什么开始或结束也没有匹配。
	   // 为了简单起见，去掉有"()"的形式。匹配区号3位，则本地号8位，区号4位，则本地号7位的号码。
	   var tel = /^0\d{2}[-]?\d{8}$|^0\d{3}[-]?\d{7}$/;        
	   return this.optional(element) || (tel.test(value));        
	   } );       
	  
	// 手机号码验证
	jQuery.validator.addMethod("mobile", function(value, element) {      
	  var length = value.length;      
	  // 长度为11，以13，15，18开头的
	  return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));      
	});      
	    
	// 邮政编码验证
	jQuery.validator.addMethod("zipcode", function(value, element) {      
	  var tel = /^[0-9]{6}$/;      
	  return this.optional(element) || (tel.test(value));      
	});   
	/**
	 *比较验证最大
	 */
	jQuery.validator.addMethod("maxTo",function(value,element,param){
		
		var flag=false;
		var temp=parseInt($(param).val());
		if(temp==""){
			flag=true;
		}
		else{
		if(parseInt(value) >= temp)
			 flag=true;
		}
	    return flag;
	});
	/**
	 *比较验证最小
	 */
	jQuery.validator.addMethod("minTo",function(value,element,param){
		var flag=false;
		var temp=parseInt($(param).val());
		if(temp==""){
			flag=true;
		}
		else{
		if(parseInt(value)<= temp)
			 flag=true;
		}
	    return flag;
	});
	/* 追加自定义验证方法 */
	// 身份证号码验证
	jQuery.validator.addMethod("idcardno", function(value, element) {
	return this.optional(element) || isIdCardNo(value);
	});

	// 汉字
	jQuery.validator.addMethod("chcharacter", function(value, element) {
	var tel = /^[\u4e00-\u9fa5]+$/;
	return this.optional(element) || (tel.test(value));
	});
	//正则表达式验证
	jQuery.validator.addMethod("regstr",function(value,element,param){
	    return this.optional(element)||(param.test(value));
	});
	/**
	 * fck验证
	 */
	jQuery.validator.addMethod("fck",function(value,element,param){
		var flag=true;
		var oEditor = FCKeditorAPI.GetInstance($(element).attr("name"));   //获取名为content的FCK编辑器实例
		var content = oEditor.GetXHTML(); //获取编辑器内容
		$(element).val(content);
		if(param==true){
		    if(content == ""||content == "<br />"||content == "&nbsp;"){
				oEditor.SetHTML("");
	            oEditor.Focus();
	            flag=false;
	        }
		}
	    return flag;
	});
	
	/**
	 * 身份证号码验证
	 * 
	 */
	function isIdCardNo(num) {

        num = num.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
        {
            alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
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
                alert('输入的身份证号里出生日期不对！');
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
                alert('输入的身份证号里出生日期不对！');
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
                    alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return true;
            }
        }
        return false;
	}