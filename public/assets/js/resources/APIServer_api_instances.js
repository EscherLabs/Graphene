$('.navbar-header .nav a h4').html('API Instances');
url = "/api/proxy/"+slug+"/api_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true,type:"text",template:"{{attributes.name}} - ({{attributes.environment.type}})"},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Environment', name:'environment_id', required: true,type:'select',options:'/api/proxy/'+slug+'/environments',format:{label:"{{name}}",value:function(item){return item.id;}}},	
			{label: 'API', name:'api_id',type:'select', required: true,options:'/api/proxy/'+slug+'/apis',format:{label:"{{name}}",value:function(item){return item.id;}}},	
			{label: 'API Version', name:'api_version_id', show: false,type:'select',options:'/api/proxy/'+slug+'/api_versions',format:{label:"{{summary}}",value:function(item){return item.id;}}},			
			{label: 'Error Level', name:"errors", options:[{label:"None",value:"none"},{label:"All",value:"all"}],type:"select"},
			{name:'container',show:false, label: 'Resources',
			"template":'{{#attributes.resources}}{{name}}<br> {{/attributes.resources}}',
			type: 'fieldset', fields:[
				{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
					{label:false, name: 'name',columns:0, type:'hidden'}
				]}
			]},
			{name: 'id', type:'hidden'}
		];
        tableConfig.actions = [
			{'name':'delete',max:1},'|',
			{'name':'edit',max:1},{'name':'documentation',max:1,min:1, 'label': '<i class="fa fa-cogs"></i> View Documentation'},'|',
			{'name':'create'}
		]
		tableConfig.data = data;
		tableConfig.name = "api_instances";
		grid = new GrapheneDataGrid(tableConfig).on('click',function(e){window.location.href = '/admin/apiserver/'+slug+'/api_instance/'+e.model.attributes.id})
        grid.on('model:documentation',function(e){
            window.open('/admin/apiserver/'+slug+'/api_docs/'+e.model.attributes.id)
        });
	}
});
