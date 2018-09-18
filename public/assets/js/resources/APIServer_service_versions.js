$('.navbar-header .nav a h4').html('Service Versions');
// url = "/admin/apiserver/fetch/service_versions";
url = "/api/proxy/"+slug+"/service_versions";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Service', name:'service_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/services',label_key:'name',value_key:'id'},
			{label: 'Summary', name:'summary',required:true},
			{label: 'Description', name:'description', type:"textarea"},			
			{label: 'Stable', name:'stable',type:'checkbox'},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "service_versions";
		tableConfig.add = false;
		bt = new berryTable(tableConfig)
	}
});