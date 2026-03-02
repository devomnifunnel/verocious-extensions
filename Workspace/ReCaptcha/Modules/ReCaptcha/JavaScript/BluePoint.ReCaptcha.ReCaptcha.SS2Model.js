// Model.js
// -----------------------
// @module Case
define("BluePoint.ReCaptcha.ReCaptcha.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/ReCaptcha/SuiteScript2/ReCaptcha.Service.ss"
            ),
            true
        )
    });
});
