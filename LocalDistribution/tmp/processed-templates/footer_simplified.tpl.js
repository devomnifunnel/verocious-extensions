define('footer_simplified.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"unless").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"hide") : depth0),{"name":"unless","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":18},"end":{"line":20,"column":29}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = compilerNameLookup(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? compilerNameLookup(depth0,"showRange") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data,"loc":{"start":{"line":14,"column":22},"end":{"line":19,"column":29}}})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    return "                          "
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"&copy; $(0) &#8211; $(1) $(2)",(depth0 != null ? compilerNameLookup(depth0,"initialYear") : depth0),(depth0 != null ? compilerNameLookup(depth0,"currentYear") : depth0),(depth0 != null ? compilerNameLookup(depth0,"companyName") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":15,"column":26},"end":{"line":15,"column":107}}}))
    + "\n                          <!-- an en dash &#8211; is used to indicate a range of values -->\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "                          "
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"&copy; $(0) $(1)",(depth0 != null ? compilerNameLookup(depth0,"currentYear") : depth0),(depth0 != null ? compilerNameLookup(depth0,"companyName") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":18,"column":26},"end":{"line":18,"column":82}}}))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "  				"
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"&copy; 2008-2017 Company Name",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":22,"column":6},"end":{"line":22,"column":51}}}))
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n<div data-view=\"Global.BackToTop\"></div>\n<div class=\"footer-simplified-wrapper\">\n  <div class=\"footer-content footer-simplified\">\n      <div class=\"footer-banner\">\n          <div id=\"banner-footer\" class=\"content-banner banner-footer\" data-cms-area=\"global_banner_footer\" data-cms-area-filters=\"global\"></div>\n      </div>\n      <div class=\"footer-content-nav-copyright\">\n          <div class=\"footer-content-nav\"></div>\n          <div class=\"footer-content-copyright\">\n"
    + ((stack1 = compilerNameLookup(helpers,"with").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? compilerNameLookup(depth0,"extraFooterSimplified") : depth0)) != null ? compilerNameLookup(stack1,"copyright") : stack1),{"name":"with","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":12,"column":14},"end":{"line":23,"column":23}}})) != null ? stack1 : "")
    + "          </div>\n      </div>\n  </div>\n</div>\n\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'footer_simplified'; return template;});