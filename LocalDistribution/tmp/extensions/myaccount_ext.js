var extensions = {};

extensions['OmniFunnelMarketing.CanonicalFix.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/CanonicalFix/1.0.0/' + asset;
}

// @module default.CanonicalFix.CanonicalFix
define('default.CanonicalFix.CanonicalFix.View'
,	[
	'default_canonicalfix_canonicalfix.tpl'
	
	,	'default.CanonicalFix.CanonicalFix.SS2Model'
	
	,	'Backbone'
    ]
, function (
	default_canonicalfix_canonicalfix_tpl
	
	,	CanonicalFixSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class default.CanonicalFix.CanonicalFix.View @extends Backbone.View
	return Backbone.View.extend({

		template: default_canonicalfix_canonicalfix_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new CanonicalFixModel();
			// var self = this;
         	// this.model.fetch().done(function(result) {
			// 	self.message = result.message;
			// 	self.render();
      		// });
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {

		}

		//@method getContext @return default.CanonicalFix.CanonicalFix.View.Context
	,	getContext: function getContext()
		{
			//@class default.CanonicalFix.CanonicalFix.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});


// Model.js
// -----------------------
// @module Case
define("default.CanonicalFix.CanonicalFix.Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({

        
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "services/CanonicalFix.Service.ss"
            )
        )
        
});
});


// Model.js
// -----------------------
// @module Case
define("default.CanonicalFix.CanonicalFix.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/CanonicalFix/SuiteScript2/CanonicalFix.Service.ss"
            ),
            true
        )
});
});


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


};

extensions['NSeComm.Klaviyo.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/NSeComm/Klaviyo/1.0.0/' + asset;
}

/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
/* globals klaviyo */
define('NSeComm.Klaviyo.Main', [
    'jQuery',
    'underscore'
], function NSeCommKlaviyoMain(
    jQuery,
    _
) {
    'use strict';

    return {

        getItems: function getItems(lines) {
            var result = {};
            var itemObj;
            result.itemNames = [];
            result.items = [];

            _.each(lines, function eachLine(line) {
                result.itemNames.push(line.item.extras.storedisplayname2);

                itemObj = {};
                itemObj.ProductID = line.item.internalid;
                itemObj.SKU = line.item.itemid;
                itemObj.ProductName = line.item.extras.storedisplayname2;
                itemObj.Quantity = line.quantity;
                itemObj.ItemPrice = line.rate;
                itemObj.RowTotal = line.amount;
                itemObj.ProductURL = line.item.extras.keyMapping_url;
                itemObj.ImageURL = line.item.extras.keyMapping_thumbnail.url;

                result.items.push(itemObj);
            });

            return result;
        },

        mountToApp: function mountToApp(container) {
            var environment = container.getComponent('Environment');
            var layout = container.getComponent('Layout');
            var checkout = container.getComponent('Checkout');
            var cart = container.getComponent('Cart');
            var klaviyoUrl = environment.getConfig('klaviyo.url');
            var customerCategory = environment.getConfig('klaviyo.customerCategory');
            var item;
            var klaviyoTracker;
            var self = this;
            var orderInfo = {};
            var itemsInfo = {};

            if (environment.isPageGenerator()) {
                return;
            }

            klaviyoTracker = {
                trackProductView: function trackProductView(line) {
                    item = {
                        'ProductName': line.name,
                        'ProductID': line.internalId,
                        'SKU': line.sku,
                        'ImageURL': line.thumbnail,
                        'URL': line.urlComponent,
                        'Price': line.price
                    };
                    klaviyo.push(['track', 'Viewed Product', item]);
                }
            };

            if (layout) {
                jQuery('body').on('change', '#cct_netsuite_newsletter', function onNewsletterChange() {
                    jQuery('.newslettercct-submit').on('click', function sendInfoToKlaviyo() {
                        var firstName = jQuery('.newslettercct-container [name="firstName"]').val();
                        var lastName = jQuery('.newslettercct-container [name="lastName"]').val();
                        var email = jQuery('.newslettercct-container [name="email"]').val();

                        if (firstName && lastName && email) {
                            klaviyo.push(['track', 'Subscribed to Email Marketing', {
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                                customerCategory: customerCategory
                            }]);
                        }
                    });
                });
            }

            jQuery.getScript(klaviyoUrl).done(function pushKlaviyo() {
                environment.addTracker(klaviyoTracker);
            });

            if (checkout) {
                checkout.on('afterShowContent', function addKlaviyoEvent() {
                    checkout.getCurrentStep().then(function validateStep(step) {
                        if (step.step_group_name === 'Shipping Address') {
                            cart.getLines().then(function sendKlaviyoInformation(lines) {
                                self.lines = lines;
                                cart.getSummary().then(function getSummary(summary) {
                                    orderInfo.$value = summary.total;
                                    orderInfo.CheckoutURL = window.location.href;
                                    itemsInfo = self.getItems(self.lines);
                                    orderInfo.ItemNames = itemsInfo.itemNames;
                                    orderInfo.Items = itemsInfo.items;

                                    klaviyo.push(['track', 'Started Checkout', orderInfo]);
                                });
                            });
                        }
                    });
                });
            }
        }
    };
});


};

extensions['NSeComm.LiveChat.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/NSeComm/LiveChat/1.0.0/' + asset;
}

/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define('NSeComm.LiveChat.Main', [],
function NSeCommLiveChatMain(
) {
    'use strict';

    return {
        mountToApp: function mountToApp(container) {
            var self = this;
            var environment = container.getComponent('Environment');
            var layout = container.getLayout();
            layout.once('afterAppendView', function afterAppendView() {

                if ('requestIdleCallback' in window) {
                    requestIdleCallback(function() {
                        setTimeout(function() { 
                            self.loadSlaask(
                                environment.getConfig('liveChat.slaaskKey'),
                                environment.getConfig('liveChat.slaaskUrl')
                            );
                        }, 3000);
                    });
                } else {
                    setTimeout(function() { 
                        self.loadSlaask(
                            environment.getConfig('liveChat.slaaskKey'),
                            environment.getConfig('liveChat.slaaskUrl')
                        ); 
                    }, 5000);
                }
            });
        },

        loadSlaask: function loadSlaask(key, scriptUrl) {
            var script = document.createElement('script');
            // eslint-disable-next-line no-underscore-dangle
            window._slaaskSettings = {
                key: key
            };

            script.src = scriptUrl;
            script.async = true;

            document.head.appendChild(script);
        }
    };
});


};

extensions['OmniFunnelMarketing.MatrixQuickAddFix.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/MatrixQuickAddFix/1.0.0/' + asset;
}

// @module OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix
define('OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View'
,	[
	'omnifunnelmarketing_matrixquickaddfix_matrixquickaddfix.tpl'
	
	,	'OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_matrixquickaddfix_matrixquickaddfix_tpl
	
	,	MatrixQuickAddFixSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_matrixquickaddfix_matrixquickaddfix_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new MatrixQuickAddFixModel();
			// var self = this;
         	// this.model.fetch().done(function(result) {
			// 	self.message = result.message;
			// 	self.render();
      		// });
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {

		}

		//@method getContext @return OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});


// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({

        
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "services/MatrixQuickAddFix.Service.ss"
            )
        )
        
});
});


// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/MatrixQuickAddFix/SuiteScript2/MatrixQuickAddFix.Service.ss"
            ),
            true
        )
});
});


define('OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix', [
    'Cart.QuickAddToCart.View',
    'jQuery'
], function (CartQuickAddToCartView, jQuery) {
    'use strict';
    return {
        mountToApp: function mountToApp() {
            // Store reference to the original initialize method
            var originalInitialize = CartQuickAddToCartView.prototype.initialize;
            // Override initialize to add matrix parent detection
            CartQuickAddToCartView.prototype.initialize = function () {
                // Call the original initialize first — this sets this.showQuickAddToCartButton
                originalInitialize.apply(this, arguments);
                // After original logic, check if the item is a matrix parent
                // If so, flag it as a matrix item (but do NOT hide the button area)
                try {
                    var item = this.model.getItem();
                    var matrixPriceRange = item.get('onlinematrixpricerange');
                    if (matrixPriceRange && matrixPriceRange.length > 0) {
                        // This is a matrix parent item
                        this.isMatrixParent = true;
                        this.matrixItemUrl = item.get('_url') || '';
                        // IMPORTANT: Force the button area to show (undo the hide)
                        // We WANT the button area rendered so we can replace its content
                        this.showQuickAddToCartButton = true;
                    } else {
                        this.isMatrixParent = false;
                    }
                } catch (e) {
                    console.warn('MatrixQuickAddFix: Error in initialize', e);
                    this.isMatrixParent = false;
                }
            };
            // Store reference to the original render method
            var originalRender = CartQuickAddToCartView.prototype.render;
            // Override render to swap the button after the template renders
            CartQuickAddToCartView.prototype.render = function () {
                // Call the original render first — this renders the full Add to Cart template
                originalRender.apply(this, arguments);
                // If this is a matrix parent, replace the Add to Cart button + quantity
                // with a "Choose Options" link button pointing to the PDP
                if (this.isMatrixParent && this.matrixItemUrl) {
                    try {
                        var $addToCartContainer = this.$('[data-view="AddToCart"]');
                        if ($addToCartContainer.length) {
                            // Replace the entire AddToCart child view content with a Choose Options link
                            $addToCartContainer.html(
                                '<div class="cart-add-to-cart-button-container">' +
                                    '<div class="cart-add-to-cart-button">' +
                                        '<a href="' + this.matrixItemUrl + '" ' +
                                           'class="cart-add-to-cart-button-button matrix-choose-options-button" ' +
                                           'data-touchpoint="home" ' +
                                           'data-hashtag="' + this.matrixItemUrl + '">' +
                                            'Choose Options' +
                                        '</a>' +
                                    '</div>' +
                                '</div>'
                            );
                        }
                        // Also hide the quantity input — it's not relevant for "Choose Options"
                        this.$('[data-type="cart-quickaddtocart-quantity"]').closest('.cart-quickaddtocart-quantity-wrapper, .cart-quickaddtocart-quantity').hide();
                    } catch (e) {
                        console.warn('MatrixQuickAddFix: Error in render override', e);
                    }
                }
                return this;
            };
        }
    };
});

};

extensions['OmniFunnelMarketing.MatrixQuickAddFixAustenitex.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/MatrixQuickAddFixAustenitex/1.0.0/' + asset;
}

// @module OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex
define('OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View'
,	[
	'omnifunnelmarketing_matrixquickaddfixaustenitex_matrixquickaddfixaustenitex.tpl'
	
	,	'OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_matrixquickaddfixaustenitex_matrixquickaddfixaustenitex_tpl
	
	,	MatrixQuickAddFixAustenitexSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_matrixquickaddfixaustenitex_matrixquickaddfixaustenitex_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new MatrixQuickAddFixAustenitexModel();
			// var self = this;
         	// this.model.fetch().done(function(result) {
			// 	self.message = result.message;
			// 	self.render();
      		// });
		}

	,	events: {
		}

	,	bindings: {
		}

	, 	childViews: {

		}

		//@method getContext @return OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View.Context
			this.message = this.message || 'Hello World!!'
			return {
				message: this.message
			};
		}
	});
});


// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({

        
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "services/MatrixQuickAddFixAustenitex.Service.ss"
            )
        )
        
});
});


// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/MatrixQuickAddFixAustenitex/SuiteScript2/MatrixQuickAddFixAustenitex.Service.ss"
            ),
            true
        )
});
});


define('OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex', [
    'Cart.QuickAddToCart.View',
    'jQuery'
], function (CartQuickAddToCartView, jQuery) {
    'use strict';
    return {
        mountToApp: function mountToApp() {
            // Store reference to the original initialize method
            var originalInitialize = CartQuickAddToCartView.prototype.initialize;
            // Override initialize to add matrix parent detection
            CartQuickAddToCartView.prototype.initialize = function () {
                // Call the original initialize first — this sets this.showQuickAddToCartButton
                originalInitialize.apply(this, arguments);
                // After original logic, check if the item is a matrix parent
                // If so, flag it as a matrix item (but do NOT hide the button area)
                try {
                    var item = this.model.getItem();
                    var matrixPriceRange = item.get('onlinematrixpricerange');
                    if (matrixPriceRange && matrixPriceRange.length > 0) {
                        // This is a matrix parent item
                        this.isMatrixParent = true;
                        this.matrixItemUrl = item.get('_url') || '';
                        // IMPORTANT: Force the button area to show (undo the hide)
                        // We WANT the button area rendered so we can replace its content
                        this.showQuickAddToCartButton = true;
                    } else {
                        this.isMatrixParent = false;
                    }
                } catch (e) {
                    console.warn('MatrixQuickAddFix: Error in initialize', e);
                    this.isMatrixParent = false;
                }
            };
            // Store reference to the original render method
            var originalRender = CartQuickAddToCartView.prototype.render;
            // Override render to swap the button after the template renders
            CartQuickAddToCartView.prototype.render = function () {
                // Call the original render first — this renders the full Add to Cart template
                originalRender.apply(this, arguments);
                // If this is a matrix parent, replace the Add to Cart button + quantity
                // with a "Choose Options" link button pointing to the PDP
                if (this.isMatrixParent && this.matrixItemUrl) {
                    try {
                        var $addToCartContainer = this.$('[data-view="AddToCart"]');
                        if ($addToCartContainer.length) {
                            // Replace the entire AddToCart child view content with a Choose Options link
                            $addToCartContainer.html(
                                '<div class="cart-add-to-cart-button-container">' +
                                    '<div class="cart-add-to-cart-button">' +
                                        '<a href="' + this.matrixItemUrl + '" ' +
                                           'class="cart-add-to-cart-button-button matrix-choose-options-button" ' +
                                           'data-touchpoint="home" ' +
                                           'data-hashtag="' + this.matrixItemUrl + '">' +
                                            'Choose Options' +
                                        '</a>' +
                                    '</div>' +
                                '</div>'
                            );
                        }
                        // Also hide the quantity input — it's not relevant for "Choose Options"
                        this.$('[data-type="cart-quickaddtocart-quantity"]').closest('.cart-quickaddtocart-quantity-wrapper, .cart-quickaddtocart-quantity').hide();
                    } catch (e) {
                        console.warn('MatrixQuickAddFix: Error in render override', e);
                    }
                }
                return this;
            };
        }
    };
});

};

extensions['OmniFunnelMarketing.QuantityUrlCleaner.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/QuantityUrlCleaner/1.0.0/' + asset;
}

// @module default.QuantityUrlCleaner.QuantityUrlCleaner
define('default.QuantityUrlCleaner.QuantityUrlCleaner.View'
,   [
        'default_quantityurlcleaner_quantityurlcleaner.tpl'
    ,   'default.QuantityUrlCleaner.QuantityUrlCleaner.SS2Model'
    ,   'Backbone'
    ]
,   function (
        default_quantityurlcleaner_quantityurlcleaner_tpl
    ,   QuantityUrlCleanerSS2Model
    ,   Backbone
    )
{
    'use strict';

    // @class default.QuantityUrlCleaner.QuantityUrlCleaner.View @extends Backbone.View
    return Backbone.View.extend({

        template: default_quantityurlcleaner_quantityurlcleaner_tpl

    ,   initialize: function (options)
        {
            // Boilerplate — logic lives in default.QuantityUrlCleaner.QuantityUrlCleaner.js
        }

    ,   events: {
        }

    ,   bindings: {
        }

    ,   childViews: {
        }

        // @method getContext @return default.QuantityUrlCleaner.QuantityUrlCleaner.View.Context
    ,   getContext: function getContext()
        {
            // @class default.QuantityUrlCleaner.QuantityUrlCleaner.View.Context
            return {};
        }
    });
});


// @module default.QuantityUrlCleaner.QuantityUrlCleaner
define(
    'default.QuantityUrlCleaner.QuantityUrlCleaner.SS2Model'
,   [
        'Backbone'
    ]
,   function (
        Backbone
    )
{
    'use strict';

    // @class default.QuantityUrlCleaner.QuantityUrlCleaner.SS2Model @extends Backbone.Model
    return Backbone.Model.extend({

        urlRoot: '/api/quantityurlcleaner'

    });
});


// =============================================================================
// VMS Quantity URL Cleaner Extension
// Verocious Motorsports | verociousmotorsports.com
// Version: 1.0.0
//
// PURPOSE:
// SuiteCommerce Standard appends ?quantity=N to product detail page URLs.
// This causes Google to index thousands of near-duplicate pages 
// (e.g. ?quantity=1, ?quantity=2, ?quantity=3 per product × entire catalog).
// This extension silently removes the quantity parameter from the browser URL
// using history.replaceState() — no redirect, no reload, no UX impact.
//
// WHAT IT TOUCHES:
// - Browser address bar URL only
// - Fires on: initial page load + every quantity input change event
//
// WHAT IT DOES NOT TOUCH:
// - Quantity input field value (cart still works normally)
// - Canonical tag (already correct — strips all params server-side)
// - Variant params (hose-id-135, color, size, etc.) — preserved in URL
// - Any non-PDP page (category pages, homepage, cart, checkout)
// - Google Merchant Center feed URLs (server-side — unaffected by client JS)
// =============================================================================
define(
//   'VMSQuantityUrlCleaner.QuantityUrlCleaner',
    'default.QuantityUrlCleaner.QuantityUrlCleaner',
  [
    'Backbone',
    'jQuery'
  ],
  function(Backbone, jQuery) {
    'use strict';
    // -------------------------------------------------------------------------
    // CORE FUNCTION: removeQuantityFromUrl
    //
    // Takes the current browser URL, strips the 'quantity' parameter,
    // and uses history.replaceState() to update the address bar silently.
    //
    // Examples:
    //   ?quantity=1&hose-id-135=1&color=2  →  ?hose-id-135=1&color=2
    //   ?quantity=1&size=1168              →  ?size=1168
    //   ?quantity=4                        →  (no params — clean URL)
    //   ?quantity=1                        →  (no params — clean URL)
    // -------------------------------------------------------------------------
        var isCleaningUrl = false;

            function removeQuantityFromUrl() {
          if (isCleaningUrl) return;
        try {
        isCleaningUrl = true;
        // // console.log(window.location.search);
        
        var midurl = null;
        // // console.log(window.location.href);
        //for local
        if(window.location.href.includes('#')) {
          var qsparams = window.location.href.split('#')[1].split('?')[1] || '';
           midurl = "?whence=#" + window.location.href.split('#')[1].split('?')[0];
        } else {
            //for production
          var qsparams = window.location.search;
        }
        // Get current URL parameters
        var currentParams = new URLSearchParams(qsparams);
        // Only proceed if quantity is actually in the URL
        // Avoids unnecessary history.replaceState() calls on clean URLs
        // currentParams = new URLSearchParams("?quantity=1&color=2&hose-id-135=10");
        // // console.log(currentParams);
        if (!currentParams.has('quantity')) {
            // console.log('No quantity parameter found in URL. No update needed.');
          return;
        }
        // Remove the quantity parameter
        currentParams.delete('quantity');
        // Build the new URL
        // If no params remain after removing quantity, use clean path only
        // If other params remain (e.g. variant selectors), keep them
        var newSearch = currentParams.toString();
        var newUrl = window.location.pathname + (midurl || '') + (newSearch ? '?' + newSearch : '');
        // Silently update the browser address bar
        // replaceState: replaces current history entry (no new back-button entry)
        // null: no state object needed
        // newUrl: the clean URL to display
        // console.log('mid url:', midurl);
        // console.log('Updating URL to:', newUrl);
        window.history.replaceState(null, document.title, newUrl);
      } catch (error) {
        // Fail silently — if history API is unavailable, do nothing
        // This extension is a progressive enhancement; failure has no impact
        // console.warn('[VMS Quantity URL Cleaner] Could not update URL:', error);
      } finally {
        isCleaningUrl = false;
  }
    }
    // -------------------------------------------------------------------------
    // PAGE TYPE DETECTION: isPdpPage
    //
    // Only run on Product Detail Pages (PDPs).
    // SuiteCommerce Standard uses the quantity input as a reliable PDP indicator.
    // The quantity input on this site is confirmed as:
    //   <input type="number" name="quantity" id="quantity" 
    //          data-action="changeQuantity" 
    //          class="product-details-quantity-value">
    //
    // We check for this element's presence to confirm we're on a PDP.
    // This prevents the extension from running on category pages, the homepage,
    // cart, checkout, or any other page type.
    // -------------------------------------------------------------------------
    function isPdpPage() {
    //   return document.querySelector('input[name="quantity"][data-action="changeQuantity"]') !== null;
        return true;
}
    // -------------------------------------------------------------------------
    // QUANTITY CHANGE LISTENER: watchQuantityInput
    //
    // SuiteCommerce updates the URL when quantity changes (e.g. user types 2).
    // This listener re-fires removeQuantityFromUrl() whenever that happens.
    //
    // Uses event delegation on document body to handle cases where SuiteCommerce
    // re-renders the quantity input via Backbone view refresh.
    //
    // Debounced by 50ms to avoid firing on every keystroke during typing.
    // -------------------------------------------------------------------------
    function watchQuantityInput() {
      var debounceTimer;
      jQuery(document).on(
        'change keyup',
        'input[data-action="changeQuantity"]',
        function() {
            // console.log('Clicked');
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            removeQuantityFromUrl();
          }, 50);
        }
      );
    }

     function watchVariationInput() {
      var debounceTimer;
      jQuery(document).on(
        'change keyup',
        'input[data-action="changeOption"]',
        function() {
            // console.log('Clicked');
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            removeQuantityFromUrl();
          }, 50);
        }
      );
    }
    
  

 
    // -------------------------------------------------------------------------
    // BACKBONE ROUTER LISTENER: watchRouteChanges
    //
    // SuiteCommerce Standard is a single-page application (SPA).
    // When a user navigates between products without a full page reload,
    // Backbone fires a 'route' event. We listen for this and re-run
    // our URL cleaner after a short delay to let SuiteCommerce finish
    // updating the URL with its own parameters first.
    // -------------------------------------------------------------------------
    function watchRouteChanges() {
      
        Backbone.history.on('route', function() {
        // Wait 100ms for SuiteCommerce to finish its own URL updates
        // before we strip quantity out
        setTimeout(function() {
          if (isPdpPage()) {
              // console.log('Backbone route change detected. Re-checking URL for quantity parameter. route watch');
            removeQuantityFromUrl();
          }
        }, 100);
      });
    }


    // -------------------------------------------------------------------------
    // INITIALISATION
    //
    // Entry point for the extension.
    // Called once when the SuiteCommerce application boots.
    // -------------------------------------------------------------------------
    return {
      mountToApp: function(application) {
        // Step 1: Run immediately on page load for initial URL cleanup
        // Wrapped in jQuery document.ready to ensure DOM is available
        jQuery(document).ready(function() {
          if (isPdpPage()) {
            // console.log("is pdp");
            removeQuantityFromUrl();
          }

          setTimeout(function() {
            if (isPdpPage()) {
                // console.log('Initial page load detected. Checking URL for quantity parameter.');
              removeQuantityFromUrl();
            }
          }, 5000); 
    
          setTimeout(function() {
            if (isPdpPage()) {
                // console.log('Initial page load detected. Checking URL for quantity parameter.');
              removeQuantityFromUrl();
            }
          }, 2000);

          setTimeout(function() {
            if (isPdpPage()) {
                // console.log('Initial page load detected. Checking URL for quantity parameter.');
              removeQuantityFromUrl();
            }
          }, 1000);

          setTimeout(function() {
            if (isPdpPage()) {
                // console.log('Initial page load detected. Checking URL for quantity parameter.');
              removeQuantityFromUrl();
            }
          }, 10000);
        });
        // Step 2: Watch for quantity input changes and re-strip on each change
        // (handles user typing 2, 3, etc. into the quantity box)
          watchVariationInput();
          watchQuantityInput();
        // Step 3: Watch for SPA route changes
        // (handles navigating from one product to another without full reload)
 
      }
    };
  }
);


};

SC.ENVIRONMENT.EXTENSIONS_JS_MODULE_NAMES = ["default.CanonicalFix.CanonicalFix.View","default.CanonicalFix.CanonicalFix.Model","default.CanonicalFix.CanonicalFix.SS2Model","OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View","OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.Model","OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.SS2Model","OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View","OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.Model","OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.SS2Model","default.QuantityUrlCleaner.QuantityUrlCleaner.View","default.QuantityUrlCleaner.QuantityUrlCleaner.SS2Model"];
try{
	extensions['OmniFunnelMarketing.CanonicalFix.1.0.0']();
	SC.addExtensionModule('default.CanonicalFix.CanonicalFix');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['NSeComm.Klaviyo.1.0.0']();
	SC.addExtensionModule('NSeComm.Klaviyo.Main');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['NSeComm.LiveChat.1.0.0']();
	SC.addExtensionModule('NSeComm.LiveChat.Main');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['OmniFunnelMarketing.MatrixQuickAddFix.1.0.0']();
	SC.addExtensionModule('OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['OmniFunnelMarketing.MatrixQuickAddFixAustenitex.1.0.0']();
	SC.addExtensionModule('OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['OmniFunnelMarketing.QuantityUrlCleaner.1.0.0']();
	SC.addExtensionModule('default.QuantityUrlCleaner.QuantityUrlCleaner');
}
catch(error)
{
	console.error(error);
}

