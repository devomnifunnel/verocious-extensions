
function service(request, response)
{
	'use strict';
	try 
	{
		require('OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.ServiceController').handle(request, response);
	} 
	catch(ex)
	{
		console.log('OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.ServiceController ', ex);
		var controller = require('ServiceController');
		controller.response = response;
		controller.request = request;
		controller.sendError(ex);
	}
}