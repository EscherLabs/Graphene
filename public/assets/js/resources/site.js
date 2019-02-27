$('.navbar-header .nav a h4').html('Site');
$.ajax({
	url: '/api/sites/'+resource_id,
	success: function(data) {			

		$('#table').html(templates['site'].render())
		var temp = $(window).height() - $('.nav-tabs').offset().top;
		
		$('body').append('<style>#table{height:'+temp +'px;overflow:scroll;margin:-16px -21px 0px !important} .ace_editor { height: '+(temp-120)+'px; }#theme .ace_editor { height: '+(temp-220)+'px; }</style>')
		
		$('#main .col-sm-9').berry({fields: [
			{label: 'Name', name:'name', required: true},
			{label: 'Domain', name:'domain', required: true},
			// {label: 'Auth Type', name:'auth', required: true,type:"select",options:[
			// 	'Default','CAS','SAML2'
			// ],type:'select'},
			{name: 'id', type:'hidden'},				
		],attributes:data, actions:false, name:'main'})

		$('#theme .col-sm-9').berry({fields: [
			{label: 'Icon', name:'icon', required: true, inline: true},
			{label: 'CSS', name:'css', type:'ace', inline: true, mode:'ace/mode/css'},
		],attributes:data.theme, actions:false, name:'theme'})

		data.auth_config.auth_type = data.auth;
		var hideshow = function() {
			var attributes = sso_config_form.toJSON();
			if (attributes.auth_type === "Default") {
				$('#sso_config .external_user_lookup_form').hide();
				$('#sso_config .cas_data_map_default_form').hide();
				$('#sso_config .cas_data_map_additional_form').hide();
			} else {
				$('#sso_config .external_user_lookup_form').show();
				$('#sso_config .cas_data_map_default_form').show();
				$('#sso_config .cas_data_map_additional_form').show();
			}
		}
		var sso_config_form = $('#sso_config .sso_config_form').berry({fields: [
			{label: "Auth Type", name:"auth_type", required: true, type:"select",options:[
				{value:"Default",label:"SSO Disabled / Default Auth"},"CAS","SAML2"
			]},
			{label: 'CAS Hostname', name:'cas_hostname', required: true,
			"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},		
			{label: 'CAS Real Hosts', name:'cas_real_hosts', required: true,"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},
			{label: 'CAS URI', name:'cas_uri', required: true, placeholder:'/cas',"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},
			{label: 'CAS Port', name:'cas_port', required: true, type:'select',options:[
				{name:'HTTP (80)', value:'80'},{name:'HTTPS (443)', value:'443'},
			],"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},
			{label: 'CAS Login URL', name:'cas_login_url', required: false,"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},
			{label: 'CAS Logout URL', name:'cas_logout_url', required: false,"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},
			{label: 'CAS Enable SAML', name:'cas_enable_saml', required: true,options:[
				{label:'Enabled',value:true},{label:'Disabled',value:false}
			],type:'select',"show": {
				"matches": {
					"name": "auth_type",
					"value": "CAS"
				}
			}},
			{label: 'SP x509 Public Certificate', name:'sp.x509cert', required: true,type:'textarea',"show": {
				"matches": {
					"name": "auth_type",
					"value": "SAML2"
				}
			}},
			{label: 'SP x509 Private Key', name:'sp.privateKey', required: true,type:'textarea',"show": {
				"matches": {
					"name": "auth_type",
					"value": "SAML2"
				}
			}},
			{label: 'IDP x509 Public Certificate', name:'idp.x509cert', required: true,type:'textarea',"show": {
				"matches": {
					"name": "auth_type",
					"value": "SAML2"
				}
			}},
			{label: 'IDP entityId', name:'idp.entityId', required: true,type:'text',"show": {
				"matches": {
					"name": "auth_type",
					"value": "SAML2"
				}
			}},
			{label: 'IDP singleSignOnService Redirect Endpoint', name:'idp.singleSignOnService.url', required: true,type:'text',"show": {
				"matches": {
					"name": "auth_type",
					"value": "SAML2"
				}
			}},
			{label: 'IDP singleLogoutService Redirect Endpoint', name:'idp.singleLogoutService.url', required: true,type:'text',"show": {
				"matches": {
					"name": "auth_type",
					"value": "SAML2"
				}
			}},
		],attributes:data.auth_config, actions:false, name:'sso_config'}).on('change',hideshow)
		debugger;
		hideshow();

		$('#sso_config .external_user_lookup_form').berry({fields: [
			{label: 'External User Lookup Enabled',name:"enabled",options:[
				{label:'Enabled',value:true},{label:'Disabled',value:false}
			],type:'select'},
			{label: 'External User Lookup URL',name:"url","show": {
				"matches": {
					"name": "enabled",
					"value": "true"
				}
			}},
			{label: 'External User Lookup Verb',name:"verb",type:"select",options:[
				'POST','GET'
			],"show": {
				"matches": {
					"name": "enabled",
					"value": "true"
				}
			}},
		],attributes:data.auth_config.external_user_lookup, actions:false, name:'external_user_lookup'})

		if (typeof data.auth_config.cas_data_map === 'undefined') {data.auth_config.cas_data_map = {
			default:{},additional:{}
		}}
		$('#sso_config .cas_data_map_default_form').berry({fields: [
			{label: 'Email',name:"email"},
			{label: 'First Name',name:"first_name"},
			{label: 'Last Name',name:"last_name"},
			{label: 'Unique ID',name:"unique_id"},
		],attributes:data.auth_config.cas_data_map.default, actions:false, name:'cas_data_map_default'})

		var arr = [];
		for (var key in data.auth_config.cas_data_map.additional) {
			arr.push({name:key, value:data.auth_config.cas_data_map.additional[key]});
		}
		$('#sso_config .cas_data_map_additional_form').berry({fields: [
			{label: 'CAS Data Map', name:'cas_data_map', fields:{
				additional:{
					label: false, name:'additional',
					multiple:{
						"duplicate": true,
						"min": 1
					},fields: [
						{columns:6, label: 'Name',name:"name"},
						{columns:6, label: 'Value',name:"value"},
					],
				}
			}},
		],attributes:{additional:arr}, actions:false, name:'cas_data_map_additional'})

		$('#proxyserver_config .col-sm-9').berry({fields: [
			{label: 'ProxyServer Config', name:'proxyserver_config', fields:{
				config:{
					label: false, name:'config',
					multiple:{
						"duplicate": true,
						"min": 1
					},fields: [
						{label: 'Name',name:"name"},
						{label: 'Slug',name:"slug"},
						{label: 'Server',name:"server"},
						{label: 'Password',name:"password"},
						{label: 'Username',name:"username"},
					],
				}
			}},
		],attributes:{config:data.proxyserver_config}, actions:false, name:'proxyserver_config'})

		data.templates.partials = _.map(data.templates.partials,function(item, key){
			return {name:key,content:item||'',disabled:false}
		})
		if(typeof _.findWhere(data.templates.partials,{name:'main'}) == 'undefined'){
			data.templates.partials.unshift({name:'main',content:'', disabled: true});
		}
		// data.partials.unshift({name:'main',content:data.templates.main, disabled: true})

	templatePage = new paged('#templates',{items:data.templates.partials||[]});





		$('#save').on('click',function(){
			var item = Berries.main.toJSON();
			item.theme = Berries.theme.toJSON();
			item.auth_config = Berries.sso_config.toJSON();
			item.auth = item.auth_config.auth_type;
			item.auth_config.cas_data_map = {};
			item.auth_config.cas_data_map.default = Berries.cas_data_map_default.toJSON();
			item.auth_config.cas_data_map.additional = _.zipObject(_.map(Berries.cas_data_map_additional.toJSON().additional, 'name'), _.map(Berries.cas_data_map_additional.toJSON().additional, 'value'))
			item.proxyserver_config = Berries.proxyserver_config.toJSON().config;
			item.auth_config.external_user_lookup = Berries.external_user_lookup.toJSON();
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

			$.ajax({url: '/api/sites/'+item.id, type: 'PUT', data: item, success:function(){
					toastr.success('', 'Successfully updated Site Configuration')
				}.bind(this),
				error:function(e) {
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
			$().berry({name: 'update', inline: true, legend: '<i class="fa fa-cloud"></i> Import Site Theme',fields: [	{label: 'Theme', type: 'textarea'}]}).on('save', function(){
				_.each(templatePage.toJSON(),function(item){templatePage.remove(item.name)})
				var theme = JSON.parse(this.toJSON().theme);
				Berries.theme.fields.css.set(theme.css);
				_.each(theme.partials, function(item){templatePage.add(item.name,item.content)})
				Berries.update.trigger('close');
		});
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