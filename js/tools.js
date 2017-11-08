var HOST={
    dev:"http://www.xiaomaizhibo.com/cloudlive/",
    // dev:"http://www.xiaomaizhibo.com/cloudltest/"    
};
(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            var clientHeight = docEl.clientHeight;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            if (clientHeight < clientWidth) {
                docEl.style.fontSize = 100 * (clientWidth / 1334) + 'px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
//清除空格
String.prototype.trim = function() {
    return this.replace(/[\s　]+|(&nbsp;)+/gi, '');
};

function checkphone(p) {
    var reg = new RegExp(/^1[3-8]{1}[0-9]{9}$/);
    if (reg.test(p)) {
        return true;
    } else {
        return false;
    }
}

function checkemail(p) {
    var reg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (reg.test(p) || p == "") {
        return true;
    } else {
        return false;
    }
}

function checkUrl(p) {
    var reg = new RegExp(/^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/);
    if (reg.test(p)) {
        return true;
    } else {
        return false;
    }
}

function checkpasswd(p) {
    //不小于八位数字字母组合
    var reg = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/);
    if (reg.test(p)) {
        return true;
    } else {
        return false;
    }
}
//显示loading
function showLoading(options){
    var options=options||{}
    if(!mainVar.loading){
        var css='.loadingScreen{position:absolute;top:0;left:0;height:100%;width:100%;background:rgba(0,0,0,'+(options.opacity||.2)+');z-index:'+(options.zIndex||10000)+';}\
                .loading{background:url(./img/loading.gif) no-repeat center center;height:25px;width:25px;position:fixed;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);background-color:rgba(0,0,0,.8);padding:15px;background-size:25px 25px;box-sizing:content-box;border-radius:8px;}\
                 .loadingScreen .loading span{position: absolute;font-size: 0.4rem;color: wi;color: #171616;top: -0.7rem; left: 0;right: 0;text-align: center;font-weight: bold;}';
    setStyle(css);
    mainVar.loading=createNode(DB,'div',{className:"loadingScreen",html:'<div class="loading"></div>'});
    }else{
        mainVar.loading.style.display='block';
    };
};
//隐藏loading
function hideLoading(){
    if(mainVar.loading){
        mainVar.loading.style.display='none';
    };
};
function addEvent(_, Eve, Fun, b) { _.addEventListener(Eve, Fun, b || false) };

function delEvent(_, Eve, Fun, b) { _.removeEventListener(Eve, Fun || null, b || false) };
//取子元素
function getChildNodes(_, tag) {
    var nodes = [],
        node = _.firstChild;
    if (tag) {
        tag = tag.toUpperCase();
        while (node) {
            if (tag == node.tagName) nodes.push(node);
            node = node.nextSibling;
        }
    } else {
        while (node) {
            if (node.tagName) nodes.push(node);
            node = node.nextSibling;
        }
    }
    return (nodes == "" ? null : nodes);
};
//获取兄弟元素节点
function siblings(ele) {
    var r = [];
    var n = ele.parentNode.firstChild;
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== ele) {
            r.push(n);
        }
    }

    return r;
}
//取search
function getSearch(str) {
    var s = str || location.search.substr(1),
        o = {}
    if (s.length > 2) {
        var fg = s.indexOf("&amp;") > -1 ? "&amp;" : "&",
            arr = (s !== "" && s.split(fg)) || [""],
            arrL = arr.length - 1,
            i = -1,
            key = null,
            v = null,
            a = null;
        do {
            var a = arr[++i].split("=");
            if (a) {
                o[a[0]] = decodeURIComponent(a[1])
            }
        } while (i < arrL)
    }
    return o
}

//去两边空格 
function trim(str) {
    var s = str || ''
    return s.replace(/^\s+|\s+$/g, "")
}
//移除node    
function removeNode(_) {
    var arr = (typeOf(_) == "array") ? _ : [_];
    for (var i = 0; i < arr.length; i++) {
        arr[i] && arr[i].parentNode.removeChild(arr[i])
    }
}
//创建并返回element  
function createNode(_, tag, type, position) {
    var p = position || "p3";
    var node = (typeof(tag) == "string" ? document.createElement(tag) : tag)
    if (type) setAtt(node, type)
    switch (p) {
        case "p1":
            _.parentNode.insertBefore(node, _);
            break;
        case "p2":
            _.insertBefore(node, _.firstChild);
            break;
        case "p3":
            _.appendChild(node)
            break;
        case "p4":
            if (_.nextSibling)
                _.parentNode.insertBefore(node, _.nextSibling);
            else
                _.parentNode.appendChild(node);
            break;
        default:
            var child = getChildNodes(_)
            if (child) {
                if (child[p]) _.insertBefore(node, child[p]);
            } else {
                _.parentNode.insertBefore(node, _.nextSibling)
            }
            break

    }
    return node
};


//创建JSONP 
function setJsonp(action, callback, _) {
    var js = document.createElement("script"),
        _ = _ || document.documentElement;
    js.src = action;
    _.appendChild(js);
    js.onreadystatechange = js.onload = function(e) {
        var read = js.readyState;
        if (read) {
            if (read == "loaded") callback && callback(1)
        } else {
            callback && callback(1)
        }
        _.removeChild(js)
    }
    js.onerror = err;

    function err(status) {
        isFun(callback, 0);
        _.removeChild(js)
    }
}

//设置对象属性
function setAtt(_, att, val) {
    if (typeOf(att) == "object") {
        for (var i in att) {
            if (att.propertyIsEnumerable(i))
                Att(i, att[i])
        }
    } else {
        Att(att, val)
    }

    function Att(att, val) {
        switch (att) {
            case "style":
                _.style.cssText = val;
                break;
            case "className":
                _.className = val;
                break;
            case "html":
                _.innerHTML = val;
                break;
            default:
                _.setAttribute(att, val);
                break
        }
    }
};

//返回对象类型    
function typeOf(_) {
    var a = typeof(_);
    if (a === "object") {
        if (_ === null) {
            a = null
        } else if (_.setAttribute) {
            a = "DOM"
        } else if (_.shift) {
            a = "array"
        }
    }
    return a
};
//获取元素的相对屏幕位置
function getProperty(_) {
    var w = _.offsetWidth,
        h = _.offsetHeight,
        l = 0,
        t = 0;
    do {
        l += _.offsetLeft;
        t += _.offsetTop;
    } while (_ = _.offsetParent)
    return { width: w, height: h, left: l, top: t };
}
//创建xmlObj对象-----------------------------------
function xmlObj() {
    try {
        return (new ActiveXObject("Msxml2.XMLHTTP") || new ActiveXObject('Microsoft.XMLHTTP'))
    } catch (e) {
        return new XMLHttpRequest()
    }
}

function B(num) {
    return +num < 10 ? "0" + num : num
}
var timeStr = setItem("$Y;Y;$M;M;$D;D;$h;h;$m;m;$s;s");
//日期格式化
function formatTime(fra, $time, $type) {
    var date = new Date($type ? { "Unix": $time * 1000, "UTC": $time - 288e5 }[$type] : $time);
    if (!date.getTime()) return null;
    var y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        m2 = date.getMinutes(),
        s = date.getSeconds();
    var obj = timeStr,
        temp = obj,
        str2 = "",
        dataStr = "",
        data = { Y: y, $Y: y.toString().substr(2), $M: B(m), M: m, $D: B(d), D: d, $h: B(h), h: h, $m: B(m2), m: m2, $s: B(s), s: s };
    switch (fra) {
        case "toUTC":
            with(date) dataStr = Date.UTC(getFullYear(), getMonth(), getDate(), getHours(), getMinutes(), getSeconds())
            break
        case "toUnix":
            dataStr = +date / 1000 ^ 0
            break
        default:
            for (var i = 0, il = fra.length, t; i < il;) {
                str = fra.charAt(i)
                if (temp = temp[str]) {
                    str2 += str;
                    if (temp.end) {
                        dataStr += data[str2];
                        str2 = "";
                        temp = obj
                    }
                } else {
                    temp = obj;
                    str2 = "";
                    dataStr += str
                }
                i++
            }
            break
    }
    return dataStr
}


//返回路径中的最后一层目录
function urlFolder($str) {
    var s, a, l;
    if (!$str) {
        s = location.pathname;
        s = location.origin + s.substr(0, s.lastIndexOf("/"))
    } else {
        l = $str.search(/[\#\?]/g)
        s = l > -1 ? $str.substr(0, l) : $str
        s = s.substr(0, s.lastIndexOf("/"))
    }
    return s + "/"
}

//ajax方法
function setAjax(a, b, c, d, e) {
    return new function() {
        var t = this,
            errRun = 0;
        t.method = a || "get";
        t.action = b;
        t.async = (c != undefined ? c : true);
        t.callBack = (typeof(e) == "function" ? e : 0)
        t.data = d || null;
        t.Open = t.Send = t.Test = t.Over = Function;
        t.Err = function() { xmlhttp = null }
        t.send = function(xmlCache) {
            var xmlhttp = xmlObj();
            xmlhttp.open(t.method, t.action, t.async);
            t.set && t.set.call(xmlhttp);
            if (t.method.toUpperCase() == "POST") {
                if (!t.set) xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8; text/html");
            }

            function err() {
                t.stop();
                if (errRun) return;
                errRun = 1;
                typeof(t.err) === "function" && t.err()
            }
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200 || xmlhttp.status === 304) {
                        t.err = null
                        if (t.callBack) t.callBack.call(xmlhttp, xmlhttp.responseText); //responseXML responseText
                        xmlhttp = null;
                    } else {
                        xmlhttp = null;
                        err()
                    }
                }
            }
            xmlhttp.send(t.data);
            t.stop = function() {
                xmlhttp && xmlhttp.abort()
            }
            setTimeout(function() {
                if (t.err) err()
            }, 15000)
        };
    }
}

function setItem($c, $k, $o) {
    var k = $k || ";",
        sl = $c.length,
        i = 0,
        o = $o || {},
        it = o,
        t
    for (; i < sl; i++) {
        t = $c.charAt(i)
        if (t !== k) {
            if (it[t]) {
                it = it[t];
                it.tag = $k;
            } else {
                it = it[t] = {};
                it.tag = $k;
            }
        } else {
            it.end = true;
            it = o;
        }
    }
    it.end = true
    return o
}

function insertText(obj, str) {
    if (document.selection) {
        var sel = document.selection.createRange();
        sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
        cursorPos += str.length;
        obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
        obj.value += str;
    }
}

function moveEnd(obj) {
    obj.focus();
    var len = obj.value.length;
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character', len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}
//千分制       
function qfz($n) {
    return $n.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

function noPop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.returnValue = false;
    e.cancelBubble = true
}

function xdAlbum(box, option) {
    //初始化所有变量
    var isTouch = ('ontouchstart' in window),
        evtS = "mousedown",
        evtM = "mousemove",
        evtE = "mouseup",
        getTouchType = function(e, type) {
            return e[type]
        },
        eve = function(e, type) {
            return e[type]
        },
        startY, endY, _t = this,
        _box = box //盒子对象
        ,
        _boxSty = _box.style //设置盒子的变量
        ,
        _option = option || {} //设置参数   
        ,
        _childs = _box.children,
        _childsCount = _childs.length,
        _origin = 0,
        _delay = 300 //延时清零
        ,
        _maxPoint = _option.maxPoint || _childsCount - 1 //设置最大可显示的点
        ,
        _minPoint = _option.minPoint || 0,
        _X = 0,
        _Y = 0,
        _x = 0,
        _y = 0,
        arg = 0.5,
        winW = window.innerWidth,
        winH = window.innerHeight,
        _startX, _startY, runTime = _option.runTime || 500 //设置一个过度时间
        ,
        _transition = _option.transition || 'all ' + runTime + 'ms ease' //过渡属性设置
        ,
        translateX = 0,
        translateY = 0,
        _move = 0 //子对象默认不可移动
        ,
        _scale = 1 //默认缩放级别
        ,
        _clickCount = 0 //点击次数
        ,
        _pointCount = 0 //触摸点的数量
    ;
    _t.restEnd = option.restEnd;
    if (isTouch) {
        evtS = "touchstart";
        evtM = "touchmove";
        evtE = "touchend";
        evt = function(e, type) {
            return e.touches[0][type]
        };
        getTouchType = function(e, type) {
            return e.changedTouches[0][type]
        }
    }
    _t.handleEvent = function(e) {
        _pointCount = _t.canScale ? e.touches.length : 1;
        switch (e.type) {
            case evtS:
                touchStart(e);
                break;
            case evtM:
                touchMove(e);
                break;
            case evtE:
                touchEnd(e);
                break;
        }
        setTimeout(function() { _clickCount = 0 }, _delay)
    };

    function touchStart(e) {
        _t.run = true;
        _t.moveReady = false;
        _boxSty.webkitTransition = "";
        translateX = 0;
        translateY = 0;
        _x = 0;
        _y = 0;
        _origin = 0;
        _startX = getTouchType(e, 'pageX');
        _startY = getTouchType(e, 'pageY');
        _t.startTime = e.timeStamp
    }

    function touchMove(e) {
        if (!_t.run) return false;
        var pageX = getTouchType(e, 'pageX'),
            pageY = getTouchType(e, 'pageY'),
            distX = pageX - _startX //计算移动水平与垂直的距离  
            ,
            distY = pageY - _startY,
            absX = Math.abs(distX),
            absY = Math.abs(distY);
        if (absX > absY) { // 判断水平还是垂直
            var newX = _t.currentX + distX;
            setTranslate(newX); //正常移动
            _t.space = distX; //赋值移动变量
            _origin = distX > 0 ? -1 : 1; //计算滑动的方向
            noPop(e)
        } else if (absY > absX) { //垂直方向
            return
            var newY = _t.currentY + distY;
            setTranslate(newY); //正常移动
            _t.space = distX; //赋值移动变量
            _origin = distY > 0 ? -1 : 1; //计算滑动的方向
            noPop(e)
        }
    }

    function touchEnd(e) {
        _t.run = false;
        var space = 0,
            point = _t.currentPoint;
        _boxSty.webkitTransition = _transition;
        _boxSty.transition = _transition;
        if (Math.abs(_t.space) > _t.range) {
            point = point + _origin
            _t.moveToPoint(point < 0 ? 0 : point > _maxPoint ? _maxPoint : point)
        } else {
            _t.moveToPoint(_t.currentPoint)
        }
        _pointCount = 0
    }

    _t.toNext = function() {
        if (_t.currentPoint < _maxPoint) _t.moveToPoint(_t.currentPoint + 1)
    };
    _t.toPrev = function() {
        if (_t.currentPoint > _minPoint) _t.moveToPoint(_t.currentPoint - 1);
    };
    _t.moveToPoint = function(index) {
        var space = -index * _t.distance;
        setTranslate(space);
        _t.currentPoint = index;
        _t.currentX = space;
        typeof _t.restEnd === "function" && _t.restEnd.call(_t, index)
    };
    _t.toPosition = function(index) {
        _boxSty.webkitTransition = "";
        _boxSty.transition = "";
        var space = -index * _t.distance;
        _t.currentPoint = index;
        _t.currentX = space;
        setTranslate(space, function() {
            setTimeout(function() { _boxSty.webkitTransition = _transition }, runTime)
        })
    }

    function setTranslate(x) {
        _boxSty.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';
    };
    _t.noThing = function() {
        $.delEvent(box, evtS, T, false);
        $.delEvent(box, evtM, T, false);
        $.delEvent(box, evtE, T, false)
    };
    _t.getPoints = function(point) {
        return point ? _t.maxPoint = point : _t.maxPoint
    }

    function calcSqrt(x, y) {
        return Math.sqrt(Math.pow(x[0] - x[1], 2) + Math.pow(y[0] - y[1], 2))
    };
    _t.currentPoint = _option.currentPoint || 0;
    _t.distance = _option.distance || _box.scrollWidth / (_childsCount);
    _t.toPosition(_t.currentPoint);
    _t.range = _option.range || 50;
    _t.child = _childs[_t.currentPoint];
    addEvent(box, evtS, _t, false);
    addEvent(box, evtM, _t, false);
    addEvent(box, evtE, _t, false);
    typeof _option.done == "function" && _option.done.call(_t);
};





/*提示用户*/
//提示方法
function tishi($c, options) {
    var opt = options || {},
        t = this,
        boxSty, bgSty, bg, box;
    if (!window.xdAlert) {
        setStyle(".xdAlert_bg{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:1001;background:rgba(0,0,0,.7);-webkit-transition:background 400ms ease;}.xdAlert_bg.display{display:block}.xdAlert_box{position:absolute;display:table;text-align:center;color:#fff;font-size:16px;background:rgba(0,0,0,.5);top:50%;left:50%;max-width:90%;-webkit-transform:translate3D(-50%,-50%,0);border-radius:6px;padding:10px;opacity:0;margin:-60px 0 0 0;box-sizing:border-box;-webkit-transition:margin 400ms ease,opacity 500ms ease;}.xdAlert_box.show{opacity:1;margin:0 0 0 0;}.xdAlert_box.MoveHide{-webkit-animation:iHidd 350ms forwards;}@-webkit-keyframes iShow{0%{opacity:0;margin:-60px 0 0 0}100%{opacity:1;margin:0 0 0 0}}@-webkit-keyframes iHidd{0%{opacity:1;margin:0 0 0 0;}100%{opacity:0;margin:-60px 0 0 0;}}")
        window.xdAlert = {}
    }
    if (t === window) {
        t = window.xdAlert
    }
    create()
    t.time && clearTimeout(t.time);
    t.showTime = opt.showTime || 1000; //默认显示时长，如果没设置在1秒后隐藏
    t.hiddFun = opt.hiddFun;
    t.show = show;
    t.hidd = hidd;
    t.bgSty = opt.bgSty;
    t.boxSty = opt.boxSty;
    bgSty = t.bg.style;
    boxSty = t.box.style;
    show("",opt.fun);
    return t

    function create() {
        if (!t.bg) {
            t.bg = createNode(opt.box || document.body, "div", { className: "xdAlert_bg" }, "p3");
            t.box = createNode(t.bg, "div", { className: "xdAlert_box" }, "p2")
        }
    }

    function show($s, $fun) {
        var content = $s || $c || "",
            type = typeOf(content); //显示当前内容，初始内容，空白内容
        if (t.bgSty) bgSty.cssText = t.bgSty;
        if (t.boxSty) boxSty.cssText = t.boxSty;
        if (type === "DOM")
            t.box.appendChild(content)
        else
            t.box.innerHTML = content
        t.bg.classList.add("display");
        setTimeout(function() {
            t.type = "show";
            t.box.classList.add("show")
        }, 100)
        t.time = setTimeout(function() { hidd($fun) }, t.showTime);
    }

    function hidd($fun) {
        t.box.classList.remove("show");
        t.time = setTimeout(function() {
            t.type = "hidd";
            t.bg.classList.remove("display");
        }, 600);
        isFun($fun || t.hiddFun)
    }
}
//新提示方法
function mAlert() {
    var t = {}
    setStyle('.mAlert_bg{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:1001;-webkit-transition:background 400ms ease;}\
        .mAlert_bg.display{display:block}\
        .mAlert_box{position:absolute;display:table;text-align:center;color:#fff;font-size:16px;background:rgba(0,0,0,.5);top:50%;left:50%;max-width:90%;-webkit-transform:translate3D(-50%,-50%,0);border-radius:6px;padding:10px;opacity:0;margin:-60px 0 0 0;box-sizing:border-box;-webkit-transition:margin 400ms ease,opacity 500ms ease;}\
        .mAlert_box.show{opacity:1;margin:0 0 0 0;}\
        .mAlert_box.MoveHide{-webkit-animation:iHidd 350ms forwards;}\
        @-webkit-keyframes iShow{0%{opacity:0;margin:-60px 0 0 0}100%{opacity:1;margin:0 0 0 0}}\
        @-webkit-keyframes iHidd{0%{opacity:1;margin:0 0 0 0;}100%{opacity:0;margin:-60px 0 0 0;}}')
    t.bg = createNode(document.body, "div", { className: "mAlert_bg" }, "p3");
    t.box = createNode(t.bg, "div", { className: "mAlert_box" }, "p2")
    t.flag = true; //true 执行提示  false:不执行提示
    return function($c, $opt) {
        var content = $c || '',
            opt = $opt || {},
            color = opt.color,
            bg = opt.bg || false,
            showTime = opt.showTime || 1000,
            boxSty = t.box.style,
            bgSty = t.bg.style,
            boxCss = opt.boxCss,
            fun = opt.fun
        t.box.innerHTML = content;
        if (!t.flag) return
        t.flag = false
        if (boxCss) boxSty.cssText = boxCss;
        if (color) boxSty.cssText = 'color:' + color + ';';
        if (bg) bgSty.cssText = 'background-color:rgba(0,0,0,.7);';
        t.bg.classList.add("display");
        setTimeout(function() {
            t.type = "show";
            t.box.classList.add("show")
        }, 100)
        t.time = setTimeout(function() {
            t.box.classList.remove("show");
            setTimeout(function() {
                t.bg.classList.remove("display");
                isFun(fun)
                t.flag = true;
            }, 400)
        }, showTime);
    }
}

function t2s($t, $now) {
    var t = ($now - $t) / 1000 ^ 0,
        s = ""
    if (t > 31536000) {
        s = +n2t(t, [{ v: 31536000, u: "", hidd: 1 }]) + "年前"
    } else if (t > 2592000) {
        s = +n2t(t, [{ v: 2592000, u: "", hidd: 1 }]) + "月前"
    } else if (t > 604800) {
        s = +n2t(t, [{ v: 604800, u: "", hidd: 1 }]) + "周前"
    } else if (t > 86400) {
        s = +n2t(t, [{ v: 86400, u: "", hidd: 1 }]) + "天前"
    } else if (t > 3600) {
        s = +n2t(t, [{ v: 3600, u: "", hidd: 1 }]) + "小时前"
    } else if (t > 60) {
        s = +n2t(t, [{ v: 60, u: "", hidd: 1 }]) + "分钟前"
    } else {
        s = t + "秒前"
    }
    return s
}


/*
绑定事件委托
*/
function eventEntrust($opt) {
    var ele = $opt.ele,
        event = $opt.event,
        action = $opt.action || "action",
        split = $opt.splitStr || ".,";
    addEvent(ele, event, function(e) {
        var ele = e.srcElement || e.target,
            attribute, argument, a1, fun = typeof($opt.fun) === "function" ? $opt.fun : function() {},
            targetElem = ele,
            arr = [];
        do {
            if (ele.nodeType !== 1) break
            if (attribute = ele.getAttribute(action)) break
        } while (ele = ele.parentNode);
        if (attribute) {
            arr = attribute.split(split);
            arr.push(targetElem);
            fun.apply(ele, arr);
        }
        $opt.stopPropagation && e.stopPropagation();
        $opt.preventDefault && e.preventDefault();
    })
}
//去缓存随机数
function nocache() {
    return "nocache=" + Math.random()
}



//数字转倒计时间
function n2t($n, $fra) {
    var a = $fra || [{ v: 86400, u: "天" }, { v: 3600, u: "小时" }, { v: 60, u: "分钟" }, { v: 1, u: "秒" }],
        al = a.length,
        i = 0,
        t1, t2 = $n,
        v, u, d, str = "";
    for (; i < al; i++) d = a[i], v = d.v, u = d.u, str += (t2 >= v ? (t1 = t2 / v ^ 0, t2 = t2 % v, B(t1) + u) : d.hidd ? "" : "00" + u)
    return str
}

function setStyle(css, _) {
    var sty = document.createElement("style")
    sty.setAttribute("type", "text/css");
    sty.styleSheet ? sty.styleSheet.cssText = css : sty.innerHTML = css
    _ ? _.appendChild(sty) : document.documentElement.firstChild.appendChild(sty);
};
// 解析成对象
function toObject($data) {
    return typeof($data) === "object" ? $data : eval("(" + $data + ")")
}
//返回系统标识
function getOS() {
    var OSA = ["windows", "ipad", "ipod", "iphone", "android"],
        OSL = OSA.length,
        OS, UA = navigator.userAgent.toLowerCase()
    while (OS = OSA.shift())
        if (UA.indexOf(OS) > -1) break;
    return OS
}
//判断是否是function 
function isFun($fun) {
    var a;
    return typeof($fun) === "function" ? (a = [].slice.call(arguments), a.shift(), $fun.apply(null, a), $fun) : function() {}
}

function setMoney($s) {
    var b = "" + $s;
    return b.replace(/(..)$/, ".$1")
}

function isPhone($s) {
    var s = +$s;
    return (s < 18999999999 && s > 13000000000) ? 1 : 0
}

function jsonJoin($o, $s) {
    var i, s = $s || "&",
        r = "",
        v
    for (i in $o) {
        if ($o.propertyIsEnumerable(i)) {
            v = $o[i]
            r += s + i + "=" + (typeof v === "object" ? JSON.stringify(v) : v)
        }
    }
    return r.substr(1)
}


function windowClose() {
    history.back()
}
