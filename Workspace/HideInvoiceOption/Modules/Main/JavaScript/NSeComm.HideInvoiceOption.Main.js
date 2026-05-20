
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
    var _switching = false;

    var forceHideInvoice = function forceHideInvoice() {
        if (!shouldHideInvoice || _switching) {
            return;
        }
        if (!jQuery('#' + STYLE_ID).length) {
            jQuery('head').append('<style type="text/css" id="' + STYLE_ID + '">' + STYLE_CSS + '</style>');
        }
        jQuery(INVOICE_SELECTOR).css('display', 'none');

        // If invoice is the selected payment method, switch to credit card
        var invoiceBtn = jQuery(INVOICE_SELECTOR);
        if (invoiceBtn.hasClass('selected') || invoiceBtn.hasClass('active')) {
            var ccBtn = jQuery('.order-wizard-paymentmethod-selector-module-button[value="creditcard"]');
            if (ccBtn.length && !ccBtn.hasClass('selected')) {
                _switching = true;
                ccBtn.trigger('click');
                setTimeout(function () { _switching = false; }, 200);
            }
        }
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
                // 1. Guest users → always hide invoice (can't pay by invoice)
                // 2. Logged-in users whose terms match the config list → hide invoice
                // 3. Logged-in users with no matching terms → show invoice
                userProfile.getUserProfile().then(function (profile) {
                    var isGuest = !profile.paymentterms;  
                    // var isGuest = profile.isGuest === 'T' || profile.isLoggedIn === 'F';
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
