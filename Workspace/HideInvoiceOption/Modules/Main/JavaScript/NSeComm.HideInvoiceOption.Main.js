
define('NSeComm.HideInvoiceOption.Main', [
    'jQuery',
    'underscore'
], function NSeCommHideInvoiceOptionMain(
    jQuery,
    _
) {
    'use strict';

    var INVOICE_SELECTOR = '.order-wizard-paymentmethod-selector-module-button[value="invoice"]';
    var STYLE_ID = 'hide-invoice-style';
    var STYLE_CSS =
        INVOICE_SELECTOR + ',' +
        '.order-wizard-paymentmethod-selector-module-button.order-wizard-paymentmethod-selector-module-button[value="invoice"]' +
        '{display:none!important;visibility:hidden!important;width:0!important;height:0!important;' +
        'overflow:hidden!important;padding:0!important;margin:0!important;border:0!important;}';

    var shouldHideInvoice = false;

    var forceHideInvoice = function forceHideInvoice() {
        if (!shouldHideInvoice) {
            return;
        }
        if (!jQuery('#' + STYLE_ID).length) {
            jQuery('head').append('<style type="text/css" id="' + STYLE_ID + '">' + STYLE_CSS + '</style>');
        }
        jQuery(INVOICE_SELECTOR).css('display', 'none');
    };

    return {
        mountToApp: function mountToApp(container) {
            var checkout = container.getComponent('Checkout');
            var userProfile = container.getComponent('UserProfile');
            var environment = container.getComponent('Environment');
            var termsToHideInvoice = environment.getConfig('hideInvoice.terms');

            if (checkout) {
                // Start observer immediately
                var hideTimer = null;
                var observer = new MutationObserver(function () {
                    if (!shouldHideInvoice) {
                        return;
                    }
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(forceHideInvoice, 30);
                });
                observer.observe(document.body, { childList: true, subtree: true });

                // Determine if invoice should be hidden:
                // 1. Guest users (no paymentterms) → always hide invoice
                // 2. Logged-in users whose terms match the config list → hide invoice
                userProfile.getUserProfile().then(function (profile) {
                    var isGuest = !profile.paymentterms;
                    var termsMatch = profile.paymentterms && _.find(termsToHideInvoice, function (termObj) {
                        return parseInt(termObj.term, 10) === parseInt(profile.paymentterms.internalid, 10);
                    });

                    if (isGuest || termsMatch) {
                        shouldHideInvoice = true;
                        forceHideInvoice();
                    }
                });
            }
        }
    };
});
