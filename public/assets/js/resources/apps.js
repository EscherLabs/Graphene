$('.navbar-header .nav a h4').html('MicroApps');
getData([url,'/api/apps/developers'], function(data,developers){
	tableConfig.schema = [
		{label: 'Name', name:'name', required: true},
		{label: 'Description', name:'description', required: false, type:'textarea'},
		{label: 'Tags', name:'tags', required: false},
		{label: 'Lead Developer', name:'user_id', type:'select', options: developers, template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false,format:{label:"{{email}}",value:"{{id}}"}},
		{name: 'id', type:'hidden'}
	];
	tableConfig.actions=[{'name':'delete'},'|',
	{'name':'edit',max:1},{'name':'developers',max:1,min:1,'label': '<i class="fa fa-code"></i> Developers'},'|',
	{'name':'create'},
	{'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'}]

	if(resource_id !== ''){
		tableConfig.schema[0].enabled = false;
		tableConfig.schema[0].value = resource_id;
		tableConfig.actions=tableConfig.actions.concat(['|',
			{'name':'edit',max:1},'|',
			{'name':'create'},
			{'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'},
		])
	}
	tableConfig.name = "apps";
	tableConfig.data = data;

	grid = new GrapheneDataGrid(tableConfig).on('click',function(e){
		window.location = '/admin/'+route+'/'+e.model.attributes.id
	}).on('model:developers',function(e){
		window.location = '/admin/apps/'+e.model.attributes.id+'/developers'
	})
});