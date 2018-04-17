$(function () {
    $("#grade").click(function () {
        var _this=$(this);
        $.post('user/grade',{},function (data) {
            if(data.flag=="success"){
                _this.html('<i class="score-icon icon-upgrade"></i>等待审核').addClass("grade-disabled");
            }else{
                alert(data.msg);
            }
        });
    });
    var score=$("#location").data("score");
    if(score>-1&&score<500){
        $("#location").css({
            left:((score/500)*26+8)+"%"
        });
    }
    if(score>500&&score<1500){
        $("#location").css({
            left:(((score-500)/1000)*25+34)+"%"
        });
    }
    if(score>1500&&score<3000){
        $("#location").css({
            left:(((score-1500)/1500)*24+59)+"%"
        });
    }
    if(score>3000&&score<5000000){
        $("#location").css({
            left:(((score-3000)/4997000)*24+85)+"%"
        });
    }
    $(".member-handle").click(function () {
        if($(".right-nav").find("li:gt(2)").is(":hidden")){
            $(".right-nav").find("li:gt(2)").css({
                "display":"inline-block"
            });
            $(this).text("收起");
        }else{
            $(".right-nav").find("li:gt(2)").css({
                "display":"none"
            });
            $(this).text("展开");
        }
    });
    // var imgparent=$(".heard-img");
    // DrawImage(imgparent.find("img"),imgparent.width(),imgparent.height());
});

function DrawImage(imgObj, widthValue, heightValue) {
    var image = new Image();
    image.src = imgObj[0].src;
    if (image.width > 0 && image.height > 0) {
        if (image.height > heightValue || image.width > widthValue) {
            var h = 0, w, wflg = false;
            if (image.height > heightValue)
                wflg = true;
            if (wflg) {
                w = widthValue;
                h = (image.height * widthValue) / image.width;
            }
            if (h == 0 || h > heightValue) {
                h = heightValue;
                w = (image.width * heightValue) / image.height;
            }
            imgObj.css({
                width:w,
                height:h
            });
        } else {
            imgObj.css({
                width:image.width,
                height:image.height
            });
        }
    }
}
