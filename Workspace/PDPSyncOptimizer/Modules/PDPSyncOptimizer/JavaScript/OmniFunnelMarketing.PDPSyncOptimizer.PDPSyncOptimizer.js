/**
 * PDP Sync Optimizer - Client Side
 *
 * Two optimizations:
 *
 * 1. Matrix child bloat stripping: Removes the custitemhtmlchart_verocious
 *    field from matrixchilditems_detail before the model processes the
 *    response. This field is identical across all children and already
 *    exists on the parent. Stripping it from 1,536 children saves ~228 MB
 *    of redundant data per PDP load.
 *
 * 2. Three-layer caching strategy:
 *    a. SC.ENVIRONMENT.ITEMS (injected server-side by SSP Library hook)
 *    b. localStorage cache (persists across sessions, 30 min TTL)
 *    c. Fall through to normal API call (strip bloat, cache the result)
 */
define(
    'OmniFunnelMarketing.PDPSyncOptimizer.PDPSyncOptimizer'
,   [
        'Backbone'
    ,   'jQuery'
    ,   'underscore'
    ,   'SC.Configuration'
    ]
,   function (
        Backbone
    ,   $
    ,   _
    ,   Configuration
    )
{
    'use strict';

    var TAG = '[PDPSyncOptimizer]';
    var originalSync = Backbone.sync;
    var CACHE_PREFIX = 'pdpSync_';
    var CACHE_TTL = 30 * 60 * 1000; // 30 minutes

    // Fields to strip from matrix child items. These are large, redundant
    // fields that exist on the parent and are identical across all children.
    var CHILD_BLOAT_FIELDS = [
        'custitemhtmlchart_verocious'
    ];

    // Routes that are never PDP pages
    var NON_PDP_PREFIXES = [
        'search', 'cart', 'checkout', 'my-account', 'account',
        'login', 'register', 'forgot-password', 'reset-password',
        'wishlist', 'returns', 'cases', 'overview', 'confirmation',
        'categories', 'stores', 'locator', 'compare', 'quick-order',
        'reorder', 'quotes', 'receipt', 'thankyou', 'balance',
        'creditcard', 'address', 'settings', 'orders', 'invoice'
    ];

    // -------------------------------------------------------------------
    // Detection helpers
    // -------------------------------------------------------------------

    function isItemsReadSync(method, model, options) {
        if (method !== 'read') {
            return false;
        }
        var url = options.url || _.result(model, 'url') || '';
        return (/\/api\/(cacheable\/)?items/i).test(url) ||
               (/items\.ss/i).test(url);
    }

    function couldBePDPRoute() {
        var fragment = (Backbone.history.getFragment() || '').split('?')[0].toLowerCase();
        if (!fragment) {
            return false;
        }
        for (var i = 0; i < NON_PDP_PREFIXES.length; i++) {
            if (fragment.indexOf(NON_PDP_PREFIXES[i]) === 0) {
                return false;
            }
        }
        return true;
    }

    function getCurrentItemSlug() {
        var fragment = (Backbone.history.getFragment() || '').split('?')[0];
        var parts = fragment.split('/');
        return parts[parts.length - 1] || fragment;
    }

    // -------------------------------------------------------------------
    // Matrix child bloat stripping
    // -------------------------------------------------------------------

    /**
     * Strip redundant large fields from matrix child items.
     * Modifies the data in place. Returns the same object with children
     * trimmed. The parent item retains all fields.
     */
    function stripChildBloat(data) {
        if (!data) {
            return data;
        }

        // Handle both single item and items array responses
        var items = data.items || (data.internalid ? [data] : []);

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var children = item.matrixchilditems_detail;

            if (children && children.length) {
                var stripped = 0;
                var savedBytes = 0;

                for (var c = 0; c < children.length; c++) {
                    for (var f = 0; f < CHILD_BLOAT_FIELDS.length; f++) {
                        var field = CHILD_BLOAT_FIELDS[f];
                        if (children[c][field]) {
                            savedBytes += String(children[c][field]).length;
                            delete children[c][field];
                            stripped++;
                        }
                    }
                }

                if (stripped > 0) {
                    console.log(TAG, 'Stripped bloat from matrix children.', {
                        childrenCount: children.length,
                        fieldsStripped: stripped,
                        savedMB: (savedBytes / 1024 / 1024).toFixed(1)
                    });
                }
            }
        }

        return data;
    }

    // -------------------------------------------------------------------
    // Layer 1: SC.ENVIRONMENT.ITEMS (server-side preloaded)
    // -------------------------------------------------------------------

    function getFromEnvironment() {
        if (typeof SC === 'undefined' || !SC.ENVIRONMENT) {
            return null;
        }

        if (SC.ENVIRONMENT.ITEMS && SC.ENVIRONMENT.ITEMS.length) {
            if (SC.ENVIRONMENT.ITEMS.length === 1) {
                console.log(TAG, 'Layer 1 HIT: SC.ENVIRONMENT.ITEMS (single item)');
                return SC.ENVIRONMENT.ITEMS[0];
            }

            var slug = getCurrentItemSlug();
            if (slug) {
                var matched = _.find(SC.ENVIRONMENT.ITEMS, function (item) {
                    return item.urlcomponent === slug ||
                           item.url === slug ||
                           String(item.internalid) === slug;
                });
                if (matched) {
                    console.log(TAG, 'Layer 1 HIT: SC.ENVIRONMENT.ITEMS (matched slug: ' + slug + ')');
                    return matched;
                }
            }
        }

        if (SC.ENVIRONMENT.contextData && SC.ENVIRONMENT.contextData.item) {
            console.log(TAG, 'Layer 1 HIT: SC.ENVIRONMENT.contextData.item');
            return SC.ENVIRONMENT.contextData.item;
        }

        if (SC.ENVIRONMENT.item) {
            console.log(TAG, 'Layer 1 HIT: SC.ENVIRONMENT.item');
            return SC.ENVIRONMENT.item;
        }

        console.log(TAG, 'Layer 1 MISS: No preloaded data in SC.ENVIRONMENT');
        return null;
    }

    // -------------------------------------------------------------------
    // Layer 2: localStorage cache
    // -------------------------------------------------------------------

    function getCacheKey(url) {
        var match = url.match(/[?&]url=([^&]+)/) || url.match(/[?&]id=([^&]+)/);
        if (match) {
            return CACHE_PREFIX + decodeURIComponent(match[1]);
        }
        var fragment = (Backbone.history.getFragment() || '').split('?')[0];
        return fragment ? CACHE_PREFIX + fragment : null;
    }

    function getFromCache(key) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) {
                return null;
            }
            var entry = JSON.parse(raw);
            if (Date.now() - entry.timestamp > CACHE_TTL) {
                localStorage.removeItem(key);
                return null;
            }
            return entry.data;
        } catch (e) {
            return null;
        }
    }

    function setCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn(TAG, 'localStorage write failed. Storage may be full.');
        }
    }

    // -------------------------------------------------------------------
    // Sync override
    // -------------------------------------------------------------------

    return {
        mountToApp: function mountToApp(container) {
            console.log(TAG, 'mountToApp fired. Extension is loaded.');

            if (Configuration['PDPSyncOptimizer.enabled'] === false) {
                console.warn(TAG, 'Extension DISABLED via configuration.');
                return;
            }

            console.log(TAG, 'Extension ENABLED. Patching Backbone.sync.');

            Backbone.sync = function pdpOptimizedSync(method, model, options) {
                options = options || {};

                var url = options.url || _.result(model, 'url') || '';
                var isPDP = couldBePDPRoute();
                var isItemsCall = isItemsReadSync(method, model, options);

                if (isPDP && isItemsCall) {
                    var route = (Backbone.history.getFragment() || '').split('?')[0];

                    // Layer 1: Check SC.ENVIRONMENT (server-side preloaded)
                    var preloaded = getFromEnvironment();
                    if (preloaded) {
                        console.log(TAG, 'SKIPPING API call. Using server-preloaded data.', {
                            route: route,
                            itemId: preloaded.internalid
                        });

                        var d1 = $.Deferred();
                        if (options.success) {
                            options.success(stripChildBloat(preloaded));
                        }
                        d1.resolve(preloaded);
                        return d1.promise();
                    }

                    // Layer 2: Check localStorage cache (already stripped)
                    var cacheKey = getCacheKey(url);
                    if (cacheKey) {
                        var cached = getFromCache(cacheKey);
                        if (cached) {
                            console.log(TAG, 'SKIPPING API call. Using localStorage cache.', {
                                route: route,
                                key: cacheKey
                            });

                            var d2 = $.Deferred();
                            if (options.success) {
                                options.success(cached);
                            }
                            d2.resolve(cached);
                            return d2.promise();
                        }
                    }

                    // Layer 3: Fall through to API. Strip bloat, then cache.
                    console.log(TAG, 'CACHE MISS on all layers. API call proceeding.', {
                        route: route,
                        key: cacheKey
                    });

                    var originalSuccess = options.success;
                    options.success = function (data) {
                        // Strip bloated fields from matrix children before
                        // the model processes the response
                        var cleaned = stripChildBloat(data);

                        // Cache the cleaned (smaller) version
                        if (cacheKey && cleaned) {
                            setCache(cacheKey, cleaned);
                            console.log(TAG, 'Cleaned response cached in localStorage.', {
                                key: cacheKey
                            });
                        }

                        if (originalSuccess) {
                            originalSuccess.call(this, cleaned);
                        }
                    };
                }

                return originalSync.call(this, method, model, options);
            };

            console.log(TAG, 'Backbone.sync patched. Bloat stripping + 3-layer caching active.');
        }
    };
});
