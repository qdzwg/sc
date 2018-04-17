$(function (){
	$.get('/list/promotion?toType=ajax')
        .success(function (data){
        	var domHtml = '';
        	$.each(data,function (index,value){
        		var datas=index === 0 ? value.data : value.datas;
                datas=value.data==null?[]:value.data;
        		$.each(datas,function (indexs,values){
        			 if (index !== 3){
        				$.each(values.sliceList,function (ind,val){
        					var _a = '',_img = '',_h4 = '',_strong = '',_del = '',_tag = '';
          					switch (index){
          						case 0:
          							_a = '/detail/ticket/' + val.id;
          							_img = val.mainUrl.replace('http://odl5az86x.bkt.clouddn.com','//static.51dmq.com');
          							_h4 = val.parkName;
          							_strong = val.startingPrice;
          							_del = val.normalPrice;
          							_tag = '景区';
          							break;
          						case 1:
          							_a = '/detail/hotel/' + val.id;
          							_img = val.mainUrl.replace('http://odl5az86x.bkt.clouddn.com','//static.51dmq.com');
          							_h4 = val.productName;
          							_strong = val.originalPrice === null ? 0 : val.originalPrice;
          							_del = val.originalPrice === null ? 0 : val.originalPrice;
          							_tag = '酒店';
          							break;
                                case 2:
                                    _a = '/detail/line/' + val.id;
                                    _img = val.imgUrl.replace('http://odl5az86x.bkt.clouddn.com','//static.51dmq.com');
                                    _h4 = val.name;
                                    _strong = val.price === null ? 0 : val.price;
                                    _del = val.price === null ? 0 : val.price;
                                    _tag = '自由行';
                                    break;
          						// case 3:
          						// 	_a = '/detail/goods/' + val.id;
          						// 	_img = val.mainUrl;
          						// 	_h4 = val.modelName;
          						// 	_strong = val.salePrice;
          						// 	_del = val.startingPrice;
          						// 	_tag = '特产';
          						// 	break;
          					}
          					domHtml += '<li>' +
          								'<a href=' + _a + '>' +
          									'<div class="hot-img">' +
          										'<img src=' + _img + '>' +
          									'</div>' +
          									'<h4 class="hot-title">' + _h4 + '</h4>' +
          									'<p class="hot-explian">' +
          										'<span class="price"><em>￥</em><strong>' + _strong + '</strong></span>' +
          										'<del>￥' + _del + '</del>' +
          									'</p>' +
          									'<div class="hot-tag">' + _tag + '</div>' +
          								'</a>' +
          							'</li>';
        				});
        			}else{
        				domHtml += '<li>' +
          								'<a href=/detail/goods/' + values.id + '>' +
          									'<div class="hot-img">' +
          										'<img src=' + values.mainUrl.replace('http://odl5az86x.bkt.clouddn.com','//static.51dmq.com') + '>' +
          									'</div>' +
          									'<h4 class="hot-title">' + values.modelName + '</h4>' +
          									'<p class="hot-explian">' +
          										'<span class="price"><em>￥</em><strong>' + values.price + '</strong></span>' +
          									'</p>' +
          									'<div class="hot-tag">特产</div>' +
          								'</a>' +
          							'</li>';
        			}
        		});
        	});
        	$('.hot-list').append(domHtml);
          	/*for (var index in data){
          		for (var item in data[index]){
          			if (index !== 2){
          				for (var tag in item.sliceList){
          					var _a = '',_img = '',_h4 = '',_strong = '',_del = '',_tag = '';
          					switch (index){
          						case 0:
          							_a = '/detail/ticket/' + ;
          							_img = '';
          							_h4 = '';
          							_strong = '';
          							_del = '';
          							_tag = '';
          							break;
          						case 1:
          							_a = '';
          							_img = '';
          							_h4 = '';
          							_strong = '';
          							_del = '';
          							_tag = '';
          							break;
          						case 3:
          							_a = '';
          							_img = '';
          							_h4 = '';
          							_strong = '';
          							_del = '';
          							_tag = '';
          							break;
          					}
	          			}
          			}else{
          				domHtml += '<li>' +
          								'<a href="http://dmqb2c.sendinfo.com.cn/detail/ticket/5093">' +
          									'<div class="hot-img">' +
          										'<img src="http://odl5az86x.bkt.clouddn.com/推荐2（260-168）.jpg">' +
          									'</div>' +
          									'<h4 class="hot-title">杭州宋城第一大酒店</h4>' +
          									'<p class="hot-explian">' +
          										'<span class="price"><em>￥</em><strong>0.01</strong></span>' +
          										'<del>￥0.01</del>' +
          									'</p>' +
          									'<div class="hot-tag">酒店</div>' +
          								'</a>' +
          							'</li>';
          			}
          			
          		}
          	}*/
        })
        .error(function (err){
          	console.log(err);
        });
})