/*
Details Element Polyfill 2.0.0
Copyright © 2017 Javan Makhmali
 */
(function () { }).call(this),
    function () {
    if (document.querySelector('body').getAttribute('class') && document.querySelector('body').getAttribute('class').indexOf('on-page-editor') > -1) {
            return;
        }
        var t, e, n, r, u, o, i, a, s, l, c, d;
        l = {
            element: function () {
                var t, e, n, r, u;
                return e = document.createElement("details"), "open" in e ? (e.innerHTML = "<summary>a</summary>b", e.setAttribute("style", "position: absolute; left: -9999px"), r = null != (u = document.body) ? u : document.documentElement, r.appendChild(e), t = e.offsetHeight, e.open = !0, n = e.offsetHeight, r.removeChild(e), t !== n) : !1
            }(),
            toggleEvent: function () {
                var t;
                return t = document.createElement("details"), "ontoggle" in t
            }()
        }, l.element && l.toggleEvent || (i = function () {
            return document.head.insertAdjacentHTML("afterbegin", '<style>@charset"UTF-8";details:not([open])>*:not(summary){display:none;}details>summary{display:block;}details>summary::before{content:"\u25ba";padding-right:0.3rem;font-size:0.6rem;cursor:default;}details[open]>summary::before{content:"\u25bc";}</style>')
        }, o = function () {
            var t, e, n, r, u;
            return t = document.createElement("details").constructor.prototype, r = t.setAttribute, n = t.removeAttribute, u = null != (e = Object.getOwnPropertyDescriptor(t, "open")) ? e.set : void 0, Object.defineProperties(t, {
                open: {
                    set: function (t) {
                        return "DETAILS" === this.tagName ? (t ? this.setAttribute("open", "") : this.removeAttribute("open"), t) : null != u ? u.call(this, t) : void 0
                    }
                },
                setAttribute: {
                    value: function (t, e) {
                        return d(this, function (n) {
                            return function () {
                                return r.call(n, t, e)
                            }
                        }(this))
                    }
                },
                removeAttribute: {
                    value: function (t) {
                        return d(this, function (e) {
                            return function () {
                                return n.call(e, t)
                            }
                        }(this))
                    }
                }
            })
        }, a = function () {
            return r(function (t) {
                var e;
                return e = t.querySelector("summary"), t.hasAttribute("open") ? (t.removeAttribute("open"), e.setAttribute("aria-expanded", !1)) : (t.setAttribute("open", ""), e.setAttribute("aria-expanded", !0))
            })
        }, u = function () {
            var e, n, r, u, o;
            for (u = document.querySelectorAll("summary"), e = 0, n = u.length; n > e; e++) o = u[e], t(o);
            return "undefined" != typeof MutationObserver && null !== MutationObserver ? (r = new MutationObserver(function (e) {
                var n, r, u, i, a;
                for (i = [], r = 0, u = e.length; u > r; r++) n = e[r].addedNodes, i.push(function () {
                    var e, r, u;
                    for (u = [], e = 0, r = n.length; r > e; e++) a = n[e], "DETAILS" === a.tagName && (o = a.querySelector("summary")) ? u.push(t(o, a)) : u.push(void 0);
                    return u
                }());
                return i
            }), r.observe(document.documentElement, {
                subtree: !0,
                childList: !0
            })) : document.addEventListener("DOMNodeInserted", function (e) {
                return "SUMMARY" === e.target.tagName ? t(e.target) : void 0
            })
        }, t = function (t, e) {
            return null == e && (e = n(t, "DETAILS")), t.setAttribute("aria-expanded", e.hasAttribute("open")), t.hasAttribute("tabindex") || t.setAttribute("tabindex", "0"), t.hasAttribute("role") ? void 0 : t.setAttribute("role", "button")
        }, s = function () {
            var t;
            return "undefined" != typeof MutationObserver && null !== MutationObserver ? (t = new MutationObserver(function (t) {
                var e, n, r, u, o, i;
                for (o = [], n = 0, r = t.length; r > n; n++) u = t[n], i = u.target, e = u.attributeName, "DETAILS" === i.tagName && "open" === e ? o.push(c(i)) : o.push(void 0);
                return o
            }), t.observe(document.documentElement, {
                attributes: !0,
                subtree: !0
            })) : r(function (t) {
                var e;
                return e = t.getAttribute("open"), setTimeout(function () {
                    return t.getAttribute("open") !== e ? c(t) : void 0
                }, 1)
            })
        }, e = function (t) {
            return !(t.defaultPrevented || t.altKey || t.ctrlKey || t.metaKey || t.shiftKey || t.target.isContentEditable)
        }, r = function (t) {
            return addEventListener("click", function (r) {
                var u, o;
                return e(r) && r.which <= 1 && (u = n(r.target, "SUMMARY")) && "DETAILS" === (null != (o = u.parentElement) ? o.tagName : void 0) ? t(u.parentElement) : void 0
            }, !1), addEventListener("keydown", function (r) {
                var u, o, i;
                return e(r) && (13 === (o = r.keyCode) || 32 === o) && (u = n(r.target, "SUMMARY")) && "DETAILS" === (null != (i = u.parentElement) ? i.tagName : void 0) ? (t(u.parentElement), r.preventDefault()) : void 0
            }, !1)
        }, n = function () {
            return "function" == typeof Element.prototype.closest ? function (t, e) {
                return t.closest(e)
            } : function (t, e) {
                for (; t;) {
                    if (t.tagName === e) return t;
                    t = t.parentElement
                }
            }
        }(), c = function (t) {
            var e;
            return e = document.createEvent("Events"), e.initEvent("toggle", !0, !1), t.dispatchEvent(e)
        }, d = function (t, e) {
            var n, r;
            return n = t.getAttribute("open"), r = e(), t.getAttribute("open") !== n && c(t), r
        }, l.element || (i(), o(), a(), u()), l.element && !l.toggleEvent && s())
    }.call(this),
    function () { }.call(this);