define('BluePoint.ReCaptcha.Recaptcha.Register.View'
	, [
		'bp_recaptcha_recaptcha_register.tpl'
	, 	'jQuery'
	, 	'Backbone'
	, 	'BluePoint.ReCaptcha.ReCaptcha.SS2Model'
	]
	, function (
		bp_recaptcha_recaptcha_register_tpl
	, 	jQuery
	, 	Backbone
	, 	RecaptchaModel
	) {
		'use strict';

		// @class WB.GoogleRecaptchaApruvd.Recaptcha.View @extends Backbone.View
		return Backbone.View.extend({

			template: bp_recaptcha_recaptcha_register_tpl,

			initialize: function (options) {
				var self = this;
				this.application = options.application;
				this.environment = options.environment;
				var keyList = this.environment.getConfig('recaptcha.keylist');
				var siteKey = keyList[0].sitekey;
				var isVerocious = this.environment.getConfig('recaptcha.isverocious');

				this.recaptchaModel = new RecaptchaModel();

				this.options.LoginRegisterPage.on('beforeRegister', function () {
					var defer = jQuery.Deferred();

					grecaptcha.ready(function () {
						grecaptcha.execute(siteKey, { action: 'login' }).then(function (token) {
							self.$('input[name="g-recaptcha-response-register"]').val(token);
							self.recaptchaModel.fetch({
								data: {
									'token': token,
									'isVerocious': isVerocious
								}
							}).done(function (response) {
								if (response.data && response.data.success) {
									defer.resolve();
								} else {
									self.application.getLayout().showErrorInModal('Captcha validation failed. If you are not a robot then please try again.');
									defer.reject();
								}
							}).fail(function () {
								defer.reject();
							});
						});
					});
					return defer.promise();
				});
			}

			, getContext: function getContext() {
				var keyList = this.environment.getConfig('recaptcha.keylist');
				var siteKey = keyList[0].sitekey;
				return {
					siteKey: siteKey
				};
			}
		});
	});
