(function ($, window, document, undefined) {  
    var name = "JqueryPages",  
        instance = null,  
        defaults = { //默认值  
            first: false,  
            previous: "上一页",  
            next: "下一页",  
            last: false,  
            links: "numeric",  
            startPage: 1,  
            perPage: 10,  //每页显示数量  
            midRange: 5,  
            startRange: 1,  
            endRange: 1,  
            pause: 0,  
            clickStop: false,  
            delay: 50,  
            fallback: 400,  
            minHeight: true,  
            callback: undefined,  
            skip: "跳转",  
            msgnum: 0  
        };  
    //自定义JQUERY  
    $.fn[name] = function (arg) {  
        var type = $.type(arg);  
        if (type === "object") {  
            if (this.length && !$.data(this, name)) {  
                instance = new Plugin(this, arg);  
                this.each(function () {  
                    $.data(this, name, instance);  
                });  
            }  
            return this;  
        }  
  
        if (type === 'number' && arg % 1 === 0) {  
            if (instance.validNewPage(arg)) {  
                instance.paginate(arg);  
            }  
            return this;  
        }  
  
        return this;  
    };  
  
    function Plugin(element, options) {  
        this.options = $.extend({}, defaults, options); //合并默认值  
        this._holder = $(element);  
        this._nav = {};  
        this._first = $(this.options.first);  //首页对象  
        this._previous = $(this.options.previous); //上一页对象  
        this._next = $(this.options.next); //下一页对象  
        this._last = $(this.options.last); //尾页对象  
        this._numPages = Math.ceil(this.options.msgnum / this.options.perPage);  
        this._currentPageNum = this.options.startPage;  
        this._clicked = false;  
        this.init();  
    }  
  
  
    Plugin.prototype.init = function () {  
        this.setStyles();  
        this.setNav();  
        this.paginate(this._currentPageNum);  
        this.setMinHeight();  
    };  
  
    Plugin.prototype.setStyles = function () {  
        var requiredStyles = "<style>" +  
        ".jp-invisible { visibility: hidden !important; } " +  
        ".jp-hidden { display: none !important; }" +  
        "</style>";  
  
        $(requiredStyles).appendTo("head");  
    };  
  
    Plugin.prototype.setNav = function () {  
        var navhtml = this.writeNav();  
  
        this._holder.each(this.bind(function (index, element) {  
            var holder = $(element);  
            holder.html(navhtml);  
            this.cacheNavElements(holder, index);  
            this.bindNavHandlers(index);  
            this.disableNavSelection(element);  
        }, this));  
    };  
    //拼出分页HTML代码  
    Plugin.prototype.writeNav = function () {  
        var i = 1, navhtml;  
        navhtml = this.writeBtn("first") + this.writeBtn("previous");  
        for (; i <= this._numPages; i++) {  
            if (i === 1 && this.options.startRange === 0) {  
                navhtml += "<span>...</span>";  
            }  
            if (i > this.options.startRange && i <= this._numPages - this.options.endRange) {  
                navhtml += "<a class='jp-hidden'>";  
            } else {  
                navhtml += "<a>";  
            }  
            switch (this.options.links) {  
                case "numeric":  
                    navhtml += i;  
                    break;  
                case "blank":  
                    break;  
            }  
            navhtml += "</a>";  
            if (i === this.options.startRange || i === this._numPages - this.options.endRange) {  
                navhtml += "<span>...</span>";  
            }  
        }  
  
        navhtml += this.writeBtn("next") + this.writeBtn("last");  
        navhtml += this.options.skip + "<input type='text' style='width:30px;'/><input type='button' value='GO'/>";  
        return navhtml;  
    };  
  
    Plugin.prototype.writeBtn = function (which) {  
        return this.options[which] !== false && !$(this["_" + which]).length ?  
            "<a class='jp-" + which + "'>" + this.options[which] + "</a>" : "";  
    };  
  
    //获取对象里所有元素  
    Plugin.prototype.cacheNavElements = function (holder, index) {  
        this._nav[index] = {};  
  
        this._nav[index].holder = holder;  
  
        this._nav[index].first = this._first.length ? this._first : this._nav[index].holder.find("a.jp-first");  
        this._nav[index].previous = this._previous.length ? this._previous : this._nav[index].holder.find("a.jp-previous");  
        this._nav[index].next = this._next.length ? this._next : this._nav[index].holder.find("a.jp-next");  
        this._nav[index].last = this._last.length ? this._last : this._nav[index].holder.find("a.jp-last");  
  
        this._nav[index].skipPg = this._nav[index].holder.find("input[type=text]"); //获取跳转文本框页数对象(修改)  
        this._nav[index].skipBtn = this._nav[index].holder.find("input[type=button]"); //获取跳转按钮对象(修改)  
  
        this._nav[index].fstBreak = this._nav[index].holder.find("span:first");  
        this._nav[index].lstBreak = this._nav[index].holder.find("span:last");  
  
        this._nav[index].pages = this._nav[index].holder.find("a").not(".jp-first, .jp-previous, .jp-next, .jp-last");  
        this._nav[index].permPages = this._nav[index].pages.slice(0, this.options.startRange)  
            .add(this._nav[index].pages.slice(this._numPages - this.options.endRange, this._numPages));  
        this._nav[index].pagesShowing = $([]);  
        this._nav[index].currentPage = $([]);  
    };  
  
    Plugin.prototype.bindNavHandlers = function (index) {  
        var nav = this._nav[index];  
  
        nav.holder.bind("click.jPages", this.bind(function (evt) {  
            var newPage = this.getNewPage(nav, $(evt.target));  
            if (this.validNewPage(newPage)) {  
                this._clicked = true;  
                this.paginate(newPage);  
            }  
            evt.preventDefault();  
        }, this));  
  
        // 跳转按钮出发方法(修改)  
        nav.skipBtn.bind("click.jPages", this.bind(function () {  
            var newPage = nav.skipPg.val();  
            if (this.validNewPage(newPage)) {  
                this.paginate(newPage);  
            }  
        }, this));  
  
        //首页单击触发  
        if (this._first.length) {  
            this._first.bind("click.jPages", this.bind(function () {  
                if (this.validNewPage(1)) {  
                    this._clicked = true;  
                    this.paginate(1);  
                }  
            }, this));  
        }  
  
        //上一页单机触发  
        if (this._previous.length) {  
            this._previous.bind("click.jPages", this.bind(function () {  
                var newPage = this._currentPageNum - 1;  
                if (this.validNewPage(newPage)) {  
                    this._clicked = true;  
                    this.paginate(newPage);  
                }  
            }, this));  
        }  
  
        // 下一页单机触发  
        if (this._next.length) {  
            this._next.bind("click.jPages", this.bind(function () {  
                var newPage = this._currentPageNum + 1;  
                if (this.validNewPage(newPage)) {  
                    this._clicked = true;  
                    this.paginate(newPage);  
                }  
            }, this));  
        }  
  
        //尾页单机触发  
        if (this._last.length) {  
            this._last.bind("click.jPages", this.bind(function () {  
                if (this.validNewPage(this._numPages)) {  
                    this._clicked = true;  
                    this.paginate(this._numPages);  
                }  
            }, this));  
        }  
  
    };  
  
    Plugin.prototype.disableNavSelection = function (element) {  
        if (typeof element.onselectstart != "undefined") {  
            element.onselectstart = function () {  
                return false;  
            };  
        } else if (typeof element.style.MozUserSelect != "undefined") {  
            element.style.MozUserSelect = "none";  
        } else {  
            element.onmousedown = function () {  
                return false;  
            };  
        }  
    };  
  
  
    Plugin.prototype.getNewPage = function (nav, target) {  
        if (target.is(nav.currentPage)) return this._currentPageNum;  
        if (target.is(nav.pages)) return nav.pages.index(target) + 1;  
        if (target.is(nav.first)) return 1;  
        if (target.is(nav.last)) return this._numPages;  
        if (target.is(nav.previous)) return nav.pages.index(nav.currentPage);  
        if (target.is(nav.next)) return nav.pages.index(nav.currentPage) + 2;  
    };  
  
    Plugin.prototype.validNewPage = function (newPage) {  
        return newPage !== this._currentPageNum && newPage > 0 && newPage <= this._numPages ?  
            true : false;  
    };  
  
    Plugin.prototype.paginate = function (page) {  
        var pageInterval;  
        pageInterval = this.updatePages(page);  
        this._currentPageNum = page;  
        if ($.isFunction(this.options.callback)) {  
            this.callback(page, pageInterval);  
        }  
        this.updatePause();  
    };  
  
  
    Plugin.prototype.updatePages = function (page) {  
        var interval, index, nav;  
  
        interval = this.getInterval(page);  
  
        for (index in this._nav) {  
            if (this._nav.hasOwnProperty(index)) {  
                nav = this._nav[index];  
                this.updateBtns(nav, page);  
                this.updateCurrentPage(nav, page);  
                this.updatePagesShowing(nav, interval);  
                this.updateBreaks(nav, interval);  
            }  
        }  
  
        return interval;  
    };  
  
    Plugin.prototype.getInterval = function (page) {  
        var neHalf, upperLimit, start, end;  
  
        neHalf = Math.ceil(this.options.midRange / 2);  
        upperLimit = this._numPages - this.options.midRange;  
        start = page > neHalf ? Math.max(Math.min(page - neHalf, upperLimit), 0) : 0;  
        end = page > neHalf ? Math.min(page + neHalf - (this.options.midRange % 2 > 0 ? 1 : 0), this._numPages) : Math.min(this.options.midRange, this._numPages);  
  
        return { start: start, end: end };  
    };  
  
    Plugin.prototype.updateBtns = function (nav, page) {  
  
        if (page === 1) {  
            nav.first.addClass("jp-disabled");  
            nav.previous.addClass("jp-disabled");  
        }  
  
        if (page === this._numPages) {  
            nav.next.addClass("jp-disabled");  
            nav.last.addClass("jp-disabled");  
        }  
  
        if (this._currentPageNum === 1 && page > 1) {  
            nav.first.removeClass("jp-disabled");  
            nav.previous.removeClass("jp-disabled");  
        }  
  
        if (this._currentPageNum === this._numPages && page < this._numPages) {  
            nav.next.removeClass("jp-disabled");  
            nav.last.removeClass("jp-disabled");  
        }  
  
    };  
  
    Plugin.prototype.updateCurrentPage = function (nav, page) {  
  
        nav.currentPage.removeClass("jp-current");  
        nav.currentPage = nav.pages.eq(page - 1).addClass("jp-current");  
  
    };  
  
    Plugin.prototype.updatePagesShowing = function (nav, interval) {  
        var newRange = nav.pages.slice(interval.start, interval.end).not(nav.permPages);  
  
        nav.pagesShowing.not(newRange).addClass("jp-hidden");  
        newRange.not(nav.pagesShowing).removeClass("jp-hidden");  
  
        nav.pagesShowing = newRange;  
  
    };  
  
    Plugin.prototype.updateBreaks = function (nav, interval) {  
  
        if (interval.start > this.options.startRange || (this.options.startRange === 0 && interval.start > 0)) {  
            nav.fstBreak.removeClass("jp-hidden");  
        } else {  
            nav.fstBreak.addClass("jp-hidden");  
        }  
  
        if (interval.end < this._numPages - this.options.endRange) {  
            nav.lstBreak.removeClass("jp-hidden");  
        } else {  
            nav.lstBreak.addClass("jp-hidden");  
        }  
  
    };  
  
    Plugin.prototype.callback = function (page, pageInterval) {  
        var pages = {  
            current: page, //当前是第几页  
            interval: pageInterval,  
            count: this._numPages, //总页数  
            everyNum: this.options.perPage //每页数据量  
        };  
  
        pages.interval.start = pages.interval.start + 1;  
  
        this.options.callback(pages);  
    };  
  
    Plugin.prototype.updatePause = function () {  
        if (this.options.pause && this._numPages > 1) {  
            clearTimeout(this._pause);  
            if (this.options.clickStop && this._clicked) {  
                return;  
            } else {  
                this._pause = setTimeout(this.bind(function () {  
                    this.paginate(this._currentPageNum !== this._numPages ? this._currentPageNum + 1 : 1);  
                }, this), this.options.pause);  
            }  
        }  
    };  
  
    Plugin.prototype.setMinHeight = function () {  
        if (this.options.minHeight && !this._container.is("table, tbody")) {  
            setTimeout(this.bind(function () {  
                this._container.css({  
                    "min-height": this._container.css("height")  
                });  
            }, this), 1000);  
        }  
    };  
  
    Plugin.prototype.bind = function (fn, me) {  
        return function () {  
            return fn.apply(me, arguments);  
        };  
    };  
  
  
  
  
})(jQuery, window, document);  