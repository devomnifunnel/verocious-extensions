define('BluePoint.ReCaptcha.Loader', [
    'jQuery'
], function (jQuery) {
    'use strict';

    var _siteKey = null;
    var _loadPromise = null;
    var _isLoaded = false;

    return {

        /**
         * Store the site key (does NOT load anything yet)
         * @param {string} siteKey
         */
        initialize: function initialize(siteKey) {
            _siteKey = siteKey;
        },

        /**
         * Load api.js ONCE, asynchronously
         * Returns a promise that resolves when grecaptcha is ready
         * Safe to call multiple times - only loads once
         * @returns {jQuery.Deferred.promise}
         */
        load: function load() {
            // If already loading or loaded, return existing promise
            if (_loadPromise) {
                return _loadPromise;
            }

            var deferred = jQuery.Deferred();
            _loadPromise = deferred.promise();

            // Create script element with async attribute
            var script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=' + _siteKey;
            script.async = true;
            script.defer = true;

            script.onload = function onApiLoaded() {
                // Wait for grecaptcha to be fully ready
                grecaptcha.ready(function onGrecaptchaReady() {
                    _isLoaded = true;
                    console.log('[ReCaptcha Loader] api.js loaded and ready (single instance).');
                    deferred.resolve(grecaptcha);
                });
            };

            script.onerror = function onApiError() {
                console.error('[ReCaptcha Loader] Failed to load api.js');
                _loadPromise = null; // Allow retry on next call
                deferred.reject(new Error('Failed to load reCAPTCHA api.js'));
            };

            document.head.appendChild(script);
            console.log('[ReCaptcha Loader] Loading api.js asynchronously...');

            return _loadPromise;
        },

        /**
         * Load (if needed) then execute reCAPTCHA and return a token
         * This is what the views call on form submit
         * @param {string} [action='login'] - reCAPTCHA action name
         * @returns {jQuery.Deferred.promise} Resolves with token string
         */
        execute: function execute(action) {
            return this.load().then(function onReady(grecaptcha) {
                return grecaptcha.execute(_siteKey, {
                    action: action || 'login'
                });
            });
        },

        /**
         * Check if reCAPTCHA has loaded
         * @returns {boolean}
         */
        isLoaded: function isLoaded() {
            return _isLoaded;
        },

        /**
         * Get the site key
         * @returns {string}
         */
        getSiteKey: function getSiteKey() {
            return _siteKey;
        }
    };
});