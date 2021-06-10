$('.navbar-header .nav a h4').html('Workflows');

getData([url, '/api/workflows/developers'], (workflows, developers) => {

	new GrapheneDataGrid({...tableConfig,
		schema: [
			{label: 'Name', name:'name', required: true},
			{label: 'Description', name:'description', required: false, type:'textarea'},
			{label: 'Tags', name:'tags', required: false},
			{label: 'Lead Developer', name:'user_id', type:'select', options: 'developers', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false,format:{label:"{{email}}",value:"{{id}}"}},
			{name: 'id', type:'hidden'}
		],
		data: workflows,
		name: 'workflows'
	})
	.on('click', e =>{
		window.location = '/admin/'+route+'/'+e.model.attributes.id
	})
	.on('model:developers', e => {
		window.location = '/admin/workflows/'+e.model.attributes.id+'/developers'
	})
});




