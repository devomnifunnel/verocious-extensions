// @module PacejetIntegration
define('PacejetIntegration.Helper', [
    'underscore'
], function PacejetIntegrationHelper(
    _
) {
    'use strict';

    // ZIP-to-state lookup table built from USPS 3-digit prefix assignments.
    // Used as fallback when the order's shipping address is missing a state
    // (common on SCS OPC guest checkout due to timing issues).
    var PREFIX_TO_STATE = (function () {
        var map = {};
        function assign(start, end, state) {
            for (var i = start; i <= end; i++) {
                map[('000' + i).slice(-3)] = state;
            }
        }
        assign(6, 9, 'PR');
        assign(10, 27, 'MA'); assign(28, 29, 'RI'); assign(30, 38, 'NH');
        assign(39, 49, 'ME'); assign(50, 59, 'VT'); assign(60, 69, 'CT');
        assign(70, 89, 'NJ'); assign(90, 98, 'AE');
        assign(100, 149, 'NY'); map['005'] = 'NY';
        assign(150, 196, 'PA'); assign(197, 199, 'DE');
        assign(200, 205, 'DC'); assign(206, 219, 'MD'); assign(220, 246, 'VA');
        assign(247, 268, 'WV'); assign(270, 289, 'NC'); assign(290, 299, 'SC');
        assign(300, 319, 'GA'); assign(398, 399, 'GA');
        assign(320, 349, 'FL'); assign(350, 369, 'AL');
        assign(370, 385, 'TN'); assign(386, 397, 'MS');
        assign(400, 427, 'KY'); assign(430, 459, 'OH');
        assign(460, 479, 'IN'); assign(480, 499, 'MI');
        assign(500, 528, 'IA'); assign(530, 549, 'WI');
        assign(550, 567, 'MN'); assign(570, 577, 'SD');
        assign(580, 588, 'ND'); assign(590, 599, 'MT');
        assign(600, 629, 'IL'); assign(630, 658, 'MO');
        assign(660, 679, 'KS'); assign(680, 693, 'NE');
        assign(700, 714, 'LA'); assign(716, 729, 'AR');
        assign(730, 749, 'OK'); assign(750, 799, 'TX'); assign(885, 885, 'TX');
        assign(800, 816, 'CO'); assign(820, 831, 'WY');
        assign(832, 838, 'ID'); assign(840, 847, 'UT');
        assign(850, 865, 'AZ'); assign(870, 884, 'NM');
        assign(889, 898, 'NV'); assign(900, 961, 'CA');
        assign(967, 968, 'HI'); assign(969, 969, 'GU');
        assign(970, 979, 'OR'); assign(980, 994, 'WA'); assign(995, 999, 'AK');
        return map;
    })();

    function zipToState(zip) {
        if (!zip) return '';
        var s = String(zip).trim().split('-')[0];
        if (!/^\d{3,5}$/.test(s)) return '';
        s = ('00000' + s).slice(-5);
        return PREFIX_TO_STATE[s.substring(0, 3)] || '';
    }

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

                // Fallback: derive state from zip code if still missing.
                // This eliminates the race condition on SCS OPC where the
                // temporal session hasn't been populated yet.
                if (!shipAddress.state && shipAddress.zip) {
                    shipAddress.state = zipToState(shipAddress.zip);
                    if (shipAddress.state) {
                        nlapiLogExecution('error', '[PacejetAddress] State derived from zip',
                            'zip=' + shipAddress.zip + ' state=' + shipAddress.state);
                    }
                }

                nlapiLogExecution('error', '[PacejetAddress] Address being sent to Pacejet',
                    'state=' + (shipAddress.state || 'MISSING') +
                    ' city=' + (shipAddress.city || 'MISSING') +
                    ' zip=' + (shipAddress.zip || 'MISSING') +
                    ' addr1=' + (shipAddress.addr1 || 'MISSING'));

                // map NetSuite address fields to Pacejet fields
                destination = {
                    destination: {
                        'CompanyName': shipAddress.company || '',
                        'Address1': shipAddress.addr1 || '',
                        'Address2': shipAddress.addr2 || '',
                        'City': shipAddress.city || '',
                        'StateOrProvinceCode': shipAddress.state || '',
                        'PostalCode': shipAddress.zip,
                        'CountryCode': shipAddress.country,
                        'ContactName': shipAddress.addressee || '',
                        'Email': '',
                        'Phone': shipAddress.phone || '',
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
          // SuiteCommerce normalizes checkbox values to boolean true/false
          // (or the string equivalents). Accept either, plus the SuiteScript
          // 'T'/'F' form just in case. Field must always be sent so the
          // Pacejet automation EQ false condition can match for parcel items.
          var rawLtl = item.custitemcustitem_pacejet_item_ltl;
          var mustShipLtl = (rawLtl === true || rawLtl === 'true' || rawLtl ===
  'T')
              ? 'true'
              : 'false';
  
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
                  'Units': 'IN'
              },  
              'AutoPack': 'true',
              'CustomFields': [{
                  'Name': 'custitemcustitem_pacejet_item_ltl',
                  'Value': mustShipLtl
              }]  
          };  
          
          nlapiLogExecution('error', '[DBG][LTL] item=' + item.itemid,
              'custitemcustitem_pacejet_item_ltl raw=' +
  item.custitemcustitem_pacejet_item_ltl
              + ' sent=' + mustShipLtl);
              
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
