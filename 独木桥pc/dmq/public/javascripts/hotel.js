$(function () {
	var url='/order/hotel/room/'+$('input[name=roomId]').val(), begDate=$("#begDate").val(),endDate=$("#endDate").val();
	rooms(url,begDate,endDate);
});

var hotel = new function(){
	this.intiDate = function(){
		var count = $("#amount").val();
		var html = "";
		for(var i = 0; i < count ; i++){
			html +="<div class='name_block'>入住人<br><input type='text' name='inPersionNames' class='text name_sel'></div>"
		}
		$("#inPersions").html(html);
		var price = $("#totalPrice").attr("val");
		var totalPrice = price*count; 
		var price2 = $("#totalPrice2").attr("val");
		var totalNowPayPrice = price2*count;
		if($("input[name=cashId]:checked").val()==0 || $("input[name=cashId]").val()==null || $("input[name=cashId]").val()==""){//没有使用优惠券
			$("#totalPrice").html("¥"+totalPrice); 
			$("#totalPrice2").html("¥"+totalNowPayPrice);
		}else{//使用优惠券
			var cash = $("input[name=cashId]:checked").val();//选中的优惠券
			var cashNum = $("#cash"+cash).val();//优惠券的优惠金额
			if(totalPrice-cashNum > 0){
				$("#totalPrice").html("¥"+(totalPrice-cashNum));
			}else{
				$("#totalPrice").html("¥0");
			}
		}
		
	}
	this.chanageDate = function(url){
		//$("input").attr('validate','');
		var begDate=$("#begDate").val(),endDate=$("#endDate").val();
		rooms(url,begDate,endDate);
		$("#chanageDateDiv").hide();
		$("#bd").text(begDate);
		$("#ed").text(endDate);
		// document.orderForm.action=url;
		// $("#orderForm").submit();
	}
	this.showChanageDiv=function(){
		$("#chanageDateDiv").show();
	}
	this.hidenChanageDiv=function(){
		$("#chanageDateDiv").hide();
	} 
	this.chanagePrice = function(){ 
		var isChecked = $("#nowPay1").attr("checked"); 
		var unChecked = $("#nowPay2").attr("checked"); 
		if(isChecked){
			$("#totalPrice").hide(); 
			$("#totalPrice2").show(); 
			$("#table1").hide(); 
			$("#table2").show();
		}else if(unChecked){  
			$("#totalPrice2").hide();
			$("#totalPrice").show(); 
			$("#table2").hide(); 
			$("#table1").show();
		}
		
	}
	
};

function rooms(url,bdate,edate) {
	var totalPrice=0;
	$.get(url,{beginDate:bdate,endDate:edate},function (data) {
		console.log(data);
		var html='<table cellspacing="0" cellpadding="0" border="0" class="arr"><tbody><tr></tr><tr></tr><tr>',rooms=data.dates;
		$.each(rooms,function (i) {
			if(i<rooms.length){
				html+='<td>';
				html+='<table width="100%" border="0"><tbody>';
				html+='<tr><th>'+rooms[i].date+'</th></tr>';
				html+='<tr><td>¥'+rooms[i].price+'<br>双早</td></tr>';
				html+='</tbody></table></td>';
                totalPrice+=rooms[i].price;
			}
		});
		html+='</tr></tbody></table>';
		$("#priceList").html(html);
		$("#totalPrice").html("¥"+totalPrice*$("#amount").val()).attr("val",totalPrice);
	});
}