
define('NSeComm.HideInvoiceOption.Main', [
    'jQuery',
    'underscore'
], function NSeCommHideInvoiceOptionMain(
    jQuery,
    _
) {
    'use strict';

    var addAdditionalStyles = function addAdditionalStyles() {
        if (!jQuery('#hide-invoice-style').length) {
            jQuery('head').append('<style type="text/css" id="hide-invoice-style">' +
                '.order-wizard-paymentmethod-selector-module-button[value="invoice"] {display: none}' +
                '</style>');
        }
    };

    return {
        mountToApp: function mountToApp(container) {
            var checkout = container.getComponent('Checkout');
            var userProfile = container.getComponent('UserProfile');
            var environment = container.getComponent('Environment');
            var termsToHideInvoice = environment.getConfig('hideInvoice.terms');

            if (checkout) {
                checkout.on('afterShowContent', function afterShowContent() {
                    checkout.getCurrentStep().then(function then(step) {
                        if (step.url === 'billing') {
                            userProfile.getUserProfile().then(function check(profile) {
                                if (_.find(termsToHideInvoice, function findTerm(termObj) {
                                    return parseInt(termObj.term, 10) === parseInt(profile.paymentterms.internalid, 10);
                                })) {
                                    jQuery('[data-action="change-payment-method"] [value="creditcard"]').click();
                                    addAdditionalStyles();
                                }
                            });
                        }
                    });
                });
            }
        }
    };
});
