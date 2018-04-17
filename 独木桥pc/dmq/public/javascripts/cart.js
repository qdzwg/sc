$(function (){
	// 购物车结算
    var single = $('.pay-table'),
        multiple = $('.total-table'),
        totalPrice = function (){
            var checked = $('.pay-table input:checked');
            var price = 0;

            if (checked.length !== $('.pay-table tr').length && multiple.find('input').is(':checked')){
                multiple.find('input').prop('checked',false);
            }else if (checked.length === $('.pay-table tr').length && !multiple.find('input').is(':checked')){
            	multiple.find('input').prop('checked',true);
            }
            checked.each(function (index,item){

                price += +$(item).parents('tr').find('.sub-price').text()
            });
            $('.box-balance .sub-price').text('￥' + price.toFixed(2));
        },
        totalDel = function (parameters) {
            $.ajax({
                traditional: true,
                url: '/member/cart',
                type: 'post',
                dataType: 'json',
                data: {'proid':parameters},
                success: function (data){
                    if (data.status === 'success'){
                        data.info.forEach(function (value,index){
                            $('.pay-table input[data-proid="' + value + '"]').parents('tr').remove();
                        });
                    }else{
                        alert(data.info);
                    }
                },
                error: function (err){}
            });
        };

    /*-----------------------单选----------------------*/
    single
        .on('change','input',totalPrice)
        .on('click','.pay-del',function (){
            var proid = +$(this).parents('tr').find('input').data('proid');

            totalDel([proid]);
        });

    /*-----------------------多选----------------------*/
    multiple
        .on('change','input',function (){
            if (multiple.find('input').is(':checked')){
                single.find('input').prop('checked',true);
            }else{
                single.find('input').prop('checked',false);
            }
            
            totalPrice();
        })
        .on('click','.toal-del',function (){
            var checked = $('.pay-table input:checked');
            var delArr = new Array();

            checked.each(function (index,item){
                delArr.push(+$(item).data('proid'));
            });
            totalDel(delArr);
        });
    /*-----------------------结算----------------------*/
    $('.box-balance .balance').on('click',function (){
        var checked = $('.pay-table input:checked');
        var ids = '';

        $.each(checked,function (index,item){
            
            ids += (index === checked.length - 1 ? $(item).data('orderid') : ($(item).data('orderid') + ','));
        });
        if(ids!=""){
            $.get('/cart/order?ids=' + escape(ids))
                .success(function (data){
                    window.location.href = '/order/cart/info/' + data;
                })
                .error(function (err){});
        }
    });
});