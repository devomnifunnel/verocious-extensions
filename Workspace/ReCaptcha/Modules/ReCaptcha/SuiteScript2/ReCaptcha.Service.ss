/**
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(['N/log', 'N/url', 'N/https'], function (log, url, https) {
    "use strict";

    function service(context) {
        var response = {};
        var params = context.request.parameters;
        var token = params.token;
        var isVerocious = params.isVerocious;
        
        log.debug('params', params);

        var deploymentId = 'customdeploy_recaptcha_validation';

        if(isVerocious == 'false') {
            deploymentId = 'customdeploy_recaptcha_validation_2';
        }

        log.debug('deploymentId', deploymentId);

        try {

            // Resolve the Suitelet URL
            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_recaptcha_validation',
                deploymentId: deploymentId,
                returnExternalUrl: true // Set to true if you need an external URL
            });

            suiteletUrl += '&token=' + token;
            log.debug('suiteletUrl', suiteletUrl);

            // Make the HTTPS call to the Suitelet
            var suiteletResponse = https.get({
                url: suiteletUrl
            });
            log.debug('suiteletResponse', suiteletResponse);

            // Process the response from the Suitelet
            var suiteletResponseBody = suiteletResponse.body;
            var suiteletResponseCode = suiteletResponse.code;

            if (suiteletResponseCode === 200) {
                var suiteletData = JSON.parse(suiteletResponseBody);
                response.success = true;
                response.data = suiteletData;
            } else {
                response.success = false;
                response.message = 'Suitelet returned an error: ' + suiteletResponseCode;
                log.error('Suitelet Error', suiteletResponseBody);
            }

        } catch (e) {
            response.success = false;
            response.message = 'An error occurred: ' + e.message;
            log.error('Error', e);
        }

        // Send the response back
        context.response.write(JSON.stringify(response));
    }

    return {
        service: service
    };
});
