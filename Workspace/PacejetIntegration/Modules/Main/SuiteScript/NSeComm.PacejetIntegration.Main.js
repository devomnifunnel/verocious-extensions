// @module PacejetIntegration
define('NSeComm.PacejetIntegration.Main', [
    'Application',
    'PacejetIntegration'
], function NSeCommPacejetIntegrationMain(
    Application,
    PacejetIntegration
) {
    'use strict';

    var updatePacejetInformation = function updatePacejetInformation(request) {
        var url = request.getSSPURL();
        // returns true if address is changed or setted, or it is on checkout page, or after user is login
        return (
            nlapiGetWebContainer().getShoppingSession().isLoggedIn2() &&
            (url.indexOf('internalid=cart') > -1 ||
                url.indexOf('Touchpoint=checkout') > -1 ||
                url.indexOf('Account.Login.Service.ss') > -1)
        );
    };

    Application.on('after:LiveOrder.get', function afterLiveOrderGet(model, result) {
        if (updatePacejetInformation(request)) {
            PacejetIntegration.updateResult(result);
        }
    });

    Application.on('after:LiveOrder.update', function afterLiveOrderUpdate(model, result, data) {
        if (updatePacejetInformation(request)) {
            PacejetIntegration.updateResult(data);
        }
    });
});
