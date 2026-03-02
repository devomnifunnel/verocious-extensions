
define('BluePoint.ReCaptcha.ReCaptcha'
,   [
		'BluePoint.ReCaptcha.ReCaptcha.Login.View',
		'BluePoint.ReCaptcha.Recaptcha.Register.View',
		'BluePoint.ReCaptcha.ReCaptcha.Checkout.View'
	]
,   function (
		RecaptchaLoginView,
		RecaptchaRegisterView,
		RecaptchaCheckoutView
	)
{
	'use strict';

	return  {
		mountToApp: function mountToApp (container)
		{
			var LoginRegisterPage = container.getComponent('LoginRegisterPage');
			var environment = container.getComponent("Environment");
			var isactive = environment.getConfig('recaptcha.isactive');
			var checkout = container.getComponent('Checkout');
			var layout = container.getComponent('Layout');
			var self = this;

			if (isactive && LoginRegisterPage) {
				LoginRegisterPage.addChildView('Login.Recaptcha', function () {
					return new RecaptchaLoginView({ LoginRegisterPage: LoginRegisterPage, application: container, environment: environment });
				});
				LoginRegisterPage.addChildView('Register.Recaptcha', function () {
					return new RecaptchaRegisterView({ LoginRegisterPage: LoginRegisterPage, application: container, environment: environment });
				});
			}

			if (isactive && checkout) {
				checkout.addChildView('Checkout.Recaptcha', function () {
					return new RecaptchaCheckoutView({ LoginRegisterPage: checkout, application: container, environment: environment });
				});
				// layout.addToViewContextDefinition('OrderWizard.Step', 'isReview', 'boolean', function (context) {
				// 	var isReview = false
					
				// 	if (window.location.hash && window.location.hash.indexOf('review') !== -1) {
				// 		isReview = true;
				// 	}
				// 	return isReview
				// });
			}
		}
	};
});
