$('.navbar-header .nav a h4').html('Manage API Accounts');

$g.getData(url, app_users => {
	new GrapheneDataGrid({...tableConfig, 
		schema: [
			{label: 'App Name', name:'app_name', help:'HTTP Basic Auth <i>Username</i>', required: true},
			{label: 'App Secret', name:'app_secret', help:'HTTP Basic Auth <i>Password</i>', required: true},
			{name: 'id', type:'hidden'}
		],
		data: app_users,
		name: "app_users"
	})
});