$('.navbar-header .nav a h4').html('Module Instances');
// url = "/admin/apiserver/fetch/module_instances";
url = "/api/proxy/module_instances";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Environment', name:'environment_id', required: true,type:'select',choices:'/api/proxy/environments',label_key:'name',value_key:'id'},
			
			{label: 'Module', name:'module_id',type:'select', required: true,choices:'/api/proxy/modules',label_key:'name',value_key:'id'},
			{label: 'Module Version', name:'module_version_id', required: true,type:'select',choices:'/api/proxy/module_versions',label_key:'summary',value_key:'id'},			
			{label: 'Public', name:'public',type:'checkbox'},
			{name: 'id', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.name = "module_instances";
		bt = new berryTable(tableConfig)
	}
});
