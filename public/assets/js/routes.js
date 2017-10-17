if(typeof route !== 'undefined'){

var api = '/api/'+route;
var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: -20,
		container: '#table', 
		berry: {flatten: false},
		add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes,
			success:function(data) {
				model.set(data);
				Berries.modal.trigger('close')
				toastr.success('', 'Successfully Added')
			}.bind(model),
			error:function(e) {
				toastr.error(e.statusText, 'ERROR');
			}
		});},
		edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
			success:function() {
				toastr.success('', 'Successfully Updated')
			},
			error:function(e) {
				toastr.error(e.statusText, 'ERROR');
			}
		});},
		delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE',
			success:function() {
				toastr.success('', 'Successfully Deleted')
			},
			error:function(e) {
				toastr.error(e.statusText, 'ERROR');
			}
		});}

		// tableConfig.add = function(model){
		// 	if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
		// 		$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.user_id, type: 'POST', data: model.attributes,
		// 			success:function(data){
		// 				toastr.success('', 'Developer successfully Added')
		// 			},
		// 			error:function(e){
		// 				toastr.error(e.statusText, 'ERROR');
		// 			}
		// 		});
		// 	}else{
		// 		toastr.error('Developer already exists', 'Duplicate')
		// 		model.delete();
		// 		model.owner.draw();
		// 	}
		// },

	}
$('#content').html('<div class="row "><div class="col-sm-12"><div id="table" style="margin:-21px"></div></div></div>');		

initializers = {};

initializers['apps'] = function() {
		$('.navbar-header .nav a h4').html('Apps');
		$.ajax({
			url: '/api/'+route,
			success: function(data) {
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
				tableConfig.name = "apps";
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['appinstances'] = function() {
		$('.navbar-header .nav a h4').html('App Instances');
		$.ajax({
			url: '/api/appinstances',
			success: function(data) {
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
        			{label: 'Slug', name:'slug', required: true},
        			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
        			{label: 'Unlisted', name:'unlist', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'App', name:'app_id', required: true, type:'select', choices: '/api/apps'},
					{name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/admin/appinstances/'+model.attributes.id};
				tableConfig.data = data;
				tableConfig.name = "appinstances";

				bt = new berryTable(tableConfig)
			}
		});
}
initializers['app_instance'] = function() {
		$('.navbar-header .nav a h4').html('App Instances');
		$.ajax({
			url: '/api/appinstances/'+resource_id,
			success: function(data) {				
				$('#table').html(`
				<div style="margin:21px">
<div class="btn-group pull-right">
  <button type="button" class="btn btn-primary" id="save">Save</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="/app/`+data.slug+`">Visit</a></li>
  </ul>
</div>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#main" aria-controls="home" role="tab" data-toggle="tab">Main</a></li>
    <li role="presentation"><a href="#resources" aria-controls="messages" role="tab" data-toggle="tab">Resources</a></li>
	<li role="presentation"><a href="#options" aria-controls="profile" role="tab" data-toggle="tab">Options</a></li>
	<li role="presentation"><a href="#user_options_default" aria-controls="profile" role="tab" data-toggle="tab">User Default Options</a></li>	
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="main" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
  	<div class="col-sm-3"></div></div></div>
    <div role="tabpanel" class="tab-pane" id="resources" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="options" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
  	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="user_options_default" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
  	<div class="col-sm-3"></div></div></div>
  </div>

</div>
				`)

				$('#main .col-sm-9').berry({fields: [
					{label: 'Name', name:'name', required: true},
        			{label: 'Slug', name:'slug', required: true},
        			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'App', name:'app_id', required: true, type:'select', choices: '/api/apps'},
					{name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				],attributes:data, actions:false, name:'main'})
				$('#save').on('click',function(){
					var item = Berries.main.toJSON();
					item.options = Berries.options.toJSON();
					item.user_options_default = Berries.user_options_default.toJSON();
					item.resources = Berries.resources.toJSON().resources;

					$.ajax({url: '/api/appinstances/'+item.id, type: 'PUT', data: item, success:function(){
							toastr.success('', 'Successfully updated App Instance')
						}.bind(this),
						error:function(e) {
							toastr.error(e.statusText, 'ERROR');
						}
					});

				})

				var options = $.extend(true,{actions:false}, JSON.parse(data.app.code.forms[0].content)) 
				options.attributes = data.options || {};
				options.attributes.id = data.id;
				options.name = 'options';
				$('#options .col-sm-9').berry(options);

				var user_options_default = $.extend(true,{actions:false}, JSON.parse(data.app.code.forms[1].content)) 
				user_options_default.attributes = data.user_options_default || {};
				user_options_default.attributes.id = data.id;
				user_options_default.name = 'user_options_default';
				$('#user_options_default .col-sm-9').berry(user_options_default);
				
				if(data.app.code.sources[0].name !== '') {	
					var attributes = $.extend(true, [],data.app.code.sources, data.resources);
					$('#resources .col-sm-9').berry({name:'resources', actions:false,attributes: {resources:attributes},fields:[
						{name:'container', label: false,  type: 'fieldset', fields:[

							{"multiple": {"duplicate": false},label: '<hr>', name: 'resources', type: 'fieldset', fields:[
								{label: 'Name', enabled:false},
								{label: 'Fetch', type: 'checkbox'},
								{label: 'Endpoint', type: 'select', choices: '/api/endpoints'},
								{label: 'Path'},
								{label: 'Cache', type: 'checkbox'},
								{label: 'Modifier', type: 'select', choices:[{label: 'None', value: 'none'},{label: 'XML', value: 'xml'}, {label: 'CSV', value: 'csv'}]},
							]}
						]},
					]} )
				}
			}
		});
}

initializers['sites'] = function() {
		$('.navbar-header .nav a h4').html('Sites');
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				tableConfig.schema = [
					{label: 'Site Name', name:'name', required: true},
					{label: 'Domain', name:'domain', required: true},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.name = "sites";
				tableConfig.click = function(model){window.location.href = '/admin/sites/'+model.attributes.id};
				bt = new berryTable(tableConfig)
			}
		});
}

initializers['site'] = function() {
	$('.navbar-header .nav a h4').html('Site');
	$.ajax({
		url: '/api/sites/'+resource_id,
		success: function(data) {				
			$('#table').html(`
			<div style="margin:21px">
<div class="btn-group pull-right">
<button type="button" class="btn btn-primary" id="save">Save</button>
<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="caret"></span>
<span class="sr-only">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
<li><a href="/app/`+data.slug+`">Visit</a></li>
</ul>
</div>
<!-- Nav tabs -->
<ul class="nav nav-tabs" role="tablist">
<li role="presentation" class="active"><a href="#main" aria-controls="main" role="tab" data-toggle="tab">Main</a></li>
<li role="presentation"><a href="#theme" aria-controls="theme" role="tab" data-toggle="tab">Theme</a></li>
<li role="presentation"><a href="#cas_config" aria-controls="cas_config" role="tab" data-toggle="tab">CAS</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
	<div role="tabpanel" class="tab-pane active" id="main" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="theme" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="cas_config" style="padding-top: 20px;">
		<div class="row">
			<div class="col-sm-9 styles">
				<div class="cas_config_form"></div>
				<div class="external_user_lookup_form"></div>								
				<div class="cas_data_map_default_form"></div>
				<div class="cas_data_map_additional_form"></div>
			</div>
			<div class="col-sm-3"></div>
		</div>
	</div>
</div>

</div>
			`)

			$('#main .col-sm-9').berry({fields: [
				{label: 'Name', name:'name', required: true},
				{label: 'Domain', name:'domain', required: true},
				{label: 'Auth Type', name:'auth', required: true,type:"select",options:[
					'Default','CAS'
				],type:'select'},
				{name: 'id', type:'hidden'},				
			],attributes:data, actions:false, name:'main'})

			$('#theme .col-sm-9').berry({fields: [
				{label: 'Icon', name:'icon', required: true},
				{label: 'CSS', name:'css', required: true, type:'ace', mode:'ace/mode/css'},
			],attributes:data.theme, actions:false, name:'theme'})

			$('#cas_config .cas_config_form').berry({fields: [
				{label: 'CAS Hostname', name:'cas_hostname', required: true},		
				{label: 'CAS Real Hosts', name:'cas_real_hosts', required: true},
				{label: 'CAS URI', name:'cas_uri', required: true, placeholder:'/cas'},
				{label: 'CAS Port', name:'cas_port', required: true, type:'select',options:[
					{name:'HTTP (80)', value:'80'},{name:'HTTPS (443)', value:'443'},
				]},
				{label: 'CAS Login URL', name:'cas_login_url', required: false},
				{label: 'CAS Logout URL', name:'cas_logout_url', required: false},
				{label: 'CAS Enable SAML', name:'cas_enable_saml', required: true,options:[
					{label:'Enabled',value:true},{label:'Disabled',value:false}
				],type:'select'},
			],attributes:data.auth_config, actions:false, name:'cas_config'})

			$('#cas_config .external_user_lookup_form').berry({fields: [
				{label: 'External User Lookup Enabled',name:"enabled",options:[
					{label:'Enabled',value:true},{label:'Disabled',value:false}
				],type:'select'},
				{label: 'External User Lookup URL',name:"url"},
				{label: 'External User Lookup Verb',name:"verb",type:"select",options:[
					'POST','GET'
				]},
			],attributes:data.auth_config.external_user_lookup, actions:false, name:'external_user_lookup'})

			if (typeof data.auth_config.cas_data_map === 'undefined') {data.auth_config.cas_data_map = {
				default:{},additional:{}
			}}
			$('#cas_config .cas_data_map_default_form').berry({fields: [
				{label: 'Email',name:"email"},
				{label: 'First Name',name:"first_name"},
				{label: 'Last Name',name:"last_name"},
				{label: 'Unique ID',name:"unique_id"},
			],attributes:data.auth_config.cas_data_map.default, actions:false, name:'cas_data_map_default'})

			var arr = [];
			for (var key in data.auth_config.cas_data_map.additional) {
				arr.push({name:key, value:data.auth_config.cas_data_map.additional[key]});
			}
			$('#cas_config .cas_data_map_additional_form').berry({fields: [
				{label: 'CAS Data Map', name:'cas_data_map', fields:{
					additional:{
						label: false, name:'additional',
						multiple:{
							"duplicate": true,
							"min": 1
						},fields: [
							{columns:6, label: 'Name',name:"name"},
							{columns:6, label: 'Value',name:"value"},
						],
					}
				}},
			],attributes:{additional:arr}, actions:false, name:'cas_data_map_additional'})

			$('#save').on('click',function(){
				var item = Berries.main.toJSON();
				item.options = Berries.theme.toJSON();
				item.auth_config = Berries.cas_config.toJSON();
				item.auth_config.cas_data_map = {};
				item.auth_config.cas_data_map.default = Berries.cas_data_map_default.toJSON();
				item.auth_config.cas_data_map.additional = 
					_.object(_.map(Berries.cas_data_map_additional.toJSON().additional, function(x){return [x.name, x.value]}))
				item.auth_config.external_user_lookup = Berries.external_user_lookup.toJSON();
				
				$.ajax({url: '/api/sites/'+item.id, type: 'PUT', data: item, success:function(){
						toastr.success('', 'Successfully updated App Instance')
					}.bind(this),
					error:function(e) {
						toastr.error(e.statusText, 'ERROR');
					}
				});
			})

		}
	});
}

initializers['pages'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('.navbar-header .nav a h4').html('Pages');
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Slug', name:'slug', required: true},
        			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
        			{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/page/'+model.attributes.group_id+'/'+model.attributes.slug};

				tableConfig.data = data;
				tableConfig.name = "pages";

				bt = new berryTable(tableConfig)
			}
		});
}

initializers['endpoints'] = function() {
		$('.navbar-header .nav a h4').html('Endpoints');
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Auth Type', name:'type', type: 'select', choices:[
						{label:'HTTP No Auth', value:'http_no_auth'}, 
						{label:'HTTP Basic Auth', value:'http_basic_auth'}, 
						{label:'Google Sheets', value:'google_sheets'},
					], required: true},
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'Configuration', name:'config', showColumn:false, fields:[
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
						{label:'Sheet ID', name:'sheet_id', type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Google Redirect URL', name:'google_redirect', enabled:false, type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
						{label:'Password', 'name':'secret', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
					]},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.name = "endpoints";

				bt = new berryTable(tableConfig)
			}
		});
}

initializers['users'] = function() {
	$('.navbar-header .nav a h4').html('Users');
	$.ajax({
		url: '/api/'+route,
		success: function(data) {
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
initializers['groups'] = function() {
		$('.navbar-header .nav a h4').html('Groups');
		$.ajax({
			url: '/api/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},        
					{label: 'Slug', name:'slug', required: true},
					{name: 'id', type:'hidden'}
				];
				tableConfig.events = [
					{'name': 'config', 'label': '<i class="fa fa-lock"></i> Admins', callback: function(model){
						window.location.href = '/admin/groups/'+model.attributes.id+'/admins'
					}},
					{'name': 'resources', 'label': '<i class="fa fa-users"></i> Members', callback: function(model){
						window.location.href = '/admin/groups/'+model.attributes.id+'/members'
					}},
					{'name': 'composites', 'label': '<i class="fa fa-puzzle-piece"></i> Composites', callback: function(model){
						window.location.href = '/admin/groups/'+model.attributes.id+'/composites'
					}}
				]
				tableConfig.data = data;
				tableConfig.name = "groups";

				bt = new berryTable(tableConfig)
			}
		});
}
initializers['members'] = function() {
		$('.navbar-header .nav a h4').html('Members');
		$.ajax({
			url: '/api/groups/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'user_id', required: true, type:'select', choices: '/api/users', label_key:'email'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/members/'+model.attributes.user_id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Member successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Member already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/members/'+model.attributes.user_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Member successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}

				bt = new berryTable(tableConfig)
			}
		});
}
initializers['admins'] = function() {
		$('.navbar-header .nav a h4').html('Admins');
		$.ajax({
			url: '/api/groups/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'user_id', required: true, type:'select', choices: '/api/users', label_key:'email'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/admins/'+model.attributes.user_id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Admin successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Admin already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/admins/'+model.attributes.user_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Admin successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['composites'] = function() {
		$('.navbar-header .nav a h4').html('Group Composites');
		$.ajax({
			url: '/api/groups/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'Group', name:'composite_group_id', required: true, type:'select', choices: '/api/groups?limit=true', label_key:'composite_group_id'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.composite_group_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/composites/'+model.attributes.composite_group_id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Composite successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Composite already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/composites/'+model.attributes.composite_group_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Composite successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['developers'] = function() {
		$('.navbar-header .nav a h4').html('Developers');
		$.ajax({
			url: '/api/apps/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'user_id', required: true, type:'select', choices: '/api/users', label_key:'email'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
						$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.user_id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Developer successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Developer already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.user_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Developer successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				bt = new berryTable(tableConfig)
			}
		});
}

$('[href="/admin/'+route+'"]').parent().addClass('active');
initializers[route]();

}

templates['pages_tabpanel'] =Hogan.compile(`<div role="tabpanel" class="tab-pane {{key}}" id="{{key}}"></div>`);
templates['pages_listgroupitem'] =Hogan.compile(`{{#items}}{{^removed}}<a class="list-group-item tab" href="#{{key}}" aria-controls="{{key}}" data-toggle="tab">{{name}}</a>{{/removed}}{{/items}}`);
templates['pages'] = Hogan.compile(
  `<div class="row">
  <div class="col-sm-9">
  <div class="tab-content">
    {{#items}}
	{{>pages_tabpanel}}
    {{/items}}
  </div></div>
  <div class="col-sm-3" style="padding-top: 5px;">
  {{#editable}}
    	{{#hasextra}}<a href="javascript:void(0);" class="pages_extra btn btn-default pull-right" ><i class="fa fa-gears"></i></a>{{/hasextra}}

		<div class="actions" style="height:40px">
		
		<div class="btn-group">
						<button type="button" class="btn  btn-info go pages_new">New <span class="">Section</span></button>
						<button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<span class="caret"></span>
							<span class="sr-only">Toggle Dropdown</span>
						</button>
						<ul class="dropdown-menu dropdown-menu-right">
							<li><a href="javascript:void(0);" class="pages_edit" ><i class="fa fa-pencil"></i> Edit Name</a></li>
							<li><a href="javascript:void(0);" class="pages_delete" ><i class="fa fa-times"></i> Delete</a></li>
						</ul>
					</div>
		</div>

		  {{/editable}}

  <div class="list-group">
	{{>pages_listgroupitem}}
  </div>
  </div>
  <div class="dummyTarget"></div>
  </div>`);