
var ucmask = null;
var ucsobj = null;

function addShowObj(tobj){
	ucsobj = tobj;

	if (!ucmask){
		ucmask = $('<div id="ucmask" style="background:#000;display:none;z-index:999;position:absolute;left:0;top:0;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity:0.5;opacity:0.5;"></div>').appendTo('body');
		uc_makepos();
	}
	else{
		uc_makepos();
	}

    tobj.find('.cp_close,.cancel_btn').click(function(){
        ucmask.hide();
        tobj.hide();
    });;
}

$(window).resize(function(){
    if (ucmask&&ucmask.is(':visible')){
        uc_makepos();
    }
});

function uc_makepos(){
	var tarr = ___getPageSize();
	var sarr = ___getPageScroll();



	ucmask.css({'width':tarr[0],'height':tarr[1]});
	ucmask.show();

	ucsobj.show();
	var u_width = ucsobj.outerWidth();
	var u_height = ucsobj.outerHeight();

	ucsobj.css({'left':(tarr[0]-u_width)/2,'top':(tarr[1]-u_height)/2+sarr[1],'z-index':1000});

    var ifobj = ucsobj.find('iframe').eq(0);
    if (ifobj&&ifobj.length>0){
        ifobj.attr("src",ifobj.attr('url'));
    }

}

function ___getPageSize() {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {    
                xScroll = window.innerWidth + window.scrollMaxX;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }
            var windowWidth, windowHeight;
            if (self.innerHeight) {    // all except Explorer
                if(document.documentElement.clientWidth){
                    windowWidth = document.documentElement.clientWidth; 
                } else {
                    windowWidth = self.innerWidth;
                }
                windowHeight = self.innerHeight;
            } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else if (document.body) { // other Explorers
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }    
            // for small pages with total height less then height of the viewport
            if(yScroll < windowHeight){
                pageHeight = windowHeight;
            } else { 
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport
            if(xScroll < windowWidth){    
                pageWidth = xScroll;        
            } else {
                pageWidth = windowWidth;
            }
            arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
            return arrayPageSize;
};

function ___getPageScroll() {
            var xScroll, yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
                xScroll = self.pageXOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) {     // Explorer 6 Strict
                yScroll = document.documentElement.scrollTop;
                xScroll = document.documentElement.scrollLeft;
            } else if (document.body) {// all other Explorers
                yScroll = document.body.scrollTop;
                xScroll = document.body.scrollLeft;    
            }
            arrayPageScroll = new Array(xScroll,yScroll);
            return arrayPageScroll;
};

$(function(){
    var flag = $("#flag").val();
    var emObj;
    
    if(flag == 'email'){
        emObj = $("#email_cw");
        emObj.find(".info_list,.c_op").hide();
        emObj.find('.info_edit').show();
    }else if(flag == 'mobile'){
        emObj = $("#phone_cw");
        emObj.find(".info_list,.c_op").hide();
        emObj.find('.info_edit').show();
    }else if(flag == 'password'){
        addShowObj($('#change_pw_box'));
        
    }
    
    if (emObj&&emObj.length>0){
        $(window).scrollTop(emObj.position().top);
    }
    
    

    $('.chang_pw_op').click(function(){
        addShowObj($('#change_pw_box'));
    });
    /*$('.u_img_txt').click(function(){
        addShowObj($('#change_pic_box'));
    });*/
/*
    $('#changePass').on('click','input[type=submit]',function (){
        if (validator.form()){
            $('#changePass').prop('action','/user/changePass').submit();
        }
    });

    // 表单验证
    var validator=$("#changePass").validate({
        rules: {
            oldPass:{
                required:true,
                rangelength: [6,20]
            },
            loginPass: {
                required:true,
                rangelength:[6,20]
            },
            eqloginPass:{
                equalTo:"#password"
            }
        },
        messages: {
        }
    });*/

    $('.common_t').on('click','.deleConcat',function (){
        $.get('/user/concat/dele?id=' + $(this).data('proid'))
            .success(function (data){
                document.write(data);
            })
            .error(function (err){
                alert(err);
            });
    });
    $(".stat-content").find("i").click(function () {
        var index=$(this).index()+1;
        $(".stat-content").find("i").removeClass("stat-icon-full");
        $(".stat-content").find("i:lt("+index+")").addClass("stat-icon-full");
        $("#score").val(index);
    });
    
    $(function (){
        $('#date_search_btn').on('click',function (){
            filterUrl('begDate=' + ($('#orderStarDate').attr('realvalue') === undefined ? $('#orderStarDate').val() : $('#orderStarDate').attr('realvalue')) + '&' + 'endDate=' + ($('#orderEndDate').attr('realvalue') === undefined ? $('#orderEndDate').val() : $('#orderEndDate').attr('realvalue')));
        })
    });

});

