$('.navbar-header .nav a h4').html('Resources');
// url = "/admin/apiserver/fetch/resource_instances";
url = "/api/proxy/"+slug+"/resources";
api = url;
$.ajax({
	url: url,
	success: function(data){
		if(typeof data !== 'object'){ data = []; }
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Type', name:'resource_type', required: true, type:'select',
			options:[
				{label: 'MySQL Database',value: 'mysql'},
				{label: 'Oracle Database', value:'oracle'},
				{label: 'Value', value:'value'},
				{label: 'Secret Value (Encrypted at Rest)', value:'secret'}
			]},
			{label: 'Environment Type', name:'type', options:['dev','test','prod'], required: true},
			
			// {label: 'Resource', name:'resource_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/resources',label_key:'name',value_key:'id'},
			{name:'config',label:'Config',show:false, template:'{{attributes.config.value}}{{attributes.config.name}}{{attributes.config.tns}}',fields:[
				// {label: 'Name',name: 'name',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'Pass', name:'pass',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'User', name:'user',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'Server', name:'server',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'Value', name:'value',type:'hidden',parsable:'show',show:{multiMatch:[{name:'type',value:'secret'},{name:'type',value:'value'}]}},
			]},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;

		tableConfig.events=[
			{'name': 'config', 'label': '<i class="fa fa-cogs"></i> Config', callback: function(model){

				var fields = [
					{name: 'name',type: 'hidden'},
					{name: 'id',type: 'hidden'},
					{name: 'resource_id',type: 'hidden'},					
				];
				switch(model.attributes.resource_type){
					case 'mysql':
					fields.push({name:'config',label:false,fields:[
						{label: 'Database Name',name: 'name'},
						{label: 'Username', name:'user'},
						{label: 'Password', name:'pass'},
						{label: 'Server', name:'server'}
					]})
					break;	
					case 'oracle':
					fields.push({name:'config',label:false,fields:[
						{label: 'TNS_NAME',name: 'tns'},
						{label: 'Username', name:'user'},
						{label: 'Password', name:'pass'},
					]})
					break;									
					case 'secret':
					case 'value':
					fields.push({name:'config',label:false,fields:[
						{label: 'Value',name: 'value'}
					]})
					break;
				}
				$().berry({
					legend:'Config',
					name:'config',
					model:model,
					"flatten": false,
					fields:fields
					}).on('saved',function(){
						// this.set(Berries.config.toJSON())			
						this.owner.options.edit(this);
						this.owner.draw();
					}.bind(model))
			}, multiEdit: false},
	
		]


		tableConfig.name = "resources";
		bt = new berryTable(tableConfig)
	}
});

// {label: 'API', name:'api_id',type:'select', required: true,choices:'/api/proxy/resources',label_key:'name',value_key:'id'},
