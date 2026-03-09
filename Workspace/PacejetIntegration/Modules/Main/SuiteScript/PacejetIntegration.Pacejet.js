// @module PacejetIntegration
define('PacejetIntegration.Pacejet', [
    'PacejetIntegration.Helper',
    'Utils',
    'underscore'
],
function PacejetIntegrationPacejet(
    Helper,
    Utils,
    _
) {
    'use strict';

    function getConfiguration(request) {
        var url = nlapiResolveURL('SUITELET', 'customscript_pacejet_configurations', 'customdeploy_pacejet_configurations', true);
        var fullURL = url + '&request=' + encodeURIComponent(request);

        nlapiLogExecution('error', 'fullURL encoded', fullURL);

        return nlapiRequestURL(fullURL);
    }

    function hashCode(s) {
        var hash = 0;
        var i;
        var char;
        if (s.length === 0) return hash;
        for (i = 0; i < s.length; i++) {
            char = s.charCodeAt(i);
            hash = ((hash < 5) - hash) + char;
        }
        return hash;
    }

    function getPacejetResponse(request) {
        var maxTries = 3;
        var countTries;
        var pacejetResponse = null;
        var code;

        for (countTries = 0; countTries < maxTries; countTries++) {
            try {
                pacejetResponse = getConfiguration(JSON.stringify(request));
                code = parseInt(pacejetResponse.getCode(), 10) || 500;

                if (code >= 200 && code <= 299) {
                    nlapiLogExecution('error', 'Breaking on success response');
                    break;
                } else {
                    throw nlapiCreateError('PaceJet return error ' + code, '', true);
                }
            } catch (e) {
                nlapiLogExecution('error', 'PaceJet exception', e);
            }
        }
        return pacejetResponse.getBody();
    }

    function getRatesFromPacejet(shipaddress, order, results, data) {
        var ratingResultsList = [];
        var request = {};
        var pacejetConfig;
        var cache;
        var cacheObj;
        var pacejetResponse = null;
        var rates;
        var newCache;
        var body;

        try {
            pacejetConfig = Helper.pacejetConfiguration();

            _.extend(request, shipaddress, Helper.packageDetailsList(order, data), pacejetConfig.location);
            // cache requests since LiveOver.Model#get is called repeatedly through the checkout process
            cache = [];
            try {
                cache = JSON.parse(nlapiGetContext().getSessionObject('pjrcache'));
            } catch (ignore) {
                nlapiLogExecution('error', 'Error on get cache', JSON.stringify(ignore));
            }

            if (cache && cache.length > 0) {
                cacheObj = _.findWhere(cache, { h: hashCode(JSON.stringify(request)) });

                if (cacheObj && !_.isEmpty(cacheObj.r)) {
                    return cacheObj.r;
                }
            }

            pacejetResponse = getPacejetResponse(request);
            rates = JSON.parse(JSON.parse(pacejetResponse).body);
            ratingResultsList = rates.ratingResultsList;

            // filter out any rates that returned zero or are not in mapping table.
            ratingResultsList = _.filter(ratingResultsList, function removeZeros(rate) {
                return !!rate.consignorFreight;
            });

            // set rates cache
            newCache = { h: hashCode(JSON.stringify(request)), r: ratingResultsList };
            cache = cache || [];
            cache.push(newCache);

            nlapiGetContext().setSessionObject('pjrcache', JSON.stringify(cache));
        } catch (e) {
            nlapiGetContext().setSessionObject('pjrcache', null);

            body = 'Pacejet.js\nunexpected error: ' + e.toString() + '\nrequest = ' + JSON.stringify(request, null, 2);
            if (e instanceof nlobjError) {
                body = 'Pacejet.js\nsystem error: \ncode = ' + e.getCode() + '\ndetails = ' + e.getDetails()
                    + '\nrequest = ' + JSON.stringify(request, null, 2);
            }
            nlapiSendEmail(-5, Helper.pacejetConfiguration().notificationEmail, 'PaceJet /rates error', body, null, null, null, null, true);
        }

        return ratingResultsList;
    }

    function getLengthAndWeight(items) {
        var itemWeightArr = [];
        var currItemObj;
        var itemLenArr = [];
        var result = {};

        _.each(items, function getItemPacejetLength(item) {
            if (item.weight) {
                itemWeightArr.push(Number(item.weight));
            }
            if (item.custitem_pacejet_item_length) {
                currItemObj = {};
                currItemObj.itemInternalId = item.internalid;
                currItemObj.itemLength = Number(item.custitem_pacejet_item_length);
                itemLenArr.push(currItemObj);
            }
        });
        result.totalWeight = itemWeightArr.reduce(function reduce(a, b) {
            return a + b;
        }, 0);
        result.maxLen = _.max(itemLenArr, 'itemLength');
        result.maxWeight = itemWeightArr.length > 0
            ? Math.max.apply(null, itemWeightArr)
            : 0;

        return result;
    }

    function updateRates(shipMethods, newShipmethods, pacejetRates, data, relatedMethods) {
        var packageMethod;
        _.each(shipMethods, function filterByPacejetMethods(method) {
            var rate = _.findWhere(pacejetRates, { shipCodeXRef: method.internalid });
            if (rate && relatedMethods && relatedMethods.allowedMethod.indexOf(rate.shipCodeXRef) > -1) {
                method.rate = 0;
                method.rate_formatted = '';
                method.cost = 0;
                method.accountNumber = relatedMethods.allowedMethodWithAccounts[rate.shipCodeXRef];

                newShipmethods.push(method);

                if (data.method && method.internalid === data.method) {
                    method.transitTime = rate.transitTime;
                    // set the rate to the first line and zero any other lines
                    packageMethod = method;
                }
            } else if (rate) {
                method.rate = rate.consigneeFreight;
                method.rate_formatted = Utils.formatCurrency(rate.consigneeFreight);
                method.cost = rate.consignorFreight;
                method.transitTime = rate.transitTime;

                newShipmethods.push(method);

                if (data.method && method.internalid === data.method) {
                    packageMethod = method;
                }
            } else {
                method.name += '*';
            }
        });

        return packageMethod;
    }

    function addWillCallMethod(shipMethods, pacejetConfig, newShipmethods) {
        _.each(shipMethods, function willCall(method) {
            if (method.internalid === pacejetConfig.willCallId) {
                newShipmethods.push({
                    'internalid': method.internalid,
                    'name': method.name,
                    'shipcarrier': method.shipcarrier,
                    'rate': method.rate,
                    'rate_formatted': method.rate_formatted,
                    'cost': method.rate
                });
            }
        });
    }

    // VMS Free Shipping: only applies to VMS (site 3), not Austenitex (site 4)
    var FREE_SHIP_SITE_ID = '3';
    var FREE_SHIP_GROUND_IDS = ['3184', '59111', '172303'];
    var FREE_SHIP_MIN_SUBTOTAL = 500.00;
    var FREE_SHIP_MAX_LENGTH = 48.0;
    var FREE_SHIP_MAX_WEIGHT = 150.0;

    function evaluateFreeShipping(newShipmethods, orderSubtotal, itemsProperties) {
        var groundMethods;
        var cheapest;

        nlapiLogExecution('audit', '[FreeShip] Evaluating', 'subtotal=' + orderSubtotal
            + ' maxLen=' + (itemsProperties.maxLen ? itemsProperties.maxLen.itemLength : 'none')
            + ' maxWeight=' + itemsProperties.maxWeight);

        // Rule 1: order subtotal must exceed threshold
        if (!orderSubtotal || orderSubtotal <= FREE_SHIP_MIN_SUBTOTAL) {
            nlapiLogExecution('audit', '[FreeShip] SKIP', 'subtotal ' + orderSubtotal + ' <= ' + FREE_SHIP_MIN_SUBTOTAL);
            return;
        }

        // Rule 2: no item longer than length limit
        if (itemsProperties.maxLen && itemsProperties.maxLen.itemLength > FREE_SHIP_MAX_LENGTH) {
            nlapiLogExecution('audit', '[FreeShip] SKIP', 'item length ' + itemsProperties.maxLen.itemLength + ' > ' + FREE_SHIP_MAX_LENGTH);
            return;
        }

        // Rule 3: no individual item weight at or above weight limit
        if (itemsProperties.maxWeight >= FREE_SHIP_MAX_WEIGHT) {
            nlapiLogExecution('audit', '[FreeShip] SKIP', 'item weight ' + itemsProperties.maxWeight + ' >= ' + FREE_SHIP_MAX_WEIGHT);
            return;
        }

        // Find ground methods that have a positive rate from Pacejet
        groundMethods = _.filter(newShipmethods, function isGround(method) {
            return FREE_SHIP_GROUND_IDS.indexOf(method.internalid) > -1 && method.rate > 0;
        });

        if (groundMethods.length === 0) {
            nlapiLogExecution('audit', '[FreeShip] SKIP', 'no ground methods with positive rate');
            return;
        }

        // Pick the cheapest ground method and zero its rate
        cheapest = _.min(groundMethods, function byRate(method) {
            return method.rate;
        });

        cheapest.originalRate = cheapest.rate;
        cheapest.rate = 0;
        cheapest.rate_formatted = '$0.00';
        cheapest.isFreeShipping = true;

        nlapiLogExecution('audit', '[FreeShip] APPLIED', 'method=' + cheapest.internalid
            + ' name=' + cheapest.name + ' originalRate=' + cheapest.originalRate);
    }

    return {
        getShippingRates: function getShippingRates(results, data, order) {
            var shipAddress = Helper.shippingAddress(order, results, data);
            var pacejetRates = getRatesFromPacejet(shipAddress, order, results, data);
            var relatedMethods;
            var pacejetConfig = Helper.pacejetConfiguration();
            // get customers custom fields
            var customerCustomFields = nlapiGetWebContainer().getShoppingSession().getCustomer().getCustomFieldValues();
            var pacejetFreightTerm = _.find(customerCustomFields, function getFreight(field) {
                return (field.name === 'custentity_pacejet_freight_term_override');
            });
            var shipMethods = results.shipmethods;
            var packageMethod = {};
            var newShipmethods = [];
            var itemsProperties = getLengthAndWeight(order.getItems() || []);

            this.isCollectTerm = pacejetFreightTerm && Helper.isFreightCustomer(pacejetFreightTerm.value);

            if (itemsProperties.maxLen.itemLength < pacejetConfig.lengthLimit &&
                itemsProperties.totalWeight < pacejetConfig.weightLimit) {
                shipMethods = Helper.removeShipMethods(pacejetConfig.shipItemsExcludeByWandL, shipMethods);
            } else if (itemsProperties.maxLen.itemLength > pacejetConfig.lengthLimit) {
                shipMethods = Helper.removeShipMethods(pacejetConfig.shipItemsExcludeByL, shipMethods);
            }

            if (this.isCollectTerm) {
                relatedMethods = Helper.getRelatedMethods();
                // if term is collected and have methods
                if (relatedMethods.allowedMethod.length > 0) {
                    packageMethod = updateRates(shipMethods, newShipmethods, pacejetRates, data, relatedMethods);
                }
            } else {
                packageMethod = updateRates(shipMethods, newShipmethods, pacejetRates, data, false);
                addWillCallMethod(shipMethods, pacejetConfig, newShipmethods);

                // VMS Free Shipping: evaluate eligibility for prepaid (non collect) customers only
                try {
                    var currentSiteId = String(nlapiGetWebContainer().getShoppingSession().getSiteSettings(['siteid']).siteid);
                    nlapiLogExecution('audit', '[FreeShip] Site check', 'currentSiteId=' + currentSiteId + ' target=' + FREE_SHIP_SITE_ID);
                    if (currentSiteId === FREE_SHIP_SITE_ID) {
                        var orderSubtotal = parseFloat(order.getFieldValue('subtotal')) || 0;
                        nlapiLogExecution('audit', '[FreeShip] Subtotal', 'orderSubtotal=' + orderSubtotal);
                        evaluateFreeShipping(newShipmethods, orderSubtotal, itemsProperties);
                    }
                } catch (freeShipErr) {
                    nlapiLogExecution('error', '[FreeShip] Evaluation error', JSON.stringify(freeShipErr));
                }
            }

            results.shipmethods = newShipmethods;
            results.isCollectTerm = this.isCollectTerm;

            return packageMethod;
        }
    };
});
