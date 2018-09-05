$('.navbar-header .nav a h4').html('Modules');
url = "/admin/apiserver/fetch/modules";
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Description', name:'description', required: true, type:"textarea"},
			{label: 'Tags', name:'tags',type:'tags'},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "modules";
		bt = new berryTable(tableConfig)
	}
});