$('.navbar-header .nav a h4').html('Modules Versions');
url = "/admin/apiserver/fetch/module_versions";
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Module', name:'module_id',type:'tags'},
			{label: 'Summary', name:'summary',required:true},
			{label: 'Description', name:'description', type:"textarea"},			
			{label: 'Stable', name:'stable',type:'checkbox'},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "module_versions";
		bt = new berryTable(tableConfig)
	}
});