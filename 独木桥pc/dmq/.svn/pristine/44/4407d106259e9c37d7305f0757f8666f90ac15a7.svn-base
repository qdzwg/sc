$(document).ready(function () {
    $('#addCart').on('click', function () {
        if ($("input[name=toType]").length == 0) {
            $('#validateForm').append($('<input>', {
                'type': 'hidden',
                'name': 'toType',
                'value': 'cart'
            }));
        }
        $('#validateForm').submit();
    });
    //init();
    $("#validateForm").validate({
        ignore: "",
        submitHandler: function (form) {
            if ($("#ac_check:checked").length > 0) {
                form.submit();
            }
            else {
                alert("接受合同条款后方能提交订单。");
            }
        }
    })
});
function init() {
    var ordNum = $("#ordNum").val();
    var str = "";
    for (var i = 1; i <= ordNum; i++) {
        var daxie = converyNumToDaXie(i);
        str = "<div class='sub_t'><span class='mr10'>第" + daxie + "个出游人</span><input name='marks' value='_size' type='checkbox'><label>保存为常用联系人</label></div><table cellpadding='0' cellspacing='0' class='normal_t'><tr><th><strong>*</strong>出游人姓名：</th><td><input type='text' class='text text_s1 mr10' name='contacts[_size].name' validate='{required:true,chcharacter:true}' id='visit_name_playNum' /></td></tr><tr><th><strong>*</strong>性别：</th><td><input type='radio'name='contacts[_size].sex'value='true' checked/>男&nbsp&nbsp&nbsp<input type='radio'name='contacts[_size].sex'value='false'/>女</td></tr><tr><th><strong>*</strong>手机号：</th><td><input type='text' class='text text_s1' name='contacts[_size].mobile' validate='{required:true,minlength:11,mobile:true}' id='visit_mobile_playNum'/></td></tr><tr><th><strong>*</strong>身份证号码：</th><td><input type='text' class='text text_s1' name='contacts[_size].cardNo' validate='{required:true,idcardno:true}' id='visit_card_playNum'/></td></tr></table>";
        str = str.replace(eval("/playNum/ig"), i);
        str = str.replace(eval("/_size/ig"), i - 1);
        $("#tourist").append(str);
    }
    $("input[type=radio][value=0]").attr("checked", true);
}
function converyNumToDaXie(num) {
    var first = "";
    var second = "";
    var third = "";
    if (9 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "九";
        second = "十"
    } else if (8 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "八";
        second = "十"
    } else if (7 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "七";
        second = "十"
    } else if (6 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "六";
        second = "十"
    } else if (5 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "五";
        second = "十"
    } else if (4 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "四";
        second = "十"
    } else if (3 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "三";
        second = "十"
    } else if (2 <= parseFloat(parseInt(num) / parseInt(10))) {
        first = "二";
        second = "十"
    } else if (1 < parseFloat(parseInt(num) / parseInt(10))) {
        second = "十"
    }
    if (parseInt(num) == 0) {
        third = "零"
    } else if (parseInt(num) % parseInt(10) == 1) {
        third = "一"
    } else if (parseInt(num) % parseInt(10) == 2) {
        third = "二"
    } else if (parseInt(num) % parseInt(10) == 3) {
        third = "三"
    } else if (parseInt(num) % parseInt(10) == 4) {
        third = "四"
    } else if (parseInt(num) % parseInt(10) == 5) {
        third = "五"
    } else if (parseInt(num) % parseInt(10) == 6) {
        third = "六"
    } else if (parseInt(num) % parseInt(10) == 7) {
        third = "七"
    } else if (parseInt(num) % parseInt(10) == 8) {
        third = "八"
    } else if (parseInt(num) % parseInt(10) == 9) {
        third = "九"
    } else {
        third = "十"
    }
    return (first + second + third)
}
function plus(cash) {
    var oldPrice = $("#totalSum").val();
    var newPrice = oldPrice - cash;
    if (newPrice > 0) {
        $("#newPrice").html("￥" + newPrice);
    } else {
        $("#newPrice").html("￥0");
    }
}
function addCash() {
    var zyxId = $("#zyxId").val();
    var cashNo = $("input[name=cashNo]").val();
    $.ajax({
        url: "/zyx/order_step2_" + zyxId + "!jihuo.htm?cashNo=" + cashNo,
        dataType: 'json',
        success: function (data) {
            if (data.length == 1) {
                $("<tr><th><strong>*</strong>选择优惠券：</th><td id='choose'></td></tr>").insertBefore($("#cashInfo"));
            }
            $("#choose").empty();
            $.each(data, function (i, res) {
                if (i == 0) {
                    $("#choose").append("&nbsp;<input name='id' type='radio' value=" + res.id + " onclick=plus(" + res.cash + ")>&nbsp;优惠" + res.cash + "元,优惠券编号" + res.cashNo + "</input><br>");
                } else {
                    $("#choose").append("<span class='w2'></span>&nbsp;<input name='id' type='radio' value=" + res.id + " onclick=plus(" + res.cash + ")>&nbsp;优惠" + res.cash + "元,优惠券编号" + res.cashNo + "</input><br>");
                }
            });
            $("#choose").append("<span class='w2'></span>&nbsp;<input name='id' type='radio' value='0' checked='checked' onclick='plus(0)' />&nbsp;暂不使用优惠券<br>");
            $("input[name=cashNo]").val("");
        },
        error: function () {
            alert("优惠券编号错误或已激活！");
        }
    });
}
var bcon_arr = $('.book_con');
$('#book_ul li').each(function (i) {
    $(this).click(function () {
        $(this).siblings().removeClass('current');
        $(this).addClass('current');
        $(bcon_arr).hide();
        $(bcon_arr).eq(i).show();
    });
});
