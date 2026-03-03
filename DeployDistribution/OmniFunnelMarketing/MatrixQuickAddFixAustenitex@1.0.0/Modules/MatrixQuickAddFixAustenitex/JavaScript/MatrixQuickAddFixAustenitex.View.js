// @module OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex
define('OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View'
,	[
	'omnifunnelmarketing_matrixquickaddfixaustenitex_matrixquickaddfixaustenitex.tpl'
	
	,	'OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_matrixquickaddfixaustenitex_matrixquickaddfixaustenitex_tpl
	
	,	MatrixQuickAddFixAustenitexSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_matrixquickaddfixaustenitex_matrixquickaddfixaustenitex_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new MatrixQuickAddFixAustenitexModel();
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

		//@method getContext @return OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});
