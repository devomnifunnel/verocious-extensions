define('BluePoint.ReCaptcha.ReCaptcha.Login.View', [
    'bp_recaptcha_recaptcha_login.tpl'
,   'jQuery'
,   'Backbone'
,   'BluePoint.ReCaptcha.Loader'
,   'BluePoint.ReCaptcha.ReCaptcha.SS2Model'
], function (
    bp_recaptcha_recaptcha_login_tpl
,   jQuery
,   Backbone
,   RecaptchaLoader
,   RecaptchaModel
) {
    'use strict';

    return Backbone.View.extend({

        template: bp_recaptcha_recaptcha_login_tpl,

        initialize: function (options) {
            var self = this;
            this.application = options.application;
            this.isVerocious = options.isVerocious;

            this.recaptchaModel = new RecaptchaModel();

            this.options.LoginRegisterPage.on('beforeLogin', function () {
                var defer = jQuery.Deferred();

                // Loader handles loading api.js (once, async) + executing
                RecaptchaLoader.execute('login')
                    .then(function (token) {
                        self.$('input[name="g-recaptcha-response"]').val(token);

                        return self.recaptchaModel.fetch({
                            data: {
                                'token': token,
                                'isVerocious': self.isVerocious
                            }
                        });
                    })
                    .then(function (response) {
                        if (response.data && response.data.success) {
                            defer.resolve();
                        } else {
                            self.application.getLayout().showErrorInModal(
                                'Captcha validation failed. If you are not a robot then please try again.'
                            );
                            defer.reject();
                        }
                    })
                    .fail(function () {
                        self.application.getLayout().showErrorInModal(
                            'Captcha validation failed. Please try again.'
                        );
                        defer.reject();
                    });

                return defer.promise();
            });
        }

        , getContext: function getContext() {
            return {};
        }
    });
});