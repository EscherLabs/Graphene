$('.navbar-header .nav a h4').html('Environments');
// url = "/admin/apiserver/fetch/environments";
url = "/api/proxy/"+slug+"/environments";
api=url;
$.ajax({
	url: url,		
	success: function(data){
		grid = new GrapheneDataGrid({...tableConfig,
			data: data,
			name:'environments',
			schema: [
				{label: 'Name', name:'name', required: true},
				{label: 'Domain', name:'domain', required: true},
				{label: 'Type', name:'type',type:"select", options:['dev','test','prod'], required: true},
				{name: 'id', type:'hidden'}
			]
		})

	}
});