// @module OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix
define('OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View'
,	[
	'omnifunnelmarketing_matrixquickaddfix_matrixquickaddfix.tpl'
	
	,	'OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_matrixquickaddfix_matrixquickaddfix_tpl
	
	,	MatrixQuickAddFixSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_matrixquickaddfix_matrixquickaddfix_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new MatrixQuickAddFixModel();
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

		//@method getContext @return OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
