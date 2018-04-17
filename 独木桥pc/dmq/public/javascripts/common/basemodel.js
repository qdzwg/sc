/**
 *需要引用jquery
 *订定一个独立请求的方法名 
 */

function ModelBase(url,div){
	var url=url;
	var div=div;
	this.callback=function(html){
		$("#"+div).html(html);
	};
	this.invoke=function(param) {
		type = "html";
		param = param || {};
		param.uri=encodeURI(window.location);
		return $.post(url, param, this.callback, type);
	};
	
};


function orderDetail(u,fushDiv){
	$.ajax({ 
		url: u ,
		type:'post', //数据发送方式 
		dataType:'html', //接受数据格式 
		data: {} ,
		beforeSend: function() {
			$("#"+fushDiv).html("cw");
		},
		success:function(obj) {
			$("#"+fushDiv).html(obj);
		},
		error:function(obj)
		{
			window.location.reload();
		}
	}); 
};


