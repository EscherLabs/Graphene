$('.navbar-header .nav a h4').html('Database Instances');
url = "/admin/apiserver/fetch/database_instances";
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'DBID', name:'database_id', required: true},
			{label: 'Config', name:'config', required: true},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "database_instances";
		bt = new berryTable(tableConfig)
	}
});