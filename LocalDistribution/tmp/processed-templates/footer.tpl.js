define('footer.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    return "      <div class=\"footer-content-newsletter\" data-view=\"FooterContent\"></div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "      <div class=\"newsletter-cct-area\" data-cms-area=\"newsletter-cct-area\" data-cms-area-filters=\"global\"></div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "      <div class=\"footer-content-social\">\n          <ul class=\"footer-content-social-list\">\n          "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"socialMediaLinksTitle") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":10},"end":{"line":20,"column":104}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"socialMediaLinks") : stack1),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":10},"end":{"line":23,"column":19}}})) != null ? stack1 : "")
    + "          </ul>\n      </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<li>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"socialMediaLinksTitle") : stack1), depth0))
    + "</li>";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "              <li><a "
    + alias3((compilerNameLookup(helpers,"objectToAtrributes")||(depth0 && compilerNameLookup(depth0,"objectToAtrributes"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"item") : depth0),{"name":"objectToAtrributes","hash":{},"data":data,"loc":{"start":{"line":22,"column":21},"end":{"line":22,"column":48}}}))
    + " data-hashtag=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"datahashtag") || (depth0 != null ? compilerNameLookup(depth0,"datahashtag") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"datahashtag","hash":{},"data":data,"loc":{"start":{"line":22,"column":63},"end":{"line":22,"column":78}}}) : helper)))
    + "\" data-touchpoint=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"datatouchpoint") || (depth0 != null ? compilerNameLookup(depth0,"datatouchpoint") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"datatouchpoint","hash":{},"data":data,"loc":{"start":{"line":22,"column":97},"end":{"line":22,"column":115}}}) : helper)))
    + "\" data-target=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"datatarget") || (depth0 != null ? compilerNameLookup(depth0,"datatarget") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"datatarget","hash":{},"data":data,"loc":{"start":{"line":22,"column":130},"end":{"line":22,"column":144}}}) : helper)))
    + "\" target=\"_blank\">"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"icon") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data,"loc":{"start":{"line":22,"column":162},"end":{"line":22,"column":253}}})) != null ? stack1 : "")
    + "</a></li>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<i class=\"footer-content-social-icon icon-"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"icon") || (depth0 != null ? compilerNameLookup(depth0,"icon") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"icon","hash":{},"data":data,"loc":{"start":{"line":22,"column":216},"end":{"line":22,"column":224}}}) : helper)))
    + "\"></i>";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"text","hash":{},"data":data,"loc":{"start":{"line":22,"column":238},"end":{"line":22,"column":246}}}) : helper)));
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"footer-column-links\">\n                <ul>\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col1Links") : stack1),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":16},"end":{"line":41,"column":25}}})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"href") : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(18, data, 0),"data":data,"loc":{"start":{"line":36,"column":16},"end":{"line":40,"column":23}}})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "                    <li class=\"footer-column-link-listitem\"><a class=\"footer-column-link\" "
    + alias3((compilerNameLookup(helpers,"objectToAtrributes")||(depth0 && compilerNameLookup(depth0,"objectToAtrributes"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"item") : depth0),{"name":"objectToAtrributes","hash":{},"data":data,"loc":{"start":{"line":37,"column":90},"end":{"line":37,"column":117}}}))
    + " data-hashtag=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"datahashtag") || (depth0 != null ? compilerNameLookup(depth0,"datahashtag") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"datahashtag","hash":{},"data":data,"loc":{"start":{"line":37,"column":132},"end":{"line":37,"column":147}}}) : helper)))
    + "\" data-touchpoint=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"datatouchpoint") || (depth0 != null ? compilerNameLookup(depth0,"datatouchpoint") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"datatouchpoint","hash":{},"data":data,"loc":{"start":{"line":37,"column":166},"end":{"line":37,"column":184}}}) : helper)))
    + "\" data-target=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"datatarget") || (depth0 != null ? compilerNameLookup(depth0,"datatarget") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"datatarget","hash":{},"data":data,"loc":{"start":{"line":37,"column":199},"end":{"line":37,"column":213}}}) : helper)))
    + "\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"datatarget") : depth0),{"name":"if","hash":{"includeZero":true},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":37,"column":215},"end":{"line":37,"column":272}}})) != null ? stack1 : "")
    + ">"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":37,"column":273},"end":{"line":37,"column":281}}}) : helper)))
    + "</a></li>\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "target=\"_blank\"";
},"18":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <li class=\"footer-column-heading-listitem\"><h4 class=\"footer-column-heading\">"
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"text","hash":{},"data":data,"loc":{"start":{"line":39,"column":97},"end":{"line":39,"column":105}}}) : helper)))
    + "</h4></li>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"footer-column-links\">\n                <ul>\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col2Links") : stack1),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":16},"end":{"line":54,"column":25}}})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n";
},"22":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"footer-column-links\">\n                <ul>\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col3Links") : stack1),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":61,"column":16},"end":{"line":67,"column":25}}})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n";
},"24":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"footer-column-links\">\n                <ul>\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col4Links") : stack1),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":74,"column":16},"end":{"line":80,"column":25}}})) != null ? stack1 : "")
    + "                </ul>\n            </div>\n";
},"26":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        			<ul class=\"footer-content-nav-list\">\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"footerNavigationLinks") : depth0),{"name":"each","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":98,"column":12},"end":{"line":104,"column":21}}})) != null ? stack1 : "")
    + "        			</ul>\n";
},"27":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "        					<li>\n        						<a "
    + alias3((compilerNameLookup(helpers,"objectToAtrributes")||(depth0 && compilerNameLookup(depth0,"objectToAtrributes"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"item") : depth0),{"name":"objectToAtrributes","hash":{},"data":data,"loc":{"start":{"line":100,"column":17},"end":{"line":100,"column":44}}}))
    + ">\n        							"
    + alias3(((helper = (helper = compilerNameLookup(helpers,"text") || (depth0 != null ? compilerNameLookup(depth0,"text") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":101,"column":15},"end":{"line":101,"column":23}}}) : helper)))
    + "\n        						</a>\n        					</li>\n";
},"29":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"hide") : depth0),{"name":"unless","hash":{},"fn":container.program(30, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":111,"column":20},"end":{"line":118,"column":31}}})) != null ? stack1 : "");
},"30":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showRange") : depth0),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.program(33, data, 0),"data":data,"loc":{"start":{"line":112,"column":24},"end":{"line":117,"column":31}}})) != null ? stack1 : "");
},"31":function(container,depth0,helpers,partials,data) {
    return "                            "
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"&copy; $(0) &#8211; $(1) $(2)",(depth0 != null ? compilerNameLookup(depth0,"initialYear") : depth0),(depth0 != null ? compilerNameLookup(depth0,"currentYear") : depth0),(depth0 != null ? compilerNameLookup(depth0,"companyName") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":113,"column":28},"end":{"line":113,"column":109}}}))
    + "\n                            <!-- an en dash &#8211; is used to indicate a range of values -->\n";
},"33":function(container,depth0,helpers,partials,data) {
    return "                            "
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"&copy; $(0) $(1)",(depth0 != null ? compilerNameLookup(depth0,"currentYear") : depth0),(depth0 != null ? compilerNameLookup(depth0,"companyName") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":116,"column":28},"end":{"line":116,"column":84}}}))
    + "\n";
},"35":function(container,depth0,helpers,partials,data) {
    return "    				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"&copy; 2008-2017 Company Name",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":120,"column":8},"end":{"line":120,"column":53}}}))
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n<div data-view=\"Global.BackToTop\"></div>\n\n<div class=\"footer-banner-wrapper\">\n	<div id=\"banner-footerFull\" class=\"content-banner banner-footer footer-banner\" data-cms-area=\"global_banner_footerFull\" data-cms-area-filters=\"global\"></div>\n	<div id=\"banner-footer1\" class=\"content-banner banner-footer footer-banner-1\" data-cms-area=\"global_banner_footer1\" data-cms-area-filters=\"global\"></div>\n	<div id=\"banner-footer5\" class=\"content-banner banner-footer footer-banner-5\" data-cms-area=\"global_banner_footer5\" data-cms-area-filters=\"global\"></div>\n</div>\n\n<div class=\"footer-content-newsletter-social\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"showLegacyNewsletter") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":12,"column":4},"end":{"line":16,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"socialMediaLinks") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":17,"column":4},"end":{"line":26,"column":11}}})) != null ? stack1 : "")
    + "</div>\n\n<div class=\"footer-columns-wrapper\">\n    <div class=\"footer-columns-container\">\n        <div class=\"footer-columns\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col1Links") : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":12},"end":{"line":44,"column":10}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col2Links") : stack1),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":45,"column":12},"end":{"line":57,"column":10}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col3Links") : stack1),{"name":"if","hash":{},"fn":container.program(22, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":58,"column":12},"end":{"line":70,"column":10}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"col4Links") : stack1),{"name":"if","hash":{},"fn":container.program(24, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":12},"end":{"line":83,"column":10}}})) != null ? stack1 : "")
    + "\n        </div>\n    </div>\n\n    <div class=\"footer-content\">\n        <div class=\"footer-banner\">\n    		<div id=\"banner-footer-top\" class=\"content-banner-top banner-footer-top\" data-cms-area=\"global_banner_footer_top\" data-cms-area-filters=\"path\"></div>\n    		<div id=\"banner-footer\" class=\"content-banner banner-footer\" data-cms-area=\"global_banner_footer\" data-cms-area-filters=\"global\"></div>\n        </div>\n\n        <div class=\"footer-content-nav-copyright\">\n        	<div class=\"footer-content-nav\">\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"showFooterNavigationLinks") : depth0),{"name":"if","hash":{},"fn":container.program(26, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":96,"column":10},"end":{"line":106,"column":17}}})) != null ? stack1 : "")
    + "        	</div>\n\n        	<div class=\"footer-content-copyright\">\n"
    + ((stack1 = compilerNameLookup(helpers,"with").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooter") : depth0)) != null ? compilerNameLookup(stack1,"copyright") : stack1),{"name":"with","hash":{},"fn":container.program(29, data, 0),"inverse":container.program(35, data, 0),"data":data,"loc":{"start":{"line":110,"column":7},"end":{"line":121,"column":25}}})) != null ? stack1 : "")
    + "        	</div>\n        </div>\n\n    </div>\n\n</div>\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'footer'; return template;});