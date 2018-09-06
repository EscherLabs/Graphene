$('.navbar-header .nav a h4').html('Database Instances');
// url = "/admin/apiserver/fetch/database_instances";
url = "/api/proxy/database_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'DBID', name:'database_id', required: true},
			{label: 'Config', name:'config', required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "database_instances";
		bt = new berryTable(tableConfig)
	}
});