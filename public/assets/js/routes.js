if(typeof route !== 'undefined'){

var api = '/api/'+route;
var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: -20,
		container: '#table', 
		berry: {flatten: false},
		add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes});},
		edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes});},
		delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE'});}
	}
$('#content').html('<div class="row "><div class="col-sm-12"><div id="table" style="margin:-21px"></div></div></div>');		

initializers = {};

initializers['apps'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Apps');
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/admin/'+route+'/'+model.attributes.id},
				tableConfig.events = [
					{'name': 'config', 'label': '<i class="fa fa-code"></i> Developers', callback: function(model){
						window.location.href = '/admin/apps/'+model.attributes.id+'/developers'
					}}
				]
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['appinstances'] = function(){
		$.ajax({
			url: '/api/appinstances',
			success: function(data){
				$('.navbar-header .nav a h4').html('App Instances');
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
        			{label: 'Slug', name:'slug', required: true},
        			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'},
					{label: 'App', name:'app_id', required: true, type:'select', choices: '/api/apps'},
					{name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/app/'+model.attributes.slug};
				tableConfig.data = data;
				tableConfig.events = [
					{'name': 'config', 'label': '<i class="fa fa-cogs"></i> Config', callback: function(model){
						var options = $.extend(true, {legend:'Update Configuration'}, JSON.parse(JSON.parse(model.attributes.app.code).form)) 

						options.attributes = JSON.parse(model.attributes.configuration)|| {};
						options.attributes.id = model.attributes.id;
						options.fields.push({name: 'id', type:'hidden'});
						$().berry(options).on('save', function(){
							$.ajax({url: api+'/'+this.toJSON().id, type: 'PUT', data: {configuration: JSON.stringify(this.toJSON())},success:function(){
								this.trigger('close');
							}.bind(this)});
						});
					}},
					{'name': 'resources', 'label': '<i class="fa fa-road"></i> Resources', callback: function(model){
						 
						var attributes = $.extend(true, [],JSON.parse(model.attributes.app.code).sources, JSON.parse(model.attributes.resources));
						$().berry({legend:'Update Routes',flatten:false, attributes: {id:model.attributes.id, container:{resources:attributes}},fields:[
							{name: 'id', type:'hidden'},
							{name:'container', label: false,  type: 'fieldset', fields:[

								{"multiple": {"duplicate": false},label: 'Resource', name: 'resources', type: 'fieldset', fields:[
									{label: 'Name', enabled:false},
									{label: 'Path'},
									{label: 'Cache', type: 'checkbox'},
									{label: 'Fetch', type: 'checkbox'},
									{label: 'Endpoint', type: 'select', choices: '/api/endpoints'},
									{label: 'Modifier', type: 'select', choices:[{label: 'None', value: 'none'},{label: 'XML', value: 'xml'}, {label: 'CSV', value: 'csv'}]},
								]}
							]},
						]} ).on('save', function(){
							$.ajax({url: api+'/'+this.toJSON().id, type: 'PUT', data: {resources: JSON.stringify(this.toJSON().container.resources)},success:function(){
								this.trigger('close');
							}.bind(this)});
						});
					}}
				]
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['sites'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Sites');
				tableConfig.schema = [
					{label: 'Name', name:'domain', required: true},
					{label: 'Theme', name:'theme'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}

initializers['endpoints'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Endpoints');
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Auth Type', name:'type', type: 'select', choices:[
						{label:'HTTP No Auth', value:'http_no_auth'}, 
						{label:'HTTP Basic Auth', value:'http_basic_auth'}, 
						{label:'Google Sheets', value:'google_sheets'},
					], required: true},
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'},
					{label: 'Configuration', name:'config', showColumn:false, fields:[
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
						{label:'Sheet ID', name:'sheet_id', type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Google Redirect URL', name:'google_redirect', enabled:false, type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
						{label:'Password', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
					]},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}

initializers['users'] = function(){
	$.ajax({
		url: '/api/'+route,
		success: function(data){
			$('.navbar-header .nav a h4').html('Users');
			tableConfig.schema = [
				{label: 'First Name', name:'first_name', required: true},
				{label: 'Last Name', name:'last_name', required: true},
				{label: 'Email', name:'email', type: 'email', required: true},
				{name: 'id', type:'hidden'}
			];
			tableConfig.data = data;
			bt = new berryTable(tableConfig)
		}
	});
}
initializers['groups'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Groups');
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},        
					{label: 'Slug', name:'slug', required: true},
					{name: 'id', type:'hidden'}
				];
				tableConfig.events = [
					{'name': 'config', 'label': '<i class="fa fa-lock"></i> Admins', callback: function(model){
						window.location.href = '/admin/groups/'+model.attributes.id+'/admins'
					}},
					{'name': 'resources', 'label': '<i class="fa fa-person"></i> Members', callback: function(model){
						window.location.href = '/admin/groups/'+model.attributes.id+'/members'

					}}
				]
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['members'] = function(){
		$.ajax({
			url: '/api/groups/1/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Members');
				tableConfig.schema = [
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'},
					{label: 'User', name:'user_id', required: true, type:'select', choices: '/api/users', label_key:'email'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){$.ajax({url: '/api/groups/'+model.attributes.group_id+'/members/'+model.attributes.user_id, type: 'POST', data: model.attributes});},
				tableConfig.edit = function(model){$.ajax({url: '/api/groups/'+model.attributes.group_id+'/members/'+model.attributes.user_id, type: 'PUT', data: model.attributes});},
				tableConfig.delete = function(model){ $.ajax({url: '/api/groups/'+model.attributes.group_id+'/members/'+model.attributes.user_id, type: 'DELETE'});}

				bt = new berryTable(tableConfig)
			}
		});
}
initializers['admins'] = function(){
		$.ajax({
			url: '/api/groups/1/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Admins');
				tableConfig.schema = [
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'},
					{label: 'User', name:'user_id', required: true, type:'select', choices: '/api/users', label_key:'email'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){$.ajax({url: '/api/groups/'+model.attributes.group_id+'/admins/'+model.attributes.user_id, type: 'POST', data: model.attributes});},
				tableConfig.edit = function(model){$.ajax({url: '/api/groups/'+model.attributes.group_id+'/admins/'+model.attributes.user_id, type: 'PUT', data: model.attributes});},
				tableConfig.delete = function(model){ $.ajax({url: '/api/groups/'+model.attributes.group_id+'/admins/'+model.attributes.user_id, type: 'DELETE'});}
				
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['developers'] = function(){
		$.ajax({
			url: '/api/apps/1/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Developers');
				tableConfig.schema = [
					{label: 'App', name:'app_id', required: true, type:'select', choices: '/api/apps'},
					{label: 'User', name:'user_id', required: true, type:'select', choices: '/api/users', label_key:'email'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){$.ajax({url: '/api/apps/'+model.attributes.app_id+'/developers/'+model.attributes.user_id, type: 'POST', data: model.attributes});},
				tableConfig.edit = function(model){$.ajax({url: '/api/apps/'+model.attributes.app_id+'/developers/'+model.attributes.user_id, type: 'PUT', data: model.attributes});},
				tableConfig.delete = function(model){ $.ajax({url: '/api/apps/'+model.attributes.app_id+'/developers/'+model.attributes.user_id, type: 'DELETE'});}
				
				bt = new berryTable(tableConfig)
			}
		});
}

$('[href="/admin/'+route+'"]').parent().addClass('active');
initializers[route]();

}
templates["berry_ace"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"clearfix form-group\" name=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\">");t.b("\n" + i);t.b(t.rp("<berry__label0",c,p,"	"));if(t.s(t.f("label",c,p,1),c,p,0,80,277,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	");if(t.s(t.f("inline",c,p,1),c,p,0,93,167,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"col-md-12\" ");if(t.s(t.f("advanced",c,p,1),c,p,0,129,153,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("style=\"padding:0px 13px\"");});c.pop();}t.b(">");});c.pop();}t.b("\n" + i);t.b("	");if(!t.s(t.f("inline",c,p,1),c,p,1,0,0,"")){t.b("<div class=\"col-md-8\" ");if(t.s(t.f("advanced",c,p,1),c,p,0,226,250,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("style=\"padding:0px 13px\"");});c.pop();}t.b(">");};t.b("\n" + i);});c.pop();}if(!t.s(t.f("label",c,p,1),c,p,1,0,0,"")){t.b("	<div class=\"col-md-12\" ");if(t.s(t.f("advanced",c,p,1),c,p,0,337,361,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("style=\"padding:0px 13px\"");});c.pop();}t.b(">");t.b("\n" + i);};t.b("		<div class=\"formcontrol\"><div placeholder=\"");t.b(t.v(t.f("placeholder",c,p,0)));t.b("\" style=\"min-height: 250px;outline:none;border:solid 1px #cbd5dd;");if(!t.s(t.f("unstyled",c,p,1),c,p,1,0,0,"")){t.b("background:#fff;padding:10px");};t.b("\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("container\"></div></div>");t.b("\n" + i);t.b(t.rp("<berry__addons1",c,p,"			"));t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<berry__label0":{name:"berry__label", partials: {}, subs: {  }},"<berry__addons1":{name:"berry__addons", partials: {}, subs: {  }}}, subs: {  }});
(function(b, $){
	b.register({
		type: 'ace',
		create: function() {
				return b.render('berry_ace', this);
			},
		setup: function() {
			this.$el = this.self.find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

			this.editor = ace.edit(this.id+"container");
	    this.editor.setTheme(this.item.theme || "ace/theme/chrome");
	    this.editor.getSession().setMode(this.item.mode || "ace/mode/handlebars");

		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.editor.setValue(value);
			return this.$el;
		},
		getValue: function(){
			return this.editor.getValue()
		},
		// destroy: function(){
		// 	this.editor.destroy();
		// }
		focus: function(){
			this.editor.focus();
		}
	});
})(Berry,jQuery);