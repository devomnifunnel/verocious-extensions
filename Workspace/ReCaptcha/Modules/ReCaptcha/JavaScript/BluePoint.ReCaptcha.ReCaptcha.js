define('BluePoint.ReCaptcha.ReCaptcha'
,   [
        'BluePoint.ReCaptcha.Loader',
        'BluePoint.ReCaptcha.ReCaptcha.Login.View',
        'BluePoint.ReCaptcha.Recaptcha.Register.View',
        'BluePoint.ReCaptcha.ReCaptcha.Checkout.View'
    ]
,   function (
        RecaptchaLoader,
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
            var environment = container.getComponent('Environment');
            var isactive = environment.getConfig('recaptcha.isactive');
            var checkout = container.getComponent('Checkout');

            if (!isactive) {
                return;
            }

            // Get site key from config
            var keyList = environment.getConfig('recaptcha.keylist');
            var siteKey = keyList[0].sitekey;
            var isVerocious = environment.getConfig('recaptcha.isverocious');

            // Initialize the shared loader with site key (loads NOTHING yet)
            RecaptchaLoader.initialize(siteKey);

            // Load reCAPTCHA api.js immediately on page load instead of
            // deferring until form submit. Reverts the March 10 2026
            // deferred-loading optimization to ensure the badge is visible
            // and Google's behavioural analysis runs before any submission,
            // and so any UI-bypass attempts cannot benefit from a window
            // where the script hasn't loaded yet.
            RecaptchaLoader.load();

            if (LoginRegisterPage) {
                LoginRegisterPage.addChildView('Login.Recaptcha', function () {
                    return new RecaptchaLoginView({
                        LoginRegisterPage: LoginRegisterPage,
                        application: container,
                        environment: environment,
                        isVerocious: isVerocious
                    });
                });
                LoginRegisterPage.addChildView('Register.Recaptcha', function () {
                    return new RecaptchaRegisterView({
                        LoginRegisterPage: LoginRegisterPage,
                        application: container,
                        environment: environment,
                        isVerocious: isVerocious
                    });
                });
            }

            if (checkout) {
                checkout.addChildView('Checkout.Recaptcha', function () {
                    return new RecaptchaCheckoutView({
                        LoginRegisterPage: checkout,
                        application: container,
                        environment: environment,
                        isVerocious: isVerocious
                    });
                });
            }
        }
    };
});
