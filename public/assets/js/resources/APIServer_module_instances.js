$('.navbar-header .nav a h4').html('Module Instances');
url = "/admin/apiserver/fetch/module_instances";
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Environment', name:'environment_id', required: true},
			{label: 'Module', name:'module_id',type:'tags'},
			{label: 'Module Version', name:'module_version_id'},
			{label: 'Public', name:'public',type:'checkbox'},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "module_instances";
		bt = new berryTable(tableConfig)
	}
});
