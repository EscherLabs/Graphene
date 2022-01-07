$('.navbar-header .nav a h4').html('Users');
// 09/14/2021 START
// 09/14/2021, AKT - Updated User.js file formatting
user_form_attributes = [
	{ name: 'id', label: 'Graphene ID', edit: false },
	{ name: 'unique_id', label: 'Unique ID', edit: [{ type: 'matches', name: 'modify_unique_id', value: true }], parse: 'edit' },
	{ name: 'first_name', label: 'First Name' },
	{ name: 'last_name', label: 'Last Name' },
	{ name: 'email', label: 'Email' },
	{ type: "switch", label: "Modify Unique ID", name: "modify_unique_id", value: false, options: [{ value: false }, { value: true }], parse: false },
];

$('#table').html(templates.user_summary_container.render());
new gform({
	name: 'user_search',
	el: '#user-search',
	actions: [],
	label: false,
	fields: [
		{ name: 'query', label: false, placeholder: 'Search', pre: '<i class="fa fa-filter"></i>', help: "Start typing a name to search i.e. john" },
		{ type: 'output', name: 'results', label: false, format: { value: templates['user_list'].template } },
	]
})
	.on('change:query', function () {
		if (typeof gform.instances.user !== 'undefined') {
			gform.instances.user.destroy();
		}
		$('.user-view').hide();
	})
	.on('change:query', _.debounce(function (e) {
		$.ajax({
			url: '/api/users/search/' + this.toJSON().query,
			success: function (data) {
				e.form.find('results').set(data, false)
			}
		})
	}, 500))


$('body').on('click', '.list-group-item.user', function (e) {
	if (typeof gform.instances.user !== 'undefined') {
		gform.instances.user.destroy();
	}
	if (typeof gform.instances.site_permissions !== 'undefined') {
		gform.instances.site_permissions.destroy();
	}
	$.ajax({
		// url: '/api/users/search/'+this.toJSON().query,
		url: '/api/users/' + e.currentTarget.dataset.id + '/info',
		success: function (data) {
			$('.user-view').show();
			$('#user_summary').html(templates.user_summary.render(data));


			// Edit User
			new gform({
				actions: [
					{ "type": "button", "label": "Save", "action": "save", "modifiers": "btn btn-primary" },
					{ "type": "button", "label": "<i class=\"fa fa-user\"></i> Impersonate User", "action": "impersonate", "modifiers": "btn btn-danger pull-right" }
				],
				el: "#user-info",
				name: 'user',
				data: data,
				strict: false,
				fields: user_form_attributes
			})
				.on('save', function (e) {
					$.ajax({
						url: '/api/users/' + e.form.get().id,
						type: 'PUT',
						dataType: 'json',
						contentType: 'application/json',
						data: JSON.stringify(e.form.get()),
						success: function (data) {
							e.form.set(data);
							toastr.success("Updated User Information Successfully");
						}, error: function (data) {
							toastr.error(data);
						}
					})
				})
				.on('impersonate', function (form_data) {
					$.ajax({
						url: '/api/users/' + form_data.form.get().id + '/impersonate',
						type: 'GET',
						success: function (data) {
							window.location = '/';
						}
					});
				});

			new gform({
				el: ".user-site-permissions",
				name: 'site_permissions',
				data: data,
				"fields": [
					{ type: 'hidden', name: 'id' },
					{
						"type": "checkbox",
						"label": "Site Admin",
						"name": "site_admin",
						"options": [
							{
								"label": "No",
								"value": 0
							},
							{
								"label": "Yes",
								"value": 1
							}
						]
					}, {
						"type": "checkbox",
						"label": "Site Developer",
						"name": "site_developer",
						"options": [
							{
								"label": "No",
								"value": 0
							},
							{
								"label": "Yes",
								"value": 1
							}
						]
					}
				],
				"el": ".user-site-permissions",
				"actions": [
					{ "type": "save", "label": "Update Permissions", "modifiers": "btn btn-primary" }
				]
			}).on('save', function (e) {
				$.ajax({
					url: '/api/users/' + e.form.get().id + '/permissions',
					type: 'PUT',
					dataType: 'json',
					contentType: 'application/json',
					data: JSON.stringify(e.form.get()),
					success: function (data) {
						e.form.set(data);
						toastr.success("Updated Site Permissions Successfully");
					}, error: function (data) {
						toastr.error(data);
					}
				})
			})
		}

	});
});