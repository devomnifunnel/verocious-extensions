/* globals getExtensionAssetsPath */
define('PacejetIntegration.Session.Model', [
    'SCModel',
    'Utils'
], function PacejetIntegrationSessionModelModule(
    SCModelComponent,
    Utils
) {
    'use strict';

    var SCModel = SCModelComponent.SCModel;

    function PacejetIntegrationSessionModel(attributes) {
        SCModel.call(this, attributes);

        this.urlRoot = function urlRoot() {
            return Utils.getAbsoluteUrl(
                getExtensionAssetsPath(
                    'services/PacejetIntegration.Session.Service.ss'
                )
            );
        };
    }

    PacejetIntegrationSessionModel.prototype = Object.create(SCModel.prototype);
    PacejetIntegrationSessionModel.prototype.constructor = PacejetIntegrationSessionModel;

    return PacejetIntegrationSessionModel;
});
