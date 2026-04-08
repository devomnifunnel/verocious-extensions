/**
 * PDP Sync Optimizer - Item Preloader (Server Side)
 *
 * Two server-side optimizations:
 *
 * 1. Matrix child bloat stripping: Hooks into Item.get and Item.list to
 *    remove custitemhtmlchart_verocious from matrixchilditems_detail
 *    BEFORE the response is serialized and sent to the client. This
 *    reduces the response from ~246 MB to ~18 MB for matrix items with
 *    many children. The parent item keeps the field. This directly helps
 *    crawler bots because the data never leaves the server.
 *
 * 2. Environment injection (speculative): Attempts to preload item data
 *    into SC.ENVIRONMENT during page generation so the client-side SPA
 *    can skip the API call entirely. Multiple hooks are tried because
 *    the exact event name varies by SC version.
 */
define('OmniFunnelMarketing.PDPSyncOptimizer.ItemPreloader', [
    'Application',
    'underscore'
], function (Application, _) {
    'use strict';

    var TAG = 'PDPSyncOptimizer';

    // Fields to strip from matrix child items. These exist on the parent
    // and are identical across all children. Add more field names here
    // if other bloated custom fields are found.
    var CHILD_BLOAT_FIELDS = [
        'custitemhtmlchart_verocious'
    ];

    var NON_PDP_PREFIXES = [
        'search', 'cart', 'checkout', 'my-account', 'account',
        'login', 'register', 'forgot-password', 'reset-password',
        'wishlist', 'returns', 'cases', 'overview', 'confirmation',
        'categories', 'stores', 'locator', 'compare', 'quick-order',
        'reorder', 'quotes', 'receipt', 'thankyou', 'balance',
        'creditcard', 'address', 'settings', 'orders', 'invoice'
    ];

    // ---------------------------------------------------------------
    // Matrix child bloat stripping (server-side)
    // ---------------------------------------------------------------

    /**
     * Strip redundant large fields from a single item's matrix children.
     * Modifies the item in place. Returns the count of fields stripped.
     */
    function stripChildBloatFromItem(item) {
        if (!item || !item.matrixchilditems_detail || !item.matrixchilditems_detail.length) {
            return 0;
        }

        var children = item.matrixchilditems_detail;
        var stripped = 0;

        for (var c = 0; c < children.length; c++) {
            for (var f = 0; f < CHILD_BLOAT_FIELDS.length; f++) {
                if (children[c][CHILD_BLOAT_FIELDS[f]]) {
                    delete children[c][CHILD_BLOAT_FIELDS[f]];
                    stripped++;
                }
            }
        }

        return stripped;
    }

    // ---------------------------------------------------------------
    // Hook 1: after:Item.get (single item fetch, e.g. PDP API call)
    // This is the primary optimization for bots and humans.
    // ---------------------------------------------------------------

    try {
        Application.on('after:Item.get', function (model, result) {
            nlapiLogExecution('DEBUG', TAG, 'after:Item.get fired.');

            var stripped = stripChildBloatFromItem(result);
            if (stripped > 0) {
                nlapiLogExecution('AUDIT', TAG,
                    'after:Item.get: Stripped ' + stripped + ' bloated fields from ' +
                    (result.matrixchilditems_detail ? result.matrixchilditems_detail.length : 0) +
                    ' matrix children. Item: ' + (result.displayname || result.urlcomponent || 'unknown'));
            }
        });
        nlapiLogExecution('DEBUG', TAG, 'Registered hook: after:Item.get');
    } catch (e) {
        nlapiLogExecution('ERROR', TAG, 'Could not register after:Item.get: ' + e.message);
    }

    // ---------------------------------------------------------------
    // Hook 2: after:Item.list (item list/search, may return items array)
    // ---------------------------------------------------------------

    try {
        Application.on('after:Item.list', function (model, result) {
            nlapiLogExecution('DEBUG', TAG, 'after:Item.list fired.');

            var items = result && result.items ? result.items : (_.isArray(result) ? result : []);
            var totalStripped = 0;

            for (var i = 0; i < items.length; i++) {
                totalStripped += stripChildBloatFromItem(items[i]);
            }

            if (totalStripped > 0) {
                nlapiLogExecution('AUDIT', TAG,
                    'after:Item.list: Stripped ' + totalStripped +
                    ' bloated fields across ' + items.length + ' items.');
            }
        });
        nlapiLogExecution('DEBUG', TAG, 'Registered hook: after:Item.list');
    } catch (e) {
        nlapiLogExecution('ERROR', TAG, 'Could not register after:Item.list: ' + e.message);
    }

    // ---------------------------------------------------------------
    // Hook 3: after:Item.search (alternative method name in some SC versions)
    // ---------------------------------------------------------------

    try {
        Application.on('after:Item.search', function (model, result) {
            nlapiLogExecution('DEBUG', TAG, 'after:Item.search fired.');

            var items = result && result.items ? result.items : (_.isArray(result) ? result : []);
            var totalStripped = 0;

            for (var i = 0; i < items.length; i++) {
                totalStripped += stripChildBloatFromItem(items[i]);
            }

            if (totalStripped > 0) {
                nlapiLogExecution('AUDIT', TAG,
                    'after:Item.search: Stripped ' + totalStripped +
                    ' bloated fields across ' + items.length + ' items.');
            }
        });
        nlapiLogExecution('DEBUG', TAG, 'Registered hook: after:Item.search');
    } catch (e) {
        nlapiLogExecution('ERROR', TAG, 'Could not register after:Item.search: ' + e.message);
    }

    // ---------------------------------------------------------------
    // Hook 4: Environment injection (speculative)
    // Tries to preload item data into SC.ENVIRONMENT during page
    // generation. Multiple event names are tried.
    // ---------------------------------------------------------------

    function getRequestURL() {
        try {
            if (typeof request !== 'undefined' && request && request.getURL) {
                return request.getURL();
            }
        } catch (e) {}

        try {
            var container = nlapiGetWebContainer();
            if (container && container.getRequest) {
                var req = container.getRequest();
                if (req && req.getURL) {
                    return req.getURL();
                }
            }
        } catch (e) {}

        return null;
    }

    function extractItemSlug(url) {
        if (!url) {
            return null;
        }
        var path = url.replace(/^https?:\/\/[^\/]+/, '').split('?')[0].split('#')[0];
        path = path.replace(/^\/+|\/+$/g, '').replace(/^scs\//, '').replace(/^shopping\.ssp\/?/, '');
        if (!path) {
            return null;
        }
        var segments = path.split('/');
        return segments[segments.length - 1];
    }

    function isNonPDPRoute(slug) {
        if (!slug) {
            return true;
        }
        var lower = slug.toLowerCase();
        for (var i = 0; i < NON_PDP_PREFIXES.length; i++) {
            if (lower.indexOf(NON_PDP_PREFIXES[i]) === 0) {
                return true;
            }
        }
        return false;
    }

    function fetchItemBySlug(slug) {
        try {
            var filters = [
                new nlobjSearchFilter('urlcomponent', null, 'is', slug),
                new nlobjSearchFilter('isinactive', null, 'is', 'F')
            ];
            var columns = [
                new nlobjSearchColumn('internalid'),
                new nlobjSearchColumn('itemid'),
                new nlobjSearchColumn('displayname'),
                new nlobjSearchColumn('urlcomponent'),
                new nlobjSearchColumn('storedescription'),
                new nlobjSearchColumn('storedetaileddescription'),
                new nlobjSearchColumn('storedisplayimage'),
                new nlobjSearchColumn('storedisplaythumbnail'),
                new nlobjSearchColumn('onlinecustomerprice'),
                new nlobjSearchColumn('salesdescription'),
                new nlobjSearchColumn('type'),
                new nlobjSearchColumn('isonline')
            ];
            var results = nlapiSearchRecord('item', null, filters, columns);
            if (results && results.length > 0) {
                var r = results[0];
                return {
                    internalid: parseInt(r.getId(), 10),
                    itemid: r.getValue('itemid'),
                    displayname: r.getValue('displayname'),
                    urlcomponent: r.getValue('urlcomponent'),
                    storedescription: r.getValue('storedescription'),
                    storedetaileddescription: r.getValue('storedetaileddescription'),
                    storedisplayimage: r.getValue('storedisplayimage'),
                    storedisplaythumbnail: r.getValue('storedisplaythumbnail'),
                    onlinecustomerprice: parseFloat(r.getValue('onlinecustomerprice')) || 0,
                    salesdescription: r.getValue('salesdescription'),
                    type: r.getValue('type'),
                    isonline: r.getValue('isonline')
                };
            }
        } catch (e) {
            nlapiLogExecution('ERROR', TAG, 'fetchItemBySlug error: ' + e.message);
        }
        return null;
    }

    function tryInjectItemData(hookName, model, result) {
        nlapiLogExecution('DEBUG', TAG, hookName + ' hook fired.');
        try {
            var url = getRequestURL();
            if (!url) {
                nlapiLogExecution('DEBUG', TAG, hookName + ': No URL available.');
                return;
            }
            var slug = extractItemSlug(url);
            if (!slug || isNonPDPRoute(slug)) {
                return;
            }
            var itemData = fetchItemBySlug(slug);
            if (itemData) {
                result.ITEMS = [itemData];
                nlapiLogExecution('AUDIT', TAG, hookName + ': Injected item "' +
                    itemData.displayname + '" into environment.');
            }
        } catch (e) {
            nlapiLogExecution('ERROR', TAG, hookName + ' error: ' + e.message);
        }
    }

    var envHooks = ['after:SiteSettings.get', 'after:Environment.get', 'after:ShoppingUserEnvironment.get'];
    for (var h = 0; h < envHooks.length; h++) {
        (function (hookName) {
            try {
                Application.on(hookName, function (model, result) {
                    tryInjectItemData(hookName, model, result);
                });
                nlapiLogExecution('DEBUG', TAG, 'Registered hook: ' + hookName);
            } catch (e) {
                nlapiLogExecution('DEBUG', TAG, 'Could not register ' + hookName + ': ' + e.message);
            }
        })(envHooks[h]);
    }

    nlapiLogExecution('AUDIT', TAG, 'ItemPreloader initialized. Server-side bloat stripping active.');
});
