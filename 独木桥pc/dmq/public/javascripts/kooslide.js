
(function ($) {
	$.fn.kooslide = function(settings){
		settings = jQuery.extend({

		},settings);

		var jQueryMatchedObj = this; 
		
		function _initialize() {
			jQueryMatchedObj.each(function(){
				var iObj = $(this);
				var cArr = $(this).children('img');
				var cNum = cArr.length;
				var pObj = $('<p style="width:400px;height:30px;background:url(about:blank);position:absolute;left:0;bottom:0;z-index:'+(cNum+1)+'"></p>').appendTo(iObj);
				var sArr = [];

				var Interval = null;

                var preObj = null;
                var nextObj = null;

                var stopTip = true;

				cArr.each(function(i) {
					$(this).css({'z-index':cNum-i,'position':'absolute','left':0,'top':0,'display':'none'});
					var nObj = $('<span>'+(i+1)+'</span>').appendTo(iObj);
					sArr.push(nObj);
					nObj.css({'right':(cNum-i-1)*25+5,'bottom':5,'z-index':cNum+2});
				});

                sArr = iObj.find('span');

				if(sArr.length > 0) {
					sArr.eq(0).addClass('koosel');   //第一个选中
					$(cArr[0]).show();

					if(sArr.length > 1) {
						preNum = 0;
						nextNum = 1;

						sArr.each(function() {
							$(this).click(function() {
								var mtNum = 0;
							    mtNum = sArr.index($(this));
							    if (preNum!=mtNum){
									nextNum = mtNum;
							    	moveOn();
								}
							    else {
							    }
							});
						});
						Interval = setInterval(moveOn, 3000);
					}
					else {
						return;
					}	
				}

				function moveOn() {
					if (stopTip)
					{
					    stopTip = false;
						if (Interval) clearInterval(Interval);
						preObj = $(cArr[preNum]);
						nextObj = $(cArr[nextNum]);
						var preIndex = preObj.css('z-index');
						var nextIndex = nextObj.css('z-index');
						if (preIndex > nextIndex) {
							sArr.eq(preNum).removeClass('koosel');
							sArr.eq(nextNum).addClass('koosel');
							nextObj.show();
							preObj.fadeToggle("normal",function(){
							    preNum = nextNum;
								nextNum == cNum - 1 ? nextNum = 0 : nextNum++;
								Interval = setInterval(moveOn, 3000);
								stopTip = true;
							});
						}
						else {
							sArr.eq(preNum).removeClass('koosel');
							sArr.eq(nextNum).addClass('koosel');
							nextObj.fadeToggle("normal",function(){
								preObj.hide();
								preNum = nextNum;
								nextNum == cNum - 1 ? nextNum = 0 : nextNum++;
								Interval = setInterval(moveOn, 3000);
								stopTip = true;
							});
						}
					}
				};
			});
		};
		_initialize();
	};
})(jQuery);