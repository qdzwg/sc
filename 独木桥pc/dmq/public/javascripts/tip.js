var error_pop_w, error_container, error_mask, error_tip_txt, error_tip_cbtn;

function form_structure() {

	error_container = $('<div id="error_container"></div>').appendTo('body');

	error_mask = $('<div id="error_mask"></div>').appendTo(error_container);
	error_mask.css({
		'opacity': 0.5
	});

	error_pop_w = $('<div id="error_pop_w"><div id="error_pop_h"class="cf"><div id="error_pop_close"></div></div><div id="error_pop_c"><table cellpadding="0"cellspacing="0"style="width:100%;border:none"><tr><td style="padding:15px 0;"width="30%"align="center"><div id="error_tip_pic"></div></td><td style="padding:15px 0;font-size:18px;font-family:Microsoft Yahei;"id="error_tip_txt"></td></tr><tr><td colspan="2"style="padding:15px 0;"align="center"><input type="button"id="error_tip_cbtn"/></td></tr></table></div></div>').appendTo(error_container);

	error_tip_txt = $('#error_tip_txt');
	error_tip_cbtn = $('#error_tip_cbtn');

	make_pos();

	$(window).resize(function() {
		make_pos();
	});
	$('#error_pop_close,#error_tip_cbtn').click(function() {
		$('body').css({
			'overflow': 'auto'
		});
		$('html').css({
			'overflow': ''
		});
		error_container.hide();
		$('select.error_select').removeClass('error_select').show();
	});
}

function checkErro(txt) {
	error_container = $('#error_container');

	$('html').css({
		'overflow': 'visible'
	});
	$('body').css({
		'overflow': 'hidden'
	});

	if ($('#error_container').length == 0) {
		form_structure();
	} else {
		gone();
	}

	error_tip_txt.html(txt);
}

function gone() {
	error_container.show();

	make_pos();
}

function make_pos() {
	$('select:visible').addClass('error_select').hide();

	var w = $(window).width();
	var h = $(window).height();
	var s_top = $(window).scrollTop()

	error_container.css({
		'width': w,
		'height': h,
		'top': s_top
	});
	error_mask.css({
		'width': w,
		'height': h
	});
	error_pop_w.css({
		'left': (w - 348) / 2,
		'top': (h - $(error_pop_w).height()) / 2
	});

}