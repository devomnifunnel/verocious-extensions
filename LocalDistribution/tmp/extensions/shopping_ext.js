var extensions = {};

extensions['OmniFunnelMarketing.BillingAddressOptimization.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/BillingAddressOptimization/1.0.0/' + asset;
}

// @module OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization
define('OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View'
,	[
	'omnifunnelmarketing_billingaddressoptimization_billingaddressoptimization.tpl'
	
	,	'OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_billingaddressoptimization_billingaddressoptimization_tpl
	
	,	BillingAddressOptimizationSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_billingaddressoptimization_billingaddressoptimization_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new BillingAddressOptimizationModel();
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

		//@method getContext @return OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View.Context
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
define("OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/BillingAddressOptimization/SuiteScript2/BillingAddressOptimization.Service.ss"
            ),
            true
        )
});
});


define(
    'OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization'
,   [
        'jQuery',
        'Backbone'
    ]
,   function (
        jQuery,
        Backbone
    )
{
    'use strict';

    return {
        mountToApp: function mountToApp(container)
        {
            function initBillingOptimization() {
                
                var userUnchecked = false;
                var isInitialized = false;
                
                // Add CSS to force hide
                function addForceHideCSS() {
                    if (!jQuery('#billing-sameas-style').length) {
                        jQuery('head').append(
                            '<style id="billing-sameas-style">' +
                            '.billing-form-force-hide { display: none !important; }' +
                            '</style>'
                        );
                    }
                }
                
                // Check if we're showing address list or new address form
                function isSavedAddressView() {
                    return jQuery('[data-manage="billaddress"] .order-wizard-address-module-list-placeholder').length > 0;
                }
                
                function isNewAddressFormView() {
                    return jQuery('[data-manage="billaddress"] .order-wizard-address-module-form-placeholder').length > 0;
                }
                
                // --- NEW ADDRESS FORM FUNCTIONS ---
                
                var fieldMap = {
                    'fullname': 'fullname',
                    'company': 'company',
                    'addr1': 'addr1',
                    'addr2': 'addr2',
                    'city': 'city',
                    'country': 'country',
                    'state': 'state',
                    'zip': 'zip',
                    'phone': 'phone',
                    'isresidential': 'isresidential'
                };
                
                function getShippingField(fieldName) {
                    return jQuery('#shipaddress-' + fieldName + ', [name="' + fieldName + '"]').filter(function() {
                        return this.id && this.id.startsWith('shipaddress');
                    }).first();
                }
                
                function getBillingField(fieldName) {
                    return jQuery('#billaddress-' + fieldName + ', [name="' + fieldName + '"]').filter(function() {
                        return this.id && this.id.startsWith('billaddress');
                    }).first();
                }
                
                function copyFieldValue(fieldName) {
                    var $shipField = getShippingField(fieldName);
                    var $billField = getBillingField(fieldName);
                    
                    if ($shipField.length && $billField.length) {
                        if ($shipField.is(':checkbox')) {
                            $billField.prop('checked', $shipField.is(':checked'));
                        } else {
                            $billField.val($shipField.val()).trigger('change');
                        }
                    }
                }
                
                function copyAllFields() {
                    Object.keys(fieldMap).forEach(function(fieldName) {
                        copyFieldValue(fieldName);
                    });
                }
                
                function clearAllBillingFields() {
                    Object.keys(fieldMap).forEach(function(fieldName) {
                        var $billField = getBillingField(fieldName);
                        if ($billField.length) {
                            if ($billField.is(':checkbox')) {
                                $billField.prop('checked', false);
                            } else {
                                $billField.val('').trigger('change');
                            }
                        }
                    });
                }
                
                function bindShippingFieldListeners() {
                    Object.keys(fieldMap).forEach(function(fieldName) {
                        var $shipField = getShippingField(fieldName);
                        
                        if ($shipField.length) {
                            $shipField.off('keyup.sameas change.sameas blur.sameas').on('keyup.sameas change.sameas blur.sameas', function() {
                                if (!userUnchecked && isNewAddressFormView()) {
                                    copyFieldValue(fieldName);
                                }
                            });
                        }
                    });
                }
                
                // --- SAVED ADDRESS LIST FUNCTIONS ---
                
                function getSelectedShippingAddressId() {
                    var $selected = jQuery('[data-manage="shipaddress"] input[name="address-options-shipaddress"]:checked');
                    return $selected.val() || $selected.data('id');
                }
                
                function selectBillingAddress(addressId) {
                    var $billingRadio = jQuery('[data-manage="billaddress"] input[value="' + addressId + '"]');
                    if ($billingRadio.length) {
                        $billingRadio.prop('checked', true).trigger('click');
                    }
                }
                
                function bindShippingAddressSelection() {
                    jQuery('[data-manage="shipaddress"] input[name="address-options-shipaddress"]').off('change.sameas').on('change.sameas', function() {
                        if (!userUnchecked && isSavedAddressView()) {
                            var selectedId = jQuery(this).val() || jQuery(this).data('id');
                            if (selectedId) {
                                selectBillingAddress(selectedId);
                            }
                        }
                    });
                }
                
                // --- COMMON FUNCTIONS ---
                
                function hideBillingContainer() {
                    var $billingContainer = jQuery('[data-manage="billaddress"]').closest('.order-wizard-address-module-list-placeholder, .order-wizard-address-module-form-placeholder');
                    $billingContainer.addClass('billing-form-force-hide');
                }
                
                function showBillingContainer() {
                    var $billingContainer = jQuery('[data-manage="billaddress"]').closest('.order-wizard-address-module-list-placeholder, .order-wizard-address-module-form-placeholder');
                    $billingContainer.removeClass('billing-form-force-hide');
                }
                
                function setupCheckboxHandler() {
                    var $checkbox = jQuery('[data-action="same-as"]');
                    
                    if (!$checkbox.length) {
                        return;
                    }
                    
                    $checkbox.off('change.custom');
                    
                    $checkbox.on('change.custom', function() {
                        var isChecked = jQuery(this).is(':checked');
                        
                        if (isChecked) {
                            // CHECKED: Hide container and sync
                            userUnchecked = false;
                            
                            if (isSavedAddressView()) {
                                // Match shipping address selection
                                var shipAddressId = getSelectedShippingAddressId();
                                if (shipAddressId) {
                                    selectBillingAddress(shipAddressId);
                                }
                                bindShippingAddressSelection();
                            } else if (isNewAddressFormView()) {
                                // Copy form fields
                                copyAllFields();
                                bindShippingFieldListeners();
                            }
                            
                            hideBillingContainer();
                            
                        } else {
                            // UNCHECKED: Show container and clear
                            userUnchecked = true;
                            
                            if (isNewAddressFormView()) {
                                clearAllBillingFields();
                                Object.keys(fieldMap).forEach(function(fieldName) {
                                    getShippingField(fieldName).off('keyup.sameas change.sameas blur.sameas');
                                });
                            }
                            
                            showBillingContainer();
                        }
                    });
                }
                
                function applyBillingDefaults() {
                    var $checkbox = jQuery('[data-action="same-as"]');
                    
                    if (!$checkbox.length) {
                        return;
                    }
                    
                    addForceHideCSS();
                    
                    $checkbox.prop('disabled', false);
                    
                    if (!isInitialized || !userUnchecked) {
                        $checkbox.prop('checked', true);
                        hideBillingContainer();
                        
                        if (isSavedAddressView()) {
                            // Match shipping address
                            var shipAddressId = getSelectedShippingAddressId();
                            if (shipAddressId) {
                                selectBillingAddress(shipAddressId);
                            }
                            bindShippingAddressSelection();
                        } else if (isNewAddressFormView()) {
                            // Don't copy yet, wait for user input
                            bindShippingFieldListeners();
                        }
                    } else {
                        $checkbox.prop('checked', false);
                        
                        if (isNewAddressFormView()) {
                            clearAllBillingFields();
                        }
                        
                        showBillingContainer();
                    }
                    
                    setupCheckboxHandler();
                    
                    isInitialized = true;
                }
                
                // Apply immediately
                applyBillingDefaults();
                
                // Watch for re-renders
                var observer = new MutationObserver(function(mutations) {
                    var billingContainerAdded = false;
                    
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            for (var i = 0; i < mutation.addedNodes.length; i++) {
                                var node = mutation.addedNodes[i];
                                if (node.nodeType === 1) {
                                    if (node.querySelector && node.querySelector('[data-manage="billaddress"]')) {
                                        billingContainerAdded = true;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    
                    if (billingContainerAdded) {
                        setTimeout(applyBillingDefaults, 100);
                    }
                });
                
                var targetNode = document.querySelector('.order-wizard-step-content-wrapper');
                if (targetNode) {
                    observer.observe(targetNode, {
                        childList: true,
                        subtree: true
                    });
                }
            }
            
            if (typeof jQuery !== 'undefined') {
                jQuery(document).ready(function() {
                    setTimeout(initBillingOptimization, 1000);
                });
            } else {
                if (document.readyState === 'complete') {
                    setTimeout(initBillingOptimization, 1000);
                } else {
                    window.addEventListener('load', function() {
                        setTimeout(initBillingOptimization, 1000);
                    });
                }
            }
            
            if (typeof Backbone !== 'undefined' && Backbone.history) {
                Backbone.history.on('route', function() {
                    setTimeout(initBillingOptimization, 1000);
                });
            }
        }
    };
});


};

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

extensions['OmniFunnelMarketing.CookieConsentCLSFix.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/CookieConsentCLSFix/1.0.0/' + asset;
}

// @module OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix
define('OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View'
,	[
	'omnifunnelmarketing_cookieconsentclsfix_cookieconsentclsfix.tpl'
	
	,	'OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.SS2Model'
	
	,	'Backbone'
    ]
, function (
	omnifunnelmarketing_cookieconsentclsfix_cookieconsentclsfix_tpl
	
	,	CookieConsentCLSFixSS2Model
	
	,	Backbone
)
{
    'use strict';

	// @class OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View @extends Backbone.View
	return Backbone.View.extend({

		template: omnifunnelmarketing_cookieconsentclsfix_cookieconsentclsfix_tpl

	,	initialize: function (options) {

			/*  Uncomment to test backend communication with an example service
				(you'll need to deploy and activate the extension first)
			*/

			// this.model = new CookieConsentCLSFixModel();
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

		//@method getContext @return OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View.Context
	,	getContext: function getContext()
		{
			//@class OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View.Context
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
define("OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({

        
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "services/CookieConsentCLSFix.Service.ss"
            )
        )
        
});
});


// Model.js
// -----------------------
// @module Case
define("OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/CookieConsentCLSFix/SuiteScript2/CookieConsentCLSFix.Service.ss"
            ),
            true
        )
});
});



define(
	'OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix'
,   [
		'OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View'
	]
,   function (
		CookieConsentCLSFixView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			// using the 'Layout' component we add a new child view inside the 'Header' existing view 
			// (there will be a DOM element with the HTML attribute data-view="Header.Logo")
			// more documentation of the Extensibility API in
			// https://system.netsuite.com/help/helpcenter/en_US/APIs/SuiteCommerce/Extensibility/Frontend/index.html
			
			// /** @type {LayoutComponent} */
			// var layout = container.getComponent('Layout');
			
			// if(layout)
			// {
			// 	layout.addChildView('Header.Logo', function() { 
			// 		return new CookieConsentCLSFixView({ container: container });
			// 	});
			// }

		}
	};
});


};

extensions['NSeComm.CustomPageTitleSuffix.1.1.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/NSeComm/CustomPageTitleSuffix/1.1.0/' + asset;
}

define('NSeComm.CustomPageTitleSuffix.Main', [
], function NSeCommCustomPageTitleSuffixMain(
) {
    'use strict';

    var escapeRegex = function escapeRegex(string) {
        return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    return {
        mountToApp: function mountToApp(container) {
            var layout = container.getComponent('Layout');
            var environment = container.getComponent('Environment');
            var pageTitleConfiguration = environment ? environment.getConfig('extensions.pagetitlesuffix') : {};

            if (layout) {
                layout.on('afterShowContent', function afterShowContent() {
                    // select the target node
                    var target = document.querySelector('title');
                    // create an observer instance
                    var observer = new MutationObserver(function titleObserver() {
                        // WARNING! This is not SC compliant
                        var templateName = layout.application.getLayout().getCurrentView().getTemplateName();

                        var suffixAtEndRegex = new RegExp(
                            escapeRegex(pageTitleConfiguration.suffix) + '$'
                        );
                        var isTitleModified = suffixAtEndRegex.test(document.title);

                        switch (templateName) {
                        case 'cms_landing_page':
                            if (!isTitleModified && pageTitleConfiguration.pagetypes) {
                                document.title += ' ' + pageTitleConfiguration.suffix;
                            }
                            break;
                        default:
                            if (!isTitleModified) {
                                document.title += ' ' + pageTitleConfiguration.suffix;
                            }
                        }
                    });
                    // pass in the target node, as well as the observer options
                    observer.observe(target, {
                        subtree: true,
                        characterData: true,
                        childList: true
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

extensions['OmniFunnelMarketing.PDPSyncOptimizer.1.0.0'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/OmniFunnelMarketing/PDPSyncOptimizer/1.0.0/' + asset;
}

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

extensions['NSeComm.ReorderSizeList.1.0.1'] = function(){

function getExtensionAssetsPath(asset){
	return 'extensions/NSeComm/ReorderSizeList/1.0.1/' + asset;
}

/*
    © 2024 NetSuite Inc.
    User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
    provided, however, if you are an authorized user with a NetSuite account or log-in, you
    may use this code subject to the terms that govern your access and use.
*/
define('NSeComm.ReorderSizeList.Main', [
    'jQuery',
    'underscore'
], function ReorderSizeListMain(
    jQuery,
    _
) {
    'use strict';

    var itemOptionId = 'custcolcustcolclampsexhaustsize';
    var sizeValuesOrderItemFieldId = 'custitem_size_values_order';
    var defaultIndex = 9999;
    var disconnectLastMutationObserver;

    var sortList = function sortList(customOrder, context) {
        var orderedList = context.values;
        if (customOrder.length) {
            orderedList = _(context.values).sortBy(function sortValueByCustomOrder(optionValue) {
                return customOrder.indexOf(optionValue.internalId) > -1
                    ? customOrder.indexOf(optionValue.internalId)
                    : defaultIndex;
            });
        }

        return orderedList;
    };

    var fixGridOrderSorting = function fixGridOrderSorting(pdp) {
        var $rows = jQuery('.grid-order-row');
        var $rowsContainer;
        var itemInfo;
        var sizeValuesOrder;
        var sizeItemOption;

        $rowsContainer = $rows.parent();
        itemInfo = pdp.getItemInfo();
        sizeValuesOrder = itemInfo.item[sizeValuesOrderItemFieldId];
        sizeItemOption = _(itemInfo.options).findWhere({ cartOptionId: itemOptionId });

        $rowsContainer.append(
            _($rows).sortBy(function sortRow($row) {
                var index = 0;
                var matrixChildItemId = jQuery($row)
                    .find('.quantity-input-container')
                    .first()
                    .data('id');
                var matrixChildItem;
                var sizeValueText;
                var sizeValue;
                var sizeValueId;

                if (sizeItemOption && matrixChildItemId) {
                    matrixChildItem = _(itemInfo.item.matrixchilditems_detail).findWhere({
                        internalid: matrixChildItemId
                    });
                    sizeValueText = matrixChildItem[sizeItemOption.itemOptionId];
                    sizeValue = _(sizeItemOption.values).findWhere({ label: sizeValueText });
                    sizeValueId = sizeValue && sizeValue.internalid;

                    if (sizeValuesOrder && sizeValueId) {
                        index = sizeValuesOrder.split(',').indexOf(sizeValueId);
                    }
                }

                jQuery($row).addClass('grid-order-row-sorted');

                return index > -1 ? index : defaultIndex;
            })
        );
    };

    var setupMutationObserver = function setupMutationObserver(pdp) {
        var targetNode = jQuery('[data-view="Product.Sku"]')[0];
        var observerConfig = { childList: true, subtree: true };

        var observer = new MutationObserver(function observerFunction(mutationList) {
            _(mutationList).each(function forEachMutation(mutation) {
                var $addedNodes = jQuery(mutation.addedNodes);
                if (
                    mutation.addedNodes.length &&
                    mutation.addedNodes.length === $addedNodes.filter('.grid-order-row').length &&
                    !$addedNodes.filter('.grid-order-row-sorted').length
                ) {
                    // this is a re-render of grid order
                    fixGridOrderSorting(pdp);
                }
            });
        });

        observer.observe(targetNode, observerConfig);

        return function disconnect() {
            observer.disconnect();
        };
    };

    return {
        mountToApp: function mountToApp(container) {
            var environment = container.getComponent('Environment');
            var layout = container.getComponent('Layout');
            var pdp = container.getComponent('PDP');

            layout.addToViewContextDefinition(
                'ProductViews.Option.View',
                'values',
                'object',
                function sortOptionValues(context) {
                    var defaultValues = context.values;
                    var itemInfo;
                    var sizeValuesOrder;

                    if (pdp && context.cartOptionId === itemOptionId) {
                        itemInfo = pdp.getItemInfo();
                        if (itemInfo) {
                            sizeValuesOrder = itemInfo.item[sizeValuesOrderItemFieldId];

                            if (sizeValuesOrder && context.values) {
                                return sortList(sizeValuesOrder.split(','), context);
                            }
                        }
                    }

                    return defaultValues;
                }
            );

            pdp.on('afterShowContent', function afterShowContent() {
                var isGridOrderItem = jQuery('.grid-order-row').length > 1;

                if (isGridOrderItem) {
                    fixGridOrderSorting(pdp);

                    if (!environment.isPageGenerator() && 'MutationObserver' in window) {
                        // this cleanup is to avoid having old observers still running
                        if (disconnectLastMutationObserver) {
                            disconnectLastMutationObserver();
                        }
                        disconnectLastMutationObserver = setupMutationObserver(pdp);
                    }
                }
            });
        }
    };
});


};

SC.ENVIRONMENT.EXTENSIONS_JS_MODULE_NAMES = ["OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.View","OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization.SS2Model","default.CanonicalFix.CanonicalFix.View","default.CanonicalFix.CanonicalFix.Model","default.CanonicalFix.CanonicalFix.SS2Model","OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.View","OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.Model","OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix.SS2Model","OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.View","OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.Model","OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix.SS2Model","OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.View","OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.Model","OmniFunnelMarketing.MatrixQuickAddFixAustenitex.MatrixQuickAddFixAustenitex.SS2Model","default.QuantityUrlCleaner.QuantityUrlCleaner.View","default.QuantityUrlCleaner.QuantityUrlCleaner.SS2Model"];
try{
	extensions['OmniFunnelMarketing.BillingAddressOptimization.1.0.0']();
	SC.addExtensionModule('OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['OmniFunnelMarketing.CanonicalFix.1.0.0']();
	SC.addExtensionModule('default.CanonicalFix.CanonicalFix');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['OmniFunnelMarketing.CookieConsentCLSFix.1.0.0']();
	SC.addExtensionModule('OmniFunnelMarketing.CookieConsentCLSFix.CookieConsentCLSFix');
}
catch(error)
{
	console.error(error);
}


try{
	extensions['NSeComm.CustomPageTitleSuffix.1.1.0']();
	SC.addExtensionModule('NSeComm.CustomPageTitleSuffix.Main');
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
	extensions['OmniFunnelMarketing.PDPSyncOptimizer.1.0.0']();
	SC.addExtensionModule('OmniFunnelMarketing.PDPSyncOptimizer.PDPSyncOptimizer');
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


try{
	extensions['NSeComm.ReorderSizeList.1.0.1']();
	SC.addExtensionModule('NSeComm.ReorderSizeList.Main');
}
catch(error)
{
	console.error(error);
}

