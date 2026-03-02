define(
    'OmniFunnelMarketing.MatrixQuickAddFix.MatrixQuickAddFix'
,   [
        'Cart.QuickAddToCart.View'
    ]
,   function (
        CartQuickAddToCartView
    )
{
    'use strict';

    return {
        mountToApp: function mountToApp(container)
        {
            // Store reference to the original initialize method
            var originalInitialize = CartQuickAddToCartView.prototype.initialize;

            // Override initialize to add matrix parent detection
            CartQuickAddToCartView.prototype.initialize = function ()
            {
                // Call the original initialize first
                // This sets this.showQuickAddToCartButton based on existing logic
                originalInitialize.apply(this, arguments);

                // After original logic runs, apply the matrix parent check
                if (this.showQuickAddToCartButton)
                {
                    try
                    {
                        var item = this.model.getItem();
                        var matrixPriceRange = item.get('onlinematrixpricerange');

                        if (matrixPriceRange && String(matrixPriceRange).trim().length > 0)
                        {
                            // This is a matrix parent item — hide the Add to Cart button.
                            // Required options (Color, Size, etc.) are not available on PLP.
                            // User must navigate to PDP to select options.
                            this.showQuickAddToCartButton = false;
                        }
                    }
                    catch (e)
                    {
                        // Fail silently — don't break the page
                        console.warn('MatrixQuickAddFix: Error checking matrix status', e);
                    }
                }
            };
        }
    };
});