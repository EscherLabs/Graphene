// initializers['endpoints'] = function() {

		$('.navbar-header .nav a h4').html('Endpoints');
		
		$.ajax({
		url: url,
			success: function(data){
				tableConfig.schema = [
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'Name', name:'name', required: true},
					{label: 'Auth Type', name:'type', type: 'select', choices:[
						{label:'HTTP No Auth', value:'http_no_auth'}, 
						{label:'HTTP Basic Auth', value:'http_basic_auth'}, 
						// {label:'Google Sheets', value:'google_sheets'},
					], required: true},
					{label: 'Configuration', name:'config', showColumn:false, fields:[
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
						// {label:'Sheet ID', name:'sheet_id', type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						// {label:'Google Redirect URL', name:'google_redirect', enabled:false, type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
						{label:'Password', 'name':'secret', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
					]},
					{name: 'id', type:'hidden'}
				];
				if(resource_id !== ''){
					tableConfig.schema[0].enabled = false;
					tableConfig.schema[0].value = resource_id;
				}
				tableConfig.data = data;
				tableConfig.name = "endpoints";

				bt = new berryTable(tableConfig)
			}
		});
// }