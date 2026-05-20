// @module OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization
define('OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View'
,	[
	'omnifunnelmarketing_billingaddressoptimization_billingaddressoptimization.tpl'
	
	,	'OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_billingaddressoptimization_billingaddressoptimization_tpl
	
	,	BillingAddressOptimizationSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_billingaddressoptimization_billingaddressoptimization_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new BillingAddressOptimizationModel();
			// var self = this;
         	// this.model.fetch().done(function(result) {
			// 	self.message = result.message;
			// 	self.render();
      		// });
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {

		}

		//@method getContext @return OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
