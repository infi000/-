/*
 * @Author: 张驰阳
 * @Date:   2017-03-29 17:30:28
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-04-12 11:14:24
 */

'use strict';

var DO = document,
    DB = DO.body,
    winW = window.innerWidth,
    winH = window.innerHeight,
    mainVar = {},
    host = HOST.dev+"?from=client&m=6602", //6601盒子接口列表，6602绑定，5001注册，6603 判断能不能绑盒子，6650 退出
    wrap = createNode(DB, "div", { className: "wrap" }),
    bind = new Bind();
bind.init();

function Bind() {
    var that = this,
        re = 1;
    this.init = function() {
        showLoading();
        var logohtml = '<div class="leaf"><img src="./img/leaf2.png"></div><div class="logo"><img src="./img/logo2.png"></div>';
        createNode(wrap, "div", { className: "logoBox", html: logohtml });
        that.dom_bind();
        eventEntrust({
            ele: wrap,
            event: "click",
            fun: function() {
                var $action = arguments[0];
                switch ($action) {
                    case "btn-bind":
                        // 绑定盒子
                        that.params.name = that.ele.name.value;
                        if (that.params.name == "") {
                            that.ele.name.focus();
                        } else {
                            showLoading();
                            that.bindBox();
                        }
                        break;
                    case "btn-back":
                        //返回上一页
                        history.back();
                        break;
                };
            }
        })
    };
    this.ele = {};
    this.params = {
        at: localStorage.getItem("at") || "",
        author: localStorage.getItem("author") || "",
        code: localStorage.getItem("code") || "",
        name: ""
    };
    this.dom_bind = function() {
        var obj = ' <h2>绑定盒子</h2>\
                    <div class="inputBox">\
                        <div class="inputBox-1">\
                            <div class="iconBox"><img src="./img/id.png"></div>\
                            <input type="text" placeholder="ID" value="' + that.params.code.toUpperCase() + '" disabled>\
                        </div>\
                        <div class="inputBox-1">\
                            <div class="iconBox"><img src="./img/boxName.png"></div>\
                            <input type="text" placeholder="给直播设备命名" id="name" maxlength="15">\
                        </div>\
                    </div>\
                    <div class="btnBox">\
                        <div class="btn btn-bind" action="btn-bind">绑定</div>\
                        <div class="btn btn-back" action="btn-back">返回</div>\
                    </div>'
        that.ele.bindBox = createNode(wrap, "div", { className: "bindBox", html: obj });
        that.ele.name = document.getElementById("name");
        hideLoading();
    };
    this.bindBox = function() {
        var p = that.params,
            d = host + "&name=" + p.name + "&code=" + p.code + "&at=" + p.at + "&author=" + p.author + "&callback=bind.callback";
        setJsonp(d, that.callback);
    };
    this.callback = function(data) {
        if (data == 1) {
            return
        };
        var $data = toObject(data);
        if ($data.status == 1) {
            //绑定成功 提示 跳转
            tishi("绑定成功！跳转中。。。");
            setTimeout(function() {
                location.href = "./index.html";
            }, 500);
        } else {
            hideLoading();
            tishi($data.msg);
        }
    };
    //获取盒子绑定状态
    this.checkBox = function() {
        var at = that.params.at,
            author = that.params.author,
            code = that.params.code,
            d = host + "&m=6603&at=" + at + "&author=" + author + "&code=" + code + "&callback=bind.checkBoxcallback";
        setJsonp(d, that.checkBoxcallback);
    };
    this.checkBoxcallback = function(data) {
        if (data == 1) {
            return
        };
        var $data = toObject(data);
        console.log($data.status);
        if ($data.status == 1) {
            //未绑定盒子 可以绑定
            that.bindBox();
        } else {
            hideLoading();
            tishi($data.msg);
        }
    };
}
