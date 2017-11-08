/*
 * @Author: 张驰阳
 * @Date:   2017-03-28 18:07:54
 * @Last Modified by:   张驰阳
 * @Last Modified time: 2017-07-06 10:35:30
 */

'use strict';
var DO = document,
    DB = DO.body,
    winW = window.innerWidth,
    winH = window.innerHeight,
    mainVar = {},
    host = HOST.dev + "?from=client", //6601盒子接口列表，6602绑定，5001注册，6603 判断能不能绑盒子，6650 退出
    wrap = createNode(DB, "div", { className: "wrap" }),
    main = new Main();
main.init();

function Main() {
    var that = this;
    this.ele = {};
    this.boxList = {};
    this.bind = false;
    this.params = {
        at: localStorage.getItem("at") || "",
        author: localStorage.getItem("author") || "",
        code: localStorage.getItem("code") || "",
        type: "1"
    };
    this.init = function() {
        showLoading();
        var logohtml = '<div class="leaf"><img src="./img/leaf2.png"></div><div class="logo"><img src="./img/logo2.png"></div>';
        createNode(wrap, "div", { className: "logoBox", html: logohtml });
        that.ele.main = createNode(wrap, "div", { className: "main" });
        // that.getStatus();
        that.getBox();
        that.dom_set();
        eventEntrust({
            ele: wrap,
            event: "click",
            fun: function() {
                var $action = arguments[0];
                switch ($action) {
                    case "bind-btn":
                        //跳转绑定页面
                        showLoading();
                        setTimeout(function() {
                            hideLoading();
                            location.href = "./bind.html";
                        }, 500);
                        break;
                    case "start-btn":
                        //
                        showLoading();
                        window.webkit.messageHandlers.beginLive.postMessage(that.params.type)
                        break;
                    case "set-btn":
                        //点击设置
                        // stopPropagation();
                        var s = (that.ele.setChoose.style.display == "block") ? "none" : "block";
                        var c = (that.ele.setChoose.style.display == "block") ? "#00a0ff" : "#156ea2";
                        that.ele.setChoose.style.display = s;
                        this.style.backgroundColor = c;
                        break;
                    case "logout":
                        //退出
                        //跳转绑定页面
                        showLoading();
                        that.out();
                        setTimeout(function() {
                            hideLoading();
                            location.href = "./login.html";
                        }, 500);
                        break;
                    case "type":
                        //选择方式
                        that.params.type = arguments[1];
                        this.className = "choosed";
                        for (var key in siblings(this)) {
                            var ele = siblings(this)[key];
                            ele.className = ""
                        };
                        that.ele.setChoose.style.display = "none";
                        break;
                }
            }
        });
    };
    //获取绑定盒子列表
    this.getBox = function() {
        var at = that.params.at,
            author = that.params.author,
            d = host + "&m=6601&at=" + at + "&author=" + author + "&callback=main.getBoxcallback";
        setJsonp(d, that.getBoxcallback);
    };
    this.getBoxcallback = function(data) {
        if (data == 1) {
            return
        };
        var $data = toObject(data);
        if ($data.status == 1) {
            that.boxList = $data.data || "";
            //登陆成功，加载DOM
            that.dom_boxList();
        } else {
            //信息出错，重新登陆
            tishi("身份信息有误，请重新登陆！");
            setTimeout(function() {
                hideLoading()
                location.href = "./login.html?id=" + that.params.code;
            }, 500);
        };
    };
    //加载DOMstatus
    this.dom_status = function() {
        var name = localStorage.getItem("name"),
            msg = "点击按钮开始直播吧！",
            action = "start-btn",
            className = "start-btn",
            btnMsg = "开始直播",
            statusHtml;
        if (!that.bind) {
            //未绑定盒子
            msg = "先绑定当前设备，才能开始直播哦~";
            action = "bind-btn";
            className = "bind-btn";
            btnMsg = "绑定当前设备";
        }
        statusHtml = ' <h2>欢迎您，<span>' + name + '</span>!</h2>\
                            <p class="statusInfo">' + msg + '</p>\
                            <div class="statusBtnBox">\
                                <div class="statusBtn ' + className + '" action="' + action + '.,">' + btnMsg + '</div>\
                                <div class="statusBtn logout-btn" action="logout.,">退出</div>\
                            </div>';
        that.ele.status = createNode(that.ele.main, "div", { className: "statusBox", html: statusHtml });
    };
    //加载DOM盒子列表
    this.dom_boxList = function() {
        var $opt = that.boxList,
            onNum = 0,
            offNum = 0,
            sumNum = $opt.length,
            liObj = "",
            conObj = "",
            onlineInfo = '';
        for (var key in $opt) {
            var opt = $opt[key],
                img = (opt.status == 0) ? "./img/box_offline.png" : "./img/box_online.png",
                className = (opt.status == 0) ? "boxOffline" : "boxOnline",
                id = opt.code;
            onNum += parseInt(opt.status);
            liObj += '<li class="' + className + '">\
                            <div class="boxPic">\
                                <img src="' + img + '" alt="预览图">\
                            </div>\
                            <div class="boxId">' + id + '</div>\
                        </li>';
            if (id == that.params.code) {
                that.bind = true;
            }
        };
        offNum = parseInt(sumNum - onNum);
        conObj = '<div class="container "><ul>' + liObj + '</ul></div>';
        onlineInfo = '<div class="onlineInfo">\
                            <h2>您的盒子</h2>\
                            <div class="onlineNumBox">\
                                <ul>\
                                    <li>\
                                        <img src="./img/online.png">\
                                        <span>在线:&nbsp;</span>\
                                        <b class="onlineNum">' + onNum + '</b>\
                                    </li>\
                                    <li>\
                                        <img src="./img/offline.png">\
                                        <span>离线:&nbsp;</span>\
                                        <b>' + offNum + '</b>\
                                    </li>\
                                </ul>\
                            </div>\
                         </div>';
        that.dom_status();
        that.ele.showBox = createNode(that.ele.main, "div", { className: "showBox", html: onlineInfo + conObj });
        hideLoading();
    };
    //加载DOM设置
    that.dom_set = function() {
        var obj = '<b action="set-btn">设置</b>\
                <div class="setChoose" style="display: none" id="setChoose">\
                    <ul>\
                        <li class="choosed" action="type.,1"><span>手机编解码(横屏)</span></li>\
                        <li action="type.,2"><span>手机编解码(竖屏)</span></li>\
                        <li action="type.,3"><span>手机屏幕输出</span></li>\
                        <li action="type.,4"><span>续传</span></li>\
                    </ul>\
                </div>';
        that.ele.setBox = createNode(wrap, "div", { className: "setBox", html: obj });
        that.ele.setChoose = document.getElementById("setChoose");
    };
    //登出
    this.out = function() {
        var at = that.params.at,
            author = that.params.author,
            d = host + "&m=6650&at=" + at + "&author=" + author + "&callback=main.outcallback";
        setJsonp(d, that.outcallback);
    };
    this.outcallback = function(data) {
        if (data == 1) {
            return
        };
        var $data = toObject(data);
        if ($data.status == 1) {
            console.log("退出成功")
        }
    };
}
