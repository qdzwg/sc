function doComment(commentType , commentId , commentText){
	var url = "";
	if(commentType == 'PARK'){
		url="${base}/ticket/park!doComment.htm?commentId="+commentId + "&commentText="+commentText;
	}else{
		url="${base}/supply/zyx/zyxInfo!addHotelRoom.htm?storeId="+storeId;
	}
	var options={};
	options.async=false;
	options.url=url;
	options.dataType="text";
	options.success = function(data) {
		if(data != null && data != ""){
			var comm = $("#comment_list_" + commentId).find("span[class=st_p1]");
			if(comm.length > 0 ){
				comm.html(data + " 人认为此评论有用");
			}	
		}
	}
	$.ajax(options);
}

function prev_skip(url,parkId,ticketId){
	var uid = $('#uid').val();
	if($.trim(uid) != ''){
		window.location.href = url+'_'+parkId+'_'+ticketId+'.htm?uid='+uid;
	}else{
		window.location.href = url+'_'+parkId+'_'+ticketId+'.htm';
	}
}