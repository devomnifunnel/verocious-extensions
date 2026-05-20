// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/BillingAddressOptimization/SuiteScript2/BillingAddressOptimization.Service.ss"
            ),
            true
        )
});
});
