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
