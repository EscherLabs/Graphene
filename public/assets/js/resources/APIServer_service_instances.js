$('.navbar-header .nav a h4').html('Service Instances');
// url = "/admin/apiserver/fetch/service_instances";
url = "/api/proxy/"+slug+"/service_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Environment', name:'environment_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/environments',label_key:'name',value_key:'id'},
			
			{label: 'Service', name:'service_id',type:'select', required: true,choices:'/api/proxy/'+slug+'/services',label_key:'name',value_key:'id'},
			{label: 'Service Version', name:'service_version_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/service_versions',label_key:'summary',value_key:'id'},			
			{label: 'Public', name:'public',type:'checkbox'},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "service_instances";
		bt = new berryTable(tableConfig)
	}
});
