;(function($){
    $.fn.seats = function (method) {
        // 如果第一个参数是字符串, 就查找是否存在该方法, 找到就调用; 如果是object对象, 就调用init方法;.
        if (methods[method]) {
            // 如果存在该方法就调用该方法
            // apply 是吧 obj.method(arg1, arg2, arg3) 转换成 method(obj, [arg1, arg2, arg3]) 的过程.
            // Array.prototype.slice.call(arguments, 1) 是把方法的参数转换成数组.
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            // 如果传进来的参数是"{...}", 就认为是初始化操作.
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.seats');
        }
    };

    // 不把方法扩展在 $.fn.seats 上. 在闭包内建个"methods"来保存方法, 类似共有方法.
    var methods = {
        /**
         * 初始化方法
         * @param _options
         * @return {*}
         */
        init : function (_options) {
            return this.each(function () {
                var $this = $(this);
                var opts = $.extend({}, $.fn.seats.defaults, _options);
                private_methods.init($this,opts);
            });
        },
        unselect:function(id){
        	private_methods.unselect(id);
        },
        selectNum:function (num) {
            private_methods.selectNum(num);
        }
    };
    
    // 私有方法
   var private_methods = {
        opts:"",
        downx:"",
        downy:"",
        _move:true,
        _x:"",
        _y:"",
        init:function(obj,opts){
		   var _this=this;
            _this.opts=opts;
            obj.html("").append(_this.seatsPanel());
            $(".seat-table").css({
                top:0,
                left:0
            });
            var rowCounts=$("#rowCounts").val(),colCounts=$("#colCounts").val(),totalCount=$("#totalCount").val(),funArray=[];
            _this.ajaxSeat(opts);

        },
       ajaxSeat:function (opts) {
           var _this=this,param=opts.param[1];
           param.areaCode=$("#areaCode").val();
           // param.offset=index;
           // param.totalCount=totalCount;
           //param.returnStatus="no";
           $.ajax({
               url:opts.url,
               data:param,
               type:"get",
               cache:false,
               dataType:"json",
               //jsonp:'callback',
               success:function(data, status, xhr){
                   if(data.datas.length>0){
                       $("#seatMove").find("li").each(function () {
                           if($(this).find("span").length==0){
                               var row=$(this).data("row"),col=$(this).data("col");
                               $(this).append(_this.seatSvg(row,col,data));
                           }
                       });
                       //console.log($(".seat-table").find(".iconfont:first").offset().left);
                       $(".seat-table").css({
                            top:120-$(".seat-table").find(".iconfont:first").offset().top,
                           left:10-$(".seat-table").find(".iconfont:first").offset().left
                       });
                   }
                   $("#seatMark").remove();
               },
               error:function(XMLHttpRequest, textStatus, error){

               },
               complete:function (xhr,data) {
                   //console.log(xhr.getResponseHeader('Content-Length'));
               }
           });
       },
        seatsPanel:function(){
            var _this=this;
            var seats=$("<div>",{id:"seatMove"}).addClass("seat-move").append(this.seatsGrid());
            return seats;
        },
        seatsGrid:function(){
        	var touchEvents = {
                touchstart: "touchstart",
                touchmove: "touchmove",
                touchend: "touchend"
            };
            var table = $("<div>").addClass("seat-table");
            var seat = $('#seats');
            var tableArray=[],
                _this=this;
            var svg_start,svg_end;
            //var rowCounts=data.rowCounts,colCounts=data.colCounts;
            var rowCounts=$("#rowCounts").val(),colCounts=$("#colCounts").val();
            for(var i=0;i<rowCounts;i++){
                var tr = $("<ul>");
                for(var j=0;j<colCounts;j++){
                    var td=$("<li>").data("row",i).data("col",j);
                    tr.append(td);
                }
                tableArray.push(tr);
            }
            table.append(tableArray);

            table.on('touchstart',function (e) {
                e.preventDefault();
                var pos = e.originalEvent.changedTouches[0];
                var $t = $(this);
                $t.removeClass("movetransition");
                _this._move=true;
                _this._x = pos.pageX-parseInt($t.css('left'));
                _this._y = pos.pageY-parseInt($t.css('top'));

                
                $("#seatPanel").on(touchEvents.touchmove,function(e) {
                    var pos = e.originalEvent.changedTouches[0];
                    if(_this._move){
                        var x = pos.pageX-_this._x;//移动时根据鼠标位置计算控件左上角的绝对位置
                        var y = pos.pageY-_this._y;
                        seat.find(".seat-table").css({top:y,left:x});//控件新位置
                        $("#side").removeClass("movetransition").css({top:y+25});//控件新位置
                    }
                });
                return false;
            });

            table.on('touchstart','span',function(e){
                var pos = e.originalEvent.changedTouches[0];
                _this.downx = pos.clientX;
                _this.downy = pos.clientY;
                svg_start = new Date();
            });
            table.on('touchend','span',function(e){
                var pos = e.originalEvent.changedTouches[0];
                var upx=pos.clientX;
                var upy=pos.clientY;
                svg_end = new Date();
                if(upx==_this.downx&&upy==_this.downy){
                    if(svg_end-svg_start < 250){
                        $(this).trigger("evtClick");
                        // if(_this.opts.selectNum<_this.opts.limit){
	                     //    $(this).trigger("evtClick");
	                     //    _this.opts.selectNum += 1;
                        // }else{
                    		// alert('最多只能选择'+_this.opts.limit+'个座位')
                		// }
                    }
                }
            });
            return table;
        },
        seatLine:function(data){
            var line='';
            for(var i=data.rowCounts;i>0;i--){
                line += '<li>'+i+'</li>'
            }
           return line;
        },
       seatSvg:function(row,col,data){
           var svg="",_this=this,seatdata=data.datas,seatlength=seatdata.length;
           var rowCounts=$("#rowCounts").val(),colCounts=$("#colCounts").val();
           $.each(seatdata,function(i){
               if(seatdata[i].GROW==(rowCounts-row-1)&&seatdata[i].GCOL==(colCounts-col-1)){
                   switch (seatdata[i].SEATSTATUS){
                       case "0" : default:
                       var selected=_this.opts.selected,flag=true;
                       if(selected.length>0){
                           $.each(selected,function(j){
                               if(selected[j].seatid==seatdata[i].SEATID&&selected[j].areacode==$("#areaCode").val()){
                                   flag=false;
                                   return false;
                               }
                           });
                           if(flag){
                               svg=$('<span class="iconfont icon-seat clicked" id="seat_'+seatdata[i].SEATID+"r"+seatdata[i].SROW+"c"+seatdata[i].SCOL+'"></span>').bind("evtClick",function(){
                                   var selected=true;
                                   if($(this).hasClass("selected")){
                                       this.className="iconfont icon-seat clicked";
                                       selected=false;
                                   }else{
                                       this.className="iconfont icon-seat clicked selected";
                                   }
                                   _this.opts.handle(seatdata[i].SROW,seatdata[i].SCOL,seatdata[i].SEATID,data.areaName,data.areaCode,seatdata[i].SEATNAME,_this.opts.selectNum,selected);
                               });
                           }else{
                               svg=$('<span class="iconfont icon-seat clicked selected" id="seat_'+seatdata[i].SEATID+"r"+seatdata[i].SROW+"c"+seatdata[i].SCOL+'"></span>').bind("evtClick",function(){
                                   var selected=true;
                                   if($(this).hasClass("selected")){
                                       this.className="iconfont icon-seat clicked";
                                       selected=false;
                                   }else{
                                       this.className="iconfont icon-seat clicked selected";
                                   }
                                   _this.opts.handle(seatdata[i].SROW,seatdata[i].SCOL,seatdata[i].SEATID,data.areaName,data.areaCode,seatdata[i].SEATNAME,_this.opts.selectNum,selected);
                               });
                           }
                       }else{
                           svg=$('<span class="iconfont icon-seat clicked" id="seat_'+seatdata[i].SEATID+"r"+seatdata[i].SROW+"c"+seatdata[i].SCOL+'"></span>').bind("evtClick",function(){
                               var selected=true;
                               if($(this).hasClass("selected")){
                                   this.className="iconfont icon-seat clicked";
                                   selected=false;
                               }else{
                                   this.className="iconfont icon-seat clicked selected";
                               }
                               _this.opts.handle(seatdata[i].SROW,seatdata[i].SCOL,seatdata[i].SEATID,data.areaName,data.areaCode,seatdata[i].SEATNAME,_this.opts.selectNum,selected);
                           });
                       }
                       break;
                       case "1":
                           svg=$('<span class="iconfont icon-seat sold"></span>');
                           break;
                       case "2":
                           svg='<span class="iconfont icon-seat sold"></span>';
                           break;
                       case "3":
                           svg='<span class="iconfont icon-seat sold"></span>';
                           break;
                   }
               }
           });
           return svg;
       },
       unselect:function(id){
           $("#seat_"+id).attr('class','iconfont icon-seat clicked');
           this.opts.selectNum -= 1;
       },
       selectNum:function (num) {
           this.opts.selectNum=num;
       }
    };
    
    // 默认参数
    $.fn.seats.defaults = {
      url:"",
      line:"",
      limit:'',
      selectNum:0,
      param:{},
      selected:[],
      handle:function(row,col,id,limit){
	  	
      }
    };

})(jQuery);