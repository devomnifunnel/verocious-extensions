define(
    'OmniFunnelMarketing.BillingAddressOptimization.BillingAddressOptimization'
,   [
        'jQuery'
    ]
,   function (
        jQuery
    )
{
    'use strict';

    return {
        mountToApp: function mountToApp(container)
        {
            console.log('🚀 Billing Address Optimization Extension - Starting...');
            
            // Wait for everything to be ready
            function startExtension() {
                
                if (!jQuery || typeof jQuery === 'undefined') {
                    console.error('jQuery not available');
                    return;
                }
                
                console.log('✅ jQuery available, initializing...');
                
                var userUnchecked = false;
                var isInitialized = false;
                
                // Field mapping
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
                
                // Add CSS to force hide with !important
                function addForceHideCSS() {
                    if (!jQuery('#billing-sameas-style').length) {
                        jQuery('head').append(
                            '<style id="billing-sameas-style">' +
                            '.billing-form-force-hide { display: none !important; }' +
                            '</style>'
                        );
                    }
                }
                
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
                                if (!userUnchecked) {
                                    copyFieldValue(fieldName);
                                }
                            });
                        }
                    });
                }
                
                function hideBillingForm() {
                    var $billingForm = jQuery('[data-manage="billaddress"]');
                    $billingForm.addClass('billing-form-force-hide');
                }
                
                function showBillingForm() {
                    var $billingForm = jQuery('[data-manage="billaddress"]');
                    $billingForm.removeClass('billing-form-force-hide');
                }
                
                function setupCheckboxHandler() {
                    var $checkbox = jQuery('[data-action="same-as"]');
                    
                    if (!$checkbox.length) {
                        return;
                    }
                    
                    // Remove old handlers
                    $checkbox.off('change.custom');
                    
                    // Add new handler
                    $checkbox.on('change.custom', function() {
                        var isChecked = jQuery(this).is(':checked');
                        
                        if (isChecked) {
                            // CHECKED: Hide form and copy
                            userUnchecked = false;
                            copyAllFields();
                            bindShippingFieldListeners();
                            hideBillingForm();
                            
                        } else {
                            // UNCHECKED: Show form and clear
                            userUnchecked = true;
                            clearAllBillingFields();
                            showBillingForm();
                            
                            // Unbind listeners
                            Object.keys(fieldMap).forEach(function(fieldName) {
                                getShippingField(fieldName).off('keyup.sameas change.sameas blur.sameas');
                            });
                        }
                    });
                }
                
                function applyBillingDefaults() {
                    var $checkbox = jQuery('[data-action="same-as"]');
                    
                    if (!$checkbox.length) {
                        console.log('⚠️ Checkbox not found yet, will retry...');
                        return;
                    }
                    
                    console.log('✅ Checkbox found, applying defaults...');
                    
                    // Add the force hide CSS
                    addForceHideCSS();
                    
                    // Enable checkbox
                    $checkbox.prop('disabled', false);
                    
                    // Set initial state based on userUnchecked flag
                    if (!isInitialized || !userUnchecked) {
                        // First time or user hasn't manually unchecked
                        $checkbox.prop('checked', true);
                        hideBillingForm();
                        bindShippingFieldListeners();
                        console.log('✅ Billing form hidden, checkbox checked');
                    } else {
                        // User previously unchecked - respect that
                        $checkbox.prop('checked', false);
                        clearAllBillingFields();
                        showBillingForm();
                    }
                    
                    // Setup checkbox handler
                    setupCheckboxHandler();
                    
                    isInitialized = true;
                }
                
                // Apply immediately
                applyBillingDefaults();
                
                // Watch for re-renders
                var observer = new MutationObserver(function(mutations) {
                    var billingFormAdded = false;
                    
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            for (var i = 0; i < mutation.addedNodes.length; i++) {
                                var node = mutation.addedNodes[i];
                                if (node.nodeType === 1) {
                                    if (node.querySelector && node.querySelector('[data-manage="billaddress"]')) {
                                        billingFormAdded = true;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    
                    if (billingFormAdded) {
                        console.log('🔄 Billing form re-rendered');
                        setTimeout(applyBillingDefaults, 100);
                    }
                });
                
                var targetNode = document.querySelector('.order-wizard-step-content-wrapper');
                if (targetNode) {
                    observer.observe(targetNode, {
                        childList: true,
                        subtree: true
                    });
                    console.log('✅ Observer attached');
                } else {
                    console.warn('⚠️ Could not find target node for observer');
                }
                
                console.log('✅ Billing Same As Shipping - Fully Initialized');
            }
            
            // Execute with proper timing
            jQuery(document).ready(function() {
                console.log('📄 Document ready');
                setTimeout(startExtension, 1500);
            });
        }
    };
});
