$('.navbar-header .nav a h4').html('Database Instances');
// url = "/admin/apiserver/fetch/database_instances";
url = "/api/proxy/database_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Database', name:'database_id',type:'select', required: true,choices:'/api/proxy/databases',label_key:'name',value_key:'id'},
			{name:'config',label:false, template:'{{attributes.config.name}}',fields:[
				{label: 'Name',name: 'name',type:'hidden'},
				{label: 'Pass', name:'pass',type:'hidden'},
				{label: 'User', name:'user',type:'hidden'},
				{label: 'Server', name:'server',type:'hidden'}
			]},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;

		tableConfig.events=[
			{'name': 'config', 'label': '<i class="fa fa-cogs"></i> Config', callback: function(model){
				$().berry({
					legend:'Config',
					name:'config',
					model:model,
					"flatten": false,
					
					fields:[
						{name: 'name',type: 'hidden'},
						{name: 'id',type: 'hidden'},
						{name: 'database_id',type: 'hidden'},
						
						{name:'config',label:false,fields:[
							{label: 'Name',name: 'name'},
							{label: 'Pass', name:'pass'},
							{label: 'User', name:'user'},
							{label: 'Server', name:'server'}
						]}
					]
					}).on('saved',function(){
						// this.set(Berries.config.toJSON())			
						this.owner.options.edit(this);
						this.owner.draw();
					}.bind(model))
			}, multiEdit: false},
	
		]


		tableConfig.name = "database_instances";
		bt = new berryTable(tableConfig)
	}
});

// {label: 'Module', name:'module_id',type:'select', required: true,choices:'/api/proxy/databases',label_key:'name',value_key:'id'},
