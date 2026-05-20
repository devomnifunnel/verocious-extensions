define(
  // The name of our module
  'OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride',
  [
    // Dependencies
    'Cart.Confirmation.View',
    'omnifunnelmarketing_cartconfirmationcustom_cartconfirmationoverride.tpl'
  ],
  function (
    CartConfirmationView,
    customCartConfirmationModalTpl
  ) {
    'use strict';

    return {
      mountToApp: function mountToApp() {
        // Override the original template with our custom one
        CartConfirmationView.prototype.template = customCartConfirmationModalTpl;
      }
    };
  }
);
