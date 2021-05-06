$('.navbar-header .nav a h4').html('Manage API Accounts');

getData(url, app_users => {

	routes.create = routes.delete = routes.update = '/api/groups/{{resource_id}}/admins/{{user_id}}';
	verbs.update = "POST"

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