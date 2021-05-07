XA.component.playlist &&
    XA.component.playlist.initInstance &&
    (XA.component.playlist.initInstance = (function(func) {
        var beforeInitScript = function(component) {
            var replacer = XA.component.ireplacer;
            replacer.replaceIcon(component);
        };

        var afterInitScript = function() {};

        return function(component, prop) {
            try {
                beforeInitScript(component, prop);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e);
            }
            var answer = func.apply(this, [component, prop]);
            try {
                afterInitScript(component, prop);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.log(e);
            }

            return answer;
        };
    })(XA.component.playlist.initInstance, jQuery));
