// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/MatrixQuickAddFixAustenitex/SuiteScript2/MatrixQuickAddFixAustenitex.Service.ss"
            ),
            true
        )
});
});
