define('header_menu_myaccount.tpl', ['Handlebars','Handlebars.CompilerNameLookup'], function (Handlebars, compilerNameLookup){ var t = {"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "	<li class=\"header-menu-myaccount-item-level2\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"permission") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":47},"end":{"line":22,"column":105}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"permissionOperator") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":22,"column":106},"end":{"line":22,"column":189}}})) != null ? stack1 : "")
    + ">\r\n"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"url") : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.program(11, data, 0),"data":data,"loc":{"start":{"line":23,"column":2},"end":{"line":33,"column":9}}})) != null ? stack1 : "")
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"children") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":3},"end":{"line":48,"column":10}}})) != null ? stack1 : "")
    + "	</li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-permissions=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"permission") || (depth0 != null ? compilerNameLookup(depth0,"permission") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"permission","hash":{},"data":data,"loc":{"start":{"line":22,"column":83},"end":{"line":22,"column":97}}}) : helper)))
    + "\"";
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "data-permissions-operator=\""
    + container.escapeExpression(((helper = (helper = compilerNameLookup(helpers,"permissionOperator") || (depth0 != null ? compilerNameLookup(depth0,"permissionOperator") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"permissionOperator","hash":{},"data":data,"loc":{"start":{"line":22,"column":159},"end":{"line":22,"column":181}}}) : helper)))
    + "\"";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "	  <a  class=\"header-menu-myaccount-anchor-level2\" tabindex=\"-1\" href=\"#\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"children") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":74},"end":{"line":24,"column":127}}})) != null ? stack1 : "")
    + " data-touchpoint=\"customercenter\" data-hashtag=\"#"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"url") || (depth0 != null ? compilerNameLookup(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":24,"column":176},"end":{"line":24,"column":183}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"name") || (depth0 != null ? compilerNameLookup(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":24,"column":191},"end":{"line":24,"column":199}}}) : helper)))
    + "\">\r\n	    "
    + alias4((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"name") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":25,"column":5},"end":{"line":25,"column":23}}}))
    + "\r\n	  	"
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"children") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":4},"end":{"line":26,"column":86}}})) != null ? stack1 : "")
    + "\r\n	  </a>\r\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "data-action=\"push-menu\"";
},"9":function(container,depth0,helpers,partials,data) {
    return "<i class=\"header-menu-myaccount-menu-push-icon\"></i>";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "	  <span  class=\"header-menu-myaccount-span-level2\" tabindex=\"-1\" "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"children") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":29,"column":66},"end":{"line":29,"column":119}}})) != null ? stack1 : "")
    + " name=\""
    + alias3(((helper = (helper = compilerNameLookup(helpers,"name") || (depth0 != null ? compilerNameLookup(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":29,"column":126},"end":{"line":29,"column":134}}}) : helper)))
    + "\">\r\n	    "
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"name") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":30,"column":5},"end":{"line":30,"column":23}}}))
    + "\r\n	    "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,((stack1 = (depth0 != null ? compilerNameLookup(depth0,"children") : depth0)) != null ? compilerNameLookup(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":31,"column":5},"end":{"line":31,"column":87}}})) != null ? stack1 : "")
    + "\r\n	  </span>\r\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "	  <ul class=\"header-menu-myaccount-level3\">\r\n	    <li>\r\n	      <a href=\"#\" class=\"header-menu-myaccount-back\" data-action=\"pop-menu\" name=\"back-level3\">\r\n	          <i class=\"header-menu-myaccount-pop-icon \"></i>\r\n	          "
    + container.escapeExpression((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||container.hooks.helperMissing).call(alias1,"Back",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":39,"column":11},"end":{"line":39,"column":31}}}))
    + "\r\n	      </a>\r\n	    </li>\r\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"children") : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":42,"column":5},"end":{"line":46,"column":14}}})) != null ? stack1 : "")
    + "	  </ul>\r\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "	    <li "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"permission") : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":9},"end":{"line":43,"column":67}}})) != null ? stack1 : "")
    + " "
    + ((stack1 = compilerNameLookup(helpers,"if").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"permissionOperator") : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":68},"end":{"line":43,"column":151}}})) != null ? stack1 : "")
    + ">\r\n	      <a class=\"header-menu-myaccount-anchor-level3\" tabindex=\"-1\" href=\"#\" data-touchpoint=\"customercenter\" data-hashtag=\"#"
    + alias4(((helper = (helper = compilerNameLookup(helpers,"url") || (depth0 != null ? compilerNameLookup(depth0,"url") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"url","hash":{},"data":data,"loc":{"start":{"line":44,"column":125},"end":{"line":44,"column":132}}}) : helper)))
    + "\" name=\""
    + alias4(((helper = (helper = compilerNameLookup(helpers,"name") || (depth0 != null ? compilerNameLookup(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":44,"column":140},"end":{"line":44,"column":148}}}) : helper)))
    + "\">"
    + alias4((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,(depth0 != null ? compilerNameLookup(depth0,"name") : depth0),{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":44,"column":150},"end":{"line":44,"column":168}}}))
    + "</a>\r\n	    </li>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression;

  return "<a class=\"header-menu-myaccount-anchor\" href=\"#\" data-action=\"push-menu\" name=\"myaccount\">\r\n	"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"My Account",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":2,"column":1},"end":{"line":2,"column":27}}}))
    + "\r\n	<i class=\"header-menu-myaccount-menu-push-icon\"></i>\r\n</a>\r\n<ul class=\"header-menu-myaccount\">\r\n	<li>\r\n			<a href=\"#\" class=\"header-menu-myaccount-back\" data-action=\"pop-menu\" name=\"back\">\r\n				<i class=\"header-menu-myaccount-pop-icon \"></i>\r\n				"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Back",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":9,"column":4},"end":{"line":9,"column":24}}}))
    + "\r\n			</a>\r\n	</li>\r\n	<li class=\"header-menu-myaccount-overview\">\r\n		<a class=\"header-menu-myaccount-overview-anchor\" href=\"#\" data-touchpoint=\"customercenter\" data-hashtag=\"#overview\" name=\"accountoverview\">\r\n			"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Account Overview",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":14,"column":3},"end":{"line":14,"column":35}}}))
    + "\r\n		</a>\r\n		<a class=\"header-menu-myaccount-signout-link\" href=\"#\" data-touchpoint=\"logout\" name=\"signout\">\r\n			<i class=\"header-menu-myaccount-signout-icon\"></i>\r\n			"
    + alias3((compilerNameLookup(helpers,"translate")||(depth0 && compilerNameLookup(depth0,"translate"))||alias2).call(alias1,"Sign Out",{"name":"translate","hash":{},"data":data,"loc":{"start":{"line":18,"column":3},"end":{"line":18,"column":27}}}))
    + "\r\n		</a>\r\n	</li>\r\n"
    + ((stack1 = compilerNameLookup(helpers,"each").call(alias1,(depth0 != null ? compilerNameLookup(depth0,"entries") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":1},"end":{"line":50,"column":10}}})) != null ? stack1 : "")
    + "</ul>\r\n\n";
},"useData":true}; var main = t.main; t.main = function(){ arguments[1] = arguments[1] || {}; var ctx = arguments[1]; ctx._extension_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; ctx._theme_path = 'http://localhost:7777/tmp/extensions/BluePoint/Summit/4.0.0/'; return main.apply(this, arguments); }; var template = Handlebars.template(t); template.Name = 'header_menu_myaccount'; return template;});