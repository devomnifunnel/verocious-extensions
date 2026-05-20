
function service(request, response)
{
	'use strict';
	try 
	{
		require('OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('OmniFunnelMarketing.CartConfirmationCustom.CartConfirmationOverride.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}