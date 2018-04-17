function acctype(string) {
    var text="";
    switch (string){
        case "sys":
            text="系统管理员";
            break;
        case "user":
            text = "散客";
            break;
        case "supplier":
            text = "供应商";
            break;
        case "general_agent":
            text = "代理商";
            break;
        case "distributor":
            text = "分销商";
            break;
        case "superSys":
            text = "超级管理员";
            break;
    }
    return text;
}
ysf.on({
    onload: function () {
        ysf.config({
            "uid": "#{user.loginId}",
            "data": JSON.stringify([{
                "key": "real_name",
                "value": "#{user.realName}"
            }, {
                "key": "mobile_phone",
                "value": "#{user.mobile}"
            }, {
                "key": "email",
                "value": "#{user.email}"
            }, {
                "index": 0,
                "key": "acc_type",
                "label": "用户类型",
                "value": acctype("#{user.accType}")
            }, {
                "index": 1,
                "key": "reg_date",
                "label": "注册日期",
                "value": "#{user.accType}"
            },
                {
                    "index":2,
                    "key":"last_login",
                    "label":"上次登录时间",
                    "value":"#{user.lastLoginTime}"
                }
            ])
        });
    }
});
