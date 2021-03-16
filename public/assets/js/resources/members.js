$('.navbar-header .nav a h4').html('Members');
$('[href="/admin/groups"]').parent().addClass('active');

getData('/api/groups/'+resource_id+'/members', function(data){
	tableConfig.schema = [
		{label: 'User',type:"user_id", name:'user_id',show:[{type:'matches',value:"create",name:"_method"}]},
	];
	tableConfig.data = data;
	tableConfig.actions=[
		{'name':'delete'},'|','|',
		{'name':'create'},		
		{'name': 'export', 'label': '<i class="fa fa-file"></i> Export'},
	]
	routes.create = routes.delete = '/api/groups/{{resource_id}}/members/{{user_id}}';

	grid = new GrapheneDataGrid(tableConfig).on('export',function(e){
		$.get('/api/groups/'+resource_id+'/members?all',function(data){
			_.csvify(data,[
				{label:"ID",name:"unique_id"},
				{label:"First Name",name:"first_name"},
				{label:"Last Name",name:"last_name"},
				{label:"Email",name:"email"}
			],group.name)
		})
	})
});