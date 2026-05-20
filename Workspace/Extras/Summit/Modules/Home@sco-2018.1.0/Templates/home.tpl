{{! Edited for Summit Theme }}

{{#if extraHome.isReady}}
<div class="home-nopad">

	<!-- CAROUSEL -->
	{{#if extraHome.showCarousel}}

	<!-- PRELOAD LCP IMAGE — Makes first carousel image discoverable immediately -->
	{{#each extraHome.carousel}}
		{{#unless @index}}
			{{#if isAbsoluteUrl}}
	<link rel="preload" href="{{image}}" as="image" fetchpriority="high" />
			{{else}}
	<link rel="preload" href="{{getThemeAssetsPathWithDefault image 'img/summit-carousel-home-1.jpg'}}" as="image" fetchpriority="high" />
			{{/if}}
		{{/unless}}
	{{/each}}

	<!-- PRELOAD INFOBLOCK LCP IMAGE — Lighthouse identifies .home-infoblock0 as LCP element -->
	{{#if extraHome.showInfoblocks}}
		{{#each extraHome.infoblock}}
			{{#unless @index}}
	<link rel="preload" href="{{getThemeAssetsPathWithDefault image}}" as="image" fetchpriority="high" />
			{{/unless}}
		{{/each}}
	{{/if}}

	<!-- LCP IMAGE VISIBILITY FIX — Must be BEFORE carousel renders -->
	<style>
		.home-slide-main-container-lcp .home-slide-image-lcp {
			display: block !important;
			width: 100% !important;
			height: auto !important;
			position: relative !important;
			opacity: 1 !important;
			visibility: visible !important;
		}
		.home-slide-main-container-lcp {
			background-image: none !important;
		}
	</style>

	<!-- Extended Carousel to include slide text and links, overrides standard carousel -->
	<div class="home-slider-container">
		<div class="home-image-slider">
			<ul data-slider id="home-image-slider-list" class="home-image-slider-list">
				{{#each extraHome.carousel}}
					<li class="{{#if text}}caption-on{{/if}} {{#if title}}caption-on{{/if}} {{#if linktext}}caption-on{{/if}}">
						{{#unless @index}}
						{{!-- FIRST SLIDE (index 0): Eager load — this is the LCP image --}}
						<div class="home-slide-main-container home-slide-main-container-lcp home-slide{{@index}}
						{{#if imageBehaviour}}
															use-image
														{{else}}
															{{#if backgroundCrop}}
																	{{backgroundCrop}}
															{{/if}}
														{{/if}}
														{{#if isAbsoluteUrl}}
															use-image
														{{/if}}"
							{{#if isAbsoluteUrl}}
								style="background-image: url({{image}}) "
							{{else}}
								style="background-image: url({{getThemeAssetsPathWithDefault image 'img/summit-carousel-home-1.jpg'}}) "
							{{/if}}>
							<a{{objectToAtrributes item}} class="home-slide-wrap-link">
	                                <img src="
	                                    {{#if isAbsoluteUrl}}
	                                        {{image}}
	                                    {{else}}
	                                        {{getThemeAssetsPathWithDefault image 'img/summit-carousel-home-1.jpg'}}
	                                    {{/if}}"
										width="1170"
										height="400"
	                                    class="home-slide-image home-slide-image-lcp {{#if imageMobile}}hide-small{{/if}} {{#if backgroundCrop}}
																					{{backgroundCrop}}
																			{{/if}}" fetchpriority="high" />
																	{{#if imageMobile}}
																		<img src="{{imageMobile}}" width="1170" height="400" class="home-slide-image-mobile" fetchpriority="high" />
																	{{/if}}
																</a>

								<div class="home-slide-caption {{#if captionSide}}{{captionSide}}{{/if}} {{#if text}}caption-display{{/if}} {{#if title}}caption-display{{/if}} {{#if linktext}}caption-display{{/if}} {{#if isAbsoluteUrl}}carousel-center-box{{/if}}">
								 			<div class="home-slide-caption-content {{captionTextAlign}}">

								     			{{#if title}}<h2 class="home-slide-caption-title" style="color:{{captionColor}}">{{title}}</h2>{{/if}}
								     			{{#if text}}<p style="color:{{captionColor}}">{{{text}}}</p>{{/if}}

													{{#if linktext}}
									     			<div class="home-slide-caption-button-container">
									         			<a{{objectToAtrributes item}} class="home-slide-caption-button">{{#if linktext}}{{linktext}}{{else}}{{translate 'Shop now'}}{{/if}} <i class="home-slide-button-icon"></i></a>
									     			</div>
													{{/if}}
								 			</div>
								</div>
						</div>
						{{else}}
						{{!-- NON-FIRST SLIDES (index 1+): Lazy load --}}
						<div class="home-slide-main-container home-slide{{@index}}
						{{#if imageBehaviour}}
															use-image
														{{else}}
															{{#if backgroundCrop}}
																	{{backgroundCrop}}
															{{/if}}
														{{/if}}
														{{#if isAbsoluteUrl}}
															use-image
														{{/if}}"
							{{#if isAbsoluteUrl}}
								data-lazy-bg="{{image}}"
							{{else}}
								data-lazy-bg="{{getThemeAssetsPathWithDefault image 'img/summit-carousel-home-1.jpg'}}"
							{{/if}}>
							<a{{objectToAtrributes item}} class="home-slide-wrap-link">
	                                <img data-lazy-src="
	                                    {{#if isAbsoluteUrl}}
	                                        {{image}}
	                                    {{else}}
	                                        {{getThemeAssetsPathWithDefault image 'img/summit-carousel-home-1.jpg'}}
	                                    {{/if}}"
	                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
										width="1170"
										height="400"
	                                    class="home-slide-image {{#if imageMobile}}hide-small{{/if}} {{#if backgroundCrop}}
																					{{backgroundCrop}}
																			{{/if}}" loading="lazy" />
																	{{#if imageMobile}}
																		<img data-lazy-src="{{imageMobile}}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width="1170" height="400" class="home-slide-image-mobile" loading="lazy" />
																	{{/if}}
																</a>

								<div class="home-slide-caption {{#if captionSide}}{{captionSide}}{{/if}} {{#if text}}caption-display{{/if}} {{#if title}}caption-display{{/if}} {{#if linktext}}caption-display{{/if}} {{#if isAbsoluteUrl}}carousel-center-box{{/if}}">
								 			<div class="home-slide-caption-content {{captionTextAlign}}">

								     			{{#if title}}<h2 class="home-slide-caption-title" style="color:{{captionColor}}">{{title}}</h2>{{/if}}
								     			{{#if text}}<p style="color:{{captionColor}}">{{{text}}}</p>{{/if}}

													{{#if linktext}}
									     			<div class="home-slide-caption-button-container">
									         			<a{{objectToAtrributes item}} class="home-slide-caption-button">{{#if linktext}}{{linktext}}{{else}}{{translate 'Shop now'}}{{/if}} <i class="home-slide-button-icon"></i></a>
									     			</div>
													{{/if}}
								 			</div>
								</div>
						</div>
						{{/unless}}
					</li>
				{{/each}}
			</ul>
		</div>
	</div>

	<!-- CAROUSEL LAZY LOADER — Positioned immediately after carousel, inside showCarousel block -->
	<script>
	(function() {
		'use strict';

		function loadSlide(el) {
			if (!el) return;
			var imgs = el.querySelectorAll('img[data-lazy-src]');
			for (var i = 0; i < imgs.length; i++) {
				var lazySrc = imgs[i].getAttribute('data-lazy-src');
				if (lazySrc) {
					imgs[i].setAttribute('src', lazySrc.trim());
					imgs[i].removeAttribute('data-lazy-src');
				}
			}
			var bgs = el.querySelectorAll('[data-lazy-bg]');
			for (var j = 0; j < bgs.length; j++) {
				var lazyBg = bgs[j].getAttribute('data-lazy-bg');
				if (lazyBg) {
					bgs[j].style.backgroundImage = 'url(' + lazyBg.trim() + ')';
					bgs[j].removeAttribute('data-lazy-bg');
				}
			}
		}

		var attempts = 0;
		var poller = setInterval(function() {
			attempts++;
			var vp = document.querySelector('.home-image-slider .bx-viewport');

			if (!vp && attempts < 100) return;
			clearInterval(poller);

			if (!vp) {
				var fallback = document.querySelectorAll('#home-image-slider-list li');
				for (var f = 0; f < fallback.length; f++) loadSlide(fallback[f]);
				return;
			}

			var allSlides = vp.querySelectorAll('ul > li');

			for (var s = 0; s < allSlides.length; s++) {
				if (allSlides[s].classList.contains('bx-clone')) {
					loadSlide(allSlides[s]);
					continue;
				}
				var div = allSlides[s].querySelector('.home-slide-main-container');
				if (div && /\bhome-slide1\b/.test(div.className)) {
					loadSlide(allSlides[s]);
				}
			}

			var ul = vp.querySelector('ul');
			if (ul && window.MutationObserver) {
				new MutationObserver(function() {
					var items = vp.querySelectorAll('ul > li');
					var vw = window.innerWidth || 1200;
					for (var i = 0; i < items.length; i++) {
						if (!items[i].querySelector('img[data-lazy-src]') &&
							!items[i].querySelector('[data-lazy-bg]')) continue;
						var rect = items[i].getBoundingClientRect();
						if (rect.right > -vw && rect.left < vw * 2) {
							loadSlide(items[i]);
						}
					}
				}).observe(ul, { attributes: true, attributeFilter: ['style'] });
			}

			setTimeout(function() {
				var rem = document.querySelectorAll('.home-image-slider img[data-lazy-src]');
				for (var r = 0; r < rem.length; r++) {
					rem[r].setAttribute('src', rem[r].getAttribute('data-lazy-src').trim());
					rem[r].removeAttribute('data-lazy-src');
				}
				var bg = document.querySelectorAll('.home-image-slider [data-lazy-bg]');
				for (var b = 0; b < bg.length; b++) {
					bg[b].style.backgroundImage = 'url(' + bg[b].getAttribute('data-lazy-bg').trim() + ')';
					bg[b].removeAttribute('data-lazy-bg');
				}
			}, 10000);
		}, 50);
	})();
	</script>

	{{else}}
	<!-- Standard Carousel -->
	<div class="home-slider-container">
		<div class="home-image-slider">
			<ul data-slider data-slider class="home-image-slider-list">
				{{#each carouselImages}}
					<li>
						<div class="home-slide-main-container" style="background-image: url({{this}});">
							<img src="{{this}}" width="1170" height="400" class="home-slide-image" style="display: none;" />
							<div class="home-slide-caption">
								<h2 class="home-slide-caption-title">SAMPLE HEADLINE</h2>
								<p>Example descriptive text displayed on multiple lines.</p>
								<div class="home-slide-caption-button-container">
									<a href="/search" class="home-slide-caption-button">Shop Now <i class="home-slide-button-icon"></i></a>
								</div>
							</div>
						</div>
					</li>
				{{else}}
					<li>
						<div class="home-slide-main-container" style="background-image: url({{getThemeAssetsPath 'img/summit-carousel-home-1.jpg'}});">
							<img src="{{getThemeAssetsPath 'img/summit-carousel-home-1.jpg'}}" width="1170" height="400" class="home-slide-image" style="display: none;" />
							<div class="home-slide-caption">
								<h2 class="home-slide-caption-title">{{translate 'Free Shipping'}}</h2>
								<p>{{translate 'on all cleaning products. The weekend only. Use code: YEAHBUDDY'}}</p>
								<div class="home-slide-caption-button-container">
									<a href="/search" class="home-slide-caption-button">{{translate 'Shop Now'}} <i class="home-slide-button-icon"></i></a>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="home-slide-main-container" style="background-image: url({{getThemeAssetsPath 'img/summit-carousel-home-2.jpg'}});">
							<img src="{{getThemeAssetsPath 'img/summit-carousel-home-2.jpg'}}" width="1170" height="400" class="home-slide-image" style="display: none;" />
							<div class="home-slide-caption">
								<h2 class="home-slide-caption-title">{{translate 'Quick Turnaround Times'}}</h2>
								<p>{{translate 'from deep groove to angular contact'}}</p>
								<div class="home-slide-caption-button-container">
									<a href="/search" class="home-slide-caption-button">{{translate 'Get the best price'}} <i class="home-slide-button-icon"></i></a>
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="home-slide-main-container" style="background-image: url({{getThemeAssetsPath 'img/summit-carousel-home-3.jpg'}});">
							<img src="{{getThemeAssetsPath 'img/summit-carousel-home-3.jpg'}}" width="1170" height="400" class="home-slide-image" style="display: none;" />
							<div class="home-slide-caption">
								<h2 class="home-slide-caption-title">{{translate 'Wiring Solutions'}}</h2>
								<p>{{translate 'including cord grips and ferrules'}}</p>
								<div class="home-slide-caption-button-container">
									<a href="/search" class="home-slide-caption-button">{{translate 'View products'}} <i class="home-slide-button-icon"></i></a>
								</div>
							</div>
						</div>
					</li>
				{{/each}}
			</ul>
		</div>
	</div>
	{{/if}}
</div>
{{/if}}

<div class="home-nopad">
	<div class="home-cms-zone" data-cms-area="home_content_top" data-cms-area-filters="path"></div>

	<!-- CMS MERCHANDISING ZONE -->
	<div class="home-merchandizing-zone">
		<div class="home-merchandizing-zone-content">
			<div data-cms-area="home_merchandizing_zone" data-cms-area-filters="path"></div>
		</div>
	</div>

	<!--
    INFOBLOCKS
    Use the Configuration section under Layout > Infoblocks
	Two infoblocks per row
	-->
	{{#if extraHome.showInfoblocks}}
    <div class="home-infoblock-layout">
        {{#each extraHome.infoblock}}
		{{#unless @index}}
		{{!-- FIX B: FIRST INFOBLOCK (index 0) — LCP element, eager load with fetchpriority="high" --}}
		<a href="{{href}}" class="home-infoblock-link">
			<div class="home-infoblock home-infoblock{{@index}}"{{#if color}} style="background-color: {{color}};"{{/if}}>
				{{#if image}}
				<img src="{{getThemeAssetsPathWithDefault image}}"
					 alt="{{#if title}}{{title}}{{else}}Shop Now{{/if}}"
					 fetchpriority="high"
					 width="800"
					 height="600"
					 class="home-infoblock-image" />
				{{/if}}
				<div class="home-infoblock-content">
					{{#if title}}
		            <h2 class="home-infoblock-title">{{title}}</h2>
					{{/if}}
					{{#if text}}
		            <h3 class="home-infoblock-text">{{text}}</h3>
					{{/if}}
		        </div>
			</div>
		</a>
		{{else}}
		{{!-- REMAINING INFOBLOCKS (index 1+) — Below fold, lazy loaded --}}
		<a href="{{href}}" class="home-infoblock-link">
			<div class="home-infoblock home-infoblock{{@index}}"{{#if color}} style="background-color: {{color}};"{{/if}}>
				{{#if image}}
				<img src="{{getThemeAssetsPathWithDefault image}}"
					 alt="{{#if title}}{{title}}{{else}}Shop Now{{/if}}"
					 loading="lazy"
					 width="800"
					 height="600"
					 class="home-infoblock-image" />
				{{/if}}
				<div class="home-infoblock-content">
					{{#if title}}
		            <h2 class="home-infoblock-title">{{title}}</h2>
					{{/if}}
					{{#if text}}
		            <h3 class="home-infoblock-text">{{text}}</h3>
					{{/if}}
		        </div>
			</div>
		</a>
		{{/unless}}
		{{/each}}
	</div>
	{{/if}}

	<div class="home-cms-zone" data-cms-area="home_content_middle" data-cms-area-filters="path"></div>
</div>

<div class="home">
	<!-- FREE TEXT AND IMAGES -->
	<!-- With support if Theme Extension is not used -->
	{{#if extraHome.freeText}}
	<div class="home-page-freetext-wrapper">
		<div class="home-page-freetext">

			<div class="home-page-freetext-content">
		        <div class="home-page-freetext-content-text">
					<div class="home-page-freetext-content-header">
				        <h3>{{#if extraHome.freeTextTitle}}{{extraHome.freeTextTitle}}{{else}}{{translate 'RELIABILITY, QUALITY & POWER'}}{{/if}}</h3>
				    </div>
		        	{{#if extraHome.freeText}}
						<div class="home-page-freetext-text">{{{extraHome.freeText}}}</div>
					{{else}}
						<div class="home-page-freetext-text">
							<p>{{translate 'We Mean Business when it comes to getting you the Products and Customer Service you need... when you need them.'}}</p>
							<p>{{translate "In today's extremely agressive marketplace, all companies face the issues of global competition and the ever increasing costs of operating a business environment. We created a low-overhead business model and an extremely efficient global supply chain that are the envy of our customers. At Summit we provide our customer with high-quality industrial control products at extremely low prices."}}</p>
						</div>
					{{/if}}
		        </div>
				{{#if extraHome.showFreeTextImages}}
		        <div class="home-page-freetext-content-images-wrapper">
					{{#each extraHome.freeTextImages}}
	                <div class="home-page-freetext-content-image"><a href="{{href}}"><img src="{{getThemeAssetsPathWithDefault image}}" width="1080" height="648" alt="Fresh Produce MFG" style="width: 100%; height: auto;"></a></div>
					{{/each}}
		        </div>
				{{else}}
				<div class="home-page-freetext-content-images-wrapper">
					<div class="home-page-freetext-content-image"><a href="{{href}}"><img src="{{getThemeAssetsPath 'img/summit-freetextimage.jpg'}}" width="1080" height="648" alt="Fresh Produce MFG" style="width: 100%; height: auto;"></a></div>
				</div>
		        {{/if}}
		    </div>

		</div>
	</div>
	{{/if}}
</div>

<div class="home-nopad">
    <div class="home-cms-zone" data-cms-area="home_content_bottom" data-cms-area-filters="path"></div>
</div>


{{!----
Use the following context variables when customizing this template:

	imageHomeSize (String)
	imageHomeSizeBottom (String)
	carouselImages (Array)
	bottomBannerImages (Array)

----}}