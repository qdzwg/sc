var path = require('path');
module.exports = {
    root: path.resolve(__dirname, '../'), //根目录
    //七牛云 配置
    serverUrl:'https://static.51dmq.com/',
    qiniu_config:{
        //需要填写你的 Access Key 和 Secret Key
        accessKey:'vWh1Hdlnij20b-bTJVb9-0Ew88akCxPDn4U-WN9V',
        secretKey:'dzy607NBOX0yYRNilprN4_x78CiQX_2qsFgZmxxM',
        bucket: 'song-workspace',
        origin: ''
    }
}