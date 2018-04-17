
(function ($) {
	$.fn.koobox = function(settings){

		settings = $.extend({
		    
		},settings);

		var jQueryMatchedObj = this; 
		var cloneObj = jQueryMatchedObj.clone();
		var index = 0;
		
		function _initialize() {
            
			jQueryMatchedObj.each(function(){
				$(this).click(function(){
                    index = $(jQueryMatchedObj).index($(this));
					$('html').css({'overflow':'visible'});
					$('body').css({'overflow':'hidden'});

					if ($('#koo_wrapper').length==0){
						form_structure();
					}else{
						gone();
					}
				});
			});
		};

		var koowrapper;
		var koo_mask;
		var koo_bpic_w;
		var koo_loading;
		var koo_bpic;
		var koo_bleft,koo_bright;
		var koo_title_w,koo_title;
		var koo_spic_w,koo_spic_bg;
		var koo_roll;
		var koo_sel,koo_close;

		var gtip = true;
		var tip;
		var zf = 1;

		var img;
		

		function form_structure(){

			koo_wrapper = $('<div id="koo_wrapper" style="position:absolute;left:0;top:0;z-index:1000;"></div>').appendTo('body');
			
			koo_mask = $('<div id="koo_mask" style="position:absolute;left:0;top:0;background:#000;"></div>').appendTo(koo_wrapper);
			koo_mask.css({'opacity':0.9});

			koo_bpic_w = $('<div id="koo_bpic_w" style="position:absolute;width:990px;height:660px;"></div>').appendTo(koo_wrapper);
			koo_loading = $('<img id="koo_loading" style="position:absolute;left:42%;top:50%;" src="img/loading.gif" />').appendTo(koo_bpic_w);
        	koo_bpic = $('<img id="koo_bpic" style="display:none;width:990px;height:660px;vertical-align:top;" src="about:blank" />').appendTo(koo_bpic_w);

        	koo_bleft = $('<div id="koo_bleft" style="cursor:pointer;position:absolute;left:10px;top:296px;width:63px;height:63px;background: url(img/text_pic_control.png) no-repeat scroll left top;"></div>').appendTo(koo_bpic_w);
        	koo_bright = $('<div id="koo_bright" style="cursor:pointer;position:absolute;right:10px;top:296px;width:63px;height:63px;background: url(img/text_pic_control.png) no-repeat scroll right top;"></div>').appendTo(koo_bpic_w);			
			koo_bleft.css({'opacity':0.5});
			koo_bright.css({'opacity':0.5});
			koo_bleft.hover(function(){$(this).css({'opacity':1});},function(){$(this).css({'opacity':0.5});});
			koo_bright.hover(function(){$(this).css({'opacity':1});},function(){$(this).css({'opacity':0.5});});

			koo_bleft.click(function(){
				if (gtip)
				{
					index--;
					move(index);
				}
			});
			koo_bright.click(function(){
				if (gtip)
				{
					index++;
					move(index);
				}
			});

        	koo_title_w = $('<div id="koo_title_w" style="width:990px;position:absolute;top:0;background-color:#3F3F3F;"></div>').appendTo(koo_wrapper);
        	koo_title_w.css({'opacity':0.5});
			
			koo_title = $('<div id="koo_title" style="width:990px;position:absolute;top:0;color:#fff;line-height:22px;padding:5px 0;text-align:center;font-family:Microsoft Yahei;font-size:14px;"></div>').appendTo(koo_wrapper);
        	
			koo_spic_w = $('<div id="koo_spic_w" style="width:990px;height:74px;position:absolute;bottom:0;overflow:hidden;"></div>').appendTo(koo_wrapper);
			koo_spic_bg = $('<div id="koo_spic_bg" style="width:990px;height:74px;position:absolute;left:0;top:0;background:#000;"></div>').appendTo(koo_spic_w);
			koo_spic_bg.css({'opacity':0.4});
			
			$('body').append('<style type="text/css">#koo_roll img{width:105px;height:70px;float:left;margin-right:44px;cursor:pointer;}</style>');
			koo_roll = $('<div id="koo_roll" style="height:70px;position:absolute;top:2px;"></div>').appendTo(koo_spic_w);
			koo_roll.css({'width':jQueryMatchedObj.length*149});
			cloneObj.show().appendTo(koo_roll);
			
			koo_sel = $('<div id="koo_sel" style="width:105px;height:70px;border:2px solid #fff;position:absolute;left:445px;top:0;"></div>').appendTo(koo_spic_w);
			koo_close = $('<div id="koo_close" style="position:absolute;right:20px;top:20px;width:34px;height:34px;cursor:pointer;background: url(img/text_pic_close.png) no-repeat 0 0;"></div>').appendTo(koo_wrapper);
			koo_close.css({'opacity':0.5});
			koo_close.hover(function(){$(this).css({'opacity':1});},function(){$(this).css({'opacity':0.5});});
			koo_close.click(function(){koo_wrapper.hide();$('body').css({'overflow':'auto'});$('html').css({'overflow':''});});
			

			cloneObj.each(function(i){
				$(this).click(function(){
					move(i);
				});	
			});
			
			check_index(index);
			show_index(index);
			koo_roll.css({'left':(3-index)*149});

			make_pos();
			
			$(window).resize(function(){make_pos();});
		};

		function gone(){
			koo_wrapper.show();

			check_index(index);
			show_index(index);
			koo_roll.css({'left':(3-index)*149});

			make_pos();
		}

		function move(i){
					if (gtip)
					{
						gtip = false;
						tip = index;
				    	index=i;
						check_index(index);
						show_index(index);

						if (i>tip)
							zf = -1;
						else
							zf = 1;

						koo_roll.animate({'left':((3-index)*149+zf*10)}, "fast",function(){
							$(this).animate({'left':(3-index)*149}, 200,function(){
								gtip = true;
							});
						});
					}
		}
		
		function check_index(index){
			(index==0)?koo_bleft.hide():koo_bleft.show();
			(index==jQueryMatchedObj.length-1)?koo_bright.hide():koo_bright.show();
		}
		function show_index(index){
			koo_title.html(cloneObj.eq(index).attr('title'));

			koo_loading.show();
			koo_bpic.hide();

			img = new Image();
			img.onload = function(){
				koo_loading.hide();
				koo_bpic.attr('src',img.src);
				koo_bpic.show();
			}
			img.src = cloneObj.eq(index).attr('bsrc');


			koo_title_w.css({'height':koo_title.outerHeight()});
		}

		function make_pos(){
			var w = $(window).width();
            var h = $(window).height();
			var s_top = $(window).scrollTop()

            koo_wrapper.css({'width':w,'height':h,'top':s_top});
            koo_mask.css({'width':w,'height':h});
            koo_bpic_w.css({'left':(w-990)/2,'top':(h-660)/2});
			koo_title.css({'left':(w-990)/2});
            koo_title_w.css({'left':(w-990)/2,'height':koo_title.outerHeight()});
			koo_spic_w.css({'left':(w-990)/2});
			
		}


		_initialize();
	};
})(jQuery);