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