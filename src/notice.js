;
! function () {
    "use strict";

    const SPEED = 180; // 动画速度

    const POSTION = {
        RIGHT: 24,
        RIGHT_BEGIN: -360,
        TOP_BEGIN: 256
    } // 初始位置

    const TYPE = {
        INFO: 0, // 消息
        SUCCESS: 1, // 成功
        WARNING: 2, // 警告
        ERROR: 3 // 错误
    }

    var options = {
        title: "消息",
        type: TYPE.INFO,
        timeout: 3000,
        content: undefined,
        callback: undefined
    }

    var yai_notice = [];

    function show(notice) {
        var type_class = "yai-notice-info";
        if (notice.type == TYPE.SUCCESS) type_class = "yai-notice-success";
        else if (notice.type == TYPE.WARNING) type_class = "yai-notice-warning";
        else if (notice.type == TYPE.ERROR) type_class = "yai-notice-danger";
        var html =
            `<div class="yai-notice" data-id="${notice.id}">
                <div class="yai-notice-container ${type_class}">
                    <div class="${notice.content ? "yai-notice-title" : ""}">${notice.title}</div>
                    <div class="yai-notice-content">${notice.content ? notice.content : ""}</div>
                </div>
                <span class="yai-notice-close"></span>
            </div>`;
        $("body").append(html);
        var $notice = $(".yai-notice[data-id='" + notice.id + "']");
        var postion = yai_notice.length - 1;
        notice.height = $notice.height(); // 获取当前notice高度
        notice.top = yai_notice[postion] ? yai_notice[postion].top + yai_notice[postion].height : POSTION.TOP_BEGIN; // 获取当前notice的top
        yai_notice.push(notice);
        $notice.css({
            top: notice.top
        });
        $notice.animate({
            right: POSTION.RIGHT
        }, SPEED);
        $notice.find(".yai-notice-close").on("click", () => remove(notice)); // 绑定移除按钮事件
        if (notice.timeout > 0) setTimeout(() => remove(notice), notice.timeout); // 设置取消定时
    }

    function remove(notice) {
        var $notice = $(".yai-notice[data-id='" + notice.id + "']");
        yai_notice.splice(yai_notice.indexOf(notice), 1); // 移除对象
        if (notice.callback) notice.callback(); // 回调函数
        move(); // 滑动下面的提示
        $notice.animate({
            right: POSTION.RIGHT_BEGIN
        }, SPEED, () => $notice.remove()); // 移除dom
    }

    function move() {
        for (var i = 0; i < yai_notice.length; i++) {
            var postion = i - 1;
            yai_notice[i].top = yai_notice[postion] ? yai_notice[postion].top + yai_notice[postion].height : POSTION.TOP_BEGIN;
            $(".yai-notice[data-id='" + yai_notice[i].id + "']").animate({
                top: yai_notice[i].top
            }, SPEED);
        }
    }

    var YaiNotice = function () {};

    YaiNotice.prototype.open = function (option) {
        var notice = $.extend({
            id: new Date().getTime() // id是当前时间
        }, options, option);
        show(notice);
    }

    YaiNotice.prototype.info = function (title, content) {
        this.open({
            type: TYPE.INFO,
            title: title,
            content: content
        });
    }

    YaiNotice.prototype.success = function (title, content) {
        this.open({
            type: TYPE.SUCCESS,
            title: title,
            content: content
        });
    }

    YaiNotice.prototype.warning = function (title, content) {
        this.open({
            type: TYPE.WARNING,
            title: title,
            content: content
        });
    }

    YaiNotice.prototype.error = function (title, content) {
        this.open({
            type: TYPE.ERROR,
            title: title,
            content: content
        });
    }

    window.YaiNotice = new YaiNotice();
}()