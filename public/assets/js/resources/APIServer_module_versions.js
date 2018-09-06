$('.navbar-header .nav a h4').html('Modules Versions');
// url = "/admin/apiserver/fetch/module_versions";
url = "/api/proxy/module_versions";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Module', name:'module_id',type:'select', required: true,choices:'/api/proxy/modules',label_key:'name',value_key:'id'},
			{label: 'Summary', name:'summary',required:true},
			{label: 'Description', name:'description', type:"textarea"},			
			{label: 'Stable', name:'stable',type:'checkbox'},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "module_versions";
		tableConfig.add = false;
		bt = new berryTable(tableConfig)
	}
});