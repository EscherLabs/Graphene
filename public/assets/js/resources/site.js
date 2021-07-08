$('.navbar-header .nav a h4').html('Site');
$.ajax({
	url: '/api/sites/'+resource_id,
	success: function(data) {			
		$('#table').html(templates['site'].render())
		var temp = $(window).height() - $('.nav-tabs').offset().top;
		
		$('body').append('<style>#table{height:'+temp +'px;overflow:scroll;margin:-16px -21px 0px !important} .ace_editor { height: '+(temp-120)+'px; }#theme .ace_editor { height: '+(temp-220)+'px; }</style>')
		
		new gform({
			"default": {"horizontal": true},"horizontal": true,
			fields: [
				{label: 'Name', name:'name', required: true},
				{label: 'Domain', name:'domain', required: true},
				{label: 'Auth Type', name:'auth', required: true,type:"select",options:[
					'Default','CAS'
				],type:'select'},
				{name: 'id', type:'hidden'},				
			],
			data: data, 
			actions:[], 
			name:'main'
		},'#main_form')

		new gform({
			fields: [
				{name: 'theme', type: 'fieldset',label: false, fields: [
					{label: 'Icon', name:'icon', required: true},
					{label: 'CSS', name:'css', type:'ace', mode:'ace/mode/css'}
					]
				}
			], 
			data: data, 
			actions: [], 
			name: 'theme'
		},'#theme_form')

		new gform({
			"default": {"horizontal": true},"horizontal": true,
			fields: [
				{label: 'CAS Hostname', name:'cas_hostname', placeholder:'cas.example.com', required: true, },		
				{label: 'CAS Real Hosts', name:'cas_real_hosts', placeholder:'cas.example.com', required: true},
				{label: 'CAS URI', name:'cas_uri', required: true, placeholder:'/cas'},
				{label: 'CAS Port', name:'cas_port', required: true, type:'select',options:[
					{label:'HTTP (80)', value:'80'},{label:'HTTPS (443)', value:'443'},
				]},
				{label: 'CAS Login URL', name:'cas_login_url', placeholder:'https://cas.example.com/cas/login', required: false},
				{label: 'CAS Logout URL', name:'cas_logout_url', placeholder:'https://cas.example.com/cas/logout', required: false},
				{label: 'CAS Enable SAML', name:'cas_enable_saml', required: true, options:[
					{label:'Enabled',value:"true"},{label:'Disabled',value:"false"}
				],type:'select'},
			],
			data: data.auth_config, 
			actions: [], 
			name:'cas_config'
		}, '#cas_config_form')

		new gform({
			"default": {"horizontal": true},"horizontal": true,
			fields: [
				{name: 'external_user_lookup', type: 'fieldset',label: false, fields: [

					{label: 'External User Lookup Enabled',name:"enabled",options:[
						{label:'Enabled',value:"true"},{label:'Disabled',value:"false"}
					],type:'select'},
					{label: 'External User Lookup URL',name:"url",placeholder:"https://example.com/userlookup","show": [
						{
							type: "matches",
							"name": "enabled",
							"value": "true"
						}
					]},
					{label: 'External User Lookup Verb',name:"verb",type:"select","show": [
						{
							type: "matches",
							"name": "enabled",
							"value": "true"
						}
					],options:[
						'POST','GET'
					]}
				]}
			],
			data: data.auth_config, 
			actions:[], 
			name:'external_user_lookup'
		}, '#external_user_lookup_form')

		if (typeof data.auth_config.cas_data_map === 'undefined') {data.auth_config.cas_data_map = {
			default:{},additional:{}
		}}
		new gform({
			"default": {"horizontal": true},"horizontal": true,
			fields: [
				{name: 'default', type: 'fieldset',label: false, fields: [
					{label: 'Email',name:"email", placeholder:'{{email}}'},
					{label: 'First Name',name:"first_name", placeholder:'{{first_name}}'},
					{label: 'Last Name',name:"last_name", placeholder:'{{last_name}}'},
					{label: 'Unique ID',name:"unique_id", placeholder:'{{unique_id}}'}
					]
				}
			],
			data:data.auth_config.cas_data_map,
			actions:[], 
			name:'cas_data_map_default'
		}, '#cas_data_map_default_form')

		var arr = [];
		for (var key in data.auth_config.cas_data_map.additional) {
			arr.push({name:key, value:data.auth_config.cas_data_map.additional[key]});
		}

		new gform({
			fields: [
				{
					label: false, 
					name:'cas_data_map',
					type: 'fieldset',
					array:{
						"min": 1
					},
					fields: [
						{columns:6, label: 'Name',name:"name"},
						{columns:6, label: 'Value',name:"value"},
					]
				}
			],
			data:{cas_data_map:arr}, 
			actions: [], 
			name:'cas_data_map_additional'
		}, '#cas_data_map_additional_form')


		new gform({
			"default": {"horizontal": true},"horizontal": true,
			fields: [
				{
					label: false, 
					name:'proxyserver_config',
					type:'fieldset',
					array: {},
					fields: [
						{label: 'Name',name:"name"},
						{label: 'Slug',name:"slug"},
						{label: 'Server',name:"server"},
						{label: 'Password',name:"password"},
						{label: 'Username',name:"username"},
					]
				}
			],
			data:data, 
			actions:[], 
			name:'proxyserver_config'
		}, '#proxyserver_config_form')

		data.templates.partials = _.map(data.templates.partials,function(item, key){
			return {name:key,content:item||'',disabled:false}
		})
		if(typeof _.findWhere(data.templates.partials,{name:'main'}) == 'undefined'){
			data.templates.partials.unshift({name:'main',content:'', disabled: true});
		}
		// data.partials.unshift({name:'main',content:data.templates.main, disabled: true})

	// templatePage = new paged('#templates',{items:data.templates.partials||[]});
	templatePage = new fileManager('#templates',{name:'templates', items:data.templates.partials||[], label:'Template'});





		$('#save').on('click',function(){
			var item = {
				...$g.forms.main.get(),
				...$g.forms.proxyserver_config.get(),
				...$g.forms.theme.get(),
				auth_config:{
					...$g.forms.cas_config.get(),
					...$g.forms.external_user_lookup.get(),
					cas_data_map: {
						...$g.forms.cas_data_map_default.get(),
						additional: $g.forms.cas_data_map_additional.get().cas_data_map.reduce((r,e) => { 
							r[e.name] = e.value;
							return r;
						}, {})
					}
				}
			};
			var partials = templatePage.toJSON();
				// var successCompile = false;
				// try{
				//   _.each(partials, function(partial){
				//     Ractive.parse(partial.content);
				//   })
				//   // if(!this.resourcesForm.validate()){
				//   //   toastr.error(e.message, e.name);
				//   //   return false;
				//   // }
				// }catch(e) {
				//     toastr.error(e.message, e.name);
				//     return false;
				// }
			var partials = _.keyBy(partials, 'name')
			for(var i in partials){
				partials[i] = partials[i].content;
			}
			item.templates = {partials:partials}
			if(typeof item.templates.partials.main !== 'undefined' && !item.templates.partials.main.length){
				delete item.templates.partials.main;
			}

			if(_.size(item.templates.partials) == 0){
				item.templates = 'false';
			}
			// item.templates.partials = partials;

			$.ajax({url: '/api/sites/'+item.id, type: 'PUT', data: item, 
				success: () =>{
					toastr.success('', 'Successfully updated Site Configuration')
				},
				error: e => {
					toastr.error(e.statusText, 'ERROR');
				}
			});
		})

		$(document).keydown(function(e) {
			if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
					e.preventDefault();
					$('#save').click()
			}
			return true;
		});

		$('#export').on('click',function() {
			downloadObjectAsJson({css:data.theme.css,partials:data.templates.partials}, 'site');
		})


		$('#import').on('click', function() {
			new gform({
				name: 'update', 
				legend: '<i class="fa fa-cloud"></i> Import Site Theme',
				fields: [	
					{label: 'Theme', type: 'textarea'}
				]
		}).on('save', e => {
				_.each(templatePage.toJSON(), template =>{templatePage.remove(template.name)})
				var theme = JSON.parse(e.form.get('theme'));
				$g.forms.theme.set({theme:theme})
				_.each(theme.partials, template => {templatePage.add(template.name,template.content)})
				e.form.trigger('close');
			}).on('cancel',function(e){e.form.dispatch('close')}).modal();
		})

		function downloadObjectAsJson(exportObj, exportName){
			var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
			var downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href",     dataStr);
			downloadAnchorNode.setAttribute("download", exportName + ".json");
			document.body.appendChild(downloadAnchorNode); // required for firefox
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	}
});