XA.component.ireplacer = (function($) {
    var api = {},
        emptyImageSelector = ".field-moviethumbnail a";

    var getComponentName = function($emptyImage) {
        var componentRoot = $emptyImage.closest(".component");
        return componentRoot.attr("class").split(" ")[1];
    };

    var getImageContent = function(componentName) {
        var div = document.createElement("div");
        div.className = ["sxa-icon", "sxa-icon-" + componentName].join(" ");
        return div;
    };

    var addNewIcon = function($emptyImage) {
        var parent = $emptyImage.parent(),
            componentName = getComponentName($emptyImage),
            newIcon = getImageContent(componentName);
        parent.append(newIcon);
    };
    api.replaceIcon = function(elem) {
        var $emptyImage = $(elem).find(emptyImageSelector);
        addNewIcon($emptyImage);
    };

    return api;
})(jQuery, _);

XA.register("ireplacer", XA.component.ireplacer);
