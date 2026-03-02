// @module default.CanonicalFix.CanonicalFix
define('default.CanonicalFix.CanonicalFix.View'
,	[
	'default_canonicalfix_canonicalfix.tpl'
	
	,	'default.CanonicalFix.CanonicalFix.SS2Model'
	
	,	'Backbone'
    ]
, function (
	default_canonicalfix_canonicalfix_tpl
	
	,	CanonicalFixSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class default.CanonicalFix.CanonicalFix.View @extends Backbone.View
	return Backbone.View.extend({

		template: default_canonicalfix_canonicalfix_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new CanonicalFixModel();
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

		//@method getContext @return default.CanonicalFix.CanonicalFix.View.Context
	,	getContext: function getContext()
		{
			//@class default.CanonicalFix.CanonicalFix.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
