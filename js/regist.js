/*
 * @Author: 张驰阳
 * @Date:   2017-03-27 16:37:24
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-03-27 18:28:29
 */

'use strict';
var regist = new Regist();
regist.init();


function Regist() {
    var that = this;
    this.params = {
        'name': "", //用户名手机号
        'tvmemail': "", //email
        'utype': 1, //用户类型
        'passwd': "", //密码
        'cname': "", //公司名称
        'caddr': "", //公司地址
        // 'cphone':,//公司电话
        // 'cemail': ,//公司Emil
        // 'uphone': ,//
        'oicq': ""
    };
    this.ele = {
        wrap: document.getElementById("wrap"),
        phoneNum: document.getElementById("phoneNum"),
        passwd: document.getElementById('password'),
        rePasswd: document.getElementById("rePassword"),
        msg:document.getElementById("msgBox")
    }
    this.init = function() {
        eventEntrust({
            ele: that.ele.wrap,
            event: "click",
            fun: function() {
                var $action = arguments[0];
                switch ($action) {
                    case "type":
                        that.params.utype = arguments[1];
                        this.className="choosed";
                        break;
                    case "next":
                        //获取手机号密码 1，验证，2参数传入params；3进入下个参数输入页面 
                        if(that.check()){
                        	console.log("去下也");
                        	console.log(that.params);
                        }
                        break;
                };
            }
        });
    };
    this.check = function() {
        var phoneNum = that.ele.phoneNum.value,
            passwd = that.ele.passwd.value,
            rePasswd = that.ele.rePasswd.value;
        if(checkphone(phoneNum)){
        	if(checkpasswd(passwd)&&(passwd==rePasswd)){
        		that.params.name=phoneNum;
        		that.params.passwd=passwd;
        		return true;
        	}else{
        		that.ele.msg.innerHTML="密码输入有误！"
        		return false;
        	}
        }else{
        	that.ele.msg.innerHTML="请输入正确手机号！"
        	return false;
        }
    };


}
