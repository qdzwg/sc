// 打开模态对话框
var util = new function() {
	// 日期有效性验证
	this.CheckDateTime = function(strng) {
		re = /^([12]{1}\d{3})-([01]?\d{1})-([0123]?\d{1})$/;
		// re=/^(\d{4})-(\d{1,2})-(\d{1,2})$/gi;不能获取正确的子匹配
		var a = strng.match(re)
		if (a != null) {
			var D = new Date(a[1] + "/" + a[2] + "/" + a[3]);
			var B = D.getFullYear() == a[1] && (D.getMonth() + 1) == a[2]
					&& D.getDate() == a[3];
			if (!B) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	this.CheckDateTime2 = function(strng) {
		re = /^([12]{1}\d{3})([01]?\d{1})([0123]?\d{1})$/;
		// re=/^(\d{4})-(\d{1,2})-(\d{1,2})$/gi;不能获取正确的子匹配
		var a = strng.match(re)
		if (a != null) {
			var D = new Date(a[1] + "/" + a[2] + "/" + a[3]);
			var B = D.getFullYear() == a[1] && (D.getMonth() + 1) == a[2]
					&& D.getDate() == a[3];
			if (!B) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	// 日期相加
	this.dateadd = function(date, num, flag) {

		var dt = date;
		var n = 0;
		if (flag == "date") {
			return new Date(dt.valueOf() + num * 24 * 60 * 60 * 1000);
		} else if (flag == "month") {
			var sArr1 = new Array();
			sArr1[1] = dt.getMonth() + num;
			sArr1[0] = dt.getFullYear()+ util.div(sArr1[1], 12);
			sArr1[1] = util.mod(sArr1[1], 12);
			return new Date(sArr1[0], sArr1[1], dt.getDate());
		} else if (flag == "year") {
			sArr1[0] = eval(sArr1[0] + num);
			return new Date(sArr1[0], dt.getMonth(), dt.getDate());
		}

	}
	// 日期相减
	this.dateminus = function(strDate1, strDate2) {
		var sArr1 = strDate1.split("-");
		var sArr2 = strDate2.split("-");
		var date1 = new Date(sArr1[0], eval(sArr1[1] - 1), sArr1[2]);
		var date2 = new Date(sArr2[0], eval(sArr2[1] - 1), sArr2[2]);
		return Math.ceil((date2 - date1) / (24 * 60 * 60 * 1000));

	}

	// 日期相减
	this.dateleftnow = function(strDate) {
		var sArr1 = strDate.split("-");
		var now = new Date();
		var date = new Date(sArr1[0], eval(sArr1[1] - 1), sArr1[2]);
		return Math.ceil((date - now) / (24 * 60 * 60 * 1000));
	}

	// 注册输入框为整数类型
	this.regInteger = function(name) {
		ocx = document.getElementById(name);
		ocx.onkeyup = function() {
			fString = this.value;
			this.value = fString.replace(/\D/gi, '');
		};
	}
	// 注册输入框为实型类型
	this.regFloat = function(name) {
		ocx = document.getElementById(name);
		ocx.onkeyup = function() {
			if (isNaN(this.value)) {
				document.execCommand('undo');
			};
		};
	}

	// 注册输入框为查询框 (过滤特殊字符)
	this.regMyBox = function(name) {
		ocx = document.getElementById(name);
		ocx.onkeyup = function() {
			fString = this.value;
			fString = fString.replace(">", "");
			fString = fString.replace("<", "");
			fString = fString.replace("'", "");
			fString = fString.replace("$", "");
			fString = fString.replace("^", "");
			fString = fString.replace("%", "");
			fString = fString.replace("(", "");
			fString = fString.replace(")", "");
			fString = fString.replace("\"", "");
			fString = fString.replace("/", "");
			fString = fString.replace("`", "");
			fString = fString.replace("!", "");
			fString = fString.replace("@", "");
			fString = fString.replace("%", "");
			fString = fString.replace("{", "");
			fString = fString.replace("&", "");
			fString = fString.replace("}", "");
			fString = fString.replace("#", "");
			fString = fString.replace(" ", "");
			fString = fString.replace("　", "");
			this.value = fString;
		};
	}

	// 过滤特殊字符
	this.replaceTT = function(name) {
		ocx = document.getElementById(name);
		ocx.onkeyup = function() {
			ocx.value = ocx.value.replace(/[^a-zA-Z0-9\u4E00-\u9FA5]*$/, '');
		};
	}

	this.div = function(exp1, exp2) {
		var n1 = Math.round(exp1); // 四舍五入
		var n2 = Math.round(exp2); // 四舍五入

		var rslt = n1 / n2; // 除

		if (rslt >= 0) {
			rslt = Math.floor(rslt); // 返回值为小于等于其数值参数的最大整数值。
		} else {
			rslt = Math.ceil(rslt); // 返回值为大于等于其数字参数的最小整数。
		}
		return rslt;
	}
	this.mod = function(exp1, exp2) {
		var n1 = Math.round(exp1); // 四舍五入
		var n2 = Math.round(exp2); // 四舍五入
		return n1 - util.div(n1, n2) * n2;
	}
	this.ismail = function(mail) {
		return (new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(mail));
	}
	this.ismobile = function(mobile) {
		var reg = new RegExp(/^1[358]\d{9}$/);
		return reg.test(mobile);
	}

	this.isIDCode=function(num) 
	  {
	     var factorArr = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
	      var error;
	      var varArray = new Array();
	      var intValue;
	      var lngProduct = 0;
	      var intCheckDigit;
	     var intStrLen = num.length;
	     var idNumber = num;    
	     // initialize
	     if ((intStrLen != 15) && (intStrLen != 18)) {
	         //error = "输入身份证号码长度不对！";
	         //alert(error);
	         //frmAddUser.txtIDCard.focus();
	         return false;
	    }    
	     // check and set value
	     for(i=0;i<intStrLen;i++) {
	         varArray[i] = idNumber.charAt(i);
	         if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
	             //error = "错误的身份证号码！.";
	             //alert(error);
	             //frmAddUser.txtIDCard.focus();
	             return false;
	         } else if (i < 17) {
	             varArray[i] = varArray[i]*factorArr[i];
	         }
	     }
	     if (intStrLen == 18) {
	         //check date
	         var date8 = idNumber.substring(6,14);
	         if (util.CheckDateTime2(date8) == false) {
	             //error = "身份证中日期信息不正确！.";
	             //alert(error);
	             return false;
	         }        
	         // calculate the sum of the products
	         for(i=0;i<17;i++) {
	             lngProduct = lngProduct + varArray[i];
	         }        
	         // calculate the check digit
	        intCheckDigit = 12 - lngProduct % 11;
	        switch (intCheckDigit) {
	            case 10:
	                 intCheckDigit = 'X';
	                 break;
	             case 11:
	                 intCheckDigit = 0;
	                 break;
	             case 12:
	                 intCheckDigit = 1;
	                 break;
	         }        
	         // check last digit
	         if (varArray[17].toUpperCase() != intCheckDigit) {
	             //error = "身份证效验位错误!正确为： " + intCheckDigit + ".";
	             //alert(error);
	             return false;
	         }
	     } 
	     else{        //length is 15
	         //check date
	         var date6 = idNumber.substring(6,12);
	         if (util.CheckDateTime2(date6) == false) {
	             //alert("身份证日期信息有误！.");
	             return false;
	         }
	     }
	     //alert ("Correct.");
	     return true;
	 }
	
	this.trim = function(s) {
		return s.replace(/^\s*/, "").replace(/\s*$/, "");
	}

	this.IsNumeric = function(s) {
		if (isNaN(Number(s)))
			return false;
		else
			return true;
	}
	this.IsNumeric = function(s) {
		if (isNaN(Number(s)))
			return false;
		else
			return true;
	}
	this.valNum = function(s) {
		var num = parseInt(s);
		if (this.IsNumeric(num))
			return num;
		else
			return 0;
	}
	this.formatRMB = function(data) {
		return "" + data.toFixed(2);
	}

}