var siteTemplates = {};

var SiteTemplate = function (berryData) {
	this.name = berryData.name.substring(berryData.id.length);
	this.content = berryData.value;
	this.differContainerId = berryData.name+'-differ-container';
	this.differ;
	this.differMade = false;

	return {
		differMade: function () {
			return this.differMade;
		}.bind(this),

		getContent: function () {
			return this.content;
		}.bind(this),

		getDiffer: function () {
			return this.differ;
		}.bind(this),

		makeDiffer: function () {
			if (this.differMade) {
				return;
			}

			this.differ = new AceDiff({
				element: '#'+this.differContainerId,
				left: {
					content: '',
					editable: false,
					mode: 'ace/mode/handlebars',
					theme: 'ace/theme/chrome'
				},
				right: {
					copyLinkEnabled: false,
					content: this.content,
					mode: 'ace/mode/handlebars',
					theme: 'ace/theme/chrome'
				}
			});

			var rightEditor = this.differ.getEditors().right;
			var leftEditor = this.differ.getEditors().left;

			rightEditor.on('change', function () {
				this.content = rightEditor.getValue();
			}.bind(this));

			$.get('/api/sites/'+resource_id+'/originaltemplatecontent/' + this.name, function (originalTemplateContent) {
				leftEditor.setValue(originalTemplateContent, -1);
				rightEditor.focus();
			});

			this.differMade = true;
		}.bind(this),

		setContent: function (content) {
			this.content = content;
		}.bind(this)
	};
};

Berry.register({
	type: 'site_template_editor',
	create: function () {
		var $navTabs = $('.nav-tabs');

		var height = $(window).height()
			- $navTabs.offset().top
			- $navTabs.height()
			- 74;

		return '<div id="'+this.name+'-differ-container" style="height: '+height+'px;"></div>';
	},
	setup: function () {
		siteTemplates[this.name] = new SiteTemplate({
			id: this.u_id,
			name: this.name,
			value: this.value
		});
	},
	setValue: function (value) {
		return siteTemplates[this.name].setContent(value);
	},
	getValue: function () {
		return siteTemplates[this.name].getContent();
	},
	focus: function() {
		if (siteTemplates[this.name].differMade()) {
			siteTemplates[this.name].getDiffer().getEditors().right.focus();
		}
	}
});

$('body')
	.on('shown.bs.tab', 'a[href="#templates"]', function () {
		$('#templates').find('[data-toggle="tab"]').first().click();
	})
	.on('shown.bs.tab', '#templates:visible', function (e) {
		siteTemplates[e.target.name].makeDiffer();
	});

$('.navbar-header .nav a h4').html('Site');
$.ajax({
	url: '/api/sites/'+resource_id,
	success: function(data) {			

		$('#table').html(templates['site'].render())
		var temp = $(window).height() - $('.nav-tabs').offset().top;
		
		$('body').append('<style>#table{height:'+temp +'px;overflow:scroll;margin:-16px -21px 0px !important} .ace_editor { height: '+(temp-120)+'px; }#theme .ace_editor { height: '+(temp-220)+'px; } .acediff__wrap {padding-left: 15px; padding-right: 15px;}</style>')
		
		$('#main .col-sm-9').berry({fields: [
			{label: 'Name', name:'name', required: true},
			{label: 'Domain', name:'domain', required: true},
			{label: 'Auth Type', name:'auth', required: true,type:"select",options:[
				'Default','CAS'
			],type:'select'},
			{name: 'id', type:'hidden'},				
		],attributes:data, actions:false, name:'main'})

		$('#theme .col-sm-9').berry({fields: [
			{label: 'Icon', name:'icon', required: true, inline: true},
			{label: 'CSS', name:'css', type:'ace', inline: true, mode:'ace/mode/css'},
		],attributes:data.theme, actions:false, name:'theme'})

		$('#cas_config .cas_config_form').berry({fields: [
			{label: 'CAS Hostname', name:'cas_hostname', placeholder:'cas.example.com', required: true, },		
			{label: 'CAS Real Hosts', name:'cas_real_hosts', placeholder:'cas.example.com', required: true},
			{label: 'CAS URI', name:'cas_uri', required: true, placeholder:'/cas'},
			{label: 'CAS Port', name:'cas_port', required: true, type:'select',options:[
				{name:'HTTP (80)', value:'80'},{name:'HTTPS (443)', value:'443'},
			]},
			{label: 'CAS Login URL', name:'cas_login_url', placeholder:'https://cas.example.com/cas/login', required: false},
			{label: 'CAS Logout URL', name:'cas_logout_url', placeholder:'https://cas.example.com/cas/logout', required: false},
			{label: 'CAS Enable SAML', name:'cas_enable_saml', required: true,options:[
				{label:'Enabled',value:"true"},{label:'Disabled',value:"false"}
			],type:'select'},
		],attributes:data.auth_config, actions:false, name:'cas_config'})

		$('#cas_config .external_user_lookup_form').berry({fields: [
			{label: 'External User Lookup Enabled',name:"enabled",options:[
				{label:'Enabled',value:"true"},{label:'Disabled',value:"false"}
			],type:'select'},
			{label: 'External User Lookup URL',name:"url",placeholder:"https://example.com/userlookup","show": {
				"matches": {
					"name": "enabled",
					"value": "true"
				}
			}},
			{label: 'External User Lookup Verb',name:"verb",type:"select","show": {
				"matches": {
					"name": "enabled",
					"value": "true"
				}
			},options:[
				'POST','GET'
			]},
		],attributes:data.auth_config.external_user_lookup, actions:false, name:'external_user_lookup'})

		if (typeof data.auth_config.cas_data_map === 'undefined') {data.auth_config.cas_data_map = {
			default:{},additional:{}
		}}
		$('#cas_config .cas_data_map_default_form').berry({fields: [
			{label: 'Email',name:"email", placeholder:'{{email}}'},
			{label: 'First Name',name:"first_name", placeholder:'{{first_name}}'},
			{label: 'Last Name',name:"last_name", placeholder:'{{last_name}}'},
			{label: 'Unique ID',name:"unique_id", placeholder:'{{unique_id}}'},
		],attributes:data.auth_config.cas_data_map.default, actions:false, name:'cas_data_map_default'})

		var arr = [];
		for (var key in data.auth_config.cas_data_map.additional) {
			arr.push({name:key, value:data.auth_config.cas_data_map.additional[key]});
		}
		$('#cas_config .cas_data_map_additional_form').berry({fields: [
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
			{label: 'API Gateway Config', name:'proxyserver_config', fields:{
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

	templatePage = new paged('#templates',{items:data.templates.partials||[],type:'site_template_editor'});





		$('#save').on('click',function(){
			var item = Berries.main.toJSON();
			item.theme = Berries.theme.toJSON();
			item.auth_config = Berries.cas_config.toJSON();
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