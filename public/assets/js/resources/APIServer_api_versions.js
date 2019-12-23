$('.navbar-header .nav a h4').html('API Versions');
// url = "/admin/apiserver/fetch/api_versions";
url = "/api/proxy/"+slug+"/api_versions";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'API', name:'api_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/apis',format:{label:"{{label}}",value:function(item){return item.id;}}},
			{label: 'Summary', name:'summary',required:true},
			{label: 'Description', name:'description', type:"textarea"},			
			{label: 'Stable', name:'stable',type:'checkbox',options:[0,1]},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "api_versions";
		// tableConfig.add = false;
		tableConfig.actions = [
			{'name':'edit'},'|',
			{'name':'delete'}
		]
		grid = new GrapheneDataGrid(tableConfig)
	}
});