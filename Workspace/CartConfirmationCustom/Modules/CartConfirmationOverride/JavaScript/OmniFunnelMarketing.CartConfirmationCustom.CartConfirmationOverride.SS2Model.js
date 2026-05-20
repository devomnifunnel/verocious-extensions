// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/CartConfirmationOverride/SuiteScript2/CartConfirmationOverride.Service.ss"
            ),
            true
        )
});
});
