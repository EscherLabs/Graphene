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