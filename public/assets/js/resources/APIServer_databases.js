$('.navbar-header .nav a h4').html('Databases');
// url = "/admin/apiserver/fetch/databases";
url = "/api/proxy/databases";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Type', name:'type', required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "databases";

		bt = new berryTable(tableConfig)
	}
});