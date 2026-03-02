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
