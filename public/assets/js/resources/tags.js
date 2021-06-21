$('.navbar-header .nav a h4').html('Tags');
$('[href="/admin/groups"]').parent().addClass('active');

getData([url, '/api/groups'], function(tags, groups){
	new GrapheneDataGrid({...tableConfig,
		schema: [
			fieldLibrary.group,
			{label: 'Name', name:'name', required: true},
			{label: 'Value', name:'value', required: true},
			{name: 'id', type:'hidden'}
		],
		data: tags,
		name: 'tags'
	})
});