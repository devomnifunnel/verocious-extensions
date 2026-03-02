define('PacejetIntegration.Session.ServiceController', [
    'ServiceController'
], function PacejetIntegrationSessionServiceController(ServiceController) {
    'use strict';

    return ServiceController.extend({
        name: 'PacejetIntegration.ServiceController',

        options: {
            post: {
                checkLoggedInCheckout: true
            }
        },

        post: function post() {
            var success = false;

            if (this.data) {
                nlapiGetContext().setSessionObject('PACEJET_TEMPORAL_STATE', this.data.state || '');
                nlapiGetContext().setSessionObject('PACEJET_TEMPORAL_CITY', this.data.city || '');
                nlapiGetContext().setSessionObject('PACEJET_TEMPORAL_ADDR1', this.data.addr1 || '');
                success = true;
            }

            return { success: success };
        }
    });
});
