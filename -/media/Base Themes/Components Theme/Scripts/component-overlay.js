/* global mejs:false */
/**
 * open content in overlay
 * @module overlay
 * @param  {jQuery} $ Instance of jQuery
 * @return {Object} List of overlay methods
 */
XA.component.overlay = function ($) {
    /**
    * This object stores all public api methods
    * @type {Object.<Methods>}
    * @memberOf module:overlay
    * */
    var api = {},
        href = window.location.href,
        host = location.host,
        label,
        overlayPlaceholder = false,
        marginTop = 100,
        focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]',
        firstTabStop,
        lastTabStop,
        overlayClickSource;
    /**
    * isPreviewMode check if page in preview mode
    * @memberOf module:overlay
    * @private
    * @returns {Boolean} is page in a preview mode
    */
    function isPreviewMode() {
        if (href.indexOf("sc_mode=preview") > -1) {
            return true;
        }
        var $hdPageMode = $('#hdPageMode');

        return $hdPageMode.length > 0 && $hdPageMode.attr('value') == 'preview';
    }
    /**
    * isEditMode check if page in edit mode
    * @memberOf module:overlay
    * @private
    * @returns {Boolean} is page in a edit mode
    */
    function isEditMode() {
        if (href.indexOf("sc_mode=edit") > -1) {
            return true;
        }
        var $hdPageMode = $('#hdPageMode');

        return $hdPageMode.length > 0 && $hdPageMode.attr('value') == 'edit';
    }
    /**
     * isOverlayPage check if "#wrapper" element has class "overlay-page"
     * @memberOf module:overlay
     * @private
     * @returns {Boolean} is #wrapper an overlay page
     */
    function isOverlayPage() {
        return $('#wrapper').hasClass('overlay-page');
    }
    /**
     * hasOverlayContent check if "overlay-source" 
     * element present on a page
     * @memberOf module:overlay
     * @private
     * @returns {Boolean} is overlay-source present on a page
     */
    function hasOverlayContent() {
        return $(".overlay-source").length;
    }
    /**
    * resizeOverlay resize overlay
    * @memberOf module:overlay
    * @param {jQuery<Object>} inner ".overlay-inner"
    * @param {jQuery<Object>} content (".component-content"),
    * @param {Object} options contains size of overlay 
    * @param {number} [options.width] width of overlay
    * @param {number} [options.height] height of overlay
    * @param {string} [options.percent] units of width and height
    * @alias module:overlay.resizeOverlay
    */
    api.resizeOverlay = function (inner, content, options) {
        var unit = "px";
        var css = {
            "width": "",
            "height": ""
        };
        var wh = $(window).height();

        if (options.percent) {
            unit = "%";
            inner.addClass("overlay-percent");
        } else {
            inner.removeClass("overlay-percent");
        }

        if (options.width) {
            css["width"] = options.width + unit;
        }
        if (options.height) {
            css["height"] = options.height + unit;
        }

        css["max-height"] = (wh - marginTop - 0.1 * wh) + "px";

        content.css(css);
    }
    /**
    * getUrlVariables get variables provided in overlay url
    * @memberOf module:overlay
    * @param {String} url url of overlay content
    * @private
    * @returns {Object} list of get parameters
    */
    function getUrlVariables(url) {
        var q = url.split('?')[1],
            vars = [],
            hash;

        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }

        return vars;
    }
    /**
    * getSize check if overlay has width or height in url 
    * and set up this values  
    * @memberOf module:overlay
    * @param {String} vars variables from url of overlay content
    * @private
    * @returns {Object} sizes of overlay
    */
    function getSize(vars) {
        var obj = {};

        if (vars["width"] !== null) {
            obj["width"] = vars["width"];
        }

        if (vars["height"] !== null) {
            obj["height"] = vars["height"];
        }

        return obj;
    }
    /**
    * checkInternal checks if overlay content is internal resource
    * @memberOf module:overlay
    * @param {String} url url of overlay content
    * @private
    * @returns {Boolean} true - content is internal| false - content is external
    */
    function checkInternal(url) {
        if (url.indexOf(host) > -1) {
            return true;
        }
        return false;
    }
    /**
    * checkImage checks if overlay content is an image
    * @memberOf module:overlay
    * @param {String} url url of overlay content
    * @private
    * @returns {Boolean} true - content is an image| false - content not an a image
    */
    function checkImage(url) {
        var ext = url.split("?")[0].split('.').pop();
        if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) > -1) {
            return true;
        }

        return false;
    }

    /**
    * loadOverlay creates overlay content and show it
    * @memberOf module:overlay
    * @param {String} url url of overlay
    * @param {jQuery<DOMElement>} overlay overlay DOMElement
    * @private
    */
    function loadOverlay(url, overlay) {
        var content = overlay.find(".overlay-inner"),
            overlayContent = overlay.find(".component-content"),
            vars = getUrlVariables(url),
            internalLink = checkInternal(url),
            overlaySize = getSize(vars),
            suffix;
        overlayContent.addClass('overlayFullWidth');
        content.removeAttr('style');
        if (internalLink) {
            if (checkImage(url)) {
                content.empty().append($("<img>", { src: url }));
                content.css(overlaySize);
                overlayContent.removeClass('overlayFullWidth');
                showOverlay(overlay);
            } else if (url.indexOf("overlaytype=iframe") > -1) {
                content.empty().append($("<iframe>", { src: url, style: "width: 100%; height: 100%" }));
                content.css(overlaySize);
                showOverlay(overlay);
            } else {
                if (isPreviewMode()) {
                    suffix = "cf_overlay=1";
                    url = url.replace("sitecore/shell/");
                    url += (url.indexOf("?") == -1 ? "?" : "&") + suffix;
                }

                $.get(url, function (data) {
                    var overlayData = $(data).before().first();

                    api.resizeOverlay(content, overlayContent, {
                        width: overlayData.attr("data-width"),
                        height: overlayData.data("height"),
                        percent: overlayData.data("percent")
                    });

                    content.empty().append(data);
                    XA.init();
                    showOverlay(overlay);
                });
            }
        } else {
            if (checkImage(url)) {
                content.empty().append($("<img>", { src: url }));
            } else {
                content.empty().append($("<iframe >", { src: url, style: "width: 100%; height: 100%" }));
            }
            content.css(overlaySize);
            showOverlay(overlay);
        }

    }
    /**
    * preShowOverlay sets opacity to 1 and shows overlay
    * @memberOf module:overlay
    * @param {jQuery<DOMElement>} overlay overlay DOMElement
    * @private
    */
    function preShowOverlay(overlay) {
        overlay.css({
            "opacity": 1
        }).show();
    }
    /**
    * showOverlay makes overlay visible
    * @memberOf module:overlay
    * @param {jQuery<DOMElement>} overlay overlay DOMElement
    * @private
    * @returns {jQuery<DOMElement>} overlay overlay DOMElement
    */

    function showOverlay(overlay) {
        var close, content;

        overlay.show().animate({
            opacity: 1
        });

        // hides wrapper data from screen readers
        $("#wrapper").addClass("aria-hidden");

        overlayClickSource = document.activeElement;

        close = overlay.find(".overlay-close");
        setTimeout(function () { close.focus(); }, 0);

        content = overlay.find(".overlay-inner");
        content.blur(function (args) {
            args.preventDefault();
            args.stopPropagation();
            setTimeout(function () { close.focus() }, 0);
        });

        // Finds all focusable children
        var focusableElements = content.find(focusableElementsString);

        // Converts NodeList to Array
        focusableElements = Array.prototype.slice.call(focusableElements);
        firstTabStop = focusableElements[0];
        lastTabStop = focusableElements[focusableElements.length - 1];

        // Focus first
        firstTabStop.focus();

        if (isPreviewMode() || isEditMode()) {
            overlay.find('> .component-content').css({
                top: 200,
                transform: 'translate(-50%, 0)'
            });
        }

        return overlay;
    }
    /**
     * hideOverlay hide overlay
     * @memberOf module:overlay
     * @private
     */
    function hideOverlay(overlay) {
        $("#wrapper").removeClass("aria-hidden");
        var content = overlay.find(".overlay-inner");

        overlay.animate({ opacity: 0 },
            function () {
                overlay.hide();
                content.empty();

                if (mejs) {
                    for (var p in mejs.players) {
                        if ($("#" + mejs.players[p].id).parents(".overlay").length == 1) {
                            $("#" + mejs.players[p].id + ' video').attr('src', '');
                            mejs.players[p].remove();
                            mejs.players.splice(p, 1);
                        }
                    }
                }
            }
        );

        return overlay;
    }
    /**
     * createOverlay creates a markup for overlay and appends it to body 
     * @memberOf module:overlay
     * @private
     */
    function createOverlay() {
        var overlay = "<div class='overlay-wrapper'>" +
            "<div class='overlay component'>" +
            "<div class='component-content' role='dialog'>" +
            "<div class='overlay-inner'></div>" +
            "<div class='overlay-close' role='button' aria-label='Close dialog'></div>" +
            "</div>" +
            "</div>" +
            "</div>";

        $("body").append(overlay);
    }
    /**
    * initInstance method prevent event propagation and call 
    * ["preShowOverlay"]{@link module:overlay.preShowOverlay} and
    * ["loadOverlay"]{@link module:overlay.loadOverlay} methods
    * @memberOf module:overlay
    * @method
    * @param {jQuery} component Root DOM element of archive component wrapped by jQuery
    * @param {jQuery<DOMElement>} overlay overlay DOMElement
    * @param {jQuery<DOMElement>} overlayContent overlay content DOMElement 
    * @alias module:overlay.initInstance
    */
    api.initInstance = function (component, overlay, overlayContent) {
        component.on("click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();
                preShowOverlay(overlay, overlayContent);

                var uri = this.href;
                loadOverlay(uri, overlay);

                var href = this.href.split('/');
                for (var i = 0; i <= href.length; i++) {
                    label = href.pop();
                    if (label.length == 0) {
                        continue;
                    }
                    break;
                }
            });
        $(this).addClass("initialized");
    }
    /**
    * init method makes preparation for overlay content, binds events
    * for proper work of overlay and
    * calls in a loop for each instance of overlay
    * [".initInstance"]{@link module:Accordion.initInstance} method.
    * @memberOf module:overlay
    * @alias module:overlay.init
    */
    api.init = function () {
        var overlayContent,
            overlaySource,
            overlayInner,
            overlayCloseLink,
            closeAction,
            page,
            overlay,
            content;

        if (!overlayPlaceholder && hasOverlayContent()) {
            createOverlay();
        }

        if (isOverlayPage()) {

            page = $(".overlay-page");
            overlayContent = page.children(".component-content");
            overlay = $("#spnOverlay");
            content = overlayContent.children(".overlay-inner");

            api.resizeOverlay(content, overlayContent, {
                width: overlayContent.data("width"),
                height: overlayContent.data("height"),
                percent: overlayContent.data("percent")
            });
            overlayContent.on("click", function (event) {
                event.stopPropagation();
            });
            page.on("click", function () {
                if (isPreviewMode()) {
                    location.href = location.href.replace("sc_mode=preview", "sc_mode=edit");
                }
            });
        }
        overlay = $(".overlay-wrapper > .overlay");
        overlayContent = overlay.find(".component-content");
        overlaySource = $(".overlay-source a:not(.initialized), a.overlay-source:not(.initialized)");
        overlayInner = $(".overlay-inner");
        overlayCloseLink = overlay.find(".overlay-close");

        closeAction = function () {
            hideOverlay(overlay);
            overlayInner.off("blur");
            setTimeout(function () {
                if (overlayClickSource != null) {
                    overlayClickSource.focus();
                }
            }, 0);
        };

        if (!overlayPlaceholder) {
            overlayContent.on("click", function (event) {
                event.stopPropagation();
            });

            overlay.on("click", function () {
                closeAction();
            });

            overlayCloseLink.on("click", function (args) {
                args.preventDefault();
                closeAction();
            });

            $("body").keydown(function (e) {
                // Check for TAB key press
                if (e.keyCode === 9) {
                    // SHIFT + TAB
                    if (e.shiftKey) {
                        if (document.activeElement === firstTabStop) {
                            e.preventDefault();
                            lastTabStop.focus();
                        }

                        // TAB
                    } else if (document.activeElement === lastTabStop) {
                        e.preventDefault();
                        // firstTabStop.attr('tabindex', 0);
                        firstTabStop.focus();
                    }
                }

                // ESCAPE
                if (e.keyCode === 27) {
                    e.stopPropagation();
                    closeAction();
                }
            });

            $(window).on("resize", function () {
                var height = $(window).height();
                height = height - marginTop - 0.1 * height;
                overlayContent.css("max-height", height + "px");
            });

            overlayPlaceholder = true;
        }


        overlaySource.each(function () {
            api.initInstance($(this), overlay, overlayContent);
        });


    };

    return api;

}(jQuery);

XA.register("overlay", XA.component.overlay);


[].forEach.call(document.querySelectorAll('.search-results.overlay-source'), function (e) {
    XA.dom.observeDOM(e, function () { XA.component.overlay.init(); });
});