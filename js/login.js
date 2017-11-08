/*
 * @Author: 张驰阳
 * @Date:   2017-03-29 09:55:58
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-04-11 17:56:13
 */

'use strict';
var DO = document,
    DB = DO.body,
    winW = window.innerWidth,
    winH = window.innerHeight,
    host = HOST.dev,
    mainVar = {};
if (getSearch().id) {
    localStorage.setItem("code", getSearch().id);
};
mainVar.ele = {
    tel: document.getElementById("tel"),
    passwd: document.getElementById("passwd"),
    regist: document.getElementById("regist"),
    login: document.getElementById("login"),
    loginBox: document.getElementById("loginBox"),
    msgBox: document.getElementById("msgBox"),
    wrap: document.getElementById("wrap")
};
mainVar.params = {
    tel: "",
    passwd: "",
    id: localStorage.getItem("code") || ""
};

eventEntrust({
    ele: mainVar.ele.loginBox,
    event: "click",
    fun: function() {
        var $action = arguments[0];
        switch ($action) {
            case "regist":
                showLoading();
                regist()
                break;
            case "login":
                showLoading();
                if (check()) {
                    login()
                } else {
                    hideLoading();
                }
                break;
            case "input":
                clearErr()
                break;
        };
    }
});

function login() {
    var tel = mainVar.params.tel,
        passwd = mainVar.params.passwd,
        d = host + "?m=5020&from=client&tel=" + tel + "&passwd=" + passwd + "&callback=callback";
    setJsonp(d, callback);
};

function callback(data) {
    if (data == 1) {
        hideLoading();
        return
    };
    var $data = toObject(data);
    if ($data.status == 1) {
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
        mainVar.ele.msgBox.innerHTML = $data.msg;

    }
    hideLoading();
};

function regist() {
    setTimeout(function() {
        hideLoading();
        location.href = "./regist.html";
    }, 500);
};

function check() {
    var tel = (mainVar.ele.tel.value) || "",
        passwd = (mainVar.ele.passwd.value) || "";
    if (tel && passwd) {
        if (checkphone(tel)) {
            mainVar.params.tel = tel;
            mainVar.params.passwd = passwd;
            return true;
        } else {
            mainVar.ele.msgBox.innerHTML = "请填写正确手机";
            return false;
        }
    } else {
        mainVar.ele.msgBox.innerHTML = "请填写完整信息";
        return false;
    }
};

function clearErr() {
    mainVar.ele.msgBox.innerHTML = "";
}
