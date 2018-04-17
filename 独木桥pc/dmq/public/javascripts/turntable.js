$(function () {
    var rotateTimeOut = function (){
        $('#rotate').rotate({
            angle:0,
            animateTo:2160,
            duration:8000,
            callback:function (){
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };
    var bRotate = false;
    var rotateFn = function (awards, angles, txt,ptype){
        bRotate = !bRotate;
        $('#rotate').stopRotate();
        $('#rotate').rotate({
            angle:0,
            animateTo:angles+1800,
            duration:8000,
            callback:function (){
                $("#leftNum").text($("#leftNum").text()-1);
                if(ptype=="0"){
                    $("#winningBox").find("p").text(txt).end().show();
                }else {
                    $("#errorBox").show();
                }
                $("#mask").show();
                bRotate = !bRotate;
            }
        })
    };

    $('.draw-arrow').click(function (){
        var leftNum=$("#leftNum").text(),user=$(this).data("user");
         if(user==0){
             alert("您没有绑定身份证！")
             return false;
         }
         if(leftNum==0){
             alert("您已经没有多余的抽奖次数了！")
             return false;
         }
        $.post("/user/turntable/"+$(this).data("id"),{},function (data) {
            if(data.flag=="error"){
                alert(data.msg);
                return false;
            }
            if(bRotate)return;
            var item = data.datas.index;
            var angle = [22,337,292,247,202,157,112,67];
            rotateFn(item, angle[item],  data.datas.text,data.datas.productType);
        });
    });
    $("#errorBox").find("a").click(function () {
        $("#errorBox,#mask").hide();
    });
    $(".cancel-btn,#tipsLayerClose").click(function () {
        $("#tipsLayer,.mask").hide();
    });
});
function rnd(n, m){
    return Math.floor(Math.random()*(m-n+1)+n)
}
