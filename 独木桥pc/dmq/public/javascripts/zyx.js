function changePro(){
 	var playDate=$("#playDate").val();
 	var ordNum=$("#ordNum").val();
 	if(playDate == null || playDate.length == 0 || ordNum < 1){
 		alert("该自由行产品已下架，无法预订!");
 	}else{
 		//location.href = location.pathname+ "?step=1&playDate=" + playDate+ "&ordNum=" + ordNum;
		zyxgetStock(playDate);
		$("#kid").val($("#playDate").find("option:selected").attr("kid"));
 	}
}

function zyxgetStock(date) {
	$.get('/order/getStock/line',{nowDate:date,id:$("#h_code").val()},function (data) {
		console.log(data);
		if(data[0].shows){
            var html="<option value=''>请选择演出场次</option>";
            html+="<option value='djx'>到店选</option>"
            $.each(data[0].shows,function (i) {
                html+="<option value='"+data[0].shows[i].value+"'>"+data[0].shows[i].changci+"</option>"
            });
            $("select[name=ticket_play_date]").html(html);
		}
		$("#zyxTicketIds").val(data[0].tickets[0].value);
	})
}

$(function(){
	zyxgetStock($("#playDate").val());
	$('#next_link').click(function(){
		
		var is_selected = true;
		var show_text="";
		
		var show_session_array = $(".ticket_date");
		if(show_session_array.length > 0){
			$(show_session_array).each(function(){
				var show_session = $(this).find("option:selected").val();
				show_text=$(this).find("option:selected").text();
				$(this).prev().val(show_text);
				if(show_session == ''){
					is_selected = false;
					alert('请选择演出票场次!');
					return false;
				}
			});
		}
		if(is_selected){
			handle_hotel_save();
			handle_park_save();
			//$("#cangci").val(show_text);
			$("#validateForm").submit(); 
		}
	});
});

$(function(){
	$('#scroll_w').kooslide();
});

var isInit = true;
var init_room_id_array = new Array();
var init_room_num_array = new Array();

var now_room_id_array = new Array(); 

var init_ticket_id_array = new Array();

var init_show_id_array = new Array();
var init_session_id_array = new Array();

$(function(){
	//初始化方法
	//init();
	
	$("input[name^='room_radio']").change(function(){
		compare_cha(this);
	});
	
	var hotel_flag = false;
	var park_flag = false;
	var show_flag = false;
	
	$('#hotel_save').click(function(){
	    hotel_flag = true;
		$(this).parents('.group_list_w').eq(0).find('#hotel_change').click();
	});
	
	$('#hotel_cancel').click(function(){
		$(this).parents('.group_list_w').eq(0).find('#hotel_change').click();
	});
	
	$('#park_save').click(function(){
		park_flag = true;
		$(this).parents('.group_list_w').eq(0).find('#park_change').click();
	});
	
	$('#park_cancel').click(function(){
		$(this).parents('.group_list_w').eq(0).find('#park_change').click();
	});

	$('#show_save').click(function(){
		show_flag = true;
		$(this).parents('.group_list_w').eq(0).find('#show_change').click();
	});

	$('#show_cancel').click(function(){
		$(this).parents('.group_list_w').eq(0).find('#show_change').click();
	});
	
	//展开更改
	// $('#hotel_change').toggle(function(){
	// 	//如果是保存提交
	// 	if (hotel_flag){
	// 		hotel_flag = false;
	//
	// 		//更改套餐保存之前询问用户是否确认修改。
	// 		handle_hotel_tip();
	// 	}
	// 	//取消提交
	// 	else {
	// 	    //酒店重置到保存前纪录
	// 		handle_hotel_cancel();
	// 	}
	// 	handle_hotel_save();
	//
	// 	$(this).html('更改▼');
	// 	s_h_switch(this);
	//
	// //收缩更改(更改，取消，保存)
	// },function(){
	//
	// 	//计算整个产品的价格
	// 	//calculateTotal();
	// 	$(this).html('更改▲');
	// 	s_h_switch(this);
	// });
	//
	// $('#park_change').toggle(function(){
	// 	//如果是保存提交
	// 	if (park_flag){
	// 		park_flag = false;
	//
	// 		//更改套餐保存之前询问用户是否确认修改。
	// 		handle_park_tip();
	// 	}
	// 	//取消提交
	// 	else {
	// 	    //景区重置到保存前纪录
	// 		handle_park_cancel();
	// 	}
	// 	handle_park_save();
	//
	// 	$(this).html('更改▼');
	// 	s_h_switch(this);
	// },function(){
	// 	$(this).html('更改▲');
	// 	s_h_switch(this);
	// });
    //
	// $('#show_change').toggle(function(){
	// 	//如果是保存提交
	// 	if (show_flag){
	// 		show_flag = false;
    //
	// 		//更改套餐保存之前询问用户是否确认修改。
	// 		handle_show_tip();
	// 	}
	// 	//取消提交
	// 	else {
	// 		//景区重置到保存前纪录
	// 		handle_show_cancel();
	// 	}
	// 	handle_show_save();
    //
	// 	$(this).html('更改▼');
	// 	s_h_switch(this);
	// },function(){
	// 	$(this).html('更改▲');
	// 	s_h_switch(this);
	// });
	
	
	$("input:checkbox").click(function(){
	
		var parent = $(this).parents('tr').eq(0);
	
		//勾掉复选框
		if (!$(this).attr("checked"))
		{
			//如果是必选项,判断该input:checkbox组有没有选择的票型
			var checkName = $(this).attr("name");
			if (!$("input[name='" + checkName +"']").is(":checked")) {
				alert('该景区是必选项！');
				$(this).attr("checked", true);
			}
		}
	});
});	

function init(){
	handle_hotel_save();
	handle_park_save();
	handle_show_save();
	isInit = false;
	calculateTotal();
}

function change_roomnum(check_select){
	var check_tr = $(check_select).parents('tr').eq(0);
	var check_radio = check_tr.find("input[type='radio']");
	if($(check_radio).is(":checked")){
		
		var check_id = check_tr.attr("id");
		var temp_num = $("#h_" + check_id).find("input[name='room_num']").val();
		
		var check_price = check_tr.find("input[name='room_price']").val();
		var check_num = check_tr.find("input[name='room_num']").eq(0).val();
		
		var init_index = $.inArray(check_id, init_room_id_array);
		if(init_index != -1){//存在默认套餐中
			var init_room_num = init_room_num_array[init_index];
			var cha_num = accSub(check_num , temp_num);
			var cha_price = accMul(cha_num, check_price);
			
			if(init_room_num == check_num){
				$(check_tr).find(".or").html("");
			}else{
				$(check_tr).find(".or").html(cha_price > 0 ? "+"+cha_price : cha_price);
			}
		}else{//不存在默认套餐中
			var hotel_radio_name = $(check_radio).attr("name");
			var hotel_radio_array = $("input[name='" + hotel_radio_name +"']");
			
			var hotel_id_array = new Array(); 
			$(hotel_radio_array).each(function(i){
				var parent = $(this).parents('tr').eq(0);
				var room_id = parent.attr("id");
				hotel_id_array.push(room_id);
			});
			
			var inter_id_array = Array.intersect(hotel_id_array,init_room_id_array);
			var default_id = inter_id_array[0];
			var default_price = $("#"+default_id).find("input[name='room_price']").eq(0).val();
			
			var cha_num = accSub(check_num , temp_num);
			
			var cha_price = accMul(check_num, accSub(check_price , default_price));
			
			$("#"+default_id).find(".or").html("");
			$(check_tr).find(".or").html(cha_price > 0 ? "+"+cha_price : cha_price);
		}
	}
}

function compare_cha(check_radio){
	var last_room_id_array = now_room_id_array.concat();
	now_room_id_array.length = 0;
	var room_radio_array = $("input[name^='room_radio']:checked");
	if(room_radio_array.length > 0)
	{
		$(room_radio_array).each(function(i){
			var parent = $(this).parents('tr').eq(0);
			var room_id = parent.attr("id");
			now_room_id_array.push(room_id);
		});
	}
	
	var hotel_radio_name = $(check_radio).attr("name");
	var hotel_radio_array = $("input[name='" + hotel_radio_name +"']");
	var hotel_id_array = new Array(); 
	$(hotel_radio_array).each(function(i){
		var parent = $(this).parents('tr').eq(0);
		var room_id = parent.attr("id");
		hotel_id_array.push(room_id);
	});
	
	//初始化默认选中房型
	var inter_id_array = Array.intersect(hotel_id_array,init_room_id_array);
	var default_id = inter_id_array[0];
	var default_price = $("#"+default_id).find("input[name='room_price']").eq(0).val();
	
	//当前选中房型
	var check_tr = $(check_radio).parents('tr').eq(0);
	var check_id = check_tr.attr("id");
	var check_num = $(check_tr).find("input[name='room_num']").eq(0).val();
	var check_price = $(check_tr).find("input[name='room_price']").eq(0).val();
	
	//取消的房型。
	var temp_id_array = Array.union(last_room_id_array,now_room_id_array);
	var uncheck_id_array = Array.minus(temp_id_array, now_room_id_array);
	var uncheck_id = uncheck_id_array[0];
	var uncheck_tr = $("#"+uncheck_id);
	var uncheck_price = $(uncheck_tr).find("input[name='room_price']").eq(0).val();
	var uncheck_num = $(uncheck_tr).find("input[name='room_num']").eq(0).val();
	
	var init_index = $.inArray(check_id, init_room_id_array);
	
	if(init_index != -1){//存在默认套餐中
		var cha_price = accMul(uncheck_num, accSub(check_price ,uncheck_price));
		
		var init_num = init_room_num_array[init_index];
		if(check_num == init_num){
			$(uncheck_tr).find(".or").html("");
			$(check_tr).find(".or").html("");
		}else{
			cha_price = accMul(check_price, accSub(check_num ,init_num));
			$(uncheck_tr).find(".or").html("");
			$(check_tr).find(".or").html(cha_price > 0 ? "+"+cha_price : cha_price);
		}
	}else{//不存在默认套餐中
		var cha_price = accMul(check_num, accSub(check_price , default_price));
		$("#"+default_id).find(".or").html("");
		$(check_tr).find(".or").html(cha_price > 0 ? "+"+cha_price : cha_price);
	}
	
}

function s_h_switch(obj){
	var pr = $(obj).parents('.group_list_w').eq(0);
	pr.find('.h_s_w').slideToggle();
}

function handle_hotel_save()
{
	var s_h_info = $(".sel_t[flag='hotel']").html('');
	//var hotel_hidden_field = $("#hotel_hidden_field").empty();
	var room_radio_array = $("input[name^='room_radio']:checked");
	
	if(room_radio_array.length > 0)
	{
		$(room_radio_array).each(function(){
			var parent = $(this).parents('tr').eq(0);
			var hotel_name = parent.parents('table').eq(0).prevAll('.g_con_t').eq(0).find('strong').html();
			var room_num = parent.find("input[name='room_num']").eq(0).val();
			var room_name = parent.find(".td_name").eq(0).html();
			var room_dayIn = parent.find(".td_dayIn").eq(0).html();
			var room_days = parent.find(".td_days").eq(0).html();
			var room_price = parent.find("input[name='room_price']").eq(0).val();
			var room_id = parent.attr("id");
			
			var s_h_i_list = $("<div class='sel_t_i cf'></div>");
			s_h_i_list.append($("<span class='st_1'></span>"));
			s_h_i_list.append($("<span class='st_2'>"+hotel_name+"</span>"));
			s_h_i_list.append($("<span class='st_3'>"+room_name +"</span>"));
			s_h_i_list.append($("<span class='st_4'>"+room_num+"间</span>"));
			s_h_i_list.append($("<span class='st_5'>"+room_dayIn+"</span>"));
			s_h_i_list.append($("<span class='st_6'>"+room_days+"</span>"));
			s_h_info.append(s_h_i_list);	
			
			h_h_div = $("<div id='h_" + room_id + "' flag='h_room'></div>");
			h_h_div.append($("<input type='hidden' name='room_num' value='"+ room_num + "' />"));
			h_h_div.append($("<input type='hidden' name='room_id' value='"+ room_id + "' />"));
			h_h_div.append($("<input type='hidden' name='room_price' value='"+ room_price + "' />"));
			h_h_div.append($("<input type='hidden' name='hotel_name' value='"+ hotel_name + "' />"));
			h_h_div.append($("<input type='hidden' name='room_name' value='"+ room_name + "' />"));
			hotel_hidden_field.append(h_h_div);
			
			if(isInit){
				init_room_id_array.push(room_id);
				init_room_num_array.push(room_num);
			}else{
				now_room_id_array.push(room_id);
			}
		});
	}
	else
	{
		var s_h_i_list = $("<div class='sel_t_i cf'></div>");
		s_h_i_list.append($("<span>未选择房型</span>"));
		s_h_info.append(s_h_i_list);
	}
}

function handle_park_save()
{
	var s_p_info = $(".sel_t[flag='park']").html('');
	//var park_hidden_field = $("#park_hidden_field").empty();
	
	var ordNum = $("#ordNum").val();
	var ticket_checkbox_array = $("input[flag='ticket_checkbox']:checked");
	
	if(ticket_checkbox_array.length >0 )
	{
		$(ticket_checkbox_array).each(function(){
			var parent = $(this).parents('tr').eq(0);
			var ticket_id = parent.attr("id");
			var ticket_num = parent.find("input[name='ticket_num']").val();
			var ticket_name = parent.find(".td_name").html();
			var ticket_date = parent.find(".td_ticket_date").html();
			var ticket_price = parent.find("input[name='ticket_price']").val();
			var park_name = $(this).parents('table').eq(0).prevAll('.g_con_t').eq(0).find('strong').html();
			
			var s_p_i_list = $("<div class='sel_t_i cf'></div>");
			s_p_i_list.append($("<span class='st_1'></span>"));
			s_p_i_list.append($("<span class='st_2'>"+park_name+"</span>"));
			s_p_i_list.append($("<span class='st_3'>"+ticket_name +"</span>"));
			s_p_i_list.append($("<span class='st_4'>"+accMul(ticket_num , ordNum)+"张</span>"));
			s_p_i_list.append($("<span class='st_5'>"+ticket_date+"</span>"));
			s_p_info.append(s_p_i_list);

			p_h_div = $("<div id='p_" + ticket_id + "' flag='p_ticket'></div>");
			p_h_div.append($("<input type='hidden' name='ticket_id' value='"+ ticket_id + "' />"));
			p_h_div.append($("<input type='hidden' name='ticket_num' value='"+ ticket_num + "' />"));
			p_h_div.append($("<input type='hidden' name='ticket_price' value='"+ ticket_price + "' />"));
			p_h_div.append($("<input type='hidden' name='park_ticket_name' value='"+ park_name + "' />"));
			p_h_div.append($("<input type='hidden' name='ticket_name' value='"+ ticket_name + "' />"));
			park_hidden_field.append(p_h_div);	
			
			if(isInit)
			{
				init_ticket_id_array.push(ticket_id);
			}
		});
	}
	
	// var show_checkbox_array = $("input[flag='show_checkbox']:checked");
	//
	// if(show_checkbox_array.length >0)
	// {
	// 	$(show_checkbox_array).each(function(i){
	// 		var parent = $(this).parents('tr').eq(0);
	// 		var show_num = parent.find("input[name='ticket_num']").val();
	// 		var show_id = parent.attr("id");
	// 		var ticket_name = parent.find(".td_name").html();
	// 		var session_id = parent.find("select[name='ticket_play_date']").eq(0).val();
	// 		var show_date = parent.find("select[name='ticket_play_date']").eq(0).find("option:selected").text();
	// 		var ticket_price = parent.find("input[name='ticket_price']").val();
	// 		var park_name = parent.parents('table').eq(0).prevAll('.g_con_t').eq(0).find('strong').html();
	//
	// 		var s_p_i_list = $("<div class='sel_t_i cf'></div>");
	// 		s_p_i_list.append($("<span class='st_1'></span>"));
	// 		s_p_i_list.append($("<span class='st_2'>"+park_name+"</span>"));
	// 		s_p_i_list.append($("<span class='st_3'>"+ticket_name +"</span>"));
	// 		s_p_i_list.append($("<span class='st_4'>"+accMul(show_num , ordNum)+"张</span>"));
	// 		s_p_i_list.append($("<span class='st_5'>"+show_date+"游玩</span>"));
	// 		s_p_info.append(s_p_i_list);
	//
	// 		p_h_div = $("<div id='p_" + show_id + "' flag='p_show'></div>");
	// 		p_h_div.append($("<input type='hidden' name='show_id' value='"+ show_id + "' />"));
	// 		p_h_div.append($("<input type='hidden' name='session_id' value='"+ session_id + "' />"));
	// 		p_h_div.append($("<input type='hidden' name='show_num' value='"+ show_num + "' />"));
	// 		p_h_div.append($("<input type='hidden' name='ticket_price' value='"+ ticket_price + "' />"));
	// 		p_h_div.append($("<input type='hidden' name='park_show_name' value='"+ park_name + "' />"));
	// 		p_h_div.append($("<input type='hidden' name='show_name' value='"+ ticket_name + "' />"));
	// 		p_h_div.append($("<input type='hidden' name='show_date' value='"+ show_date + "' />"));
	// 		park_hidden_field.append(p_h_div);
	//
	// 		if(isInit)
	// 		{
	// 			//init_show_id_array.push(show_id);
	// 			init_session_id_array.push(session_id);
	// 		}
	// 	});
	//}
	
	if(ticket_checkbox_array.length <= 0)
	{
		var s_p_i_list = $("<div class='sel_t_i cf'></div>");
		s_p_i_list.append($("<span>未选择景点</span>"));
		s_p_info.append(s_p_i_list);
	}
}

function handle_show_save()
{
	var s_p_info = $(".sel_t[flag='show']").html('');
	//var park_hidden_field = $("#show_hidden_field").empty();

	var ordNum = $("#ordNum").val();

	var show_checkbox_array = $("input[flag='show_checkbox']:checked");

	if(show_checkbox_array.length >0)
	{
		$(show_checkbox_array).each(function(i){
			var parent = $(this).parents('tr').eq(0);
			var show_num = parent.find("input[name='ticket_num']").val();
			var show_id = parent.attr("id");
			var ticket_name = parent.find(".td_name").html();
			var session_id = parent.find("select[name='ticket_play_date']").eq(0).val();
			var show_date = parent.find("select[name='ticket_play_date']").eq(0).find("option:selected").text();
			var ticket_price = parent.find("input[name='ticket_price']").val();
			var park_name = parent.parents('table').eq(0).prevAll('.g_con_t').eq(0).find('strong').html();

			var s_p_i_list = $("<div class='sel_t_i cf'></div>");
			s_p_i_list.append($("<span class='st_1'></span>"));
			s_p_i_list.append($("<span class='st_2'>"+park_name+"</span>"));
			s_p_i_list.append($("<span class='st_3'>"+ticket_name +"</span>"));
			s_p_i_list.append($("<span class='st_4'>"+accMul(show_num , ordNum)+"张</span>"));
			s_p_i_list.append($("<span class='st_5'>"+show_date+"游玩</span>"));
			s_p_info.append(s_p_i_list);

			p_h_div = $("<div id='p_" + show_id + "' flag='p_show'></div>");
			p_h_div.append($("<input type='hidden' name='show_id' value='"+ show_id + "' />"));
			p_h_div.append($("<input type='hidden' name='session_id' value='"+ session_id + "' />"));
			p_h_div.append($("<input type='hidden' name='show_num' value='"+ show_num + "' />"));
			p_h_div.append($("<input type='hidden' name='ticket_price' value='"+ ticket_price + "' />"));
			p_h_div.append($("<input type='hidden' name='park_show_name' value='"+ park_name + "' />"));
			p_h_div.append($("<input type='hidden' name='show_name' value='"+ ticket_name + "' />"));
			p_h_div.append($("<input type='hidden' name='show_date' value='"+ show_date + "' />"));
			park_hidden_field.append(p_h_div);

			if(isInit)
			{
				init_show_id_array.push(show_id);
				init_session_id_array.push(session_id);
			}
		});
	}

	if(show_checkbox_array.length <= 0)
	{
		var s_p_i_list = $("<div class='sel_t_i cf'></div>");
		s_p_i_list.append($("<span>未选择景点</span>"));
		s_p_info.append(s_p_i_list);
	}
}

function handle_hotel_cancel(){
	$("tr[flag='ROOM']").each(function(){
		var id = $(this).attr("id");
		var index = $.inArray(id, init_room_id_array);
		if(index != -1){
			$(this).find("input[type='radio']").eq(0).attr('checked',true);
			$(this).find("input[name='room_num']").eq(0).val(init_room_num_array[index]);
		}
		else{
			$(this).find("input[type='radio']").eq(0).checked = false;
			$(this).find("input[name='room_num']").eq(0).selectedIndex = 0;
		}
		$(this).find(".or").html("");
	});	
}

function handle_park_cancel(){
	$("tr[flag='TICKET']").each(function(){
		var id = $(this).attr("id");
		var index = $.inArray(id, init_ticket_id_array);
		if(index != -1)
		{
			$(this).find("input:checkbox").attr("checked", true);
		}
		else
		{
			$(this).find("input:checkbox").attr("checked", false);
		}
	});
		
	$("tr[flag='SHOW']").each(function(){
		var id = $(this).attr("id");
		var index = $.inArray(id, init_show_id_array);
		if(index != -1)
		{
			$(this).find("input:checkbox").attr("checked", true);
			$(this).find(".ticket_date").eq(0).val(init_session_id_array[index]);
		}
		else
		{
			$(this).find("input:checkbox").attr("checked", false);
		}
	});
}

function handle_show_cancel(){
	$("tr[flag='show']").each(function(){
		var id = $(this).attr("id");
		var index = $.inArray(id, init_ticket_id_array);
		if(index != -1)
		{
			$(this).find("input:checkbox").attr("checked", true);
		}
		else
		{
			$(this).find("input:checkbox").attr("checked", false);
		}
	});
}

function handle_hotel_tip(){
	var flag = 1;
	var is_change = false;
	var tips = "你当前购买的产品，已更改酒店默认套餐内容,发生的更改如下:";
	
	$("tr[flag='ROOM']").each(function(){
		var room_id = $(this).attr("id");
		var room_radio = $(this).find("input[type='radio']");
		var room_name = $(this).find(".td_name").eq(0).html();
		
		var index = $.inArray(room_id, init_room_id_array);
		if(index == -1){
			
			if($(room_radio).is(":checked"))
			{
				tips += "\n" + flag + ":选择了" + room_name;
				is_change = true;
				flag ++;
			}
		}else{
			if(!$(room_radio).is(":checked"))
			{
				tips += "\n" + flag + ":放弃了" + room_name;
				is_change = true;
				flag ++;
			}
		}
	});
	
	if(is_change)
	{
		tips += "\n是否确认更改？";
		if (!confirm(tips))
		{
			handle_hotel_cancel();
		}
	}
}

function handle_park_tip(){
	var is_change = false;
	var flag = 1;
	var tips = "你当前购买的产品，已更改景区默认套餐内容，发生的更改如下："
	
	$("tr[flag='TICKET']").each(function(){
		var id = $(this).attr("id");
		var ticket_name = $(this).find(".td_name").eq(0).html();
		var ticket_checkbox = $(this).find("input[type='checkbox']");
		var index = $.inArray(id, init_ticket_id_array);
		//如果原选择的门票不包含当前门票，而当前门票选择则说明有变动
		if(index == -1)
		{
			if($(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":选择了" + ticket_name;
				is_change = true;
				flag ++;
			}
		}
		//如果原选择的门票包含当前门票，而当前门票取消选择则说明有变动
		else
		{
			if(!$(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":放弃了" + ticket_name;
				is_change = true;
				flag ++;
			}
		}
	});
	
	$("tr[flag='SHOW']").each(function(){
		var id = $(this).attr("id");
		var show_name = $(this).find(".td_name").eq(0).html();
		var ticket_checkbox = $(this).find("input[type='checkbox']");
		var index = $.inArray(id, init_show_id_array);
		//如果原选择的门票不包含当前门票，而当前门票选择则说明有变动
		if(index == -1)
		{
			if($(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":选择了" + show_name;
				is_change = true;
				flag ++;
			}
		}
		//如果原选择的门票包含当前门票，而当前门票取消选择则说明有变动
		else
		{
			if(!$(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":放弃了" + show_name;
				is_change = true;
				flag ++;
			}
		}
	});
	
	if(is_change)
	{
		tips += "\n是否确认更改？";
		if (!confirm(tips))
		{
			handle_park_cancel();
		}
	}
}

function handle_show_tip(){
	var is_change = false;
	var flag = 1;
	var tips = "你当前购买的产品，已更改景区默认套餐内容，发生的更改如下："

	$("tr[flag='show']").each(function(){
		var id = $(this).attr("id");
		var ticket_name = $(this).find(".td_name").eq(0).html();
		var ticket_checkbox = $(this).find("input[type='checkbox']");
		var index = $.inArray(id, init_ticket_id_array);
		//如果原选择的门票不包含当前门票，而当前门票选择则说明有变动
		if(index == -1)
		{
			if($(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":选择了" + ticket_name;
				is_change = true;
				flag ++;
			}
		}
		//如果原选择的门票包含当前门票，而当前门票取消选择则说明有变动
		else
		{
			if(!$(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":放弃了" + ticket_name;
				is_change = true;
				flag ++;
			}
		}
	});

	$("tr[flag='SHOW']").each(function(){
		var id = $(this).attr("id");
		var show_name = $(this).find(".td_name").eq(0).html();
		var ticket_checkbox = $(this).find("input[type='checkbox']");
		var index = $.inArray(id, init_show_id_array);
		//如果原选择的门票不包含当前门票，而当前门票选择则说明有变动
		if(index == -1)
		{
			if($(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":选择了" + show_name;
				is_change = true;
				flag ++;
			}
		}
		//如果原选择的门票包含当前门票，而当前门票取消选择则说明有变动
		else
		{
			if(!$(ticket_checkbox).is(":checked"))
			{
				tips += "\n" + flag + ":放弃了" + show_name;
				is_change = true;
				flag ++;
			}
		}
	});

	if(is_change)
	{
		tips += "\n是否确认更改？";
		if (!confirm(tips))
		{
			handle_show_cancel();
		}
	}
}

// 根据隐藏域计算预算价格
function calculateTotal()
{
	var ordNum = $("#ordNum").val();
	var price = $("#price").val();
	var totalSum = accMul(ordNum , price);
	$("#sum").html("¥"+totalSum);
}
