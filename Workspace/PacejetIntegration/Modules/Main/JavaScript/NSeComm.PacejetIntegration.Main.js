/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define('NSeComm.PacejetIntegration.Main', [
    'PacejetIntegration.Session.Model',

    'jQuery',
    'underscore',

    'OrderWizard.Module.CleanShipMethod'
], function NSeCommPacejetIntegrationMain(
    PacejetIntegrationSessionModel,

    jQuery,
    _
) {
    'use strict';

    return {
        mountToApp: function mountToApp(container) {
            var checkout = container.getComponent('Checkout');
            var pacejetTemporalStateModel = new PacejetIntegrationSessionModel();

            if (checkout) {
                checkout.addToViewContextDefinition('OrderWizard.Module.Shipmethod', 'shippingMethods', 'array', function refreshDeliveryDates(context) {
                    // sort ship methods by rate
                    return _.sortBy(context.shippingMethods, function sortByRate(shipMethod) {
                        return parseFloat(shipMethod.rate_formatted.substring(1).replace(/[!.,]/g, '')) || 0;
                    });
                });

                checkout.addToViewContextDefinition('OrderWizard.Module.CartSummary', 'model', 'object', function displayTaxLine(context) {
                    context.model.summary.taxtotal = true;

                    return context.model;
                });

                checkout.addModuleToStep({
                    step_url: 'shipping/address',
                    module: {
                        id: 'remove_shipmethod',
                        index: 0,
                        classname: 'OrderWizard.Module.CleanShipMethod'
                    }
                });

                jQuery('body').on('change', '#shipaddress-state[name="state"]', function onStateChange(e) {
                    pacejetTemporalStateModel.set('state', e.target.value);
                    pacejetTemporalStateModel.save();
                });

                jQuery('body').on('change', '#shipaddresscountry[name="country"]', function onCountryChange() {
                    pacejetTemporalStateModel.set('state', '');
                    pacejetTemporalStateModel.set('city', '');
                    pacejetTemporalStateModel.set('addr1', '');
                    pacejetTemporalStateModel.save();
                });
                jQuery('body').on('change', '#shipaddress-city[name="city"]', function onCityChange(e) {
                    pacejetTemporalStateModel.set('city', e.target.value);
                    pacejetTemporalStateModel.save();
                });
                jQuery('body').on('change', '#shipaddress-addr1[name="addr1"]', function onCityChange(e) {
                    pacejetTemporalStateModel.set('addr1', e.target.value);
                    pacejetTemporalStateModel.save();
                });
            }
        }
    };
});
