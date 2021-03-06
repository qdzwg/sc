$(function (){
	// input加减
	function numIint(num,cb){
		num.each(function (index,item){
			var min = parseInt($(item).data('min')),
				max = parseInt($(item).data('max')),
				value = parseInt($(item).val()),
				addDom = $('<a>',{
					'class': 'add',
					'href': 'javascript:;',
					'html': '+'
				}),
				subDom = $('<a>',{
					'class': 'sub',
					'href': 'javascript:;',
					'html': '-'
				}),
				parentDom = $('<div>',{ 
					'class': 'operation-box'
				});

			$(item)
				.wrap(parentDom)
				.before(subDom)
				.after(addDom);

			$(item).siblings('a').on('click',function (){
				if (value < min) {return};
				if (($(this).index() === 0 && (value <= min || value <= 0)) || ($(this).index() !== 0 && value >= max)){
					$(this).removeClass('active');
					return;
				}
				$(this).addClass('active').siblings('a').removeClass('active');
				value = value + ($(this).index() === 0 ? -1 : +1);
				$(item).val(value);
				cb(value);
			});
		});
	}

	var fee = function (num){
		var refundNum = num;
		$.get('/user/refund?refundNum=' + num)
			.success(function (data){
				console.log(data)
				$('#formRefund input[name="fee"]').val(data.datas.costs);
			})
			.error(function (err){});
	}
	numIint($('.operation-num'),function (value){
        fee(value);
    });
    fee(1);


});