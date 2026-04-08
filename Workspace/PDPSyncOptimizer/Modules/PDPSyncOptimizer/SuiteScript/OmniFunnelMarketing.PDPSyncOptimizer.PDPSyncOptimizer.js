/**
 * PDP Sync Optimizer - SSP Library Entry Point
 *
 * Registers server-side hooks to preload item data into SC.ENVIRONMENT
 * during page generation. When successful, the client-side code finds
 * the data in SC.ENVIRONMENT.ITEMS and skips the cacheable items API call.
 */
define('OmniFunnelMarketing.PDPSyncOptimizer.PDPSyncOptimizer', [
    'OmniFunnelMarketing.PDPSyncOptimizer.ItemPreloader'
], function (ItemPreloader) {
    'use strict';

    nlapiLogExecution('DEBUG', 'PDPSyncOptimizer', 'SSP Library entry point loaded.');
});
