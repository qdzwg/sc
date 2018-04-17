function acctype(string) {
    var text = "";
    switch (string) {
        case "sys":
            text = "系统管理员";
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
