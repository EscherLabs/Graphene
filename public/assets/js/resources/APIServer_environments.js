$('.navbar-header .nav a h4').html('Environments');

// $.ajax({
// 	url: url,		
// 	success: function(data){
  var data =[];
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Domain', name:'domain', required: true},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "environments";
		bt = new berryTable(tableConfig)
	// }
// });