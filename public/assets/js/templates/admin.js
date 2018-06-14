if (!!!templates) var templates = {};
templates["app_instance"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div style=\"margin:21px\">");t.b("\n" + i);t.b("<div class=\"btn-group pull-right\">");t.b("\n" + i);t.b("  <button type=\"button\" class=\"btn btn-primary\" id=\"save\">Save</button>");t.b("\n" + i);t.b("  <button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("    <span class=\"caret\"></span>");t.b("\n" + i);t.b("    <span class=\"sr-only\">Toggle Dropdown</span>");t.b("\n" + i);t.b("  </button>");t.b("\n" + i);t.b("  <ul class=\"dropdown-menu\">");t.b("\n" + i);t.b("	<li><a href=\"/app/`+data.group.slug+'/'+data.slug+`\">Visit</a></li>");t.b("\n" + i);t.b("	<li><a href=\"javascript:void(0)\" id=\"find\">Find on Pages</a></li>");t.b("\n" + i);t.b("	<li><a href=\"javascript:void(0)\" id=\"version\">Change Version</a></li>");t.b("\n" + i);t.b("	<li><a target=\"_blank\" href=\"/admin/apps/`+data.app_id+`\">Edit MicroApp</a></li>");t.b("\n" + i);t.b("  </ul>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);t.b("  <!-- Nav tabs -->");t.b("\n" + i);t.b("  <ul class=\"nav nav-tabs\" role=\"tablist\">");t.b("\n" + i);t.b("    <li role=\"presentation\" class=\"active\"><a href=\"#main\" aria-controls=\"home\" role=\"tab\" data-toggle=\"tab\">Main</a></li>");t.b("\n" + i);t.b("    <li id=\"resoucestab\" role=\"presentation\" style=\"display:none\"><a href=\"#resources\" aria-controls=\"messages\" role=\"tab\" data-toggle=\"tab\">Resources</a></li>");t.b("\n" + i);t.b("		<li id=\"optionstab\" role=\"presentation\" style=\"display:none\"><a href=\"#options\" aria-controls=\"profile\" role=\"tab\" data-toggle=\"tab\">Options</a></li>");t.b("\n" + i);t.b("		<li id=\"useroptionstab\" role=\"presentation\" style=\"display:none\"><a href=\"#user_options_default\" aria-controls=\"profile\" role=\"tab\" data-toggle=\"tab\">User Default Options</a></li>	");t.b("\n" + i);t.b("  </ul>");t.b("\n");t.b("\n" + i);t.b("  <!-- Tab panes -->");t.b("\n" + i);t.b("  <div class=\"tab-content\">");t.b("\n" + i);t.b("    <div role=\"tabpanel\" class=\"tab-pane active\" id=\"main\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("  	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("    <div role=\"tabpanel\" class=\"tab-pane\" id=\"resources\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("	<div role=\"tabpanel\" class=\"tab-pane\" id=\"options\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("  	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("	<div role=\"tabpanel\" class=\"tab-pane\" id=\"user_options_default\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("  	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("  </div>");t.b("\n");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["error"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);if(t.s(t.f("count",c,p,1),c,p,0,16,825,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<h4><span class=\"label label-danger\">");t.b(t.v(t.f("count",c,p,0)));t.b("</span> total error(s) found in files</h4>");t.b("\n" + i);if(t.s(t.d("script.length",c,p,1),c,p,0,124,217,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<h5><span class=\"label label-warning\">");t.b(t.v(t.d("script.length",c,p,0)));t.b("</span> error(s) found in scripts</h5>");});c.pop();}t.b("\n" + i);if(t.s(t.f("script",c,p,1),c,p,0,247,351,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div>");t.b("\n" + i);t.b("<h4>");t.b(t.v(t.f("name",c,p,0)));t.b(" (");t.b(t.v(t.f("type",c,p,0)));t.b(")</h4>");t.b("\n" + i);t.b("<pre>");t.b("\n" + i);t.b(t.v(t.f("raw",c,p,0)));t.b("<br>On line ");t.b(t.v(t.f("row",c,p,0)));t.b(" character ");t.b(t.v(t.f("column",c,p,0)));t.b("\n" + i);t.b("</pre>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);});c.pop();}t.b("\n");t.b("\n");t.b("\n" + i);if(t.s(t.d("css.length",c,p,1),c,p,0,381,467,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<h5><span class=\"label label-warning\">");t.b(t.v(t.d("css.length",c,p,0)));t.b("</span> error(s) found in css</h5>");});c.pop();}t.b("\n" + i);if(t.s(t.f("css",c,p,1),c,p,0,491,596,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div>");t.b("\n" + i);t.b("<h4>");t.b(t.v(t.f("name",c,p,0)));t.b(" (");t.b(t.v(t.f("type",c,p,0)));t.b(")</h4>");t.b("\n" + i);t.b("<pre>");t.b("\n" + i);t.b(t.v(t.f("text",c,p,0)));t.b("<br>On line ");t.b(t.v(t.f("row",c,p,0)));t.b(" character ");t.b(t.v(t.f("column",c,p,0)));t.b("\n" + i);t.b("</pre>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);if(t.s(t.d("temp.length",c,p,1),c,p,0,622,715,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<h5><span class=\"label label-warning\">");t.b(t.v(t.d("temp.length",c,p,0)));t.b("</span> error(s) found in templates</h5>");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.f("temp",c,p,1),c,p,0,742,808,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div>");t.b("\n" + i);t.b("<h4>");t.b(t.v(t.f("name",c,p,0)));t.b(" (");t.b(t.v(t.f("type",c,p,0)));t.b(")</h4>");t.b("\n" + i);t.b("<pre>");t.b(t.v(t.f("message",c,p,0)));t.b("</pre>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);});c.pop();}t.b("</div>");t.b("\n" + i);});c.pop();}return t.fl(); },partials: {}, subs: {  }});
templates["formEditor"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"row\">");t.b("\n" + i);t.b("    <div class=\"col-sm-8 form-horizontal widget_container cobler_select cobler_container\" id=\"editor\"></div");t.b("\n" + i);t.b("    ><div class=\"col-sm-4\">");t.b("\n" + i);t.b("        <div id=\"form\"></div>");t.b("\n" + i);t.b("        <ul id=\"sortableList\" class=\"list-group \">");t.b("\n" + i);t.b("            <li class=\"list-group-item\" data-type=\"textbox\">Text</li>");t.b("\n" + i);t.b("            <li class=\"list-group-item\" data-type=\"select\">Select</li>");t.b("\n" + i);t.b("            <li class=\"list-group-item\" data-type=\"checkbox\">Checkbox</li>");t.b("\n" + i);t.b("        </ul>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["group_summary"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel-page\">");t.b("\n" + i);t.b("	<section class=\"panel panel-default\">");t.b("\n" + i);t.b("		<div id=\"mypanel\" class=\"panel-body\">");t.b("\n" + i);t.b("				<div class=\"row\">");t.b("\n");t.b("\n" + i);t.b("					<div class=\"col-md-6\">		");t.b("\n" + i);t.b("						<!--div class=\"row\" style=\"margin-bottom:20px;\">");t.b("\n" + i);t.b("							<div class=\"col-xs-6\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/members\" class=\"btn btn-success\" style=\"width:100%\">");t.b("\n" + i);t.b("									<i class=\"fa fa-user\"></i> Members <span class=\"badge\">");t.b(t.v(t.d("members_count.aggregate",c,p,0)));if(!t.s(t.f("members_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("							<div class=\"col-xs-6\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/admins\" class=\"btn btn-danger\" style=\"width:100%\">");t.b("\n" + i);t.b("									<i class=\"fa fa-cogs\"></i> Admins <span class=\"badge\">");t.b(t.v(t.d("admins_count.aggregate",c,p,0)));if(!t.s(t.f("admins_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("						</div>");t.b("\n" + i);t.b("						<div class=\"row\" style=\"margin-bottom:20px;\">");t.b("\n" + i);t.b("							<div class=\"col-xs-6\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/pages\" class=\"btn btn-primary\" style=\"width:100%\">");t.b("\n" + i);t.b("									<i class=\"fa fa-page\"></i> Pages <span class=\"badge\">");t.b(t.v(t.d("pages_count.aggregate",c,p,0)));if(!t.s(t.f("pages_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("							<div class=\"col-xs-6\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/appinstances\" class=\"btn btn-info\" style=\"width:100%\">");t.b("\n" + i);t.b("									<i class=\"fa fa-cubes\"></i> App Instances <span class=\"badge\">");t.b(t.v(t.d("appinstances_count.aggregate",c,p,0)));if(!t.s(t.f("appinstances_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("						</div>");t.b("\n" + i);t.b("						<div class=\"row\" style=\"margin-bottom:20px;\">");t.b("\n" + i);t.b("							<div class=\"col-xs-6\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/endpoints\" class=\"btn btn-default\" style=\"width:100%\">");t.b("\n" + i);t.b("									<i class=\"fa fa-crosshairs\"></i> Endpoints <span class=\"badge\">");t.b(t.v(t.d("endpoints_count.aggregate",c,p,0)));if(!t.s(t.f("endpoints_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("							<div class=\"col-xs-6\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/images\" class=\"btn btn-default\" style=\"width:100%\">");t.b("\n" + i);t.b("									<i class=\"fa fa-image\"></i> Images <span class=\"badge\">");t.b(t.v(t.d("images_count.aggregate",c,p,0)));if(!t.s(t.f("images_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("							<div class=\"col-xs-4\">");t.b("\n" + i);t.b("								<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/links\" class=\"btn btn-default\" style=\"width:100%;background-color:lightgray;border-color:gray;\" >");t.b("\n" + i);t.b("									<i class=\"fa fa-link\"></i> Links <span class=\"badge\">");t.b(t.v(t.d("links_count.aggregate",c,p,0)));if(!t.s(t.f("links_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("								</a>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("						</div-->");t.b("\n");t.b("\n");t.b("\n");t.b("\n");t.b("\n" + i);t.b("						<div class=\"row\">");t.b("\n" + i);t.b("							<div class=\"col-md-12\">");t.b("\n" + i);t.b("									<ul class=\"list-group\">");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/members\" class=\"list-group-item list-group-item-success\">");t.b("\n" + i);t.b("											<i class=\"fa fa-user text-success\"></i> Members <span class=\"badge\">");t.b(t.v(t.d("members_count.aggregate",c,p,0)));if(!t.s(t.f("members_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/admins\" class=\"list-group-item list-group-item-danger\">");t.b("\n" + i);t.b("											<i class=\"fa fa-lock text-danger\"></i> Admins <span class=\"badge\">");t.b(t.v(t.d("admins_count.aggregate",c,p,0)));if(!t.s(t.f("admins_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/pages\" class=\"list-group-item list-group-item-info\">");t.b("\n" + i);t.b("											<i class=\"fa fa-file text-primary\"></i> Pages <span class=\"badge\">");t.b(t.v(t.d("pages_count.aggregate",c,p,0)));if(!t.s(t.f("pages_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/appinstances\" class=\"list-group-item list-group-item-info\">");t.b("\n" + i);t.b("											<i class=\"fa fa-cubes text-info\"></i> App Instances <span class=\"badge\">");t.b(t.v(t.d("appinstances_count.aggregate",c,p,0)));if(!t.s(t.f("appinstances_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/endpoints\" class=\"list-group-item list-group-item-warning\">");t.b("\n" + i);t.b("											<i class=\"fa fa-crosshairs text-warning\"></i> Endpoints <span class=\"badge\">");t.b(t.v(t.d("endpoints_count.aggregate",c,p,0)));if(!t.s(t.f("endpoints_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/images\" class=\"list-group-item\">");t.b("\n" + i);t.b("											<i class=\"fa fa-image\"></i> Images <span class=\"badge\">");t.b(t.v(t.d("images_count.aggregate",c,p,0)));if(!t.s(t.f("images_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("										<a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/links\" class=\"list-group-item\">");t.b("\n" + i);t.b("											<i class=\"fa fa-link\"></i> Links <span class=\"badge\">");t.b(t.v(t.d("links_count.aggregate",c,p,0)));if(!t.s(t.f("links_count",c,p,1),c,p,1,0,0,"")){t.b("0");};t.b("</span>");t.b("\n" + i);t.b("										</a>");t.b("\n" + i);t.b("							</ul>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("						</div>");t.b("\n");t.b("\n" + i);t.b("						<!--div class=\"row\">");t.b("\n" + i);t.b("							<div class=\"col-md-12\">");t.b("\n" + i);t.b("		");t.b("\n" + i);t.b("								<div class=\"panel panel-default\">");t.b("\n" + i);t.b("							<div class=\"panel-heading\"><a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/links\"><strong><span class=\"fa fa-link\"></span> Links</strong></a></div>");t.b("\n" + i);t.b("							<ul class=\"list-group\">");t.b("\n" + i);if(t.s(t.f("links",c,p,1),c,p,0,4601,4694,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("										<a target=\"_blank\" href=\"");t.b(t.v(t.f("link",c,p,0)));t.b("\"  class=\"list-group-item\">");t.b(t.v(t.f("title",c,p,0)));t.b("</a>");t.b("\n" + i);});c.pop();}t.b("							</ul>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("						</div-->");t.b("\n" + i);t.b("						<div class=\"row\">");t.b("\n" + i);t.b("							<div class=\"col-md-6\">");t.b("\n");t.b("\n");t.b("\n" + i);t.b("								<div class=\"panel panel-default\">");t.b("\n" + i);t.b("						      <div class=\"panel-heading\"><a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/composites\"><strong><span class=\"fa fa-puzzle-piece sort\"></span> Composites</strong></a></div>");t.b("\n" + i);t.b("						      ");if(t.s(t.d("composites.length",c,p,1),c,p,0,5044,5315,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"panel-body\">");t.b("\n" + i);if(t.s(t.f("composites",c,p,1),c,p,0,5094,5274,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("										<a class=\"label label-success\" style=\"margin-bottom:5px;float:left\" href=\"/admin/groups/");t.b(t.v(t.d("group.id",c,p,0)));t.b("\">");t.b(t.v(t.d("group.slug",c,p,0)));t.b("</a><span style=\"float:left\">&nbsp;</span>");t.b("\n" + i);});c.pop();}t.b("									</div>");t.b("\n" + i);});c.pop();}t.b("						    </div>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("							<div class=\"col-md-6\">");t.b("\n" + i);t.b("								<div class=\"panel panel-default\">");t.b("\n" + i);t.b("						      <div class=\"panel-heading\"><a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/tags\"><strong><span class=\"fa fa-tags\"></span> Tags</strong></a></div>");t.b("\n" + i);t.b("					      		<ul class=\"list-unstyled list-info\">");t.b("\n" + i);if(t.s(t.f("tags",c,p,1),c,p,0,5652,5877,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("												<li style=\"padding: 10px 10px 0;\">");t.b("\n" + i);t.b("		                        <span class=\"icon fa fa-tag fa-fw\"></span>");t.b("\n" + i);t.b("		                        <label>");t.b(t.v(t.f("name",c,p,0)));t.b("</label>:&nbsp;");t.b(t.v(t.f("value",c,p,0)));t.b("\n" + i);t.b("		                    </li>  ");t.b("\n" + i);});c.pop();}t.b("		                </ul>");t.b("\n" + i);t.b("						    </div>");t.b("\n" + i);t.b("						  </div>");t.b("\n" + i);t.b("						</div>");t.b("\n" + i);t.b("					</div>");t.b("\n" + i);t.b("					<div class=\"col-md-6\">");t.b("\n");t.b("\n");t.b("\n" + i);if(t.s(t.f("pages_count",c,p,1),c,p,0,6020,6425,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("						<div class=\"panel panel-default\">");t.b("\n" + i);t.b("				      <div class=\"panel-heading\"><a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/pages\"><strong><span class=\"fa fa-files-o\"></span> Pages</strong></a></div>");t.b("\n" + i);t.b("				      <ul class=\"list-group\">");t.b("\n" + i);if(t.s(t.f("pages",c,p,1),c,p,0,6259,6377,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				   				<a target=\"_blank\" href=\"/page/");t.b(t.v(t.f("group_slug",c,p,0)));t.b("/");t.b(t.v(t.f("slug",c,p,0)));t.b("\"  class=\"list-group-item\">");t.b(t.v(t.f("name",c,p,0)));t.b("</a>");t.b("\n" + i);});c.pop();}t.b("				      </ul>");t.b("\n" + i);t.b("				    </div>");t.b("\n" + i);});c.pop();}if(t.s(t.f("appinstances_count",c,p,1),c,p,0,6471,7189,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				    <div class=\"panel panel-default\">");t.b("\n" + i);t.b("				      <div class=\"panel-heading\"><a href=\"/admin/groups/");t.b(t.v(t.f("id",c,p,0)));t.b("/appinstances\"><strong><span class=\"fa fa-cubes\"></span> App Instances</strong></a></div>");t.b("\n" + i);t.b("				      <ul class=\"list-group\">");t.b("\n" + i);if(t.s(t.f("app_instances",c,p,1),c,p,0,6729,7133,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("								<div class=\"list-group-item\">");t.b("\n" + i);t.b("									<a href=\"/admin/apps/");t.b(t.v(t.d("app.id",c,p,0)));t.b("\" class=\"label label-primary pull-right\"><i class=\"fa fa-cube\"></i> App</a>");t.b("\n" + i);t.b("									<a href=\"/admin/appinstances/");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"label label-default pull-right\" style=\"margin-right:10px;\"><i class=\"fa fa-gear\"></i> Config</a>");t.b("\n" + i);t.b("									<a href=\"/app/");t.b(t.v(t.f("group_slug",c,p,0)));t.b("/");t.b(t.v(t.f("slug",c,p,0)));t.b("\" target=\"_blank\">");t.b(t.v(t.f("name",c,p,0)));t.b("</a>");t.b("\n" + i);t.b("								</div>");t.b("\n" + i);});c.pop();}t.b("				      </ul>");t.b("\n" + i);t.b("				    </div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("					</div>");t.b("\n" + i);t.b("				</div>");t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("	</section>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["itemContainer"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"cobler-li-content\"></div>");t.b("\n" + i);t.b("<div class=\"btn-group parent-hover\">");t.b("\n" + i);t.b("    <span class=\"remove-item btn btn-danger fa fa-trash-o\" data-title=\"Remove\"></span>");t.b("\n" + i);t.b("    <span class=\"duplicate-item btn btn-default fa fa-copy\" data-title=\"Duplicate\"></span>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["pages"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"row\">");t.b("\n" + i);t.b("		  <div class=\"col-sm-9\">");t.b("\n" + i);t.b("		  <div class=\"tab-content\">");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,91,121,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(t.rp("<pages_tabpanel0",c,p,"			"));});c.pop();}t.b("		  </div></div>");t.b("\n" + i);t.b("		  <div class=\"col-sm-3\" style=\"padding-top: 5px;\">");t.b("\n" + i);if(t.s(t.f("editable",c,p,1),c,p,0,219,1117,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		    	");if(t.s(t.f("hasextra",c,p,1),c,p,0,240,349,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<a href=\"javascript:void(0);\" class=\"pages_extra btn btn-default pull-right\" ><i class=\"fa fa-gears\"></i></a>");});c.pop();}t.b("\n");t.b("\n" + i);t.b("				<div class=\"actions\" style=\"height:40px\">");t.b("\n" + i);t.b("				");t.b("\n" + i);t.b("				<div class=\"btn-group\">");t.b("\n" + i);t.b("								<button type=\"button\" class=\"btn  btn-info go pages_new\">New <span class=\"\">");t.b(t.v(t.f("label",c,p,0)));t.b("</span></button>");t.b("\n" + i);t.b("								<button type=\"button\" class=\"btn btn-info dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("									<span class=\"caret\"></span>");t.b("\n" + i);t.b("									<span class=\"sr-only\">Toggle Dropdown</span>");t.b("\n" + i);t.b("								</button>");t.b("\n" + i);t.b("								<ul class=\"dropdown-menu dropdown-menu-right\">");t.b("\n" + i);t.b("									<li><a href=\"javascript:void(0);\" class=\"pages_edit\" ><i class=\"fa fa-pencil\"></i> Edit Name</a></li>");t.b("\n" + i);t.b("									<li><a href=\"javascript:void(0);\" class=\"pages_delete\" ><i class=\"fa fa-times\"></i> Delete</a></li>");t.b("\n" + i);t.b("								</ul>");t.b("\n" + i);t.b("							</div>");t.b("\n" + i);t.b("				</div>");t.b("\n");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("		  <div class=\"list-group\" style=\"margin-right: 15px;\">");t.b("\n" + i);t.b(t.rp("<pages_listgroupitem1",c,p,"			"));t.b("		  </div>");t.b("\n" + i);t.b("		  </div>");t.b("\n" + i);t.b("		  <div class=\"dummyTarget\"></div>");t.b("\n" + i);t.b("		</div>");return t.fl(); },partials: {"<pages_tabpanel0":{name:"pages_tabpanel", partials: {}, subs: {  }},"<pages_listgroupitem1":{name:"pages_listgroupitem", partials: {}, subs: {  }}}, subs: {  }});
templates["pages_listgroupitem"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");if(t.s(t.f("items",c,p,1),c,p,0,10,202,"{{ }}")){t.rs(c,p,function(c,p,t){if(!t.s(t.f("removed",c,p,1),c,p,1,0,0,"")){t.b("<a class=\"list-group-item tab\" href=\"#");t.b(t.v(t.f("key",c,p,0)));t.b("\" name=\"");t.b(t.v(t.f("key",c,p,0)));t.b("\" aria-controls=\"");t.b(t.v(t.f("key",c,p,0)));t.b("\" data-toggle=\"tab\">");if(t.s(t.f("disabled",c,p,1),c,p,0,139,164,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<i class=\"fa fa-ban\"></i>");});c.pop();}t.b(" ");t.b(t.v(t.f("name",c,p,0)));t.b("</a>");};});c.pop();}return t.fl(); },partials: {}, subs: {  }});
templates["pages_tabpanel"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div role=\"tabpanel\" class=\"tab-pane ");t.b(t.v(t.f("key",c,p,0)));t.b("\" id=\"");t.b(t.v(t.f("key",c,p,0)));t.b("\"></div>");return t.fl(); },partials: {}, subs: {  }});
templates["site"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div style=\"margin:21px;\">");t.b("\n" + i);t.b("<div class=\"btn-group pull-right\">");t.b("\n" + i);t.b("<button type=\"button\" class=\"btn btn-primary\" id=\"save\">Save</button>");t.b("\n" + i);t.b("<button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("<span class=\"caret\"></span>");t.b("\n" + i);t.b("<span class=\"sr-only\">Toggle Dropdown</span>");t.b("\n" + i);t.b("</button>");t.b("\n" + i);t.b("<ul class=\"dropdown-menu\">");t.b("\n" + i);t.b("<li><a href=\"/app/`+data.slug+`\">Visit</a></li>");t.b("\n" + i);t.b("<li><a href=\"#\" id=\"export\">Export Theme</a></li>");t.b("\n" + i);t.b("<li><a href=\"#\" id=\"import\">Import Theme</a></li>");t.b("\n" + i);t.b("</ul>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);t.b("<!-- Nav tabs -->");t.b("\n" + i);t.b("<ul class=\"nav nav-tabs\" role=\"tablist\">");t.b("\n" + i);t.b("<li role=\"presentation\" class=\"active\"><a href=\"#main\" aria-controls=\"main\" role=\"tab\" data-toggle=\"tab\">Main</a></li>");t.b("\n" + i);t.b("<li role=\"presentation\"><a href=\"#theme\" aria-controls=\"theme\" role=\"tab\" data-toggle=\"tab\">Theme</a></li>");t.b("\n" + i);t.b("<li role=\"presentation\"><a href=\"#templates\" aria-controls=\"templates\" role=\"tab\" data-toggle=\"tab\">Templates</a></li>");t.b("\n" + i);t.b("<li role=\"presentation\"><a href=\"#cas_config\" aria-controls=\"cas_config\" role=\"tab\" data-toggle=\"tab\">CAS</a></li>");t.b("\n" + i);t.b("</ul>");t.b("\n");t.b("\n" + i);t.b("<!-- Tab panes -->");t.b("\n" + i);t.b("<div class=\"tab-content\">");t.b("\n" + i);t.b("	<div role=\"tabpanel\" class=\"tab-pane active\" id=\"main\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("	<div role=\"tabpanel\" class=\"tab-pane\" id=\"theme\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("	<div role=\"tabpanel\" class=\"tab-pane\" id=\"cas_config\" style=\"padding-top: 20px;\">");t.b("\n" + i);t.b("		<div class=\"row\">");t.b("\n" + i);t.b("			<div class=\"col-sm-9 styles\">");t.b("\n" + i);t.b("				<div class=\"cas_config_form\"></div>");t.b("\n" + i);t.b("				<div class=\"external_user_lookup_form\"></div>								");t.b("\n" + i);t.b("				<div class=\"cas_data_map_default_form\"></div>");t.b("\n" + i);t.b("				<div class=\"cas_data_map_additional_form\"></div>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);t.b("			<div class=\"col-sm-3\"></div>");t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("	</div>	");t.b("\n" + i);t.b("	<div role=\"tabpanel\" class=\"tab-pane\" id=\"templates\" style=\"padding-top: 20px;\"><div class=\"row\"><div class=\"col-sm-9 styles\"></div>");t.b("\n" + i);t.b("	<div class=\"col-sm-3\"></div></div></div>");t.b("\n" + i);t.b("</div>");t.b("\n");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["user_list"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");if(t.s(t.d("users.length",c,p,1),c,p,0,17,44,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("Click a user to take action");});c.pop();}t.b("<hr style=\"border:solid 1px #333\">");if(!t.s(t.d("users.length",c,p,1),c,p,1,0,0,"")){t.b("No results");};t.b("<div class=\"list-group\">");if(t.s(t.f("users",c,p,1),c,p,0,173,281,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<a href=\"javascript:void(0);\" class=\"list-group-item user\" data-id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b(t.v(t.f("first_name",c,p,0)));t.b(" ");t.b(t.v(t.f("last_name",c,p,0)));t.b("</a>");});c.pop();}t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
