 function ajaxSubmitForm(formId) {
	this.formId = formId;
	this.result = {};
	this.init = function() {
		var checkForm = $("#" + formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						var num = $("#amount").val();
						var playDate = $("#playDate").val();
						if(num == ""){
							alert("请选择数量!");
							return false;
						}
						if(playDate == "" || playDate == "暂无有效的游玩日期"){
							alert("暂无有效的游玩日期!");
							return false;
						}
						var sessionId = $("#sessionId");
						if(sessionId.length > 0)
						{
							var sess_id = sessionId.val();
							if(sess_id == ''){
								alert("请选择演出场次");
								return false;
							}
						}
			
						var options = {};
						options.success = function(rInfo) {
							//var obj = eval(rInfo);
							console.log(rInfo);
							//var obj = rInfo;
							//checkForm._form.result = obj;
							//if (obj.flag == "success") {
							//	//location.href =obj.message[0];
							//}
							//else
							//{
							//	alert(obj.message[0]);
							//}
						};
						options.beforeSend = function(XMLHttpRequest) {
							disabledForm(formId);
						};
						options.complete = function(XMLHttpRequest) {
							enabledForm(formId);
						};
						options.dataType = "text";
						var ajaxForm = $(form);
						ajaxForm.ajaxSubmit(options);
					}
				});
	}
	this.init();
}