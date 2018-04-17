jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var mobile = /^1(3|4|5|7|8)\d{9}$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

// 身份证号码验证
jQuery.validator.addMethod("isIdCardNo", function(value, element) {
    //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
    return this.optional(element) || isIdCardNo(value);
}, "请输入正确的身份证号码");

// 非法字符验证
jQuery.validator.addMethod("isIllegalChar", function(value, element) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':'\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'、？\\s]");
    return this.optional(element) || !pattern.test(value);
}, "输入包含非法字符");

jQuery.validator.addMethod("requir", function(value, element) {
    //var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;
    return this.optional(element) || k(value);
}, "这是必填项");

//数字和英文必须
jQuery.validator.addMethod("numandchar", function(value, element) {
    var regp =/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/;
    return this.optional(element) || regp.test(value);
}, "必须包含英文和数字！");

// 护照验证
jQuery.validator.addMethod("isPassport", function(value, element) {
    var re1 = /^[a-zA-Z]{5,17}$/;var re2 = /^[a-zA-Z0-9]{5,17}$/;
    return this.optional(element) || (re2.test(value)) || re1.test(value);
}, "护照格式不正确");

// 港澳通行证验证
jQuery.validator.addMethod("isHKMacao", function(value, element) {
    var re = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/;
    return this.optional(element) || (re.test(value));
}, "港澳通行证格式不正确");

// 台湾通行证验证
jQuery.validator.addMethod("isTaiwan", function(value, element) {
    var re1 = /^[0-9]{8}$/;var re2 = /^[0-9]{10}$/;
    return this.optional(element) || (re1.test(value)) || (re2.test(value));
}, "台湾通行证格式不正确");

// 车牌号验证
jQuery.validator.addMethod("isVehicleNumber", function(value, element) {
    var test= /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/;
    return this.optional(element) || test.test(value);
}, "车牌号格式不正确");

function k(value){
    if(value.replace(/^\s*/g,"")!=""){
        return true;
    }else{
        return false;
    }
}

//身份证验证
function isIdCardNo(num){
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num)))
    {
        //alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
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
            //alert('输入的身份证号里出生日期不对！');
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
            //alert('输入的身份证号里出生日期不对！');
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
                //alert('18位身份证的校验码不正确！应该为：' + valnum);
                return false;
            }
            return true;
        }
    }
    return false;
}