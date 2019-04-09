$('.navbar-header .nav a h4').html('APIs');
// url = "/admin/apiserver/fetch/apis";
url = "/api/proxy/"+slug+"/apis";
api = url;




Berry.validations['phpclassname'] = {
	method: function(value, args) {
		if (!/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/.test(value)) {
			return false;
		}
		return true;
	},
	message: 'API name must be a valid php class name'
}
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', validate:{required:true,phpclassname:true}},
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