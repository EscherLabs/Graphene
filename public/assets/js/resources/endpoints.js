$('.navbar-header .nav a h4').html('Endpoints');
if(resource_id !== ''){
	$('[href="/admin/groups"]').parent().addClass('active');
}

$g.getData([url, '/api/groups'], function(endpoints, groups){
	new GrapheneDataGrid({...tableConfig,
		schema: [
			fieldLibrary.group,
			{label: 'Name', name:'name', required: true},
			{label: 'Auth Type', name:'type', type: 'select', options:[
				{label:'HTTP No Auth', value:'http_no_auth'}, 
				{label:'HTTP Basic Auth', value:'http_basic_auth'}, 
				// {label:'Google Sheets', value:'google_sheets'},
			], required: true},
			{label: 'Configuration',type:"fieldset", name:'config', showColumn:false,template:'<dl class="dl-horizontal"><dt>URL:</dt> <dd>{{attributes.config.url}}</dd><dt>User Name:</dt> <dd>{{attributes.config.username}}</dd><dt>Content Type: </dt><dd>{{attributes.config.content_type}}</dd></dl>', fields:[
				{label:'URL', required: false, validate: [{type:'is_https'}], show:[{type:'matches',name:'type',value:'http_basic_auth'}]},
				{label:'URL', required: false, show:[{type:'matches',name:'type',value:'http_no_auth'}]},
				// {label:'Sheet ID', name:'sheet_id', type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
				// {label:'Google Redirect URL', name:'google_redirect', enabled:false, type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
				{label:'Username', required: true,show:[{type:'matches',name:'type',value:'http_basic_auth'}]},
				{label:'Password', 'name':'secret', required: true, show:[{type:'matches',name:'type',value:'http_basic_auth'}]},
				{label:'Content Type', 'name':'content_type', required: true, show:[{type:'matches',name:'type',value:'http_basic_auth'}],type:"select",options:[
					{label:"Form Data (application/x-www-form-urlencoded)",value:'application/x-www-form-urlencoded'},
					{label:"JSON (application/json)",value:'application/json'},
					{label:"XML (application/xml)",value:'application/xml'},
					{label:"Plain Text (text/plain)",value:'text/plain'},
				],'help':'Please specify the Content Type / Data Encoding your endpoint is expecting for POST / PUT / DELETE actions.  '+
				'<div><i>Note this only applies to data which is <b>sent to</b> the endpoint, not data which is received from the endpoint.</i></div>'},  
		   ]},
			{name: 'id', type:'hidden'}
		],
		data: endpoints,
		name: 'endpoints'
	})
});