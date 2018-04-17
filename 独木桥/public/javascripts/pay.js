$(function(){
    var paymold=$("#pay-mold").find("a");
    touch.on("#arrow","tap",function(){
        $("#orderDetails").slideToggle();
        $(this).find("a").toggleClass("arrow-down");
        $(this).parent().toggleClass("arrow-down");
    });
    touch.on(paymold,'tap',function(event){
        //event.stopPropagation();
        var state= 0,url=$("#pay-btn").attr("href");
        paymold.find(".icon-iconfont-gougou").removeClass("c-base");
        if(event.target.nodeName=="A"){
            $(this).find(".icon-iconfont-gougou").addClass("c-base");
            state=$(this).data("state");
        }
        else if(event.target.nodeName=="LABEL"){
            $(this).next().addClass("c-base");
            state=$(this).parent().data("state");
        }
        else if(event.target.className=="font-icon icon-iconfont-weixin"||event.target.className=="font-icon icon-iconfont-qq"||event.target.className=="font-icon icon-iconfont-zhifubao"){
            $(this).parent().next().addClass("c-base");
            state=$(this).parent().parent().data("state");
        }
        else{
            $(this).addClass("c-base");
            state=$(this).parent().data("state");
        }
        //var urlarry=url.split("/");
        //urlarry.pop();
        //urlarry.push(state);
        //$("#pay-btn").attr("href",urlarry.join("/"));
        $("#state").val(state);
    });
    $("#pay-btn").click(function () {
        $("#payForm").submit();
    });
});