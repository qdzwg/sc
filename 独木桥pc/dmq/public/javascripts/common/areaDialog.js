(function (config) {
    config['lock'] = true;
    config['fixed'] = true;
    config['yesText'] = 'yes';
    config['noText'] = 'no';
    config['resize'] = false;
    // [more..]
})(art.dialog.defaults);

var AreaDialog = {
	showDialog : function(nameId,id){
		var areacode = $('#'+id).val();
		art.dialog({
			title:'区域选择',
		    content:'<div style="padding:3px;"><select id="country" name="country"></select></div>'+
	             	'<div style="padding:3px;"><select id="province" name="province"></select></div>'+
	             	'<div style="padding:3px;"><select id="city" name="city"></select></div>'+
	             	'<input type="hidden" id="areaCode" value="'+ 
	             	areacode +
	             	'" />',
		    yesFn: function () {
				var retcode = $('#areaCode').val();
		    	$('#'+id).val(retcode);
		    	var length = retcode.length;
		    	if(length==3){
		    		$('#'+nameId).val($("#country").find("option:selected").text());
		    	}else if(length==6){
		    		$('#'+nameId).val($("#province").find("option:selected").text());
		    	}else if(length==9){
		    		$('#'+nameId).val($("#city").find("option:selected").text());
		    	}
		    	$('#'+nameId).blur();
		    	this.close();
		    },
		    yesText: '确定',
		    noText: '关闭',
		    noFn: true //为true等价于function(){}
		});
		this.setup(areacode);
	},
	
	setup:function(defaultValue){
		var area1=new area();
		area1.setupById("country","province","city","areaCode",-1,"001001001");
	},
	
	showCity:function(defaultId,id){
		var defaultValue = $('#'+defaultId).val();
		if(defaultValue==null){
			return ;
		}
		var len = defaultValue.length;
		var codes = [];
		var names = [];
		var index = 0;
		if(len==3){
			codes = countryCodes.split(",");
			names = countryNames.split(",");
		}else if(len==6){
			var countryCode=defaultValue.substring(0,3);
			codes = eval("ProvinceCodes"+countryCode+".split(',')");
			names = eval("ProvinceNames"+countryCode+".split(',')");
		}else if(len==9){
			var provinceCode=defaultValue.substring(0,6);
			codes = eval("CityCodes"+provinceCode+".split(',')");
			names = eval("CityNames"+provinceCode+".split(',')");
		}
		for(var i=0;i<codes.length;i++){
			if(codes[i]==defaultValue){
				index = i;
				break;
			}
		}
		if(names.length>0){
			$('#'+id).val(names[index]);
		}
	}
}