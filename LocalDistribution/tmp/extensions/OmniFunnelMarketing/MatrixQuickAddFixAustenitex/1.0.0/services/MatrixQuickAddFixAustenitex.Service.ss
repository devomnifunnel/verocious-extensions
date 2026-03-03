
function service(request, response)
{
	'use strict';
	try 
	{
		require('OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}