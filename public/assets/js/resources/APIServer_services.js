$('.navbar-header .nav a h4').html('Services');
// url = "/admin/apiserver/fetch/services";
url = "/api/proxy/"+slug+"/services";
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
		tableConfig.name = "services";

		tableConfig.click = function(model){window.location.href = '/admin/apiserver/'+slug+'/services/'+model.attributes.id};
		bt = new berryTable(tableConfig)
	}
});