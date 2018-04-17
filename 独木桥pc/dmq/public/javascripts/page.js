var nArr, pArr, snav, bArr;
var ctop;
$(function () {
    snav = $('#f_nav');
    ctop = $('#f_hold').offset().top;
    cleft = $('#f_hold').offset().left;
    check_nav();
    $(window).scroll(function () {
        check_nav();
        ctop = $('#f_hold').offset().top;
    }).resize(function () {
        cleft = $('#f_hold').offset().left;
        check_nav();
    });
});
var mtop = 0;
function check_nav() {
    if (ctop <= $(window).scrollTop()) {
        if ($.browser.version == '6.0') {
            snav.css({'position': 'absolute', 'left': 0, 'top': $(window).scrollTop() - ctop});
        } else {
            snav.css({'position': 'fixed', 'top': 0, 'left': cleft});
        }
    }
    else {
        if ($.browser.version == '6.0') {
            snav.css({'position': 'absolute', 'top': 0, 'left': 0});
        } else {
            snav.css({'position': 'absolute', 'top': 0, 'left': 0});
        }
    }
}//fix pos
var nArr, pArr, snav, bArr;
var ctop;
$(function () {
    snav = $('#f_nav');
    ctop = $('#f_hold').offset().top;
    cleft = $('#f_hold').offset().left;
    check_nav();
    $(window).scroll(function () {
        check_nav();
        ctop = $('#f_hold').offset().top;
    }).resize(function () {
        cleft = $('#f_hold').offset().left;
        check_nav();
    });
});
var mtop = 0;
function check_nav() {
    if (ctop <= $(window).scrollTop()) {
        if ($.browser.version == '6.0') {
            snav.css({'position': 'absolute', 'left': 0, 'top': $(window).scrollTop() - ctop});
        } else {
            snav.css({'position': 'fixed', 'top': 0, 'left': cleft});
        }
    }
    else {
        if ($.browser.version == '6.0') {
            snav.css({'position': 'absolute', 'top': 0, 'left': 0});
        } else {
            snav.css({'position': 'absolute', 'top': 0, 'left': 0});
        }
    }
}
