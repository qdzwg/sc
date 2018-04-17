$(document).ready(function(){
	$("a[dialog]").each(function(){
		var self=$(this);
		var param=eval("("+self.attr("dialog")+")");
		var option={};
		//默认参数
		option.type='iframe';
		option.width='auto';
		option.height='none';
		option.autoScale=false;
		option.onClosed=function(){dialog.onClosed();};
		option.transitionIn='none';
		option.transitionOut='none';
		//传入参数
		if(param.width)
			option.width=param.width;
		if(param.height)
			option.height=param.height;
		if(param.onClosed)
			option.onClosed=param.onClosed;
		$(this).fancybox( option);
	});	
});


var dialog=new function(){
	
	//传入jquery对象
	this.bind = function(objs){
		if(objs.length>0){  						//数组处理
			objs.each(function(){
				var self=$(this);
				var param=eval("("+self.attr("dialog")+")");
				var option={};
				//默认参数
				option.type='iframe';
				option.width='auto';
				option.height='none';
				option.autoScale=false;
				option.onClosed=function(){dialog.onClosed();};
				option.transitionIn='none';
				option.transitionOut='none';
				//传入参数
				if(param.width)
					option.width=param.width;
				if(param.height)
					option.height=param.height;
				if(param.onClosed)
					option.onClosed=param.onClosed;
				$(this).fancybox( option);
			});	
		}else{										//单对象处理
			var self=$(objs);
			var param=eval("("+self.attr("dialog")+")");
			var option={};
			//默认参数
			option.type='iframe';
			option.width='auto';
			option.height='none';
			option.autoScale=false;
			option.onClosed=function(){dialog.onClosed();};
			option.transitionIn='none';
			option.transitionOut='none';
			//传入参数
			if(param.width)
				option.width=param.width;
			if(param.height)
				option.height=param.height;
			if(param.onClosed)
				option.onClosed=param.onClosed;
			$(objs).fancybox( option);
		}
	}
	this.closeMe = function(obj){
		if(parent.dialog.callback)
			parent.dialog.callback(obj);
		parent.dialog.closeDialog()
	}
	
	this.closeDialog = function(){
		$.fancybox.close();
	}
	this.onClosed= function(){
		if(!this.callback)
			location.reload();
	}
}