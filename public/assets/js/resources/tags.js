$('.navbar-header .nav a h4').html('Tags');
$('[href="/admin/groups"]').parent().addClass('active');

getData(url, function(data){
	tableConfig.schema = [
		{label: 'Group', name:'group_id', required: true, type:'group',enabled:false},
		{label: 'Name', name:'name', required: true},
		{label: 'Value', name:'value', required: true},
		{name: 'id', type:'hidden'}
	];

	tableConfig.data = data;
	tableConfig.name = "tags";

	grid = new GrapheneDataGrid(tableConfig)
});