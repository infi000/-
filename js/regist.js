/*
 * @Author: 张驰阳
 * @Date:   2017-03-27 16:37:24
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-04-11 17:56:23
 */

'use strict';
var DO = document,
    DB = DO.body,
    winW = window.innerWidth,
    winH = window.innerHeight,
    mainVar = {},
    host = HOST.dev,
    wrap = createNode(DB, "div", { className: "wrap" }),
    regist = new Regist();
regist.init();


function Regist() {
    var that = this;
    this.params = {
        'name': "", //用户名*
        'phone': "", //手机号
        'utype': 1, //用户类型*
        'passwd': "", //密码*
        'cname': "", //公司名称*
        'caddr': "", //公司地址
        'oicq': "",
        // 'cphone':,//公司电话
        // 'cemail': ,//公司Emil
        // 'uphone': ,//
        id: localStorage.getItem("code") || ""
    };
    this.ele = {};
    this.init = function() {
        showLoading();
        var logohtml = '<div class="leaf"><img src="./img/leaf2.png"></div><div class="logo"><img src="./img/logo2.png"></div>';
        createNode(wrap, "div", { className: "logoBox", html: logohtml });
        that.firstObj();
        eventEntrust({
            ele: wrap,
            event: "click",
            fun: function() {
                var $action = arguments[0];
                switch ($action) {
                    case "input":
                        if (that.ele.msgBox) { that.ele.msgBox.innerHTML = "" };
                        if (that.ele.msgBox2) { that.ele.msgBox2.innerHTML = "" };
                        break;
                    case "type":
                        that.params.utype = arguments[1];
                        this.className = "choosed";
                        for (var key in siblings(this)) {
                            var ele = siblings(this)[key];
                            ele.className = ""
                        };
                        break;
                    case "next":
                        //获取手机号密码 1，验证，2参数传入params；3进入下个参数输入页面 
                        if (that.check()) {
                            showLoading();
                            removeNode([that.ele.typeBox, that.ele.inputBox, that.ele.btnBox, that.ele.msgBox]);
                            that.ele.registBox.style.background = "none";
                            that.nextObj();
                        }
                        break;
                    case "logout":
                        showLoading();
                        setTimeout(function() {
                            hideLoading();
                            location.href = "./login.html";
                        }, 500);
                        break;
                    case "back":
                        showLoading();
                        setTimeout(function() {
                            hideLoading();
                            location.reload();
                        }, 300);
                        break;
                    case "complete":
                        showLoading();
                        if (that.complete()) {
                            that.send()
                        } else {
                            hideLoading();
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
        if (checkphone(phoneNum)) {
            if (checkpasswd(passwd)) {
                if ((passwd == rePasswd)) {
                    that.params.phone = phoneNum;
                    that.params.passwd = passwd;
                    return true;
                } else {
                    that.ele.msgBox.innerHTML = "两次输入密码不一致！"
                    return false;
                }
            } else {
                that.ele.msgBox.innerHTML = "请输入正确密码格式！"
                return false;
            }
        } else {
            that.ele.msgBox.innerHTML = "请输入正确手机号！"
            return false;
        }
    };
    this.complete = function() {
        var name = that.ele.name.value,
            cname = that.ele.cname.value,
            caddr = that.ele.caddr.value,
            cemail = that.ele.cemail.value,
            oicq = that.ele.oicq.value;
        if (name && cname) {
            if (checkemail(cemail)) {
                that.params.name = name;
                that.params.cname = cname;
                that.params.caddr = caddr;
                that.params.cemail = cemail;
                that.params.oicq = oicq;
                return true;
            } else {
                that.ele.msgBox2.innerHTML = "请填写正确邮箱地址！"
                return false;
            }
        } else {
            that.ele.msgBox2.innerHTML = "请填写姓名和公司名！";
            return false;
        }
    };
    this.send = function() {
        var p = that.params;
        var d = host + "?m=5001&from=client&name=" + p.name + "&phone=" + p.phone + "&utype=" + p.utype + "&passwd=" + p.passwd + "&cname=" + p.cname + "&caddr=" + p.caddr + "&oicq=" + p.oicq + "&callback=regist.callback";
        setJsonp(d, that.callback);
    };
    this.callback = function(data) {
        if (data == 1) {
            hideLoading();
            return
        };
        var $data = toObject(data);
        if ($data.status == 1) {
            //跳转
            var at = $data.data.at || "",
                author = $data.data.author || "",
                name = $data.data.name || "tvm用户";
            localStorage.setItem("name", name);
            localStorage.setItem("at", at);
            localStorage.setItem("author", author);
            setTimeout(function() {
                location.href = "./index.html";
            }, 500);
        } else {
            that.ele.msgBox2.innerHTML = $data.msg;
        };
        hideLoading();
    };
    this.firstObj = function() {
        var typeBox = '   <h2>用户类型</h2>\
                        <div class="choose">\
                            <dl action="type.,2">\
                                <dt>\
                                    <img class="dark" src="./img/icon-2.png" />\
                                    <img class="light" src="./img/icon-2_1.png" />\
                                <dd>学校</dd>\
                            </dl>\
                            <dl action="type.,3">\
                                <dt>\
                                    <img class="dark" src="./img/icon-3.png" />\
                                    <img class="light" src="./img/icon-3_1.png" />\
                                </dt>\
                                <dd>培训</dd>\
                            </dl>\
                            <dl action="type.,5">\
                                <dt>\
                                    <img class="dark" src="./img/icon-5.png" />\
                                    <img class="light" src="./img/icon-5_1.png" />\
                                </dt>\
                                <dd>企业</dd>\
                            </dl>\
                            <dl action="type.,4">\
                                <dt>\
                                    <img class="dark" src="./img/icon-4.png" />\
                                    <img class="light" src="./img/icon-4_1.png" />\
                                </dt>\
                                <dd>政府</dd>\
                            </dl>\
                            <dl class="choosed" action="type.,1">\
                                <dt class="lastchild">\
                                    <img class="dark" src="./img/icon-1.png" />\
                                    <img class="light" src="./img/icon-1_1.png" />\
                                </dt>\
                                <dd>个人</dd>\
                            </dl>\
                        </div> ';

        var inputBox = '  <div class="inputBox-1">\
                                <div class="iconBox"><img src="./img/username.png"></div>\
                                <input type="number" placeholder="手机号" id="phoneNum" action="input.,">\
                            </div>\
                            <div class="inputBox-1">\
                                <div class="iconBox">\
                                    <img src="./img/key.png">\
                                </div>\
                                <input type="password" placeholder="密码(8位以上数字、字母组合)" id="password" action="input.,">\
                            </div>\
                            <div class="inputBox-1">\
                                <div class="iconBox">\
                                    <img src="./img/shild.png">\
                                </div>\
                                <input type="password" placeholder="确认密码" id="rePassword" action="input.,">\
                            </div>';

        var btnBox = '   <div class="btn-next" action="next.,">下一步</div>\
                         <div class="btn-logout" action="logout.,">返回</div> ';
        that.ele.registBox = createNode(wrap, "div", { className: "registBox" });
        that.ele.typeBox = createNode(that.ele.registBox, "div", { className: "typeBox", html: typeBox });
        that.ele.inputBox = createNode(that.ele.registBox, "div", { className: "inputBox", html: inputBox });
        that.ele.msgBox = createNode(that.ele.registBox, "div", { className: "msgBox" });
        that.ele.btnBox = createNode(that.ele.registBox, "div", { className: "btnBox", html: btnBox, style: "margin-top:0;padding-bottom:1.1rem" });
        that.ele.phoneNum = document.getElementById("phoneNum");
        that.ele.passwd = document.getElementById('password');
        that.ele.rePasswd = document.getElementById("rePassword");
        hideLoading();
    };
    this.nextObj = function() {
        var htmlobj = ' <h2>完善资料</h2>\
                        <div class="inputBox data">\
                            <div class="inputBox-1">\
                                <div class="iconBox"><img src="./img/name.png"></div>\
                                <input type="text" placeholder="用户姓名*" id="name" action="input.,">\
                            </div>\
                            <div class="inputBox-1">\
                                <div class="iconBox"><img src="./img/company.png"></div>\
                                <input type="text" placeholder="单位名称*" id="cname" action="input.,">\
                            </div>\
                            <div class="inputBox-1">\
                                <div class="iconBox"><img src="./img/addr.png"></div>\
                                <input type="text" placeholder="单位地址   (省、市/区、县)" id="caddr" action="input.,">\
                            </div>\
                            <div class="inputBox-1">\
                                <div class="iconBox"><img src="./img/email.png"></div>\
                                <input type="email" placeholder="联系人邮箱" id="cemail" action="input.,">\
                            </div>\
                            <div class="inputBox-1" style="margin-bottom:0">\
                                <div class="iconBox"><img src="./img/qq.png"></div>\
                                <input type="number" placeholder="联系人QQ" id="oicq" action="input.,">\
                            </div>\
                        </div>\
                        <div class="msgBox2" id="msgBox2"></div>\
                        <div class="btnBox complete">\
                            <div class="btn-complete" action="complete.,">完成注册</div>\
                            <div class="btn-logout" action="back">返回</div>\
                        </div>';
        that.ele.nextBox = createNode(that.ele.registBox, "div", { html: htmlobj, className: "typeBox" });
        that.ele.msgBox2 = document.getElementById("msgBox2");
        that.ele.cname = document.getElementById("cname");
        that.ele.name = document.getElementById("name");
        that.ele.caddr = document.getElementById("caddr");
        that.ele.cemail = document.getElementById("cemail");
        that.ele.oicq = document.getElementById("oicq");
        hideLoading();
    };
}
