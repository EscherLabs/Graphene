$('.navbar-header .nav a h4').html('Service Instances');
// url = "/admin/apiserver/fetch/service_instances";
url = "/api/proxy/"+slug+"/service_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Environment', name:'environment_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/environments',label_key:'name',value_key:'id'},
			
			{label: 'Service', name:'service_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/services',label_key:'name',value_key:'id'},
			{label: 'Service Version', name:'service_version_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/service_versions',label_key:'summary',value_key:'id'},			
			{label: 'Public', name:'public',type:'checkbox'},
			{name:'container',show:false, label: false,  type: 'fieldset', fields:[
				{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
					{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
					{name: 'resource',label:false,columns:8, type: 'select', choices: '/api/proxy/'+slug+'/resources'},
					{label:false, name: 'name',columns:0, type:'hidden'}
				]}
			]},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;


		tableConfig.events=[
			{'name': 'config', 'label': '<i class="fa fa-map"></i> Resource Map', callback: function(model){
				$().berry({
					legend:'Map',
					name:'map',
					model:model,
					"flatten": false,
					fields:[
						{name:'name', type:'hidden'},
						{name:'slug', type:'hidden'},
						{name:'environment_id', type:'hidden'},
						{name:'service_id', type:'hidden'},
						{name:'service_version_id', type:'hidden'},
						{name: 'id', type:'hidden'},
						{name:'container', label: false,  type: 'fieldset', fields:[
							{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
								{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
								{name: 'resource',label:false,columns:8, type: 'select', choices: '/api/proxy/'+slug+'/resources'},
								{label:false, name: 'name',columns:0, type:'hidden'}
							]}
						]},

						// {
						// 	"name": "resources",
						// 	"label": false,
						// 	"fields": {
						// 	"resource": {
						// 		"label": false,
						// 		"multiple": {
						// 		"duplicate": false
						// 		},
						// 		fields:[
						// 		// {'name':'name','label':'Name',"inline":true,columns:8},
						// 		// {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
						// 		]
						// 	}
							
						// 	}
						// }				
					]
					}).on('saved',function(){
						// this.set(Berries.map.toJSON())			
						this.owner.options.edit(this);
						this.owner.draw();
					}.bind(model))
			}, multiEdit: false},
			{'name': 'config_users', 'label': '<i class="fa fa-map"></i> User Map', callback: function(model){
				$().berry({
					legend:'Map',
					name:'map',
					model:model,
					"flatten": false,
					fields:[
						{name:'name', type:'hidden'},
						{name:'slug', type:'hidden'},
						{name:'environment_id', type:'hidden'},
						{name:'service_id', type:'hidden'},
						{name:'service_version_id', type:'hidden'},
						{name: 'id', type:'hidden'},
						{name:'container', label: false,  type: 'fieldset', fields:[
							{"multiple": {"duplicate": false},label: '', name: 'route_user_map', type: 'fieldset', fields:[
								{label:false, name: 'route',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
								{name: 'api_user',label:false,columns:8, type: 'select', choices: '/api/proxy/'+slug+'/api_users',label_key:'app_name'},
								{label:false, name: 'route',columns:0, type:'hidden'}
							]}
						]},

						// {
						// 	"name": "resources",
						// 	"label": false,
						// 	"fields": {
						// 	"resource": {
						// 		"label": false,
						// 		"multiple": {
						// 		"duplicate": false
						// 		},
						// 		fields:[
						// 		// {'name':'name','label':'Name',"inline":true,columns:8},
						// 		// {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
						// 		]
						// 	}
							
						// 	}
						// }				
					]
					}).on('saved',function(){
						// this.set(Berries.map.toJSON())	
						debugger;		
						this.owner.options.edit(this);
						this.owner.draw();
					}.bind(model))
			}, multiEdit: false},
	
	
		]


		tableConfig.name = "service_instances";
		bt = new berryTable(tableConfig)
	}
});
