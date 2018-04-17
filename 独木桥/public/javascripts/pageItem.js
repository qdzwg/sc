(function($) {
    $.fn.numSpinner = function (method) {
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
            $.error('Method ' + method + ' does not exist on jQuery.numSpinner');
        }
    };
    var methods = {
        init:function(_options){
            var opts = $.extend({}, $.fn.numSpinner.defaults, _options);
            return this.each(function(){
                var $this = $(this);
                private_methods.init($this,opts);
                private_methods.curobj=$this;
            });
        },
        max : function(num){
            if(private_methods.curobj[0].className==$(this)[0].className){
                private_methods.privateMax=num;
            }
        },
        min:function(num){
            if(private_methods.curobj[0].className==$(this)[0].className){
                private_methods.privatemin=num;
            }
        }
    };
    // 私有方法
    var private_methods = {
        privateMax:null,
        privatemin:null,
        curobj:null,
        arrowup:function(obj,opts){
            var arrowup=$("<a>", {
                "class": "sub",
                "href": "javascript:void(0);"
            }).html("<i></i>").click(function(){
                private_methods.curobj=obj;
                var privatemin=private_methods.privatemin;
                var num=0,optnum=obj.val()-opts.increment;
                if(privatemin!=null){
                    num=optnum<privatemin?privatemin:optnum;
                }else if(opts.min!=null){
                    num=optnum<opts.min?opts.min:optnum;
                }else{
                    num=optnum;
                }
                obj.val(num);
                $(".numSpinnerBox").find("a").removeClass("c-f60");
                $(this).addClass("c-f60");
                opts.onChange(obj,obj.val());
            });
            return arrowup;
        },
        arrowdown:function(obj,opts){
            var arrowdown = $("<a>", {
                "class": "add",
                "href": "javascript:void(0);"
            }).html("<i></i>").click(function() {
                private_methods.curobj=obj;
               var privateMax=private_methods.privateMax;
                var num=0,optnum=parseInt(obj.val())+opts.increment;
                if(privateMax!=null){
                    num=optnum>privateMax?privateMax:optnum;
                }
                else if(opts.max!=null){
                    num=optnum>opts.max?opts.max:optnum;
                }
                else{
                    num=optnum;
                }
                obj.val(num);
                $(".numSpinnerBox").find("a").removeClass("c-f60");
                $(this).addClass("c-f60");
                opts.onChange(obj,obj.val());
            });
            return arrowdown;
        },
        init:function(obj,opts){
            var contentBox = $("<div>", {
               "class": "numSpinnerBox"
           });
            if(!obj.parent().hasClass("numSpinnerBox")){
                obj.after(contentBox);
               contentBox.append(obj);
                obj.before(this.arrowup(obj,opts)).after(this.arrowdown(obj,opts));
               }
            obj.blur(function(){
                var val=$(this).val().replace(/[^\d]/g,'')||1;
                if(opts.min!=null){
                    val=parseFloat(val)<parseFloat(opts.min)?opts.min:val;
                }
                if(opts.max!=null){
                    val=parseFloat(val)>parseFloat(opts.max)?opts.max:val;
                }
                $(this).val(val);
                opts.onChange(this,val);
           });
        }
    };
    // 默认参数
    $.fn.numSpinner.defaults = {
        increment: 1,
        min: null,
        max: null,
        onChange: function(evl,value) {}
    };
})(jQuery);