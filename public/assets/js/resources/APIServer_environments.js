$('.navbar-header .nav a h4').html('Environments');
// url = "/admin/apiserver/fetch/environments";
url = "/api/proxy/"+slug+"/environments";
api=url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Domain', name:'domain', required: true},
			{label: 'Type', name:'type',type:"select", options:['dev','test','prod'], required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "environments";
		tableConfig.actions = [
			{'name':'delete'},'|',
			{'name':'edit'},'|',
			{'name':'create'}
		]
		bt = new GrapheneDataGrid(tableConfig)

	}
});