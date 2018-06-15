$('.navbar-header .nav a h4').html('Tags');

$.ajax({
	url: url,
	success: function(data){
		tableConfig.schema = [
			{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
			{label: 'Name', name:'name', required: true},
			{label: 'Value', name:'value', required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "tags";
		bt = new berryTable(tableConfig)
	}
});