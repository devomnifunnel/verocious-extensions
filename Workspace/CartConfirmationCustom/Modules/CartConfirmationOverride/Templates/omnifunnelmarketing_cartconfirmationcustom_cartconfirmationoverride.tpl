<div class="cart-confirmation-modal">
    <div class="cart-confirmation-modal-img">
        <img data-loader="false" src="{{resizeImage thumbnail.url 'main'}}" alt="{{thumbnail.altimagetext}}">
    </div>
    <div class="cart-confirmation-modal-details">
        <a href="{{model.item._url}}" class="cart-confirmation-modal-item-name">{{itemName}}</a>
        <div class="cart-confirmation-modal-price">
            <div data-view="Line.Price"></div>
        </div>
        <div data-view="Line.Sku" class="cart-confirmation-modal-sku"></div>
        <div class="cart-confirmation-modal-options">
            <div data-view="Line.SelectedOptions"></div>
        </div>
        {{#if showQuantity}}
            <div class="cart-confirmation-modal-quantity">
                <span class="cart-confirmation-modal-quantity-label">{{translate 'Quantity: '}}</span>
                <span class="cart-confirmation-modal-quantity-value">{{model.quantity}}</span>
            </div>
        {{/if}}
        <div class="cart-confirmation-modal-actions">
            <div class="cart-confirmation-modal-buttons-row">
                <a href="/cart" class="cart-confirmation-modal-view-cart-button">{{translate 'View Cart'}}</a>
                <a href="#" data-touchpoint="checkout" data-hashtag="#/" class="cart-confirmation-modal-checkout-button">{{translate 'Checkout'}}</a>
            </div>
            <div class="cart-confirmation-modal-continue-shopping">
                <button class="cart-confirmation-modal-continue-shopping-button" data-dismiss="modal">{{translate 'Continue Shopping'}}</button>
            </div>
        </div>
    </div>
</div>