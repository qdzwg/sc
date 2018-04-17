$(function () {
    $("#mask").click(function () {
        $("#calendar-box,#mask,#tipsLayer").hide();
    });
    $("#tipsClose").click(function () {
        $("#mask,#tipsLayer").hide();
    });
    $('.ft2').live('click', function () {
        $(this).parents(".ft_w").find('.ft2').removeClass('ft_sel');
        $(this).addClass('ft_sel');
        var sessionId = $(this).find("input[name='session']").val();
        $(this).parents(".ft_w").eq(0).prev('#sessionId').val(sessionId);
    });
    // getStock($("#hid-stockDate").val());
    if($("#address").length>0){
        $("#address").distpicker();
    }
    $("#saveBtn").click(function () {
        $("#tipsLayer,#mask").show();
    });
    $(".cancel-btn").click(function(){
        $("#tipsLayer,#mask").hide();
    });
    // if ($('#select-date').length || $('.hotel-date').length){
    //     $.post('/order/score/' + _mold + '/' +  (_mold === 'hotel' ? _id : _code))
    //         .success(function (data){
    //             if (data.flag == 'error'){
    //                 $('#select-date').replaceWith('<span>库存不足<span>');
    //                 $('#hotelDate').html('<span>库存不足<span>');

    //             }else{
    //                 var _a = data.datas ? data.datas.stockPriceMap : data.stockPriceMap,
    //                     _b = $('#validDate'),
    //                     _c = _b.data('begin'),
    //                     _d = _b.data('end'),
    //                     _e = sliceDate(_a ? _a : [], _c, _d);
                    
    //                 if (_a.length){
    //                     _a.map(function (item,index){
    //                         $('#select-date').append('<option>' + item.date + '</optin>');
    //                     });
                        
    //                     if (_mold === 'show'){
    //                         getScreen(_a[0].date);
    //                     }
    //                 }else{
    //                     $('#select-date').replaceWith('<span>库存不足<span>');
    //                 }
    //             }
    //         });
    //     if (_mold === 'show'){
    //         $('#select-date').on('change', function (){
    //             getScreen($(this).val());
    //         });
    //     }
    // }
    if (_mold === 'show'){
        getScreen($('#select-date').val());
        $('#select-date').on('change', function (){
            getScreen($(this).val());
        });
    }
    
});

function getScreen(_a){
    $.get('/order/getStock/show?modelCode=' + _code + '&nowDate=' + _a)
        .success(function (data){
            var _b = data[0].datas.session,
                _c = '';

            for (var i = 0; i < _b.length; i += 1){
                _c += '<div class="ft2">' +
                        '<input type="hidden" name="session" value="' + _b[i].stockId +'">' +
                        _b[i].playTime + ' 场<br>' +
                        '余位' + _b[i].leftAmount +
                    '</div>';
                
            }
            $('#ft_w').html(_c ? _c : '<span>暂无场次</span>');
        });
}

function sliceDate(_a, _b, _c){
    _a.map(function (item, index){
        if (formatDate(item.date) > formatDate(_c) || formatDate(item.date) < formatDate(_b)){
            _a.splice(index,1);
        }
    });
}

function formatDate(_a){
    var  _b = _a.split('-');

    return new Date(_b[0], _b[1], _b[2]).getTime();
}

// function getStock(date) {
//     $.get('/order/getStock/' + $('#mold').val(), {nowDate: date}, function (data) {
//         var html = "", obj = "";
//         $.each(data[0].datas.session, function (i) {
//             html+='<div onclick="same('+i+');" class="ft2">' +
//                 '<input type="hidden" name="session" value='+data[0].datas.session[i].stockId+'>' +
//                 data[0].datas.session[i].playTime+' 场<br>余位'+data[0].datas.session[i].leftAmount+'</div>';
//         });
//         if(data[0].datas.session>0){
//             $("#sessionId").val(data[0].datas.session[0].stockId);
//         }
//         $("#ft_w").html(html);
//     }, "json");
// }

function orderFill(){
    $("#sum").html($("#amount").val()*$("#price").text());
}