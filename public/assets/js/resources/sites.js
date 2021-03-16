$('.navbar-header .nav a h4').html('Sites');

getData(url, function(data){
	tableConfig.schema = [
		{label: 'Site Name', name:'name', required: true},
		{label: 'Domain', name:'domain', required: true},
		{name: 'id', type:'hidden'}
	];

	tableConfig.data = data;
	tableConfig.name = "sites";

	grid = new GrapheneDataGrid(tableConfig).on('click',function(e){
		window.location = '/admin/sites/'+e.model.attributes.id
	})
});