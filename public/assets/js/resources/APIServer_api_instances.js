$('.navbar-header .nav a h4').html('API Instances');
url = "/api/proxy/"+slug+"/api_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Environment', name:'environment_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/environments',label_key:'name',value_key:'id'},
			// {label: 'Type', name:['dev','test','prod'], required: true},
			{label: 'API', name:'api_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/apis',label_key:'name',value_key:'id'},
			{label: 'API Version', name:'api_version_id', show: false,type:'select',choices:'/api/proxy/'+slug+'/api_versions',label_key:'summary',value_key:'id'},			
			{name:'container',show:false, label: 'Resources',
			"template":'{{#attributes.resources}}{{name}}<br> {{/attributes.resources}}',
			type: 'fieldset', fields:[
				{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
					{name: 'resource',label:false,columns:8, type: 'select', choices: '/api/proxy/'+slug+'/resources'},
					{label:false, name: 'name',columns:0, type:'hidden'}
				]}
			]},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;

		tableConfig.click = function(model){window.location.href = '/admin/apiserver/'+slug+'/api_instance/'+model.attributes.id};
		
		tableConfig.events=[
			{'name': 'config', 'label': '<i class="fa fa-map"></i> Resource Map', callback: function(model){
				$().berry({
					legend:'Resource Map',
					name:'map',
					model:model,
					"flatten": true,
					fields:[
						{name: 'id', type:'hidden'},
						{name:'container', label: false,  type: 'fieldset', fields:[
							{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
								{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
								{name: 'resource',label:false,columns:8, type: 'select', choices: '/api/proxy/'+slug+'/resources'},
								{label:false, name: 'name',columns:0, type:'hidden'}
							]}
						]},		
					]
					}).on('saved',function(){
						this.owner.options.edit(this);
						this.owner.draw();
					}.bind(model))
			}, multiEdit: false},
		]


		tableConfig.name = "api_instances";
		bt = new berryTable(tableConfig)
	}
});
