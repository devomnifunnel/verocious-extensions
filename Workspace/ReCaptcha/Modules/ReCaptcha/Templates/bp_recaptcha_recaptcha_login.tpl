<!-- <div class="login-register-login-form-controls-group">
    <div id="login-recaptcha" class="g-recaptcha" data-sitekey="6Lcx--8pAAAAAD7OKEdGL6ibP3xNP_D-ehoWPc1l" ></div>
</div> -->

<div class="login-register-login-form-controls-group">
    <!-- Removed reCAPTCHA widget div -->
    <input type="hidden" name="g-recaptcha-response">
</div>

<script src="https://www.google.com/recaptcha/api.js?render={{siteKey}}"></script>

<script>
    var recaptcha1;
	var key = '{{siteKey}}';

	function onloadCallback1() {
		recaptcha1 = grecaptcha.render('login-recaptcha', {
			'sitekey': key
		});
	}
  
</script>
<!-- <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback1&render=explicit" async defer></script> -->