// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({

        
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "services/CookieConsentCLSFix.Service.ss"
            )
        )
        
});
});
