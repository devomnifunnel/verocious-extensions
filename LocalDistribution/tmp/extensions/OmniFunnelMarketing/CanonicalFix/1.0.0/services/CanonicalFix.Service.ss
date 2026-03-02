
function service(request, response)
{
	'use strict';
	try 
	{
		require('default.CanonicalFix.CanonicalFix.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('default.CanonicalFix.CanonicalFix.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}