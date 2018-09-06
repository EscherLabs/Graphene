$('.navbar-header .nav a h4').html('Modules');
// url = "/admin/apiserver/fetch/modules";
url = "/api/proxy/modules";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Description', name:'description', required: true, type:"textarea"},
			{label: 'Tags', name:'tags',type:'text'},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "modules";

		tableConfig.click = function(model){window.location.href = '/admin/apiserver/modules/'+model.attributes.id};
		bt = new berryTable(tableConfig)
	}
});