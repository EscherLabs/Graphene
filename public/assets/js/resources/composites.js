$('.navbar-header .nav a h4').html('Group Composites');
$('[href="/admin/groups"]').parent().addClass('active');

getData('/api/groups/'+resource_id+'/composites', composites => {
	routes.create = routes.delete = '/api/groups/{{resource_id}}/composites/{{id}}';
	new GrapheneDataGrid({...tableConfig,
		schema: [
			{label: 'Group', name:'id', required: true, type:'group',template:"{{attributes.name}}"}
		],
		actions: [
			{'name':'delete'},'|','|',
			{'name':'create'}
		],
		data: composites
	})
});