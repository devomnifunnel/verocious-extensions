// @module OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix
define('OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View'
,	[
	'omnifunnelmarketing_cookieconsentclsfix_cookieconsentclsfix.tpl'
	
	,	'OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_cookieconsentclsfix_cookieconsentclsfix_tpl
	
	,	CookieConsentCLSFixSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_cookieconsentclsfix_cookieconsentclsfix_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new CookieConsentCLSFixModel();
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

		//@method getContext @return OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
