function ajaxsubmit(formId){
		this.formId= formId;
		this.result={};
		this.init=function(){
			var checkForm = $("#"+ formId);
			checkForm._form = this;
			checkForm.validate({
				ignore:"",
				submitHandler: function(form){
					var options={};
					options.success = function(rInfo){
						var obj = eval(rInfo);
						checkForm._form.result = obj;
						if(obj.flag == "success"){
							Frame.closeMe();
							location.href = obj.message[0];
						}
						else{
							alert(obj.message[0]);
						}
					};
					options.beforeSend = function(XMLHttpRequest){
						disableForm(formId);
					}
					options.complete = function(XMLHttpRequest){
						enableForm(formId);
					}
					options.dataTyep="text";
					var ajaxForm = $(form);
					ajaxForm.ajaxSubmit(options);
				}
			});
		};
					this.init();
	};


$(function(){
		$('.cancel_btn').click(function(){
			var tobj = window.parent.document.getElementById("parent_close");
			if (tobj){tobj.click();}
		});
		$('.comfirm_btn').click(function(){
			alert("请先上传图片");
			return false;
		});
	});
	
	function upload_done(){
		$('.comfirm_btn').unbind('click');
		$('.comfirm_btn').click(function(){
			var tobj = window.parent.document.getElementById("parent_close");
			if (tobj){tobj.click();}
			window.parent.location.reload(); 
 		});
	}
	
	//判断是否已经上传图片并应用裁切效果
    function ToInit(){
    	var bigimg = $('#bigimg');
    	$('#_w').val(bigimg.width());
    	$('#_h').val(bigimg.height() );
    	if (bigimg.attr('tsrc')&&bigimg.attr('tsrc')!=""){
    		var image=new Image();
    		image.onload=function(){
    			bigimg.attr('src',bigimg.attr('tsrc'));
    			$('.crop_obj').attr('src',bigimg.attr('tsrc'));

    			if (image.width<=400&&image.height<=330){
    				InitJcrop();
    				return;
    			}

    			if (image.width/image.height>400/330){
    				bigimg.css({'width':400});
    			}else{
    				bigimg.css({'height':330});
    			}
				
    			InitJcrop();
    		}
       		image.src=bigimg.attr('tsrc');
       		
    	}
    }

	function InitJcrop(){
		
		var api = $.Jcrop("#bigimg",{ 
			setSelect: [0,0,0,180] //setSelect是Jcrop插件内部已定义的运动方法 
		});

		var seeObj = $("#bigimg");
		//记得放在jQuery(window).load(...)内调用，否则Jcrop无法正确初始化
		seeObj.Jcrop({
			onChange:showPreview,
			onSelect:showPreview,
			aspectRatio:1
		});	
		//简单的事件处理程序，响应自onChange,onSelect事件，按照上面的Jcrop调用
		function showPreview(coords){
			$("#x").val(coords.x);
			$("#y").val(coords.y);
			$("#w").val(coords.w);
			$("#h").val(coords.h);
			
			if(parseInt(coords.w) > 0){
				MakePic(coords, $('#scp_pic1'), $('#crop_obj1'));
				MakePic(coords, $('#scp_pic2'), $('#crop_obj2'));
				MakePic(coords, $('#scp_pic3'), $('#crop_obj3'));
				MakePic(coords, $('#scp_pic4'), $('#crop_obj4'));
			}
		}
		function MakePic(coords, prevbox, makeobj){
			//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
			var rx = prevbox.width() / coords.w; 
			var ry = prevbox.height() / coords.h;

			//通过比例值控制图片的样式与显示
			makeobj.css({
				width:Math.round(rx * seeObj.width()) + "px",	//预览图片宽度为计算比例值与原图片宽度的乘积
				height:Math.round(rx * seeObj.height()) + "px",	//预览图片高度为计算比例值与原图片高度的乘积
				marginLeft:"-" + Math.round(rx * coords.x) + "px",
				marginTop:"-" + Math.round(ry * coords.y) + "px"
			});
		}
	}
	
	
	
	$(function(){
		
		//上传图片
		new AjaxUpload(
			'#uploadBtn',{
				action: 'http://www.51dmq.com/manage/uploadFile.htm',
				name: 'file',
				autoSubmit: 'true',
				responseType: 'text',
				onChange: function(file, extension){
				},	
				onSubmit: function(file, extension){
					if (extension && /^(jpg|png|jpeg|gif)$/.test(extension)){
						
					}else{
						alert('格式不正确');
						return false;
					}
				},
				onComplete: function(file, response) {
					var result=eval("("+response+")");
					if(result.flag=="success"){
						var img=result.message[0];
						var imgShow=''+img;
						$('#bigimg').attr("tsrc",imgShow);
						$('#img_hid').val(img);
						ToInit();
						upload_done();
					}else{
						alert(result.message[0]);
					}
				}
			}
		);
	});
