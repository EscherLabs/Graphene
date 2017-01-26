
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
					{label: 'Name', name:'name', required: true},
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
					{label: 'Name', name:'name', required: true}
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
					{label: 'Slug', name:'slug', required: true}
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
					{label: 'Auth Type', name:'type', type: 'select', choices:[{label:'http Auth', value:'http_auth'}], required: true},
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'}
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
					{label: 'Theme', name:'theme'}
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
        	{label: 'Slug', name:'slug', required: true}
				];
				tableConfig.click = function(model){window.location.href = '/app/'+model.attributes.slug};
				tableConfig.data = data;
				tableConfig.events = [
					{'name': 'manage', 'label': '<i class="fa fa-cogs"></i> Manage', callback: function(model){
						$().berry(JSON.parse(JSON.parse(model.attributes.app.code).options));
					}}
				]
				bt = new berryTable(tableConfig)
			}
		});
}
$('[href="/admin/'+route+'"]').parent().addClass('active');
initializers[route]();
