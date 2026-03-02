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
