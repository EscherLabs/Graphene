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
                {label: 'Microsoft SQL Server Database', value:'sqlsrv'},
				{label: 'Value', value:'value'},
				{label: 'Secret Value (Encrypted at Rest)', value:'secret'}
			]},
			{label: 'Environment Type', name:'type',type:"select", options:['dev','test','prod'], required: true},
			
			// {label: 'Resource', name:'resource_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/resources',label_key:'name',value_key:'id'},
			{name:'config',type:"fieldset",label:'Config',show:false, template:'{{attributes.config.value}}{{attributes.config.name}}{{attributes.config.tns}}',fields:[
				// {label: 'Name',name: 'name',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'Pass', name:'pass',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'User', name:'user',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'Server', name:'server',type:'hidden',parsable:'show',show:{matches:{name:'type',value:'mysql'}}},
				// {label: 'Value', name:'value',type:'hidden',parsable:'show',show:{multiMatch:[{name:'type',value:'secret'},{name:'type',value:'value'}]}},
			]},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;

		tableConfig.name = "resources";
		tableConfig.actions = [
			{'name':'delete',max:1},'|',
			{'name':'edit',max:1},{'name': 'config',max:1,min:1, 'label': '<i class="fa fa-cogs"></i> Config'},'|',
			{'name':'create'}
		]
		grid = new GrapheneDataGrid(tableConfig)	
		grid.on('model:config',function(e){
			
			var model = e.model;

			var fields = [
				{name: 'name',type: 'hidden'},
				{name: 'id',type: 'hidden'},
				{name: 'resource_id',type: 'hidden'}			];
			switch(model.attributes.resource_type){
				case 'mysql':
				fields.push({name:'config',type:'fieldset',label:false,fields:[
					{label: 'Database Name',name: 'name'},
					{label: 'Username', name:'user'},
					{label: 'Password', name:'pass'},
					{label: 'Server', name:'server'}
				]})
				break;	
				case 'oracle':
				fields.push({name:'config',type:'fieldset',label:false,fields:[
					{label: 'TNS_NAME',name: 'tns'},
					{label: 'Username', name:'user'},
					{label: 'Password', name:'pass'},
				]})
                break;	
                case 'sqlsrv':
                fields.push({name:'config',type:'fieldset',label:false,fields:[
                    {label: 'Database Name',name: 'name'},
                    {label: 'Username', name:'user'},
                    {label: 'Password', name:'pass'},
                    {label: 'Server / Hostname', name:'server'}
                    ]})
                break;									                                    
				case 'secret':
				case 'value':
				fields.push({name:'config',type:'fieldset',label:false,fields:[
					{label: 'Value',name: 'value'}
				]})
				break;
			}
			var config = new gform({
				legend:'Config',
				name:'config',
				data:model.attributes,
				fields:fields
				}).modal().on('save',function(e){
					e.form.trigger('close')
					this.update(e.form.get());
					this.dispatch('edited')
					this.draw();
				}.bind(model)).on('cancel',function(e) {
                    e.form.trigger('close');
                })
			// $().berry({
			// 	legend:'Config',
			// 	name:'config',
			// 	model:model,
			// 	"flatten": false,
			// 	fields:fields
			// 	}).on('saved',function(){
			// 		// this.set(Berries.config.toJSON())			
			// 		this.owner.options.edit(this);
			// 		this.owner.draw();
			// 	}.bind(model))
		


		})
	}
});

// {label: 'API', name:'api_id',type:'select', required: true,choices:'/api/proxy/resources',label_key:'name',value_key:'id'},
