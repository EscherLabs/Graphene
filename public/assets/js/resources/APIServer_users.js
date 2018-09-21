$('.navbar-header .nav a h4').html('Users');
url = "/api/proxy/"+slug+"/api_users";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'app_name', required: true},
			{label: 'Password', name:'app_secret', required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "api_users";
		bt = new berryTable(tableConfig)
	}
});