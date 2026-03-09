// @module PacejetIntegration
define('PacejetIntegration', [
    'PacejetIntegration.Pacejet',
    'PacejetIntegration.Helper',
    'Utils',
    'underscore'
],
function PacejetIntegration(
    PacejetIntegrationPacejet,
    Helper,
    Utils,
    _
) {
    'use strict';

    function addDays(shipMethods) {
        return shipMethods.map(function defineDayWord(shipmethod) {
            var day = shipmethod.transitTime === 1 ? 'Day' : 'Days';
            var name = shipmethod.transitTime ? shipmethod.name + ' ' + shipmethod.transitTime + ' ' + day : shipmethod.name;

            var result = {
                name: name,
                rate_formatted: shipmethod.rate_formatted,
                rate: shipmethod.rate,
                freerate: !(!shipmethod.rate),
                internalid: shipmethod.internalid,
                accountNumber: shipmethod.accountNumber,
                transitTime: shipmethod.transitTime
            };

            // VMS Free Shipping: pass through free shipping properties
            if (shipmethod.isFreeShipping) {
                result.isFreeShipping = true;
                result.originalRate = shipmethod.originalRate;
            }

            return result;
        });
    }

    function setOrderFields(order, totalShipping) {
        var customerCustomFields = nlapiGetWebContainer().getShoppingSession().getCustomer().getCustomFieldValues();
        var pacejetFreightTerm = _.find(customerCustomFields, function geFreightTerm(field) {
            return (field.name === 'custentity_pacejet_freight_term_override');
        });

        if (pacejetFreightTerm && Helper.isFreightCustomer(pacejetFreightTerm.value)) {
            order.setCustomFieldValues({
                'custbody_pacejet_freight_terms': Helper.isFreightCustomer(pacejetFreightTerm.value)
            });
        }

        order.setCustomFieldValues({
            'custbody_pacejet_shipping_price_hidden': String(totalShipping)
        });
    }

    return {
        updateResult: function updateResult(results) {
            var order;
            var totalShipping = 0;
            var linesIds = [];
            var packageMethod;
            var pkg;
            var pacejetConfig = Helper.pacejetConfiguration();

            try {
                if (results.lines.length === 0) {
                    return results;
                }

                order = nlapiGetWebContainer().getShoppingSession().getOrder();

                _.each(results.lines, function each(line) {
                    linesIds.push(line.internalid);
                });

                pkg = {
                    address: results.shipaddress,
                    method: results.shipmethod,
                    lines: linesIds
                };

                packageMethod = PacejetIntegrationPacejet.getShippingRates(results, pkg, order);

                if (!packageMethod && results.shipmethod === pacejetConfig.willCallId) {
                    packageMethod = {};
                } else if (!_.isEmpty(packageMethod)) {
                    totalShipping += packageMethod.rate;
                }

                if (packageMethod && Utils.isCheckoutDomain(request) && nlapiGetWebContainer().getShoppingSession().isLoggedIn2()) {
                    setOrderFields(order, totalShipping);
                }

                results.shipmethods = addDays(results.shipmethods);

                results.pacejet = {
                    status: 'Prices updated.'
                };
            } catch (e) {
                nlapiLogExecution('error', 'Error on updateResult', JSON.stringify(e));
            }

            return results;
        }
    };
});
