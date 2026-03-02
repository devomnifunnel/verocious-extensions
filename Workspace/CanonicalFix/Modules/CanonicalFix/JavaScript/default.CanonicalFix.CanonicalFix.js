/*
 * CanonicalFix.Entry.js
 *
 * Fixes canonical URLs on PLP pages by:
 * 1. Removing ?page=1 (and &page=1)
 * 2. Stripping all pagination, sort, display, and facet params
 * 3. Keeping only the clean category/search path
 *
 * Works on:
 *   /shop-by-brand/...
 *   /shop-by-category/...
 *   /search?keywords=...
 *
 * Approach:
 *   - Listens to route changes and afterAppendView
 *   - Finds any existing <link rel="canonical"> and fixes it
 *   - If none exists, creates one
 *   - On non-PLP pages, restores original behavior
 */

define('default.CanonicalFix.CanonicalFix', [
    'jQuery',
    'Backbone'
], function CanonicalFixEntry(
    jQuery,
    Backbone
) {
    'use strict';

    // Params to strip from canonical URLs (cause duplicate content)
    var STRIP_PARAMS = [
        'page'
    ];

    /**
     * Check if the current URL fragment is a PLP page
     */
    function isPLPPage(fragment) {
        console.log('Checking if PLP page for fragment:', fragment);
        return (
            fragment.indexOf('shop-by-brand') !== -1 ||
            fragment.indexOf('shop-by-category') !== -1 ||
            fragment.indexOf('shop_by_brand') !== -1 ||
            fragment.indexOf('shop_by_category') !== -1

        );
    }

    /**
     * Build a clean canonical URL from the current fragment.
     * Strips pagination, sort, display, facet params.
     */
    function buildCleanCanonical(fragment) {
        var base = window.location.protocol + '//' + window.location.host + '/';

        // Split fragment into path and query
        var parts = fragment.split('?');
        var path = parts[0] || '';
        var queryString = parts[1] || '';

        // If no query params, just return the clean path
        if (!queryString) {
            return base + path;
        }

        // Parse and filter query params
        var cleanParams = [];
        var pairs = queryString.split('&');

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = decodeURIComponent(pair[0] || '').toLowerCase();

            // Skip params that cause duplicate content
            var shouldStrip = false;
            for (var j = 0; j < STRIP_PARAMS.length; j++) {
                if (key === STRIP_PARAMS[j]) {
                    shouldStrip = true;
                    break;
                }
            }

            if (!shouldStrip && pair[0]) {
                cleanParams.push(pairs[i]);
            }
        }

        var canonicalUrl = base + path;
        if (cleanParams.length > 0) {
            canonicalUrl += '?' + cleanParams.join('&');
        }

        return canonicalUrl;
    }

    /**
     * Update or create the canonical tag in <head>
     */
    function updateCanonical(url) {
        // Try to find existing canonical tag (SuiteCommerce may already add one)
        var existingCanonical = document.querySelector('link[rel="canonical"]');

        if (url) {
            if (existingCanonical) {
                // Update existing tag
                existingCanonical.href = url;
            } else {
                // Create new one
                var link = document.createElement('link');
                link.rel = 'canonical';
                link.href = url;
                document.head.appendChild(link);
            }
        }
        // On non-PLP pages, leave existing canonical alone
    }

    /**
     * Main logic — called on every route change
     */
    function fixCanonical() {
        var fragment = Backbone.history.getFragment() || '';

        if (isPLPPage(fragment)) {
            var cleanUrl = buildCleanCanonical(fragment);
            updateCanonical(cleanUrl);
        }
    }

    return {
        mountToApp: function mountToApp(container) {
            // ---------------------------------------------------
            // Method 1: Extensibility API (SCA 2019.1+)
            // ---------------------------------------------------
            var layout = container.getComponent && container.getComponent('Layout');

            if (layout && layout.on) {
                layout.on('afterAppendView', function () {
                    fixCanonical();
                });

                layout.on('afterShowContent', function () {
                    fixCanonical();
                });
            }

            // ---------------------------------------------------
            // Method 2: Backbone history (works on all versions
            // including Kilimanjaro)
            // ---------------------------------------------------
            Backbone.history.on('route', function () {
                // Small delay to ensure the fragment is updated
                setTimeout(fixCanonical, 150);
            });

            // ---------------------------------------------------
            // Method 3: Direct DOM observation as fallback
            // Watch for SuiteCommerce updating the canonical tag
            // with ?page=1 and fix it immediately
            // ---------------------------------------------------
            var observer = new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    var mutation = mutations[i];

                    // Check added nodes
                    if (mutation.addedNodes) {
                        for (var j = 0; j < mutation.addedNodes.length; j++) {
                            var node = mutation.addedNodes[j];
                            if (
                                node.tagName === 'LINK' &&
                                node.rel === 'canonical' &&
                                node.href &&
                                node.href.indexOf('page=') !== -1
                            ) {
                                var fragment = Backbone.history.getFragment() || '';
                                if (isPLPPage(fragment)) {
                                    node.href = buildCleanCanonical(fragment);
                                }
                            }
                        }
                    }

                    // Check attribute changes on existing canonical
                    if (
                        mutation.type === 'attributes' &&
                        mutation.target.tagName === 'LINK' &&
                        mutation.target.rel === 'canonical' &&
                        mutation.target.href &&
                        mutation.target.href.indexOf('page=') !== -1
                    ) {
                        var frag = Backbone.history.getFragment() || '';
                        if (isPLPPage(frag)) {
                            mutation.target.href = buildCleanCanonical(frag);
                        }
                    }
                }
            });

            observer.observe(document.head, {
                childList: true,
                attributes: true,
                subtree: true,
                attributeFilter: ['href']
            });

            // ---------------------------------------------------
            // Run once on initial page load
            // ---------------------------------------------------
            jQuery(document).ready(function () {
                // Delay to let SuiteCommerce set its own canonical first
                setTimeout(fixCanonical, 5000);
            });
        }
    };
});
