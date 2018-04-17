/**
 * 简单的form 提交成功或失败后只提示返回信息
 * 
 * @param formId
 *            表单id
 * @param actionName
 *            任务名如修改用户信息等
 * @return
 */
function SimpleForm(formId, actionName) {
	this.formId = formId;
	this.actionName = actionName;
	this.result = {};
	this.init = function() {
		var checkForm = $("#" + formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						if (confirm("确定" + actionName + "?")) {
							var options = {};
							options.success = function(rInfo) {
								var obj = eval(rInfo);
								checkForm._form.result = obj;
								alert(obj.message[0]);
								if (obj.flag == "success") {
									location.reload();
								}
							};
							options.beforeSend = function(XMLHttpRequest) {
								disabledForm(formId);
								WaitDialog.show("正在提交...")
							};
							options.complete = function(XMLHttpRequest) {
								enabledForm(formId);
								WaitDialog.hide();
							};
							options.dataType = "text";
							var ajaxForm = $(form);
							ajaxForm.ajaxSubmit(options);
						}
					}
				});
	}
	this.init();
}
/**
 * 一般的form提交成功后返加上一url、
 * 
 * @param formId
 * @param actionName
 * @return
 */

function GeneralForm(formId, actionName) {
	this.formId = formId;
	this.actionName = actionName;
	this.result = {};
	this.init = function() {
		var checkForm = $("#" + formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						if (confirm("确定" + actionName + "?")) {
							var options = {};
							options.success = function(rInfo) {
								var obj = eval(rInfo);
								checkForm._form.result = obj;
								alert(obj.message[0]);
								if (obj.flag == "success") {
									window.location.href = applicationContent.backUrl;
								}
							};
							options.beforeSend = function(XMLHttpRequest) {
								disabledForm(formId);
								WaitDialog.show("正在提交...")
							};
							options.complete = function(XMLHttpRequest) {
								enabledForm(formId);
								WaitDialog.hide();
							};
							options.dataType = "text";
							options.type="post";
							var ajaxForm = $(form);
							ajaxForm.ajaxSubmit(options);
						}
					}
				});
	}
	this.init();
}

function GeneralFormDialog(formId, actionName) {
	this.formId = formId;
	this.actionName = actionName;
	this.result = {};
	this.init = function() {
		var checkForm = $("#" + formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						if (confirm("确定" + actionName + "?")) {
							var options = {};
							options.success = function(rInfo) {
								var obj = eval(rInfo);
								checkForm._form.result = obj;
								alert(obj.message[0]);
								if (obj.flag == "success") {
									dialog.closeMe();
								}
							};
							options.beforeSend = function(XMLHttpRequest) {
								disabledForm(formId);
								WaitDialog.show("正在提交...")
							};
							options.complete = function(XMLHttpRequest) {
								enabledForm(formId);
								WaitDialog.hide();
							};
							options.dataType = "text";
							var ajaxForm = $(form);
							ajaxForm.ajaxSubmit(options);
						}
					}
				});
	}
	this.init();
}

/**
 * 提交成功后返回的是用户转入的url
 * 
 * @param formId
 * @param actionName
 * @param url
 * @return
 */
function BackUrlForm(formId, actionName, url) {
	this.formId = formId;
	this.actionName = actionName;
	this.result = {};
	this.url = url;
	this.init = function() {
		var checkForm = $("#" + formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						if (confirm("确定" + actionName + "?")) {
							var options = {};
							options.success = function(rInfo) {
								var obj = eval(rInfo);
								checkForm._form.result = obj;
								alert(obj.message[0]);
								if (obj.flag == "success") {
									window.location.href = checkForm._form.url;
								}
							};
							options.beforeSend = function(XMLHttpRequest) {
								disabledForm(formId);
								WaitDialog.show("正在提交...")
							};
							options.complete = function(XMLHttpRequest) {
								enabledForm(formId);
								WaitDialog.hide();
							};
							options.dataType = "text";
							var ajaxForm = $(form);
							ajaxForm.ajaxSubmit(options);
						}
					}
				});
	}
	this.init();
}
/**
 * 成功提交返回后执行用户输入方法
 * 
 * @param formId
 * @param actionName
 * @param callback
 *            方法返回CallbackForm对象
 * @return
 */
function CallbackForm(formId, actionName, callback) {
	this.formId = formId;
	this.actionName = actionName;
	this.result = {};
	this.callBack = callback;
	this.init = function() {
		var checkForm = $("#" + formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						if (confirm("确定" + actionName + "?")) {
							var options = {};
							options.success = function(rInfo) {
								var obj = eval(rInfo);
								checkForm._form.result = obj;
								alert(obj.message[0]);
								if (obj.flag == "success") {
									checkForm._form.callBack(checkForm._form);
								}
							};
							options.beforeSend = function(XMLHttpRequest) {
								disabledForm(formId);
								WaitDialog.show("正在提交...")
							};
							options.complete = function(XMLHttpRequest) {
								enabledForm(formId);
								WaitDialog.hide();
							};
							options.dataType = "text";
							var ajaxForm = $(form);
							ajaxForm.ajaxSubmit(options);
						}
					}
				});
	}
	this.init();
}
// callBefor 检证结束后提交前调用
// formId form的Id
// actionName 操作说明
// callBack 成功后的返回方法
function AdvancedForm(formOption) {
	this.callBefor = formOption.callBefor;
	this.formId = formOption.formId;
	this.actionName = formOption.actionName;
	this.result = {};
	this.callBack = formOption.callBack;
	this.init = function() {
		var checkForm = $("#" + this.formId);
		checkForm._form = this;
		checkForm.validate({
					ignore : "",
					submitHandler : function(form) {
						if (checkForm._form.callBefor) {
							if (!checkForm._form.callBefor())
								return;
						}
						if (confirm("确定" + checkForm._form.actionName + "?")) {
							var options = {};
							options.success = function(rInfo) {
								var obj = eval(rInfo);
								checkForm._form.result = obj;
								alert(obj.message[0]);
								if (obj.flag == "success") {
									checkForm._form.callBack(checkForm._form);
								}
							};
							options.beforeSend = function(XMLHttpRequest) {
								disabledForm(checkForm._form.formId);
								WaitDialog.show("正在提交...")
							};
							options.complete = function(XMLHttpRequest) {
								enabledForm(checkForm._form.formId);
								WaitDialog.hide();
							};
							options.dataType = "text";
							var ajaxForm = $(form);
							ajaxForm.ajaxSubmit(options);
						}
					}
				});
	}
	this.init();
}

/**
 * 使表单所有元素失效
 * 
 * @param id
 * @return
 */
function disabledForm(id) {
	$("#" + id).find("textarea").attr("disabled", true);
	$("#" + id).find("input").attr("disabled", true);
}
/**
 * 使表单所有元素有效
 * 
 * @param id
 * @return
 */
function enabledForm(id) {
	$("#" + id).find("textarea").attr("disabled", false);
	$("#" + id).find("input").attr("disabled", false);
}
/**
 * 弹出等条
 */
var WaitDialog = new function() {
	this.div;
	this.show = function(message) {
		var style = "background:#ffffff;position:absolute;width:300px;top:50%;left:50%;margin-left:-150px;margin-top:-150px;text-align:center;padding:7px 0 0 0;font:bold 11px Arial, Helvetica, sans-serif;";
		var html = "<div id=\"loading\" style=\"" + style + "\">" + message
				+ "..<img src=\"" + applicationContent.baseUrl
				+ "/style/m/images/waiting.gif\" alt=\"wait...\" /></div>";
		this.div = $(html);
		$("body").append(this.div);
	}
	this.hide = function() {
		this.div.remove();
	}
}