function service(request, response) {
    'use strict';

    var controller;

    try {
        require('PacejetIntegration.Session.ServiceController').handle(request, response); // eslint-disable-line global-require
    } catch (ex) {
        console.log('PacejetIntegration.Session.ServiceController ', ex);
        controller = require('ServiceController'); // eslint-disable-line global-require
        controller.response = response;
        controller.request = request;
        controller.sendError(ex);
    }
}
