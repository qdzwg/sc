/**
 * 弹出层特效
 */
function isblank(str) {
	var i;
	var len = str.length;
	for (i = 0; i < len; ++i) {
		if (str.charAt(i) != " ") {
			return false;
		}
	}
	return true;
}
//获取页面高度，窗口高度
function getPageSize() {
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else {
		if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
			xScroll = document.body.offsetWidth;
			yScroll = document.body.offsetHeight;
		}
	}
	var windowWidth, windowHeight;
	if (self.innerHeight) {  // all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else {
		if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else {
			if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}
		}
	}
	if (yScroll < windowHeight) {
		pageHeight = windowHeight;
	} else {
		pageHeight = yScroll + 50;
	}
	if (xScroll < windowWidth) {
		pageWidth = windowWidth;
	} else {
		pageWidth = xScroll + 20;
	}
	arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
	return arrayPageSize;
}
//全屏层
function ShowAllSreenDiv() {
	if (document.getElementById("opbgDiv") != null) {
		var opbgObj = document.getElementById("opbgDiv");
		var opshowObj = document.getElementById("opshowDiv");
		document.body.removeChild(opbgObj);
		//document.body.removeChild( opshowObj );
	}
	var sWidth, sHeight;
	var array1 = getPageSize();
	sWidth = array1[0];
	sHeight = array1[1];
	//生成全屏的DIV层
	var op_bgObj = document.createElement("div");
	op_bgObj.setAttribute("id", "opbgDiv");
	op_bgObj.style.position = "absolute";
	op_bgObj.style.top = 0+"px";
	op_bgObj.style.background = "#fff";
	op_bgObj.style.filter = "alpha(opacity=20);-moz-opacity:0.2;opacity: 0.2;";
	op_bgObj.style.opacity = "0.6";
	op_bgObj.style.left = 0+"px";
	op_bgObj.style.width = sWidth + "px";
	op_bgObj.style.height = sHeight + "px";
	op_bgObj.style.zIndex = "1";
	document.body.appendChild(op_bgObj);
}
function showdiv2(divname, widths, heights, top) {
	//ShowAllSreenDiv();//显示全屏DIV
	var fdiv = document.getElementById(divname);
	var scrollLeft = (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    var scrollTop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	var clientBounds = getClientBounds();
    var xCoord = (parseInt(clientBounds.width)-parseInt(widths))/2;
    var yCoord = (parseInt(clientBounds.height)-parseInt(heights))/2;   
	if(browser().agent=="ie"){
		yCoord=parseInt(yCoord)-parseInt(top);
	}
	if(browser().agent=="firefox"){
		yCoord=parseInt(yCoord)-parseInt(top);
	}
	if(browser().agent=="opera"){
		yCoord=parseInt(yCoord)-parseInt(top);
	}
	fdiv.style.position = "absolute";
	fdiv.style.left =( parseInt(scrollLeft) + parseInt(xCoord)) + "px";
	fdiv.style.width = widths +"px";
	fdiv.style.height = heights+"px" ;
	fdiv.style.top = (parseInt(scrollTop) + parseInt(yCoord)) + "px";
	fdiv.style.backgroundColor = "#fff";
	fdiv.style.zIndex = "100";
	fdiv.style.display = "";
}
function getClientBounds(){
  var clientWidth;
  var clientHeight;
  switch(browser().agent) {
      case "ie":
          clientWidth = document.documentElement.clientWidth;
          clientHeight = document.documentElement.clientHeight;
          if(clientWidth == 0)
          	clientWidth = document.body.clientWidth;
          if(clientHeight == 0)
          	clientHeight = document.body.clientHeight;
          break;
      case "firefox":
          clientWidth = window.innerWidth;
          clientHeight = window.innerHeight;
          break;
      case "opera":
          clientWidth = Math.min(window.innerWidth, document.body.clientWidth);
          clientHeight = Math.min(window.innerHeight, document.body.clientHeight);
          break;
      default:
          clientWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
          clientHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
          break;
  }
   return{
            width:clientWidth,
            height:clientHeight
        }
}
function browser(){
        var agent,version;
        if (navigator.userAgent.indexOf(' MSIE ') > -1) {
            agent = "ie";
            version = parseFloat(navigator.userAgent.match(/MSIE (\d+\.\d+)/)[1].toString());
        }
        else if (navigator.userAgent.indexOf(' Firefox/') > -1) {
            agent = "firefox";
            version = parseFloat(navigator.userAgent.match(/ Firefox\/(\d+\.\d+)/)[1].toString());
        }
        else if (navigator.userAgent.indexOf(' Safari/') > -1) {
            agent = "safari";
            version = parseFloat(navigator.userAgent.match(/ Safari\/(\d+\.\d+)/)[1].toString());
        }
        else if (navigator.userAgent.indexOf('Opera/') > -1) {
            agent = "opera";
        }
        return{
            agent : agent,
            version : version
        }
    }
 //显示DIV
function showdiv(divname, widths, heights) {
	showdiv2(divname, widths, heights, 200);
}


 //关闭DIV
function closediv(divname) {
	//document.getElementById(divname).innerHTML = "";
	document.getElementById(divname).style.display = "none";//关闭当前div
	var opbgObj = document.getElementById("opbgDiv");
	if(opbgObj!=null){
		document.body.removeChild(opbgObj);//关闭全屏div
	}
}

//拷贝地址
function CopyCode(elemName) {
	var obj = document.getElementById(elemName);
	window.clipboardData.setData("Text", obj.value);
	alert("\u590d\u5236\u5730\u5740\u6210\u529f,\u9a6c\u4e0a\u544a\u8bc9\u597d\u53cb\u5427!");
}

//拷贝票号
function CopyValue(elemName,info) {
	var obj = elemName;
	window.clipboardData.setData("Text", obj);
	alert(info);
}

