
$('.navbar-header .nav a h4').html('Manage API Accounts');

$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'App Name', name:'app_name', help:'HTTP Basic Auth <i>Username</i>', required: true},
			{label: 'App Secret', name:'app_secret', help:'HTTP Basic Auth <i>Password</i>', required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "app_users";
		bt = new berryTable(tableConfig)
	}
});
