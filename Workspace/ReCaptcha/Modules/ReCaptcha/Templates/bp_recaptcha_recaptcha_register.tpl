<!-- <div class="login-register-register-form-controls-group">
    <div id="register-recaptcha" class="g-recaptcha" data-sitekey="6Lcx--8pAAAAAD7OKEdGL6ibP3xNP_D-ehoWPc1l" ></div>
</div> -->

<div class="login-register-register-form-controls-group">
    <!-- Removed reCAPTCHA widget div -->
    <input type="hidden" name="g-recaptcha-response-register">
</div>

<script src="https://www.google.com/recaptcha/api.js?render={{siteKey}}"></script>

<script>
    var recaptcha2;
	var key = '{{siteKey}}';

	function onloadCallback2() {
		recaptcha2 = grecaptcha.render('register-recaptcha', {
			'sitekey': key
		});
	}
</script>
<!-- <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback2&render=explicit" async defer></script> -->
