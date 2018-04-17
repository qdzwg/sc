$(function(){
    if (getUrlParams()[0].spreadCode) {
        $.post('/spreadCode', {spreadCode: getUrlParams()[0].spreadCode}, function (data) {
        });
    }
});
function getUrlParams()
{
    var search = window.location.search ;
    // 写入数据字典
    var tmparray = search.substr(1,search.length).split("&");
    var paramsArray = new Array;
    if( tmparray != null)
    {
        for(var i = 0;i<tmparray.length;i++)
        {
            var reg = /[=|^==]/;    // 用=进行拆分，但不包括==
            var set1 = tmparray[i].replace(reg,'&');
            var tmpStr2 = set1.split('&');
            var array = new Array ;
            array[tmpStr2[0]] = tmpStr2[1] ;
            paramsArray.push(array);
        }
    }
    // 将参数数组进行返回
    return paramsArray ;
}
