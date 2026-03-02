// @module PacejetIntegration
define('PacejetIntegration.Helper', [
    'underscore'
], function PacejetIntegrationHelper(
    _
) {
    'use strict';

    var pacejetConfiguration = function pacejetConfiguration() {
        var config = {};
        var context = nlapiGetContext();

        config.location = {
            'Location': 'vertex'
        };

        config.lengthLimit = context.getSetting('SCRIPT', 'custscript_pacejet_item_length_limit');
        config.weightLimit = context.getSetting('SCRIPT', 'custscript_pacejet_total_weight_limit');
        config.shipItemsExcludeByWandL = context.getSetting('SCRIPT', 'custscript_pacejet_ship_items_limit_w_l');
        config.shipItemsExcludeByL = context.getSetting('SCRIPT', 'custscript_pacejet_ship_items_short_prod');
        config.willCallId = context.getSetting('SCRIPT', 'custscript_pacejet_will_call_id');
        config.customerFreightIds = context.getSetting('SCRIPT', 'custscript_pacejet_freight_values');
        config.notificationEmail = context.getSetting('SCRIPT', 'custscript_pacejet_email_errors');

        return config;
    };

    var isFreightCustomer = function isFreightCustomer(id) {
        return _.find(pacejetConfiguration().customerFreightIds.split(','), function find(elemId) {
            return id === elemId;
        });
    };

    var shippingAddress = function shippingAddress() {
        var shipAddress;
        var destination = null;

        // if we are logged in and there is shipaddress in the order, then format and return the address.
        if (nlapiGetWebContainer().getShoppingSession().isLoggedIn2()) {
            shipAddress = nlapiGetWebContainer().getShoppingSession().getOrder().getShippingAddress();

            if (shipAddress) {
                if (!shipAddress.state) {
                    shipAddress.state = nlapiGetContext().getSessionObject('PACEJET_TEMPORAL_STATE');
                }
                if (!shipAddress.city) {
                    shipAddress.city = nlapiGetContext().getSessionObject('PACEJET_TEMPORAL_CITY');
                }
                if (!shipAddress.addr1) {
                    shipAddress.addr1 = nlapiGetContext().getSessionObject('PACEJET_TEMPORAL_ADDR1');
                }
                // map NetSuite address fields to Pacejet fields
                destination = {
                    destination: {
                        'CompanyName': shipAddress.company || '',
                        'Address1': shipAddress.addr1,
                        'Address2': shipAddress.addr2,
                        'City': shipAddress.city,
                        'StateOrProvinceCode': shipAddress.state,
                        'PostalCode': shipAddress.zip,
                        'CountryCode': shipAddress.country,
                        'ContactName': shipAddress.addressee,
                        'Email': '',
                        'Phone': shipAddress.phone,
                        'Residential': shipAddress.isresidential === 'T' ? 'true' : 'false'
                    }
                };
            }
        }

        return destination;
    };

    var packageDetailsList = function packageDetailsList(order, data) {
        var items = order.getItems() || [];
        var productDetails = {};
        var productDetailsList = [];

        _.each(items, function each(item) {
            if (data.lines.indexOf(item.orderitemid) >= 0) {
                productDetails = {
                    'Quantity': {
                        'Units': 'EA',
                        'Value': item.quantity
                    },

                    'Price': {
                        'Amount': item.amount / item.quantity
                    },

                    'Number': item.itemid,

                    'Weight': item.weight,

                    'Dimensions': {
                        'Length': item.custitem_pacejet_item_length,
                        'Width': item.custitem_pacejet_item_width,
                        'Height': item.custitem_pacejet_item_height,
                        'Units': 'IN'
                    },
                    'AutoPack': 'true'
                };
                productDetailsList.push(productDetails);
            }
        });

        return {
            PackageDetailsList: [{
                ProductDetailsList: productDetailsList
            }]
        };
    };

    var getRelatedMethods = function getRelatedMethods() {
        var pacejetThirdPartyRec;
        var profileShipping = [];
        var obj = {};
        var relatedShippingCols;
        var relatedShippingMethods;
        var relatedMethods;
        var carrier;
        var acc;
        var result = {};
        var i;

        try {
            pacejetThirdPartyRec = nlapiSearchRecord('customrecord_pacejet_thirdparty',
                null,
                [['custrecord_pacejet_thirdparty_customer', 'anyof', nlapiGetUser()], 'AND', ['isinactive', 'is', 'F']],
                [new nlobjSearchColumn('name'),
                    new nlobjSearchColumn('custrecord_pacejet_thirdparty_carrier'),
                    new nlobjSearchColumn('custrecord_pacejet_thirdparty_accountnum')]
            );

            result.allowedMethod = [];
            result.allowedMethodWithAccounts = {};

            if (pacejetThirdPartyRec) {
                profileShipping = [];
                obj = {};

                _.each(pacejetThirdPartyRec, function get(thirdPartyRecord) {
                    profileShipping.push(thirdPartyRecord.getValue('custrecord_pacejet_thirdparty_carrier'));
                    obj[thirdPartyRecord.getValue('custrecord_pacejet_thirdparty_carrier')] =
                        thirdPartyRecord.getValue('custrecord_pacejet_thirdparty_accountnum');
                });

                relatedShippingCols = [new nlobjSearchColumn('custrecord_shipping_carrier'), new nlobjSearchColumn('custrecord_related_methods')];

                relatedShippingMethods = nlapiSearchRecord('customrecord_related_shipping_methods', null,
                    [['isinactive', 'is', 'F'], 'AND', ['custrecord_shipping_carrier', 'anyof', profileShipping]], relatedShippingCols);

                if (relatedShippingMethods) {
                    _.each(relatedShippingMethods, function get(relatedShipMethod) {
                        relatedMethods = relatedShipMethod.getValue('custrecord_related_methods').split(',');
                        carrier = relatedShipMethod.getValue('custrecord_shipping_carrier');
                        acc = obj[carrier];

                        for (i = 0; i < relatedMethods.length; i++) {
                            result.allowedMethodWithAccounts[relatedMethods[i]] = acc;
                            result.allowedMethod.push(relatedMethods[i]);
                        }
                    });
                }
            }
        } catch (ex) {
            nlapiLogExecution('error', 'error in related method', ex);
        }

        return result;
    };

    var removeElementFromList = function removeElementFromList(list, id) {
        return _.reject(list, function removeMethods(method) {
            return method.internalid === id;
        });
    };

    var removeShipMethods = function removeShipMethods(shipItemsToRemove, shipMethods) {
        var auxShipMethods = shipMethods;
        _.each(shipItemsToRemove.split(','), function exclude(shipId) {
            auxShipMethods = removeElementFromList(auxShipMethods, shipId);
        });
        return auxShipMethods;
    };

    return {
        pacejetConfiguration: pacejetConfiguration,
        isFreightCustomer: isFreightCustomer,
        shippingAddress: shippingAddress,
        removeElementFromList: removeElementFromList,
        packageDetailsList: packageDetailsList,
        getRelatedMethods: getRelatedMethods,
        removeShipMethods: removeShipMethods
    };
});
