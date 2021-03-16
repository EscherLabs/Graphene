$('.navbar-header .nav a h4').html('Group Composites');
$('[href="/admin/groups"]').parent().addClass('active');

getData('/api/groups/'+resource_id+'/composites', function(data){
	tableConfig.schema = [
		{label: 'Group', name:'id', required: true, type:'group'}
	];
	tableConfig.data = data;
	tableConfig.actions=[
		{'name':'delete'},'|','|',
		{'name':'create'},

	]
	routes.create = routes.delete = '/api/groups/{{resource_id}}/composites/{{id}}';

	grid = new GrapheneDataGrid(tableConfig)
});