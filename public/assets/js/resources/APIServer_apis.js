$('.navbar-header .nav a h4').html('APIs');
url = "/api/proxy/"+slug+"/apis";
api = url;

/* ATS - check validation */

gform.validations['phpclassname'] = function(value){
	if (!/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/.test(value)) {
		return 'API name must be a valid php class name';
	}else{return false}
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

		grid = new GrapheneDataGrid(tableConfig).on('click',function(e){
			window.location.href = '/admin/apiserver/'+slug+'/apis/'+e.model.attributes.id
		})
	}
});