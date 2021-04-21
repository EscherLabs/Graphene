$('.navbar-header .nav a h4').html('Users');
url = "/api/proxy/"+slug+"/api_users";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Name', name:'app_name', required: true},
			{label: 'Password', name:'app_secret', required: true},
			{label: 'Environment', name:'environment_id', required: true,type:'select',options:'/api/proxy/'+slug+'/environments',format:{"label":'{{name}}',value:function(item){return item.id;}}},		
			{name:'ipshelptext', type:'output', format:{value: '<div class="alert alert-info">Use the following fields to limit requests to one or more IP Addresses, or part (substring) of an IP Address. (Leave blank to allow from any IP)</div>', parse:false}},
            {label: 'IPs','name':'ips',type:"text",array:{min:0, max:10}},
			{name: 'id', type:'hidden'}
		];
        tableConfig.data = data;
        tableConfig.actions = [
			{'name':'delete',max:1},'|',
            {'name':'edit',max:1},
            {'name':'lookup_app_secret',max:1,min:1, 'label': '<i class="fa fa-key"></i> Lookup App Secret'},'|',
			{'name':'create'}
		]
		tableConfig.name = "api_users";
        grid = new GrapheneDataGrid(tableConfig)
        grid.on('model:lookup_app_secret',function(e){
            url = "/api/proxy/"+slug+"/api_users/"+e.model.attributes.id+"/decrypted_secret";
            $.ajax({url:url,success:function(data){
                modal({content:'<pre style="text-align:center;">'+atob(data.api_secret)+"</pre>"})
            }});
		})
	}
});