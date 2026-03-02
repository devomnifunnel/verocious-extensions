/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
/* globals klaviyo */
define('NSeComm.Klaviyo.Main', [
    'jQuery',
    'underscore'
], function NSeCommKlaviyoMain(
    jQuery,
    _
) {
    'use strict';

    return {

        getItems: function getItems(lines) {
            var result = {};
            var itemObj;
            result.itemNames = [];
            result.items = [];

            _.each(lines, function eachLine(line) {
                result.itemNames.push(line.item.extras.storedisplayname2);

                itemObj = {};
                itemObj.ProductID = line.item.internalid;
                itemObj.SKU = line.item.itemid;
                itemObj.ProductName = line.item.extras.storedisplayname2;
                itemObj.Quantity = line.quantity;
                itemObj.ItemPrice = line.rate;
                itemObj.RowTotal = line.amount;
                itemObj.ProductURL = line.item.extras.keyMapping_url;
                itemObj.ImageURL = line.item.extras.keyMapping_thumbnail.url;

                result.items.push(itemObj);
            });

            return result;
        },

        mountToApp: function mountToApp(container) {
            var environment = container.getComponent('Environment');
            var layout = container.getComponent('Layout');
            var checkout = container.getComponent('Checkout');
            var cart = container.getComponent('Cart');
            var klaviyoUrl = environment.getConfig('klaviyo.url');
            var customerCategory = environment.getConfig('klaviyo.customerCategory');
            var item;
            var klaviyoTracker;
            var self = this;
            var orderInfo = {};
            var itemsInfo = {};

            if (environment.isPageGenerator()) {
                return;
            }

            klaviyoTracker = {
                trackProductView: function trackProductView(line) {
                    item = {
                        'ProductName': line.name,
                        'ProductID': line.internalId,
                        'SKU': line.sku,
                        'ImageURL': line.thumbnail,
                        'URL': line.urlComponent,
                        'Price': line.price
                    };
                    klaviyo.push(['track', 'Viewed Product', item]);
                }
            };

            if (layout) {
                jQuery('body').on('change', '#cct_netsuite_newsletter', function onNewsletterChange() {
                    jQuery('.newslettercct-submit').on('click', function sendInfoToKlaviyo() {
                        var firstName = jQuery('.newslettercct-container [name="firstName"]').val();
                        var lastName = jQuery('.newslettercct-container [name="lastName"]').val();
                        var email = jQuery('.newslettercct-container [name="email"]').val();

                        if (firstName && lastName && email) {
                            klaviyo.push(['track', 'Subscribed to Email Marketing', {
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                                customerCategory: customerCategory
                            }]);
                        }
                    });
                });
            }

            jQuery.getScript(klaviyoUrl).done(function pushKlaviyo() {
                environment.addTracker(klaviyoTracker);
            });

            if (checkout) {
                checkout.on('afterShowContent', function addKlaviyoEvent() {
                    checkout.getCurrentStep().then(function validateStep(step) {
                        if (step.step_group_name === 'Shipping Address') {
                            cart.getLines().then(function sendKlaviyoInformation(lines) {
                                self.lines = lines;
                                cart.getSummary().then(function getSummary(summary) {
                                    orderInfo.$value = summary.total;
                                    orderInfo.CheckoutURL = window.location.href;
                                    itemsInfo = self.getItems(self.lines);
                                    orderInfo.ItemNames = itemsInfo.itemNames;
                                    orderInfo.Items = itemsInfo.items;

                                    klaviyo.push(['track', 'Started Checkout', orderInfo]);
                                });
                            });
                        }
                    });
                });
            }
        }
    };
});
