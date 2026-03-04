// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/CookieConsentCLSFix/SuiteScript2/CookieConsentCLSFix.Service.ss"
            ),
            true
        )
});
});
