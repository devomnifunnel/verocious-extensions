/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define('OrderWizard.Module.CleanShipMethod', [
    'Wizard.Module',
    'Utils'
], function OrderWizardModuleCleanShipMethod(
    WizardModule,
    Utils
) {
    'use strict';

    return WizardModule.extend({
        initialize: function initialize() {
            WizardModule.prototype.initialize.apply(this, arguments);

            if (this.model.get('isPaypalComplete')) {
                // do nothing if coming back from paypal
                return;
            }

            // reset shipping methods
            this.model.unset('shipmethod');
            this.summary = this.wizard.model.get('summary');
            if (this.summary) {
                this.summary.total = Number(this.summary.total) - Number(this.summary.shippingcost);
                this.summary.total_formatted = Utils.formatCurrency(this.summary.total);
                this.summary.shippingcost = 0;
                this.summary.shippingcost_formatted = Utils.formatCurrency(0);
                this.wizard.model.set({
                    summary: this.summary
                });
            }
        },

        template: function emptyTemplate() { return ''; }
    });
});
