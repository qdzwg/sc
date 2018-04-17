// 
function area() {
	this.xxxCountry;
	this.xxxProvince;
	this.xxxCity;
	this.xxxValueOcx;
	this.xxxtype = -1;
	this.xxxdefaultvalue = -1;
	this.areaName ="";
	// 得到值
	this.getValue = function() {
		var CountryValue = this.xxxCountry.value;
		var ProvinceValue = this.xxxProvince.value;
		var CityValue = this.xxxCity.value;
		if (CityValue.length > 6) {
			return CityValue;
		}
		if (ProvinceValue.length > 3) {
			return ProvinceValue;
		}
		if (CountryValue.length == 3)
			return CountryValue;
		return "";
	}
	this.getValue2 = function() {
		var ProvinceValue = this.xxxProvince.value;
		var CityValue = this.xxxCity.value;
		if (CityValue.length > 6) {
			return CityValue;
		}
		if (ProvinceValue.length > 3) {
			return ProvinceValue;
		}
		return "";
	}
	// 设置默认值
	this.setValue = function(value) {
		if (value.length >= 3) {
			this.xxxCountry.value = value.substring(0, 3);
			this.xxxCountry.onchange();
		}
		if (value.length >= 6) {
			this.xxxProvince.value = value.substring(0, 6);
			this.xxxProvince.onchange();
		}
		if (value.length >= 9) {
			this.xxxCity.value = value.substring(0, 9);
			this.xxxCity.onchange();
		}
	}

	this.setValue2 = function(value) {
		if (value.length >= 6) {
			this.xxxProvince.value = value.substring(0, 6);
			this.xxxProvince.onchange();
		}
		if (value.length >= 9) {
			this.xxxCity.value = value.substring(0, 9);
			this.xxxCity.onchange();
		}
	}
	this.setupById = function(countryId,provinceId,cityId,valueId,type,defaultValue){
		var countryOcx = 	document.getElementById(countryId);
		var provinceOcx = 	document.getElementById(provinceId);
		var cityOcx = 	document.getElementById(cityId);
		var valueOcx = 	document.getElementById(valueId);		//初始化数据来源
		this.setupOcx(countryOcx,provinceOcx,cityOcx,valueOcx,type,defaultValue);
	}
	// 装载全部控件
	this.setupOcx = function(Country, Province, City, ValueOcx, Type,
			Defultvalue) {
		Country._clazz=this;
		Province._clazz=this;
		City._clazz=this;
		this.xxxCountry = Country;
		this.xxxProvince = Province;
		this.xxxCity = City;
		this.xxxtype = Type;
		this.xxxdefaultvalue = Defultvalue;
		this.xxxValueOcx = ValueOcx;
		ValueOcx.value = Defultvalue;
		this.setupCountry(this.xxxCountry, "001");
		this.setupProvince(this.xxxProvince, this.xxxdefaultvalue, "001", this.xxxtype);
		this.setupCity(this.xxxCity, this.xxxdefaultvalue, this.xxxdefaultvalue, this.xxxtype);
		this.xxxCountry.onchange = function() {
			var countryCode = this.value;
			var clazz=this._clazz;
			clazz.setupProvince(clazz.xxxProvince, countryCode, countryCode,clazz.xxxtype);
			clazz.setupCity(clazz.xxxCity, countryCode,clazz.xxxProvince.value,clazz.xxxtype);
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue();
			}
		};
		this.xxxProvince.onchange = function() {
			var provinceCode = this.value;
			var clazz=this._clazz;
			clazz.setupCity(clazz.xxxCity, provinceCode, provinceCode, clazz.xxxtype);
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue();
			}
		};
		this.xxxCity.onchange = function() {
			var clazz=this._clazz;
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue();
			}
		}
	}

	// 装载全部控件
	this.setupOcx2 = function(Province, City, ValueOcx, Type, Defultvalue) {
		Country._clazz=this;
		Province._clazz=this;
		City._clazz=this;
		this.xxxProvince = Province;
		this.xxxCity = City;
		this.xxxtype = Type;
		this.xxxdefaultvalue = Defultvalue;
		this.xxxValueOcx = ValueOcx;
		ValueOcx.value = Defultvalue;
		this.setupProvince(this.xxxProvince, this.xxxdefaultvalue, "001", this.xxxtype);
		this.setupCity(this.xxxCity, this.xxxdefaultvalue, this.xxxdefaultvalue, this.xxxtype);
		this.xxxProvince.onchange = function() {
			var provinceCode = this.value;
			var clazz=this._clazz;
			clazz.setupCity(clazz.xxxCity, provinceCode, provinceCode, clazz.xxxtype);
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue2();
			}
		};
		this.xxxCity.onchange = function() {
			var clazz=this._clazz;
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue2();
			}
		}
	}

	// 装载全部控件
	this.setupOcx_Query = function(Country, Province, City, ValueOcx,
			Defultvalue) {
		Country._clazz=this;
		Province._clazz=this;
		City._clazz=this;
		this.xxxCountry = Country;
		this.xxxProvince = Province;
		this.xxxCity = City;
		this.xxxtype = "0";
		this.xxxdefaultvalue = Defultvalue;
		this.xxxValueOcx = ValueOcx;
		this.setupCountry_Query(this.xxxCountry, "0", this.xxxtype);
		this.setupProvince(this.xxxProvince, 0, "0", this.xxxtype);
		this.setupCity(this.xxxCity, 0, 0, this.xxxtype);
		this.xxxCountry.onchange = function() {
			var countryCode = this.value;
			var clazz=this._clazz;
			clazz.setupProvince(clazz.xxxProvince, countryCode, countryCode, clazz.xxxtype);
			clazz.setupCity(clazz.xxxCity, countryCode, countryCode, clazz.xxxtype);
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue();
			}
			clazz.xxxProvince.onchange();
		};
		this.xxxProvince.onchange = function() {
			var provinceCode = this.value;
			var clazz=this._clazz;
			clazz.setupCity(clazz.xxxCity, provinceCode, provinceCode, clazz.xxxtype);
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue();
			}
		};
		this.xxxCity.onchange = function() {
			var clazz=this._clazz;
			if (clazz.xxxValueOcx != null) {
				clazz.xxxValueOcx.value = clazz.getValue();
			}
		}
	}

	// 装载城市
	this.setupCity = function(city, initValue, provinceCode, type) {
		// 清除列表

		city.options.length = 0;
		if (provinceCode == "-1") {
			city.options[city.options.length] = new Option("-请选择(城市)-", "-1");
			city.style.display = "none";
			return;
		}
		if (provinceCode == "0") {
			city.options[city.options.length] = new Option("----不限----", "0");
			city.style.display = "none";
			return;
		}
		provinceCode = provinceCode.substring(0, 6);
		initValue = initValue.substring(0, 9);
		var cityCodeList = eval("CityCodes" + provinceCode + ".split(',')");
		if (cityCodeList == "")
			city.style.display = "none";
		else
			city.style.display = "";
		var cityNameList = eval("CityNames" + provinceCode + ".split(',')");
		if (type == "-1") {
			city.options[city.options.length] = new Option("-请选择(城市)-", "-1");
		} 
		if (type == "0") {
			city.options[city.options.length] = new Option("----不限----", "0");
		}
		for ( var i = 0; i < cityCodeList.length; i++) {
			if (cityNameList[i] != "") {
				var option = new Option(cityNameList[i], cityCodeList[i]);
				city.options[city.options.length] = option;

				if (cityCodeList[i] == initValue) {
					option.selected = true;
				}
			}
		}
	}
	// 装载省份
	this.setupProvince = function(province, initValue, countryCode, type) {
		// 清除列表

		province.options.length = 0;
		if (countryCode == "") {
			province.style.display = "none";
			return;
		}
		if (countryCode == "-1") {
			province.options[province.options.length] = new Option("-请选择(省份)-",
					"-1");
			return;
		}
		if (countryCode == "0") {
			province.options[province.options.length] = new Option(
					"----不限----", "0");
			return;
		}
		countryCode = countryCode.substring(0, 3);
		initValue = initValue.substring(0, 6);
		var provinceCodeList = eval("ProvinceCodes" + countryCode
				+ ".split(',')");
		if (provinceCodeList == "")
			province.style.display = "none";
		else
			province.style.display = "";
		var provinceNameList = eval("ProvinceNames" + countryCode
				+ ".split(',')");
		if (type == "-1") {
			province.options[province.options.length] = new Option("-请选择(省份)-",
					"-1");
		} 
		
		if (type == "0") {
			province.options[province.options.length] = new Option(
					"----不限----", "0");
		}
		for ( var i = 0; i < provinceCodeList.length; i++) {
			if (provinceNameList[i] != "") {
				var option = new Option(provinceNameList[i],
						provinceCodeList[i]);
				province.options[province.options.length] = option;

				if (provinceCodeList[i] == initValue) {
					option.selected = true;
				}
			}
		}
	}

	// 装载国家
	this.setupCountry = function(Country, initValue) {
		initValue = initValue.substring(0, 3);
		var countryCodeList = countryCodes.split(',');
		var countryNameList = countryNames.split(',');
		for ( var i = 0; i < countryCodeList.length; i++) {
			var option = new Option(countryNameList[i], countryCodeList[i]);
			Country.options[Country.options.length] = option;

			if (countryCodeList[i] == initValue) {
				option.selected = true;
			}
		}
	}

	this.setupCountry_Query = function(Country, initValue, type) {
		var provinceCodeList = countryCodes.split(',');
		var provinceNameList = countryNames.split(',');
		if (type == "-1") {
			Country.options[Country.options.length] = new Option("-请选择(省份)-",
					"-1");
		} else {
			Country.options[Country.options.length] = new Option("----不限----",
					"0");
		}
		for ( var i = 0; i < provinceCodeList.length; i++) {
			var option = new Option(provinceNameList[i], provinceCodeList[i]);
			Country.options[Country.options.length] = option;

			if (provinceCodeList[i] == initValue) {
				option.selected = true;
			}
		}
	}

	/***************************************************************************
	 * /* /* 根据省份的编码取得省份的名称。 /* 如果省份的编码不存在返回空的字符串。 /* /
	 **************************************************************************/
	this.getProvinceNameByCode = function(name, code, size) {
		var provinceCodes = eval(name + "Codes" + size);
		var provinceNames = eval(name + "Names" + size);
		name = "";
		var provinceCodeList = provinceCodes.split(',');
		var provinceNameList = provinceNames.split(',');
		for ( var i = 0; i < provinceCodeList.length; i++) {
			if (code == provinceCodeList[i]) {
				name = provinceNameList[i];
				break;
			}
		}
		return name;
	}

	/**
	 * 根据编码得省份
	 * 
	 * @param Defultvalue
	 * @return
	 */
	this.xxxdefaultvalue = function(Defultvalue) {
		var vst;
		this.xxxdefaultvalue = '';
		var code = Defultvalue.replace(" ", "");
		if (code.length >= 6) {
			vst = code.substring(0, 6);
			this.xxxdefaultvalue += getProvinceNameByCode('Province', vst, vst.substring(0,
					3))
					+ "省";
		}
		if (code.length >= 9) {
			vst = code.substring(0, 9);
			this.xxxdefaultvalue += getProvinceNameByCode('City', vst, vst.substring(0, 6))
					+ "市";
		}
		document.write(this.xxxdefaultvalue);
	}

	/**
	 * 用于AJAX情况下获取区域名称
	 */
	this.xxxdefaultvalueInAJAX = function(Defultvalue, rtnId) {
		var vst;
		this.xxxdefaultvalue = '';
		var code = Defultvalue.replace(" ", "");
		if (code.length >= 6) {
			vst = code.substring(0, 6);
			this.xxxdefaultvalue += getProvinceNameByCode('Province', vst, vst.substring(0,
					3))
					+ "省";
		}
		if (code.length >= 9) {
			vst = code.substring(0, 9);
			this.xxxdefaultvalue += getProvinceNameByCode('City', vst, vst.substring(0, 6))
					+ "市";
		}
		$("#" + rtnId).html(this.xxxdefaultvalue);
	}

	this.getCountryNameByAreaCode = function(areaCode, rtnId) {
		var vst;
		var countryName = '';
		areaCode = areaCode.replace(" ", "");
		if (areaCode.length >= 3) {
			vst = areaCode.substring(0, 3);
			countryName += getCountryNameByCode('country', vst);
		}
		$("#" + rtnId).html(countryName);
	}

	this.getCountryNameByCode = function(name, code) {
		var provinceCodes = eval(name + "Codes");
		var provinceNames = eval(name + "Names");
		name = "";
		var provinceCodeList = provinceCodes.split(',');
		var provinceNameList = provinceNames.split(',');
		for ( var i = 0; i < provinceCodeList.length; i++) {
			if (code == provinceCodeList[i]) {
				name = provinceNameList[i];
				break;
			}
		}
		return name;
	}

	/**
	 * 获取国家名称
	 * 
	 * @param code
	 *            国家编码或者区域编码
	 */
	this.getCountryName = function(code) {
		var rtn = "";
		code = code.replace(" ", "");
		if (code.length > 3) {
			code = code.substring(0, 3);
		}
		var countryCodesList = eval("countryCodes").split(',');
		var countryNamesList = eval("countryNames").split(',');
		for ( var i = 0; i < countryCodesList.length; i++) {
			if (code == countryCodesList[i]) {
				rtn = countryNamesList[i];
				break;
			}
		}
		return rtn;
	}

	/**
	 * 获取省份名称
	 * 
	 * @param code
	 *            省份编码或者区域编码
	 */
	this.getProvinceName = function(code) {
		var rtn = "";
		code = code.replace(" ", "");
		if (code.length > 6) {
			code = code.substring(0, 6);
		}
		var countryCode = code.substring(0, 3);
		var provinceCodes = eval("ProvinceCodes" + countryCode);
		var provinceNames = eval("ProvinceNames" + countryCode);
		var provinceCodesList = provinceCodes.split(',');
		var provinceNamesList = provinceNames.split(',');
		for ( var i = 0; i < provinceCodesList.length; i++) {
			if (code == provinceCodesList[i]) {
				rtn = provinceNamesList[i];
				break;
			}
		}
		return rtn;
	}

	/**
	 * 获取城市名称
	 * 
	 * @param code
	 *            城市编码或者区域编码
	 */
	this.getCityName = function(code) {
		var rtn = "";
		code = code.replace(" ", "");
		if (code.length > 9) {
			code = code.substring(0, 9);
		}
		var provinceCode = code.substring(0, 6);
		var cityCodes = eval("CityCodes" + provinceCode);
		var cityNames = eval("CityNames" + provinceCode);
		var cityCodesList = cityCodes.split(',');
		var cityNamesList = cityNames.split(',');
		for ( var i = 0; i < cityCodesList.length; i++) {
			if (code == cityCodesList[i]) {
				rtn = cityNamesList[i];
				break;
			}
		}
		return rtn;
	}

	this.convert = function(areaCode, rtnId) {
		var vst;
		var rtn = '';
		areaCode = areaCode.replace(" ", "");
		switch (areaCode.length) {
		case 3:
			vst = areaCode;
			rtn += getCountryName(vst.substring(0, 3));
			break;
		case 6:
			vst = areaCode;
			rtn += getCountryName(vst.substring(0, 3));
			rtn += "　";
			rtn += getProvinceName(vst.substring(0, 6));
			break;
		case 9:
			vst = areaCode;
			rtn += getCountryName(vst.substring(0, 3));
			rtn += "　";
			rtn += getProvinceName(vst.substring(0, 6));
			rtn += "　";
			rtn += getCityName(vst.substring(0, 9));
			break;
		default:
			break;
		}
		$("#" + rtnId).html(rtn);
	}
}

//--------------------------------------------国家
var countryCodes="001,002,003,004,005,006,007,008,009,010,011,012,013,014,016,018,019,020,021,022,023,024,025,026,027,028";
var countryNames="中国,美国,英国,日本,意大利,法国,阿富汗,阿尔巴尼亚,瑞士,丹麦,德国,西班牙,芬兰,希腊,韩国,马尔代夫,荷兰,葡萄牙,俄罗斯,新加坡,菲律宾,瑞典,台湾,香港,澳门,马来西亚";
//--------------------------------------------省份
var ProvinceCodes001="001001,001002,001003,001004,001005,001006,001007,001008,001009,001010,001011,001012,001013,001014,001015,001016,001017,001018,001019,001020,001021,001022,001023,001024,001026,001027,001028,001029,001030,001031,001032";
var ProvinceNames001="浙江,江苏,山东,山西,河南,河北,湖南,湖北,广东,广西,黑龙江,辽宁,安徽,福建,甘肃,江西,云南,贵州,四川,青海,陕西,吉林,宁夏,海南,西藏,内蒙古,新疆,天津,北京,上海,重庆";
var ProvinceCodes002="";
var ProvinceNames002="";
var ProvinceCodes003="";
var ProvinceNames003="";
var ProvinceCodes004="";
var ProvinceNames004="";
var ProvinceCodes005="";
var ProvinceNames005="";
var ProvinceCodes006="";
var ProvinceNames006="";
var ProvinceCodes007="";
var ProvinceNames007="";
var ProvinceCodes008="";
var ProvinceNames008="";
var ProvinceCodes009="";
var ProvinceNames009="";
var ProvinceCodes010="";
var ProvinceNames010="";
var ProvinceCodes011="";
var ProvinceNames011="";
var ProvinceCodes012="";
var ProvinceNames012="";
var ProvinceCodes013="";
var ProvinceNames013="";
var ProvinceCodes014="";
var ProvinceNames014="";
var ProvinceCodes016="";
var ProvinceNames016="";
var ProvinceCodes018="";
var ProvinceNames018="";
var ProvinceCodes019="";
var ProvinceNames019="";
var ProvinceCodes020="";
var ProvinceNames020="";
var ProvinceCodes021="";
var ProvinceNames021="";
var ProvinceCodes022="";
var ProvinceNames022="";
var ProvinceCodes023="";
var ProvinceNames023="";
var ProvinceCodes024="";
var ProvinceNames024="";
var ProvinceCodes025="";
var ProvinceNames025="";
var ProvinceCodes026="";
var ProvinceNames026="";
var ProvinceCodes027="";
var ProvinceNames027="";
var ProvinceCodes028="";
var ProvinceNames028="";

//---------------------------------------------城市

//浙江
var CityCodes001001="001001001,001001002,001001003,001001004,001001005,001001006,001001007,001001008,001001009,001001010,001001011";
var CityNames001001="杭州,宁波,温州,嘉兴,湖州,绍兴,金华,衢州,台州,舟山,丽水";

//江苏
var CityCodes001002="001002001,001002002,001002003,001002004,001002005,001002006,001002007,001002008,001002009,001002010,001002011,001002012,001002013";
var CityNames001002="苏州,淮安,无锡,南京,常州,扬州,连云港,南通,宿迁,泰州,徐州,盐城,镇江";

//山东
var CityCodes001003="001003001,001003002,001003003,001003004,001003005,001003006,001003007,001003008,001003009,001003010,001003011,001003012,001003013,001003014,001003015,001003016,001003017";
var CityNames001003="济宁,青岛,泰安,德州,临沂,烟台,威海,济南,东营,荷泽,聊城,莱芜,日照,潍坊,枣庄,淄博,滨州";

//山西
var CityCodes001004="001004001,001004002,001004003,001004004,001004005,001004006,001004007,001004008,001004009,001004010,001004011";
var CityNames001004="太原,大同,忻州,长治,晋城,晋中,临汾,阳泉,朔州,吕梁,运城";

//河南
var CityCodes001005="001005001,001005002,001005003,001005004,001005005,001005006,001005007,001005008,001005009,001005010,001005011,001005012,001005013,001005014,001005015,001005016,001005017,001005018,001005019";
var CityNames001005="开封,驻马店,许昌,郑州,周口,濮阳,平顶山,洛阳,济源,漯河,鹤壁,南阳,三门峡,安阳,信阳,商丘,焦作,新乡,济源市";

//河北
var CityCodes001006="001006001,001006002,001006003,001006004,001006005,001006006,001006007,001006008,001006009,001006010,001006011";
var CityNames001006="秦皇岛,邯郸,唐山,承德,张家口,保定,石家庄,沧州,衡水,邢台,廊坊";

//湖南
var CityCodes001007="001007001,001007002,001007003,001007004,001007005,001007006,001007007,001007008,001007009,001007010,001007011,001007012,001007013,001007014";
var CityNames001007="长沙,常德,衡阳,岳阳,张家界,湘潭,郴州,怀化,娄底,邵阳,益阳,永州,株洲,湘西土家族苗族自治州";

//湖北
var CityCodes001008="001008001,001008002,001008003,001008004,001008005,001008006,001008007,001008008,001008009,001008010,001008011,001008012,001008013";
var CityNames001008="宜昌,武汉,黄冈,十堰,恩施土家族苗族自治州,鄂州,黄石,荆州,荆门,襄樊,咸宁,孝感,随州";

//广东
var CityCodes001009="001009001,001009002,001009003,001009004,001009005,001009006,001009007,001009008,001009009,001009010,001009011,001009012,001009013,001009014,001009015,001009016,001009017,001009018,001009019,001009020,001009021";
var CityNames001009="深圳,佛山,河源,江门,阳江,汕头,梅州,云浮,韶关,汕尾,肇庆,中山,珠海,潮州,清远,广州,东莞,惠州,揭阳,茂名,湛江";

//广西
var CityCodes001010="001010001,001010002,001010003,001010004,001010005,001010006,001010007,001010008,001010009,001010010,001010011,001010012,001010013";
var CityNames001010="桂林,南宁,北海,柳州,贺州,百色,河池,梧州,玉林,防城港,贵港,崇左,来宾";

//黑龙江
var CityCodes001011="001011001,001011002,001011003,001011004,001011005,001011006,001011007,001011008,001011009,001011010,001011011,001011012,001011013";
var CityNames001011="哈尔滨,黑河,大庆,鹤岗,佳木斯,鸡西,牡丹江,齐齐哈尔,双鸭山,伊春,七台河,绥化,大兴安岭地区";

//辽宁
var CityCodes001012="001012001,001012002,001012003,001012004,001012005,001012006,001012007,001012008,001012009,001012010,001012011,001012012,001012013,001012014";
var CityNames001012="丹东,沈阳,大连,鞍山,本溪,朝阳,抚顺,锦州,铁岭,营口,葫芦岛,盘锦,阜新,辽阳";

//安徽
var CityCodes001013="001013001,001013002,001013003,001013004,001013005,001013006,001013007,001013008,001013009,001013010,001013011,001013012,001013013,001013014,001013015,001013016,001013017";
var CityNames001013="合肥,宣城,黄山,蚌埠,安庆,巢湖,滁州,阜阳,淮北,淮南,马鞍山,宿州,铜陵,芜湖,池州,六安,亳州";

//福建
var CityCodes001014="001014001,001014002,001014003,001014004,001014005,001014006,001014007,001014008,001014009";
var CityNames001014="福州,厦门,南平,泉州,龙岩,莆田,三明,漳州,宁德";

//甘肃
var CityCodes001015="001015001,001015002,001015003,001015004,001015005,001015006,001015007,001015008,001015009,001015010,001015011,001015012,001015013,001015014";
var CityNames001015="兰州,酒泉,天水,嘉峪关,金昌,临夏回族自治州,平凉,武威,白银,定西,张掖,庆阳,陇南,甘南藏族自治州";

//江西
var CityCodes001016="001016001,001016002,001016003,001016004,001016005,001016006,001016007,001016008,001016009,001016010,001016011";
var CityNames001016="南昌,景德镇,九江,赣州,吉安,抚州,萍乡,新余,上饶,宜春,鹰潭";

//云南
var CityCodes001017="001017001,001017002,001017003,001017004,001017005,001017006,001017007,001017008,001017009,001017010,001017011,001017012,001017013,001017014,001017015,001017016";
var CityNames001017="昆明,丽江,大理白族自治州,曲靖,玉溪,昭通,思茅,临沧,保山,文山壮族苗族自治州,红河哈尼族彝族自治州,西双版纳傣族自治州,楚雄彝族自治州,德宏傣族景颇族自治州,怒江傈僳族自治州,迪庆藏族自治州";

//贵州
var CityCodes001018="001018001,001018002,001018003,001018004,001018005,001018006,001018007,001018008,001018009";
var CityNames001018="贵阳,安顺,毕节地区,铜仁地区,黔西南布依族苗族自治州,六盘水,遵义,黔东南苗族侗族自治州,黔南布依族苗族自治州";

//四川
var CityCodes001019="001019001,001019002,001019003,001019004,001019005,001019006,001019007,001019008,001019009,001019010,001019011,001019012,001019013,001019014,001019015,001019016,001019017,001019018,001019019,001019020,001019021";
var CityNames001019="成都,德阳,广元,乐山,泸州,绵阳,南充,内江,攀枝花,遂宁,宜宾,自贡,广安,雅安,达州,巴中,眉山,资阳,阿坝藏族羌族自治州,甘孜藏族自治州,凉山彝族自治州";

//青海
var CityCodes001020="001020001,001020002,001020003,001020004,001020005,001020006,001020007,001020008";
var CityNames001020="西宁,海东地区,海北藏族自治州,黄南藏族自治州,海南藏族自治州,果洛藏族自治州,玉树藏族自治州,海西蒙古族藏族自治州";

//陕西
var CityCodes001021="001021001,001021002,001021003,001021004,001021005,001021006,001021007,001021008,001021009,001021010";
var CityNames001021="西安,延安,咸阳,宝鸡,汉中,铜川,渭南,榆林,商洛,安康";

//吉林
var CityCodes001022="001022001,001022002,001022003,001022004,001022005,001022006,001022007,001022008,001022009";
var CityNames001022="白城,白山,长春,辽源,四平,通化,松原,延边朝鲜族自治州,吉林市";

//宁夏
var CityCodes001023="001023001,001023002,001023003,001023004,001023005";
var CityNames001023="固原,石嘴山,吴忠,中卫,银川";

//海南
var CityCodes001024="001024001,001024002";
var CityNames001024="三亚,海口";

//西藏
var CityCodes001026="001026001,001026002,001026003,001026004,001026005,001026006,001026007";
var CityNames001026="拉萨,那曲地区,昌都地区,山南地区,日喀则地区,阿里地区,林芝地区";

//内蒙古
var CityCodes001027="001027001,001027002,001027003,001027004,001027005,001027006,001027007,001027008,001027009,001027010,001027011,001027012";
var CityNames001027="呼伦贝尔,通辽,包头,赤峰,乌海,乌兰察布,呼和浩特,锡林郭勒盟,鄂尔多斯,巴彦淖尔,阿拉善盟,兴安盟";

//新疆
var CityCodes001028="001028001,001028002,001028003,001028004,001028005,001028006,001028007,001028008,001028009,001028010,001028011,001028012,001028013,001028014,001028015,001028016,001028017,001028018";
var CityNames001028="乌鲁木齐,阿克苏地区,哈密地区,和田地区,克拉玛依,喀什地区,吐鲁番地区,克孜勒苏柯尔克孜自治州,巴音郭楞蒙古自治州,昌吉回族自治州,博尔塔拉蒙古自治州,伊犁哈萨克自治州,塔城地区,阿勒泰地区,石河子,阿拉尔,图木斯克,五家渠";

//天津
var CityCodes001029="001029001";
var CityNames001029="天津市";

//北京
var CityCodes001030="001030001";
var CityNames001030="北京市";

//上海
var CityCodes001031="001031001";
var CityNames001031="上海市";

//重庆
var CityCodes001032="001032001";
var CityNames001032="重庆市";
