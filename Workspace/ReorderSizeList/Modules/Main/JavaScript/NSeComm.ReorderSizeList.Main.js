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
