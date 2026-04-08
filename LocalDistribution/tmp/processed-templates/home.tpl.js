define('home.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"home-nopad\">\n\n	<!-- CAROUSEL -->\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"showCarousel") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(60, data, 0),"data":data,"loc":{"start":{"line":7,"column":1},"end":{"line":299,"column":8}}})) != null ? stack1 : "")
    + "</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n	<!-- PRELOAD LCP IMAGE — Makes first carousel image discoverable immediately -->\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"carousel") : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":10,"column":1},"end":{"line":18,"column":10}}})) != null ? stack1 : "")
    + "\n	<!-- PRELOAD INFOBLOCK LCP IMAGE — Lighthouse identifies .home-infoblock0 as LCP element -->\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"showInfoblocks") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":1},"end":{"line":27,"column":8}}})) != null ? stack1 : "")
    + "\n	<!-- LCP IMAGE VISIBILITY FIX — Must be BEFORE carousel renders -->\n	<style>\n		.home-slide-main-container-lcp .home-slide-image-lcp {\n			display: block !important;\n			width: 100% !important;\n			height: auto !important;\n			position: relative !important;\n			opacity: 1 !important;\n			visibility: visible !important;\n		}\n		.home-slide-main-container-lcp {\n			background-image: none !important;\n		}\n	</style>\n\n	<!-- Extended Carousel to include slide text and links, overrides standard carousel -->\n	<div class=\"home-slider-container\">\n		<div class=\"home-image-slider\">\n			<ul data-slider id=\"home-image-slider-list\" class=\"home-image-slider-list\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"carousel") : stack1),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":4},"end":{"line":151,"column":13}}})) != null ? stack1 : "")
    + "			</ul>\n		</div>\n	</div>\n\n	<!-- CAROUSEL LAZY LOADER — Positioned immediately after carousel, inside showCarousel block -->\n	<script>\n	(function() {\n		'use strict';\n\n		function loadSlide(el) {\n			if (!el) return;\n			var imgs = el.querySelectorAll('img[data-lazy-src]');\n			for (var i = 0; i < imgs.length; i++) {\n				var lazySrc = imgs[i].getAttribute('data-lazy-src');\n				if (lazySrc) {\n					imgs[i].setAttribute('src', lazySrc.trim());\n					imgs[i].removeAttribute('data-lazy-src');\n				}\n			}\n			var bgs = el.querySelectorAll('[data-lazy-bg]');\n			for (var j = 0; j < bgs.length; j++) {\n				var lazyBg = bgs[j].getAttribute('data-lazy-bg');\n				if (lazyBg) {\n					bgs[j].style.backgroundImage = 'url(' + lazyBg.trim() + ')';\n					bgs[j].removeAttribute('data-lazy-bg');\n				}\n			}\n		}\n\n		var attempts = 0;\n		var poller = setInterval(function() {\n			attempts++;\n			var vp = document.querySelector('.home-image-slider .bx-viewport');\n\n			if (!vp && attempts < 100) return;\n			clearInterval(poller);\n\n			if (!vp) {\n				var fallback = document.querySelectorAll('#home-image-slider-list li');\n				for (var f = 0; f < fallback.length; f++) loadSlide(fallback[f]);\n				return;\n			}\n\n			var allSlides = vp.querySelectorAll('ul > li');\n\n			for (var s = 0; s < allSlides.length; s++) {\n				if (allSlides[s].classList.contains('bx-clone')) {\n					loadSlide(allSlides[s]);\n					continue;\n				}\n				var div = allSlides[s].querySelector('.home-slide-main-container');\n				if (div && /\\bhome-slide1\\b/.test(div.className)) {\n					loadSlide(allSlides[s]);\n				}\n			}\n\n			var ul = vp.querySelector('ul');\n			if (ul && window.MutationObserver) {\n				new MutationObserver(function() {\n					var items = vp.querySelectorAll('ul > li');\n					var vw = window.innerWidth || 1200;\n					for (var i = 0; i < items.length; i++) {\n						if (!items[i].querySelector('img[data-lazy-src]') &&\n							!items[i].querySelector('[data-lazy-bg]')) continue;\n						var rect = items[i].getBoundingClientRect();\n						if (rect.right > -vw && rect.left < vw * 2) {\n							loadSlide(items[i]);\n						}\n					}\n				}).observe(ul, { attributes: true, attributeFilter: ['style'] });\n			}\n\n			setTimeout(function() {\n				var rem = document.querySelectorAll('.home-image-slider img[data-lazy-src]');\n				for (var r = 0; r < rem.length; r++) {\n					rem[r].setAttribute('src', rem[r].getAttribute('data-lazy-src').trim());\n					rem[r].removeAttribute('data-lazy-src');\n				}\n				var bg = document.querySelectorAll('.home-image-slider [data-lazy-bg]');\n				for (var b = 0; b < bg.length; b++) {\n					bg[b].style.backgroundImage = 'url(' + bg[b].getAttribute('data-lazy-bg').trim() + ')';\n					bg[b].removeAttribute('data-lazy-bg');\n				}\n			}, 10000);\n		}, 50);\n	})();\n	</script>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(data && compilerNameLookup(data,"index")),{"name":"unless","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":11,"column":2},"end":{"line":17,"column":13}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":12,"column":3},"end":{"line":16,"column":10}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "	<link rel=\"preload\" href=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"image") || (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"image","hash":{},"data":data,"loc":{"start":{"line":13,"column":27},"end":{"line":13,"column":36}}}) : helper)))
    + "\" as=\"image\" fetchpriority=\"high\" />\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "	<link rel=\"preload\" href=\""
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),"img/summit-carousel-home-1.jpg",{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":15,"column":27},"end":{"line":15,"column":99}}}))
    + "\" as=\"image\" fetchpriority=\"high\" />\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"infoblock") : stack1),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":2},"end":{"line":26,"column":11}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(data && compilerNameLookup(data,"index")),{"name":"unless","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":23,"column":3},"end":{"line":25,"column":14}}})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    return "	<link rel=\"preload\" href=\""
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":24,"column":27},"end":{"line":24,"column":66}}}))
    + "\" as=\"image\" fetchpriority=\"high\" />\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "					<li class=\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":16},"end":{"line":49,"column":45}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":46},"end":{"line":49,"column":76}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":77},"end":{"line":49,"column":110}}})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = compilerNameLookup(helpers,"unless").call(alias1,(data && compilerNameLookup(data,"index")),{"name":"unless","hash":{},"fn":container.program(16, data, 0),"inverse":container.program(53, data, 0),"data":data,"loc":{"start":{"line":50,"column":6},"end":{"line":149,"column":17}}})) != null ? stack1 : "")
    + "					</li>\n";
},"14":function(container,depth0,helpers,partials,data) {
    return "caption-on";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "						<div class=\"home-slide-main-container home-slide-main-container-lcp home-slide"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"index") || (data && compilerNameLookup(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":52,"column":84},"end":{"line":52,"column":94}}}) : helper)))
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"imageBehaviour") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":53,"column":6},"end":{"line":59,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":60,"column":14},"end":{"line":62,"column":21}}})) != null ? stack1 : "")
    + "\"\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.program(26, data, 0),"data":data,"loc":{"start":{"line":63,"column":7},"end":{"line":67,"column":14}}})) != null ? stack1 : "")
    + ">\n							<a"
    + alias4((compilerNameLookup(helpers,"objectToAtrributes")||(depth0 && compilerNameLookup(depth0,"objectToAtrributes"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"item") : depth0),{"name":"objectToAtrributes","hash":{},"data":data,"loc":{"start":{"line":68,"column":9},"end":{"line":68,"column":36}}}))
    + " class=\"home-slide-wrap-link\">\n	                                <img src=\"\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(30, data, 0),"data":data,"loc":{"start":{"line":70,"column":37},"end":{"line":74,"column":44}}})) != null ? stack1 : "")
    + "\"\n										width=\"1170\"\n										height=\"400\"\n	                                    class=\"home-slide-image home-slide-image-lcp "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"imageMobile") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":77,"column":82},"end":{"line":77,"column":118}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"backgroundCrop") : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":77,"column":119},"end":{"line":79,"column":26}}})) != null ? stack1 : "")
    + "\" fetchpriority=\"high\" />\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"imageMobile") : depth0),{"name":"if","hash":{},"fn":container.program(36, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":80,"column":17},"end":{"line":82,"column":24}}})) != null ? stack1 : "")
    + "																</a>\n\n								<div class=\"home-slide-caption "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"captionSide") : depth0),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":85,"column":39},"end":{"line":85,"column":80}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":85,"column":81},"end":{"line":85,"column":115}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":85,"column":116},"end":{"line":85,"column":151}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":85,"column":152},"end":{"line":85,"column":190}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":85,"column":191},"end":{"line":85,"column":238}}})) != null ? stack1 : "")
    + "\">\n								 			<div class=\"home-slide-caption-content "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"captionTextAlign") || (depth0 != null ? compilerNameLookup(depth0,"captionTextAlign") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"captionTextAlign","hash":{},"data":data,"loc":{"start":{"line":86,"column":51},"end":{"line":86,"column":71}}}) : helper)))
    + "\">\n\n								     			"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":88,"column":16},"end":{"line":88,"column":118}}})) != null ? stack1 : "")
    + "\n								     			"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":89,"column":16},"end":{"line":89,"column":83}}})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":91,"column":13},"end":{"line":95,"column":20}}})) != null ? stack1 : "")
    + "								 			</div>\n								</div>\n						</div>\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "															use-image\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"backgroundCrop") : depth0),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":56,"column":15},"end":{"line":58,"column":22}}})) != null ? stack1 : "");
},"20":function(container,depth0,helpers,partials,data) {
    var helper;

  return "																	"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"backgroundCrop") || (depth0 != null ? compilerNameLookup(depth0,"backgroundCrop") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"backgroundCrop","hash":{},"data":data,"loc":{"start":{"line":57,"column":17},"end":{"line":57,"column":35}}}) : helper)))
    + "\n";
},"22":function(container,depth0,helpers,partials,data) {
    return "															use-image\n														";
},"24":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								style=\"background-image: url("
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"image") || (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"image","hash":{},"data":data,"loc":{"start":{"line":64,"column":37},"end":{"line":64,"column":46}}}) : helper)))
    + ") \"\n";
},"26":function(container,depth0,helpers,partials,data) {
    return "								style=\"background-image: url("
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),"img/summit-carousel-home-1.jpg",{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":66,"column":37},"end":{"line":66,"column":109}}}))
    + ") \"\n							";
},"28":function(container,depth0,helpers,partials,data) {
    var helper;

  return "	                                        "
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"image") || (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"image","hash":{},"data":data,"loc":{"start":{"line":71,"column":41},"end":{"line":71,"column":50}}}) : helper)))
    + "\n";
},"30":function(container,depth0,helpers,partials,data) {
    return "	                                        "
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),"img/summit-carousel-home-1.jpg",{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":73,"column":41},"end":{"line":73,"column":113}}}))
    + "\n	                                    ";
},"32":function(container,depth0,helpers,partials,data) {
    return "hide-small";
},"34":function(container,depth0,helpers,partials,data) {
    var helper;

  return "\n																					"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"backgroundCrop") || (depth0 != null ? compilerNameLookup(depth0,"backgroundCrop") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"backgroundCrop","hash":{},"data":data,"loc":{"start":{"line":78,"column":21},"end":{"line":78,"column":39}}}) : helper)))
    + "\n																			";
},"36":function(container,depth0,helpers,partials,data) {
    var helper;

  return "																		<img src=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"imageMobile") || (depth0 != null ? compilerNameLookup(depth0,"imageMobile") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imageMobile","hash":{},"data":data,"loc":{"start":{"line":81,"column":28},"end":{"line":81,"column":43}}}) : helper)))
    + "\" width=\"1170\" height=\"400\" class=\"home-slide-image-mobile\" fetchpriority=\"high\" />\n";
},"38":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"captionSide") || (depth0 != null ? compilerNameLookup(depth0,"captionSide") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"captionSide","hash":{},"data":data,"loc":{"start":{"line":85,"column":58},"end":{"line":85,"column":73}}}) : helper)));
},"40":function(container,depth0,helpers,partials,data) {
    return "caption-display";
},"42":function(container,depth0,helpers,partials,data) {
    return "carousel-center-box";
},"44":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<h2 class=\"home-slide-caption-title\" style=\"color:"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"captionColor") || (depth0 != null ? compilerNameLookup(depth0,"captionColor") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"captionColor","hash":{},"data":data,"loc":{"start":{"line":88,"column":79},"end":{"line":88,"column":95}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":88,"column":97},"end":{"line":88,"column":106}}}) : helper)))
    + "</h2>";
},"46":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function";

  return "<p style=\"color:"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"captionColor") || (depth0 != null ? compilerNameLookup(depth0,"captionColor") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"captionColor","hash":{},"data":data,"loc":{"start":{"line":89,"column":44},"end":{"line":89,"column":60}}}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":89,"column":62},"end":{"line":89,"column":72}}}) : helper))) != null ? stack1 : "")
    + "</p>";
},"48":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "									     			<div class=\"home-slide-caption-button-container\">\n									         			<a"
    + container.escapeExpression((compilerNameLookup(helpers,"objectToAtrributes")||(depth0 && compilerNameLookup(depth0,"objectToAtrributes"))||container.hooks.helperMissing).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"item") : depth0),{"name":"objectToAtrributes","hash":{},"data":data,"loc":{"start":{"line":93,"column":23},"end":{"line":93,"column":50}}}))
    + " class=\"home-slide-caption-button\">"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0),{"name":"if","hash":{},"fn":container.program(49, data, 0),"inverse":container.program(51, data, 0),"data":data,"loc":{"start":{"line":93,"column":85},"end":{"line":93,"column":152}}})) != null ? stack1 : "")
    + " <i class=\"home-slide-button-icon\"></i></a>\n									     			</div>\n";
},"49":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"linktext") || (depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"linktext","hash":{},"data":data,"loc":{"start":{"line":93,"column":101},"end":{"line":93,"column":113}}}) : helper)));
},"51":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Shop now",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":93,"column":121},"end":{"line":93,"column":145}}}));
},"53":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "						<div class=\"home-slide-main-container home-slide"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"index") || (data && compilerNameLookup(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":101,"column":54},"end":{"line":101,"column":64}}}) : helper)))
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"imageBehaviour") : depth0),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.program(19, data, 0),"data":data,"loc":{"start":{"line":102,"column":6},"end":{"line":108,"column":21}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":109,"column":14},"end":{"line":111,"column":21}}})) != null ? stack1 : "")
    + "\"\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(54, data, 0),"inverse":container.program(56, data, 0),"data":data,"loc":{"start":{"line":112,"column":7},"end":{"line":116,"column":14}}})) != null ? stack1 : "")
    + ">\n							<a"
    + alias4((compilerNameLookup(helpers,"objectToAtrributes")||(depth0 && compilerNameLookup(depth0,"objectToAtrributes"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"item") : depth0),{"name":"objectToAtrributes","hash":{},"data":data,"loc":{"start":{"line":117,"column":9},"end":{"line":117,"column":36}}}))
    + " class=\"home-slide-wrap-link\">\n	                                <img data-lazy-src=\"\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(28, data, 0),"inverse":container.program(30, data, 0),"data":data,"loc":{"start":{"line":119,"column":37},"end":{"line":123,"column":44}}})) != null ? stack1 : "")
    + "\"\n	                                    src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\"\n										width=\"1170\"\n										height=\"400\"\n	                                    class=\"home-slide-image "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"imageMobile") : depth0),{"name":"if","hash":{},"fn":container.program(32, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":127,"column":61},"end":{"line":127,"column":97}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"backgroundCrop") : depth0),{"name":"if","hash":{},"fn":container.program(34, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":127,"column":98},"end":{"line":129,"column":26}}})) != null ? stack1 : "")
    + "\" loading=\"lazy\" />\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"imageMobile") : depth0),{"name":"if","hash":{},"fn":container.program(58, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":130,"column":17},"end":{"line":132,"column":24}}})) != null ? stack1 : "")
    + "																</a>\n\n								<div class=\"home-slide-caption "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"captionSide") : depth0),{"name":"if","hash":{},"fn":container.program(38, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":135,"column":39},"end":{"line":135,"column":80}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":135,"column":81},"end":{"line":135,"column":115}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":135,"column":116},"end":{"line":135,"column":151}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0),{"name":"if","hash":{},"fn":container.program(40, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":135,"column":152},"end":{"line":135,"column":190}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"isAbsoluteUrl") : depth0),{"name":"if","hash":{},"fn":container.program(42, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":135,"column":191},"end":{"line":135,"column":238}}})) != null ? stack1 : "")
    + "\">\n								 			<div class=\"home-slide-caption-content "
    + alias4(((helper = (helper = compilerNameLookup(helpers,"captionTextAlign") || (depth0 != null ? compilerNameLookup(depth0,"captionTextAlign") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"captionTextAlign","hash":{},"data":data,"loc":{"start":{"line":136,"column":51},"end":{"line":136,"column":71}}}) : helper)))
    + "\">\n\n								     			"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(44, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":138,"column":16},"end":{"line":138,"column":118}}})) != null ? stack1 : "")
    + "\n								     			"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(46, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":139,"column":16},"end":{"line":139,"column":83}}})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"linktext") : depth0),{"name":"if","hash":{},"fn":container.program(48, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":141,"column":13},"end":{"line":145,"column":20}}})) != null ? stack1 : "")
    + "								 			</div>\n								</div>\n						</div>\n";
},"54":function(container,depth0,helpers,partials,data) {
    var helper;

  return "								data-lazy-bg=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"image") || (depth0 != null ? compilerNameLookup(depth0,"image") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"image","hash":{},"data":data,"loc":{"start":{"line":113,"column":22},"end":{"line":113,"column":31}}}) : helper)))
    + "\"\n";
},"56":function(container,depth0,helpers,partials,data) {
    return "								data-lazy-bg=\""
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),"img/summit-carousel-home-1.jpg",{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":115,"column":22},"end":{"line":115,"column":94}}}))
    + "\"\n							";
},"58":function(container,depth0,helpers,partials,data) {
    var helper;

  return "																		<img data-lazy-src=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"imageMobile") || (depth0 != null ? compilerNameLookup(depth0,"imageMobile") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"imageMobile","hash":{},"data":data,"loc":{"start":{"line":131,"column":38},"end":{"line":131,"column":53}}}) : helper)))
    + "\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" width=\"1170\" height=\"400\" class=\"home-slide-image-mobile\" loading=\"lazy\" />\n";
},"60":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<!-- Standard Carousel -->\n	<div class=\"home-slider-container\">\n		<div class=\"home-image-slider\">\n			<ul data-slider data-slider class=\"home-image-slider-list\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"carouselImages") : depth0),{"name":"each","hash":{},"fn":container.program(61, data, 0),"inverse":container.program(63, data, 0),"data":data,"loc":{"start":{"line":245,"column":4},"end":{"line":295,"column":13}}})) != null ? stack1 : "")
    + "			</ul>\n		</div>\n	</div>\n";
},"61":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "					<li>\n						<div class=\"home-slide-main-container\" style=\"background-image: url("
    + alias2(alias1(depth0, depth0))
    + ");\">\n							<img src=\""
    + alias2(alias1(depth0, depth0))
    + "\" width=\"1170\" height=\"400\" class=\"home-slide-image\" style=\"display: none;\" />\n							<div class=\"home-slide-caption\">\n								<h2 class=\"home-slide-caption-title\">SAMPLE HEADLINE</h2>\n								<p>Example descriptive text displayed on multiple lines.</p>\n								<div class=\"home-slide-caption-button-container\">\n									<a href=\"/search\" class=\"home-slide-caption-button\">Shop Now <i class=\"home-slide-button-icon\"></i></a>\n								</div>\n							</div>\n						</div>\n					</li>\n";
},"63":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "					<li>\n						<div class=\"home-slide-main-container\" style=\"background-image: url("
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-carousel-home-1.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":260,"column":74},"end":{"line":260,"column":129}}}))
    + ");\">\n							<img src=\""
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-carousel-home-1.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":261,"column":17},"end":{"line":261,"column":72}}}))
    + "\" width=\"1170\" height=\"400\" class=\"home-slide-image\" style=\"display: none;\" />\n							<div class=\"home-slide-caption\">\n								<h2 class=\"home-slide-caption-title\">"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Free Shipping",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":263,"column":45},"end":{"line":263,"column":74}}}))
    + "</h2>\n								<p>"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"on all cleaning products. The weekend only. Use code: YEAHBUDDY",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":264,"column":11},"end":{"line":264,"column":90}}}))
    + "</p>\n								<div class=\"home-slide-caption-button-container\">\n									<a href=\"/search\" class=\"home-slide-caption-button\">"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Shop Now",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":266,"column":61},"end":{"line":266,"column":85}}}))
    + " <i class=\"home-slide-button-icon\"></i></a>\n								</div>\n							</div>\n						</div>\n					</li>\n					<li>\n						<div class=\"home-slide-main-container\" style=\"background-image: url("
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-carousel-home-2.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":272,"column":74},"end":{"line":272,"column":129}}}))
    + ");\">\n							<img src=\""
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-carousel-home-2.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":273,"column":17},"end":{"line":273,"column":72}}}))
    + "\" width=\"1170\" height=\"400\" class=\"home-slide-image\" style=\"display: none;\" />\n							<div class=\"home-slide-caption\">\n								<h2 class=\"home-slide-caption-title\">"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Quick Turnaround Times",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":275,"column":45},"end":{"line":275,"column":83}}}))
    + "</h2>\n								<p>"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"from deep groove to angular contact",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":276,"column":11},"end":{"line":276,"column":62}}}))
    + "</p>\n								<div class=\"home-slide-caption-button-container\">\n									<a href=\"/search\" class=\"home-slide-caption-button\">"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Get the best price",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":278,"column":61},"end":{"line":278,"column":95}}}))
    + " <i class=\"home-slide-button-icon\"></i></a>\n								</div>\n							</div>\n						</div>\n					</li>\n					<li>\n						<div class=\"home-slide-main-container\" style=\"background-image: url("
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-carousel-home-3.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":284,"column":74},"end":{"line":284,"column":129}}}))
    + ");\">\n							<img src=\""
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-carousel-home-3.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":285,"column":17},"end":{"line":285,"column":72}}}))
    + "\" width=\"1170\" height=\"400\" class=\"home-slide-image\" style=\"display: none;\" />\n							<div class=\"home-slide-caption\">\n								<h2 class=\"home-slide-caption-title\">"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Wiring Solutions",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":287,"column":45},"end":{"line":287,"column":77}}}))
    + "</h2>\n								<p>"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"including cord grips and ferrules",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":288,"column":11},"end":{"line":288,"column":60}}}))
    + "</p>\n								<div class=\"home-slide-caption-button-container\">\n									<a href=\"/search\" class=\"home-slide-caption-button\">"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"View products",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":290,"column":61},"end":{"line":290,"column":90}}}))
    + " <i class=\"home-slide-button-icon\"></i></a>\n								</div>\n							</div>\n						</div>\n					</li>\n";
},"65":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"home-infoblock-layout\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"infoblock") : stack1),{"name":"each","hash":{},"fn":container.program(66, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":320,"column":8},"end":{"line":366,"column":11}}})) != null ? stack1 : "")
    + "	</div>\n";
},"66":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(data && compilerNameLookup(data,"index")),{"name":"unless","hash":{},"fn":container.program(67, data, 0),"inverse":container.program(79, data, 0),"data":data,"loc":{"start":{"line":321,"column":2},"end":{"line":365,"column":13}}})) != null ? stack1 : "");
},"67":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "		<a href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"href") || (depth0 != null ? compilerNameLookup(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":323,"column":11},"end":{"line":323,"column":19}}}) : helper)))
    + "\" class=\"home-infoblock-link\">\n			<div class=\"home-infoblock home-infoblock"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"index") || (data && compilerNameLookup(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":324,"column":44},"end":{"line":324,"column":54}}}) : helper)))
    + "\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"color") : depth0),{"name":"if","hash":{},"fn":container.program(68, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":324,"column":55},"end":{"line":324,"column":112}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),{"name":"if","hash":{},"fn":container.program(70, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":325,"column":4},"end":{"line":332,"column":11}}})) != null ? stack1 : "")
    + "				<div class=\"home-infoblock-content\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":334,"column":5},"end":{"line":336,"column":12}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":337,"column":5},"end":{"line":339,"column":12}}})) != null ? stack1 : "")
    + "		        </div>\n			</div>\n		</a>\n";
},"68":function(container,depth0,helpers,partials,data) {
    var helper;

  return " style=\"background-color: "
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"color") || (depth0 != null ? compilerNameLookup(depth0,"color") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"color","hash":{},"data":data,"loc":{"start":{"line":324,"column":94},"end":{"line":324,"column":103}}}) : helper)))
    + ";\"";
},"70":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "				<img src=\""
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":326,"column":14},"end":{"line":326,"column":53}}}))
    + "\"\n					 alt=\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(71, data, 0),"inverse":container.program(73, data, 0),"data":data,"loc":{"start":{"line":327,"column":11},"end":{"line":327,"column":56}}})) != null ? stack1 : "")
    + "\"\n					 fetchpriority=\"high\"\n					 width=\"800\"\n					 height=\"600\"\n					 class=\"home-infoblock-image\" />\n";
},"71":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":327,"column":24},"end":{"line":327,"column":33}}}) : helper)));
},"73":function(container,depth0,helpers,partials,data) {
    return "Shop Now";
},"75":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		            <h2 class=\"home-infoblock-title\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"title") || (depth0 != null ? compilerNameLookup(depth0,"title") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"title","hash":{},"data":data,"loc":{"start":{"line":335,"column":47},"end":{"line":335,"column":56}}}) : helper)))
    + "</h2>\n";
},"77":function(container,depth0,helpers,partials,data) {
    var helper;

  return "		            <h3 class=\"home-infoblock-text\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"text","hash":{},"data":data,"loc":{"start":{"line":338,"column":46},"end":{"line":338,"column":54}}}) : helper)))
    + "</h3>\n";
},"79":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "		<a href=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"href") || (depth0 != null ? compilerNameLookup(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":345,"column":11},"end":{"line":345,"column":19}}}) : helper)))
    + "\" class=\"home-infoblock-link\">\n			<div class=\"home-infoblock home-infoblock"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"index") || (data && compilerNameLookup(data,"index"))) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data,"loc":{"start":{"line":346,"column":44},"end":{"line":346,"column":54}}}) : helper)))
    + "\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"color") : depth0),{"name":"if","hash":{},"fn":container.program(68, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":346,"column":55},"end":{"line":346,"column":112}}})) != null ? stack1 : "")
    + ">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),{"name":"if","hash":{},"fn":container.program(80, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":347,"column":4},"end":{"line":354,"column":11}}})) != null ? stack1 : "")
    + "				<div class=\"home-infoblock-content\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(75, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":356,"column":5},"end":{"line":358,"column":12}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"text") : depth0),{"name":"if","hash":{},"fn":container.program(77, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":359,"column":5},"end":{"line":361,"column":12}}})) != null ? stack1 : "")
    + "		        </div>\n			</div>\n		</a>\n";
},"80":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "				<img src=\""
    + container.escapeExpression((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||container.hooks.helperMissing).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":348,"column":14},"end":{"line":348,"column":53}}}))
    + "\"\n					 alt=\""
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"title") : depth0),{"name":"if","hash":{},"fn":container.program(71, data, 0),"inverse":container.program(73, data, 0),"data":data,"loc":{"start":{"line":349,"column":11},"end":{"line":349,"column":56}}})) != null ? stack1 : "")
    + "\"\n					 loading=\"lazy\"\n					 width=\"800\"\n					 height=\"600\"\n					 class=\"home-infoblock-image\" />\n";
},"82":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "	<div class=\"home-page-freetext-wrapper\">\n		<div class=\"home-page-freetext\">\n\n			<div class=\"home-page-freetext-content\">\n		        <div class=\"home-page-freetext-content-text\">\n					<div class=\"home-page-freetext-content-header\">\n				        <h3>"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"freeTextTitle") : stack1),{"name":"if","hash":{},"fn":container.program(83, data, 0),"inverse":container.program(85, data, 0),"data":data,"loc":{"start":{"line":383,"column":16},"end":{"line":383,"column":133}}})) != null ? stack1 : "")
    + "</h3>\n				    </div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"freeText") : stack1),{"name":"if","hash":{},"fn":container.program(87, data, 0),"inverse":container.program(89, data, 0),"data":data,"loc":{"start":{"line":385,"column":11},"end":{"line":392,"column":12}}})) != null ? stack1 : "")
    + "		        </div>\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"showFreeTextImages") : stack1),{"name":"if","hash":{},"fn":container.program(91, data, 0),"inverse":container.program(94, data, 0),"data":data,"loc":{"start":{"line":394,"column":4},"end":{"line":404,"column":17}}})) != null ? stack1 : "")
    + "		    </div>\n\n		</div>\n	</div>\n";
},"83":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"freeTextTitle") : stack1), depth0));
},"85":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"RELIABILITY, QUALITY & POWER",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":383,"column":82},"end":{"line":383,"column":126}}}));
},"87":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "						<div class=\"home-page-freetext-text\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"freeText") : stack1), depth0)) != null ? stack1 : "")
    + "</div>\n";
},"89":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "						<div class=\"home-page-freetext-text\">\n							<p>"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"We Mean Business when it comes to getting you the Products and Customer Service you need... when you need them.",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":389,"column":10},"end":{"line":389,"column":137}}}))
    + "</p>\n							<p>"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"In today's extremely agressive marketplace, all companies face the issues of global competition and the ever increasing costs of operating a business environment. We created a low-overhead business model and an extremely efficient global supply chain that are the envy of our customers. At Summit we provide our customer with high-quality industrial control products at extremely low prices.",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":390,"column":10},"end":{"line":390,"column":417}}}))
    + "</p>\n						</div>\n";
},"91":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "		        <div class=\"home-page-freetext-content-images-wrapper\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"freeTextImages") : stack1),{"name":"each","hash":{},"fn":container.program(92, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":396,"column":5},"end":{"line":398,"column":14}}})) != null ? stack1 : "")
    + "		        </div>\n";
},"92":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "	                <div class=\"home-page-freetext-content-image\"><a href=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"href") || (depth0 != null ? compilerNameLookup(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":397,"column":72},"end":{"line":397,"column":80}}}) : helper)))
    + "\"><img src=\""
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPathWithDefault")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPathWithDefault"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"image") : depth0),{"name":"getThemeAssetsPathWithDefault","hash":{},"data":data,"loc":{"start":{"line":397,"column":92},"end":{"line":397,"column":131}}}))
    + "\" width=\"1080\" height=\"648\" alt=\"Fresh Produce MFG\" style=\"width: 100%; height: auto;\"></a></div>\n";
},"94":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "				<div class=\"home-page-freetext-content-images-wrapper\">\n					<div class=\"home-page-freetext-content-image\"><a href=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"href") || (depth0 != null ? compilerNameLookup(depth0,"href") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"href","hash":{},"data":data,"loc":{"start":{"line":402,"column":60},"end":{"line":402,"column":68}}}) : helper)))
    + "\"><img src=\""
    + alias3((compilerNameLookup(helpers,"getThemeAssetsPath")||(depth0 && compilerNameLookup(depth0,"getThemeAssetsPath"))||alias2).call(alias1,"img/summit-freetextimage.jpg",{"name":"getThemeAssetsPath","hash":{},"data":data,"loc":{"start":{"line":402,"column":80},"end":{"line":402,"column":133}}}))
    + "\" width=\"1080\" height=\"648\" alt=\"Fresh Produce MFG\" style=\"width: 100%; height: auto;\"></a></div>\n				</div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"isReady") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":301,"column":7}}})) != null ? stack1 : "")
    + "\n<div class=\"home-nopad\">\n	<div class=\"home-cms-zone\" data-cms-area=\"home_content_top\" data-cms-area-filters=\"path\"></div>\n\n	<!-- CMS MERCHANDISING ZONE -->\n	<div class=\"home-merchandizing-zone\">\n		<div class=\"home-merchandizing-zone-content\">\n			<div data-cms-area=\"home_merchandizing_zone\" data-cms-area-filters=\"path\"></div>\n		</div>\n	</div>\n\n	<!--\n    INFOBLOCKS\n    Use the Configuration section under Layout > Infoblocks\n	Two infoblocks per row\n	-->\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"showInfoblocks") : stack1),{"name":"if","hash":{},"fn":container.program(65, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":318,"column":1},"end":{"line":368,"column":8}}})) != null ? stack1 : "")
    + "\n	<div class=\"home-cms-zone\" data-cms-area=\"home_content_middle\" data-cms-area-filters=\"path\"></div>\n</div>\n\n<div class=\"home\">\n	<!-- FREE TEXT AND IMAGES -->\n	<!-- With support if Theme Extension is not used -->\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraHome") : depth0)) != null ? compilerNameLookup(stack1,"freeText") : stack1),{"name":"if","hash":{},"fn":container.program(82, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":376,"column":1},"end":{"line":409,"column":8}}})) != null ? stack1 : "")
    + "</div>\n\n<div class=\"home-nopad\">\n    <div class=\"home-cms-zone\" data-cms-area=\"home_content_bottom\" data-cms-area-filters=\"path\"></div>\n</div>\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'home'; return template;});