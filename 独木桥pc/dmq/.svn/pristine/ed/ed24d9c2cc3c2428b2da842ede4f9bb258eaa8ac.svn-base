$(document).ready(function () {
    $("#first").click(function(){
        var value=$("#first").attr("value");
        showParkCommentsAjax(url, value);
    });
    $("#previous").click(function(){
        var value=$("#previous").attr("value");
        showParkCommentsAjax(url, value);
    });
    $("#next").click(function(){
        var value=$("#next").attr("value");
        showParkCommentsAjax(url, value);
    });
    $("#last").click(function(){
        var value=$("#last").attr("value");
        showParkCommentsAjax(url, value);
    });
    $("#dropTo").click(function(){
        var value=$("#dropTo").attr("value");
        showParkCommentsAjax(url, value);
    });

    $("#viewAll").click(function(){
        url="http://www.51dmq.com/ticket/dp!parkAllComment.htm?parkId="+pkId;
        var value=$("#viewAll").attr("value");
        showParkCommentsAjax(url, value);
    });

    <!-- ajax操作 -->
    var options={};
    var pkId=$("#parkId").val();
    url="http://www.51dmq.com/ticket/dp!parkUsefulComment.htm?parkId="+pkId;
    options.url=url;
    options.dataType="json";
    <!-- options.async=false;-->
    options.success=function(data){
        var comCount=data.commentCount;
        var commentList=data.parkComents;
        if(comCount==null){
            $(".s_ul").css("display","none");
            $(".st_w2_i").css("width","0%");
            $(".sum").text("该景区暂无评论");
            $("#viewAll").css("display","none");
        }else{
            var aveComment=comCount.aveComments;
            var avg=aveComment*20;
            var commentCount=comCount.commentCount-1;
            $("#topAvg").css({width:avg+"%"});
            $(".st_w2_i").css("width",+avg+"%");
            $(".s_sum").html("("+aveComment+"分，共"+commentCount+"条点评)");
            $(".sum").text(commentCount+"条评论，平均"+aveComment+"星");
            $("#viewAll").text("查看全部"+commentCount+"条用户评论  ");
        }
        dealHtml(commentList);
        return;
    };
    options.error=function(){
    };
    //$.ajax(options);
});

function showParkCommentsAjax(url, value){
    var currPage=parseInt($("#currPage").val());
    var totalPage=parseInt($("#totalPage").val());
    switch(value){
        default: currPage=1; url=url+"&currPage="+currPage; break;
        case "next": currPage=currPage+1; if(currPage>totalPage) return;url=url+"&currPage="+currPage; break;
        case "previous": currPage=currPage-1; if(currPage<=0) return; url=url+"&currPage="+currPage; break;
        case "last": currPage=totalPage; url=url+"&currPage="+currPage; break;
        case "跳转": var dropTo=parseInt($("#pointPage").val()); if(dropTo>totalPage||dropTo<1) return; currPage=dropTo; url=url+"&currPage="+currPage; break;
    }
    $.ajax({
        url:url,
        dataType:"json",
        success:function(data){
            if(data!=null&&data.cmPage!=null){
                var cmPage=data.cmPage;
                var commentList =cmPage.result;
            }
            if(commentList!=null&&commentList.length>0){
                dealHtml(commentList);
                if(value==="all"){
                    $("#pageBlock").css("display","block");
                    $("#totalPage").val(cmPage.totalPage);
                    $("#viewAll").css("display","none");
                }
                $("#pointPage").val(currPage);
                $("#currPage").val(currPage);
            }
            return;
        },
        error:function(){
        }
    });
};

function dealHtml(commentList){
    var str="";
    var html="";
    if(commentList==null||commentList.length<=0){
        $(".u_ct").css({display:"none"});
        $(".comment_list_w").css("display","none");
    }else{
        $(".comment_list_w").html("");
        $.each(commentList, function(index,comment){
            var cmId=comment.id;
            str="<div class='comment_list_b' id='comment_list_"+cmId+"'><div class='cm_p1 cf' >";
            str=str+"<div class='st_w'><div id='w_score' class='st_w_i' ></div></div>";
            str=str+"<span class='st_p1'></span><span class='st_p2'></span>";
            str=str+"<span class='st_p3'></span></div><div id='cm_conten' class='cm_p2 cf'></div>";
            str=str+"<div class='cm_p3 cf'><div class='st1_txt'>这条评论对您有用吗？</div>";
            html=str+"<a href='javascript:void(0);' class='y_btn'>是</a><a href='javascript:void(0);' class='n_btn'>否</a></div></div>";
            $(".comment_list_w").append(html);
            <!-- 操作数据 -->
            var score=comment.score*20;
            $("div#w_score").eq(index).css("width",score+"%");
            var clickUseful=comment.clickUseful;
            var clickCount=comment.clickCount;
            $("span.st_p1").eq(index).html(clickUseful+"/"+clickCount+" 人认为此评论有用");
            var accountName=comment.accountName;
            $("span.st_p2").eq(index).html("发表人："+accountName);
            var modifiedTime=comment.modifiedTime.toString().replace("T"," ");
            $("span.st_p3").eq(index).html("编辑时间："+modifiedTime);
            var conten=comment.conten;
            $("div#cm_conten").eq(index).text(conten);
            $("a.y_btn").eq(index).on("click",function(){
                doComment('PARK',cmId,'YES');
            });
            $("a.n_btn").eq(index).on("click",function(){
                doComment('PARK',cmId,'NO');
            });
        });
    }

};

$(function(){
    commonFloat(1000 , false);
});

$(function(){
    $('#scroll_w').kooslide();

    $('.main_t').each(function(){
        $(this).find('tr:gt(0)').each(function(){
            $(this).hover(function(){
                $(this).addClass('tr_hover');
            },function(){
                $(this).removeClass('tr_hover');
            });
        });
    });

});

$(function(){

    $('.main_type').toggle(function(){
        $(this).parents('.td_w').eq(0).find('.fx_Intro').toggle();
        $(this).html($(this).html().replace('▼','▲'));
    },function(){
        $(this).parents('.td_w').eq(0).find('.fx_Intro').toggle();
        $(this).html($(this).html().replace('▲','▼'));
    });

    $('.hide_fx').click(function(){
        $(this).parents('.td_w').eq(0).find('.main_type').click();
    });


});

$(function(){
    $('.lw').each(function(){
        $(this).hover(function(){
            check_lw();
            $('#lw_txt').html($(this).siblings('.lw_txt').eq(0).html());
            var pos = $(this).offset();
            $('#lw_pop').css({'left':pos.left+25,'top':pos.top-10}).show();
        },function(){
            $('#lw_pop').hide();
        });
    });
});

function check_lw(){
    if ($('#lw_pop').length==0){
        $('<div id="lw_pop"><div id="lw_txt"></div><div id="lw_arrow"></div></div>').appendTo('body');
    }
}

$(function(){
    var sel_nav_arr = $('.sel_nav li');
    var pic_sw_arr = $('.pic_sw');

    $(sel_nav_arr).each(function(i){
        $(this).click(function(){
            $(sel_nav_arr).removeClass('pic_sel');
            $(this).addClass('pic_sel');
            $(pic_sw_arr).hide();
            $(pic_sw_arr).eq(i).show();
        });
    });
});

$(function(){
    $('.pic_sw').find('img').koobox();
});

$(function(){
    //fix pos
    var nArr,pArr,snav,bArr;
    var ctop;

    $(function(){
        bArr = $('#f_nav li');
        nArr = $('#f_nav li a');
        pArr = $('.pos');
        snav = $('#f_nav');
        ctop = $('#hotel_intro').offset().top;
        cleft = $('#hotel_intro').offset().left;

        check_nav();
        $(window).scroll(function(){
            check_nav();
        }).resize(function(){
            cleft = $('#hotel_intro').offset().left;
            check_nav();
        });
    });

    var mtop = 0;

    function check_nav(){
        var num = 0;
        $(pArr).each(function(i){
            mtop = $(this).offset().top;
            if (mtop <= $(window).scrollTop())
            {
                num = i;
            }
            $(nArr).removeClass('f_sel');
            $(nArr).eq(num).addClass('f_sel');


        });

        if (ctop <= $(window).scrollTop()){
            if ($.browser.version=='6.0'){
                snav.css({'position':'absolute','top':$(window).scrollTop()-ctop});
            }else{
                snav.css({'position':'fixed','top':0,'left':cleft});
            }
        }
        else{
            if ($.browser.version=='6.0'){
                snav.css({'position':'relative','top':0});
            }else{
                snav.css({'position':'relative','top':0,'left':0});
            }
        }

    }

});

$(function(){

    $('.main_type').toggle(function(){
        $(this).parents('.td_w').eq(0).find('.fx_Intro').toggle();
        $(this).html($(this).html().replace('▼','▲'));
    },function(){
        $(this).parents('.td_w').eq(0).find('.fx_Intro').toggle();
        $(this).html($(this).html().replace('▲','▼'));
    });

    $('.hide_fx').click(function(){
        $(this).parents('.td_w').eq(0).find('.main_type').click();
    });


});
