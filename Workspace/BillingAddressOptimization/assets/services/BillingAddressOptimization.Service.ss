
function service(request, response)
{
	'use strict';
	try 
	{
		require('OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}