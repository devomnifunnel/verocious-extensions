
function service(request, response)
{
	'use strict';
	try 
	{
		require('OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}