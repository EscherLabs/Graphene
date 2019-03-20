$('.navbar-header .nav a h4').html('APIs');
// url = "/admin/apiserver/fetch/apis";
url = "/api/proxy/"+slug+"/apis";
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
		tableConfig.name = "apis";

		tableConfig.click = function(model){window.location.href = '/admin/apiserver/'+slug+'/apis/'+model.attributes.id};
		bt = new berryTable(tableConfig)
	}
});