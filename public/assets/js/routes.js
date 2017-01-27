var api = '/api/'+route;
var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: 20,
		container: '#table', 
		berry: {flatten: false},
		add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes});},
		edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes});},
		delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE'});}
	}
initializers = {};
initializers['users'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('#content').html('<h1 class="page-header">Users</h1><div class="row "><div id="table"></div></div>');		
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

initializers['apps'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('#content').html('<h1 class="page-header">Apps</h1><div class="row "><div id="table"></div></div>');		
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/admin/'+route+'/'+model.attributes.id},

				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['groups'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('#content').html('<h1 class="page-header">Groups</h1><div class="row "><div id="table"></div></div>');		
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},        
					{label: 'Slug', name:'slug', required: true},
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
				$('#content').html('<h1 class="page-header">Endpoints</h1><div class="row "><div id="table"></div></div>');		
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Auth Type', name:'type', type: 'select', choices:[{label:'http No Auth', value:'http_no_auth'}, {label:'http Basic Auth', value:'http_basic_auth'}], required: true},
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'},
					{label: 'App', name:'group_id', required: true, type:'select', choices: '/api/apps'},
					{label: 'Credentials', name:'credentials', showColumn:false, fields:[
						{label:'Url', required: false,parsable:'show'},
						{label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
						{label:'Password', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'}
					]},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['sites'] = function(){
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				$('#content').html('<h1 class="page-header">Sites</h1><div class="row "><div id="table"></div></div>');		
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
initializers['appinstances'] = function(){
		$.ajax({
			url: '/api/appinstances',
			success: function(data){
				$('#content').html('<h1 class="page-header">App Instances</h1><div class="row "><div id="table"></div></div>');		
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
        			{label: 'Slug', name:'slug', required: true},
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
						debugger;
						var options = $.extend(true, {legend:'Update Configuration'}, JSON.parse(model.attributes.app.code).form) 

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
$('[href="/admin/'+route+'"]').parent().addClass('active');
initializers[route]();
