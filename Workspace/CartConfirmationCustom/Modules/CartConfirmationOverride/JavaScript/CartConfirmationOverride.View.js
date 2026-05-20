// @module OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride
define('OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.View'
,	[
	'omnifunnelmarketing_cartconfirmationcustom_cartconfirmationoverride.tpl'
	
	,	'OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_cartconfirmationcustom_cartconfirmationoverride_tpl
	
	,	CartConfirmationOverrideSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_cartconfirmationcustom_cartconfirmationoverride_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new CartConfirmationOverrideModel();
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

		//@method getContext @return OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
