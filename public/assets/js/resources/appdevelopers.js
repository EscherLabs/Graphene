$('.navbar-header .nav a h4').html('Developers');
getData(['/api/apps/'+resource_id+'/developers'], developers => {
	routes.create = routes.delete = '/api/apps/{{resource_id}}/developers/{{id}}';

	new GrapheneDataGrid({...tableConfig, 
		schema: [
			{label: 'User', name:'id', type:'user_id', template:'{{attributes.first_name}} {{attributes.last_name}} - {{attributes.email}}'}
		],
		actions: [
			{'name':'create'},'|','|',
			{'name':'delete'}
		],
		data: developers,
		name: 'developers'
	})
});