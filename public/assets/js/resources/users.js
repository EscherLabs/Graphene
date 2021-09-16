	$('.navbar-header .nav a h4').html('Users');
	// 09/14/2021 START
	// 09/14/2021, AKT - Updated User.js file formatting
	user_form_attributes = [
		{name:'id', label:'Graphene ID', edit:false},	
		{name:'unique_id',label:'Unique ID', edit:[{type:'matches',name:'modify_unique_id',value:true}], parse:'edit'},
		{name:'first_name',label:'First Name'},
		{name:'last_name',label:'Last Name'},
		{name:'email',label:'Email'},
        {type:"switch",label: "Modify Unique ID",name: "modify_unique_id",value: false,options: [{value: false},{value: true}], parse:false},
	];

	$('#table').html(`
	<div style="margin:40px 20px">
		<div class="row">
			<div class="col-sm-4" id="user-search"></div>
			<div class="col-sm-8 user-view" style="display:none;">
                <div class='col-sm-6'>
                    <div class="panel panel-default">
                        <div class="panel-heading"><h3 class="panel-title">User Information</h3></div>
                        <div class="panel-body" id='user-info'></div>
                    </div>
                </div>
				<div class="col-sm-6">
				<div class="panel panel-default">
					<div class="panel-heading"><h3 class="panel-title">Site Permissions</h3></div>
					<div class="panel-body user-site-permissions"></div>
				</div>
					<div class="panel panel-default">
						<div class="panel-heading"><h3 class="panel-title">Group Memberships</h3></div>
						<div class="panel-body user-group-memberships" style='max-height:200px; overflow: scroll;'></div>
					</div>
                    <div class="panel panel-default">
						<div class="panel-heading"><h3 class="panel-title">Group Admins</h3></div>
						<div class="panel-body user-group-admins" style='max-height:200px; overflow: scroll;'></div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading"><h3 class="panel-title">Developer Apps</h3></div>
						<div class="panel-body user-app-developers" style='max-height:200px; overflow: scroll;'></div>
					</div>
					<div class="panel panel-default">
						<div class="panel-heading"><h3 class="panel-title">Developer Workflows</h3></div>
						<div class="panel-body user-workflow-developers" style='max-height:200px; overflow: scroll;'></div>
					</div>
				</div>
			</div>
		</div>
	</div>
			`);
	user_groups_memberships_template= `
		<ul>
			{{#group_members}}
				{{#group}}
					<li>
						<a href="/admin/groups/{{group_id}}/members" target='_blank'>{{group.name}}</a> 
					</li>
				{{/group}}
			{{/group_members}}
		</ul>
		{{^group_members}}
			<div class="alert alert-warning">No Group Memberships</div>
		{{/group_members}}
	`;

	user_app_developers_template = `
	<ul>
		{{#app_developers}}
			{{#app}}
				<li>
					<a href="/admin/apps/{{app_id}}" target='_blank'>{{app.name}}</a>
				</li>
			{{/app}}
		{{/app_developers}}
	</ul>
	{{^app_developers}}
		<div class="alert alert-warning">Not a Developer of any Apps</div>
	{{/app_developers}}
`;

    user_workflow_developers_template = `
    <ul>
        {{#workflow_developers}}
            {{#workflow}}
                <li>
                    <a href="/admin/workflows/{{workflow_id}}" target='_blank'>{{workflow.name}}</a>
                </li>
            {{/workflow}}
        {{/workflow_developers}}
    </ul>
    {{^workflow_developers}}
        <div class="alert alert-warning">Not a Developer of any Workflows</div>
    {{/workflow_developers}}
    `;


	user_group_admins_template = `
		<ul>
			{{#group_admins}}
				{{#group}}
					<li>
						<a href="/admin/groups/{{group_id}}/admins" target='_blank'>{{group.name}}</a> 
						{{#apps_admin}}<i class="fa fa-cubes text-info"></i>{{/apps_admin}}
						{{#content_admin}}<i class="fa fa-file text-info"></i>{{/content_admin}}
					</li>
				{{/group}}
			{{/group_admins}}
		</ul>
		{{^group_admins}}
			<div class="alert alert-warning">No Group Admin Privileges</div>
		{{/group_admins}}`;

	new gform({
		name:'user_search',
		el:'#user-search',
		actions:[],
		label:false,
		fields:[
			{name:'query',label:false,placeholder:'Search', pre:'<i class="fa fa-filter"></i>',help:"Start typing a name to search i.e. john <hr>"},
			{type:'output',name:'results',label:false}
		]
		})
		.on('change:query',function(){
			if(typeof gform.instances.user !== 'undefined'){
				gform.instances.user.destroy();
			}
            $('.user-view').hide();
		})
		.on('change:query',_.debounce(function(e){
			$.ajax({
				url: '/api/users/search/'+this.toJSON().query,
				success: function(data) {
					e.form.find('results').update({value:templates['user_list'].render({users:data})})
				}.bind(e)
			})
		},500))


	$('body').on('click','.list-group-item.user', function(e){
		if(typeof gform.instances.user !== 'undefined'){
			gform.instances.user.destroy();
		}
		if(typeof gform.instances.site_permissions !=='undefined'){
			gform.instances.site_permissions.destroy();
		}
		$.ajax({
			// url: '/api/users/search/'+this.toJSON().query,
			url: '/api/users/'+e.currentTarget.dataset.id+'/info',
			success: function(data) {
				$('.user-view').show();
				//Show User Group Memberships
				$('.user-group-memberships').html(gform.m(user_groups_memberships_template,data));
				// Show the apps where the users is the lead developer
				$('.user-app-developers').html(gform.m(user_app_developers_template,data));
				// Show the workflows where the users is the lead developer
				$('.user-workflow-developers').html(gform.m(user_workflow_developers_template,data));
				// Show the groups where the user is the admin
				$('.user-group-admins').html(gform.m(user_group_admins_template,data));
				
				// Edit User
				new gform({
					actions:[
                        {"type":"button","label":"Save","action":"save","modifiers":"btn btn-primary"},
						{"type":"button","label":"<i class=\"fa fa-user\"></i> Impersonate User","action":"impersonate","modifiers":"btn btn-danger"}
					], 
					el: "#user-info",
					name: 'user',
					data:data,
					strict:false,
					fields:user_form_attributes
				})
				.on('save',function(e){
					$.ajax({
						url: '/api/users/'+e.form.get().id,
						type: 'PUT',
						dataType : 'json',
						contentType: 'application/json',
						data: JSON.stringify(e.form.get()),
						success: function(data) {
							e.form.set(data);
							toastr.success("Updated Site Permissions Successfully");
						},error: function(data){
							toastr.error(data);
                        }
					})
				})
				.on('impersonate',function(form_data){
					$.ajax({
						url: '/api/users/'+form_data.form.get().id+'/impersonate',
						type: 'GET',
						success: function(data) {
							window.location = '/';
					}
					});
				});
				
				new gform({
					actions:[{type:'save'}], 
					el: ".user-site-permissions",
					name: 'site_permissions',
					data:data,
					strict:false,
					"fields":[
						{type:'hidden', name:'user_id'},
						{
							"type": "checkbox",
							"label": "Site Admin",
							"name": "site_admin",
							"multiple": true,
							"options": [
								{
									"label": "Yes",
									"value": false
								},
								{
									"label": "Yes",
									"value": true
								}
							]
						},{
							"type": "checkbox",
							"label": "Site Developer",
							"name": "site_developer",
							"multiple": true,
							"options": [
								{
									"label": "Yes",
									"value": false
								},
								{
									"label": "Yes",
									"value": true
								}
							]
						}
					],
					"el":".user-site-permissions",
					"data":{
						user_id:data.id,
						site_developer:data.site_members[0].site_developer,
						site_admin:data.site_members[0].site_admin
					},
					"actions":[
						{"type":"save","label":"Update Permissions","modifiers":"btn btn-primary"}
					]
				}).on('save',function(e){
					$.ajax({
						url: '/api/users/'+e.form.get().user_id+'/info',
						type: 'PUT',
						dataType : 'json',
						contentType: 'application/json',
						data: JSON.stringify(e.form.get()),
						success: function(data) {
							e.form.set(data);
							toastr.success("Updated Site Permissions Successfully");
						},error: function(data){
							toastr.error(data);
						}
					})
				})
			}.bind(e)

		});
	});