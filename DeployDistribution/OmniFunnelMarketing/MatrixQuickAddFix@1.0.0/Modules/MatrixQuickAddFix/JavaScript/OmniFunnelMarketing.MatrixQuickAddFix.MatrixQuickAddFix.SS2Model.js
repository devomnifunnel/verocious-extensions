// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/MatrixQuickAddFix/SuiteScript2/MatrixQuickAddFix.Service.ss"
            ),
            true
        )
});
});
