$('.navbar-header .nav a h4').html('Sites');

getData(url, sites => {
	new GrapheneDataGrid({...tableConfig,
		schema: [
			{label: 'Site Name', name:'name', required: true},
			{label: 'Domain', name:'domain', required: true},
			{name: 'id', type:'hidden'}
		],
		data: sites,
		name: 'sites'
	})
	.on('click', e => {
		window.location = '/admin/sites/'+e.model.attributes.id
	})
});