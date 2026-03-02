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
