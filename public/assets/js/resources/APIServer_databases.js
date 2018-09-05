$('.navbar-header .nav a h4').html('Databases');
url = "/admin/apiserver/fetch/databases";
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Type', name:'type', required: true},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "databases";
		bt = new berryTable(tableConfig)
	}
});