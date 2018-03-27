if(typeof route !== 'undefined'){

var api = '/api/'+route;
var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: -20,
		container: '#table', 
		berry: {flatten: false},
		add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes,
			success:function(data) {
				model.set(data);
				// Berries.modal.trigger('close')
				toastr.success('', 'Successfully Added')
			}.bind(model),
			error:function(e) {
				toastr.error(e.statusText, 'ERROR');
			}
		});},
		edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
			success:function() {
				toastr.success('', 'Successfully Updated')
			},
			error:function(e) {
				toastr.error(e.statusText, 'ERROR');
			}
		});},
		delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE',
			success:function() {
				toastr.success('', 'Successfully Deleted')
			},
			error:function(e) {
				toastr.error(e.statusText, 'ERROR');
			}
		});}

		// tableConfig.add = function(model){
		// 	if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
		// 		$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.user_id, type: 'POST', data: model.attributes,
		// 			success:function(data){
		// 				toastr.success('', 'Developer successfully Added')
		// 			},
		// 			error:function(e){
		// 				toastr.error(e.statusText, 'ERROR');
		// 			}
		// 		});
		// 	}else{
		// 		toastr.error('Developer already exists', 'Duplicate')
		// 		model.delete();
		// 		model.owner.draw();
		// 	}
		// },

	}


		function render(template, data){
			if(typeof templates[template] === 'undefined'){
				templates[template] =  Hogan.compile($('#'+template).html());
			}
		return templates[template].render(data, templates);
		}
		modal = function(options) {
			$('#myModal').remove();
			this.ref = $(render('modal', options));

			options.legendTarget = this.ref.find('.modal-title');
			options.actionTarget = this.ref.find('.modal-footer');

			$(this.ref).appendTo('body');

			if(options.content) {
				$('.modal-body').html(options.content);
				options.legendTarget.html(options.legend);
			}else{
				options.autoDestroy = true;
				var myform = this.ref.find('.modal-body').berry(options).on('destroy', $.proxy(function(){
					this.ref.modal('hide');
				},this));

				this.ref.on('shown.bs.modal', $.proxy(function () {
					this.$el.find('.form-control:first').focus();
				},myform));
			}
			if(options.onshow){
				this.ref.on('shown.bs.modal', options.onshow);
			}  
			this.ref.modal();
			return this;
		};
		templates["group_view"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<li id=\"list_");t.b(t.v(t.f("id",c,p,0)));t.b("\" data-id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" class=\"list-group-item filterable\">");t.b("\n" + i);t.b("	<div class=\"sortableContent\">");t.b("\n" + i);t.b("	<div class=\"handle\"></div>");t.b("\n" + i);t.b("	");t.b(t.v(t.f("name",c,p,0)));t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</li>");return t.fl(); },partials: {}, subs: {  }});

		render('group_view');
		templates.listing = Hogan.compile('<ol id="sorter" class="list-group" style="margin: -15px;">{{#items}}{{>group_view}}{{/items}}</ol>');




$('#content').html('<div class="row "><div class="col-sm-12"><div id="table" style="margin:-21px"></div></div></div>');		

initializers = {};

initializers['group'] = function() {
		$('.navbar-header li').html('<a href="/admin/groups" style="display:inline-block"><h4 style="margin:0">Groups</h4></a>');
		// $('.navbar-header .nav a h4').html('<a href="/admin/groups">Groups</a> - Group Summary');
		$.ajax({
			url: '/api/'+route+'s/'+resource_id+'/summary',
			success: function(data) {
				data.group_slug = data.slug;
				$('#table').html(templates.group_summary.render(data,templates));
			}
		});
}

initializers['apps'] = function() {
		$('.navbar-header .nav a h4').html('MicroApps');
		$.ajax({
			url: '/api/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Description', name:'description', required: false, type:'textarea'},
					{label: 'Tags', name:'tags', required: false},
					{label: 'Lead Developer', name:'user_id', type:'select', choices: '/api/apps/developers', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false, value_key:'id',label_key:'email'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/admin/'+route+'/'+model.attributes.id},
				tableConfig.events = [
					{'name': 'config', 'label': '<i class="fa fa-code"></i> Developers', callback: function(model){
						window.location.href = '/admin/apps/'+model.attributes.id+'/developers'
					}}
				]
				tableConfig.name = "apps";
				tableConfig.data = data;
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['appinstances'] = function() {
		$('.navbar-header .nav a h4').html('App Instances');
		var url = '/api/'+route;
		if(resource_id !== ''){
			url= '/api/groups/'+resource_id+'/'+route
		}
			$.ajax({
				url: url,

			success: function(data) {
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
        			{label: 'Slug', name:'slug', required: true},
        			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
        			{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'App', name:'app_id', required: true, type:'select', choices: '/api/apps'},
					{label: 'Version', name:'app_version_id', type:'hidden'},
					// {label: 'Version', name:'app_version_id', required:true, type:'select', options: function(item){
					// 	return _.map(_.findWhere(this.owner.fields.app_id.choices,{id:parseInt(this.owner.fields.app_id.val())}).versions,function(item){
					// 		return {'label':item.summary,'value':item.id}
					// 	});
					// }},
					{name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/admin/appinstances/'+model.attributes.id};
				tableConfig.data = data;
				tableConfig.name = "appinstances";
				tableConfig.events = [
					{'name': 'version', 'label': '<i class="fa fa-cogs"></i> Version', callback: function(model){
						$.ajax({
							url: '/api/apps/'+model.attributes.app_id+'/versions',
							success: function(data) {
								console.log(data);
								data.unshift({id:0,summary:'Latest Stable'})
								data.unshift({id:-1,summary:'Latest (working or stable)'})
								$().berry({attributes:model.attributes,m:model,legend:'Select Version',fields:[
										{label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'summary'},
								]}).on('save',function(){
									// model.attributes.app_version_id = this.toJSON().version;
									var temp = $.extend(true,{},this.options.m.attributes,this.toJSON());
									// temp.app_version_id = parseInt(temp.app_version_id);

									this.options.m.set(temp)
									this.options.m.owner.options.edit(this.options.m)
									this.options.m.owner.draw();
									this.trigger('close');
								})
							}
						})
					}}

				]
				if(resource_id !== ''){
					tableConfig.events.push({'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){

						var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)

						// tempdata = _.sortBy(tempdata, 'order');
						mymodal = modal({title: "Sort App Instances", content: templates.listing.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});

						Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});


					}, global: true})
				}


				$('body').on('click','.save-sort',function(){
					$.ajax({
						url: '/api/appinstances/order/'+resource_id,
						type: 'POST',
						data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
						success: function(data) {
							toastr.success('', 'Order successfully updated')
							mymodal.ref.modal('hide')
						}
					})
				})

				tableConfig.defaultSort = 'order';
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['app_instance'] = function() {
		$('.navbar-header .nav a h4').html('App Instances');
		$.ajax({
			url: '/api/appinstances/'+resource_id,
			success: function(data) {				
				$('#table').html(`
				<div style="margin:21px">
<div class="btn-group pull-right">
  <button type="button" class="btn btn-primary" id="save">Save</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="/app/`+data.slug+`">Visit</a></li>
  </ul>
</div>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#main" aria-controls="home" role="tab" data-toggle="tab">Main</a></li>
    <li id="resoucestab" role="presentation" style="display:none"><a href="#resources" aria-controls="messages" role="tab" data-toggle="tab">Resources</a></li>
		<li id="optionstab" role="presentation" style="display:none"><a href="#options" aria-controls="profile" role="tab" data-toggle="tab">Options</a></li>
		<li id="useroptionstab" role="presentation" style="display:none"><a href="#user_options_default" aria-controls="profile" role="tab" data-toggle="tab">User Default Options</a></li>	
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="main" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
  	<div class="col-sm-3"></div></div></div>
    <div role="tabpanel" class="tab-pane" id="resources" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="options" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
  	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="user_options_default" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
  	<div class="col-sm-3"></div></div></div>
  </div>

</div>
				`)
				$('#main .col-sm-9').berry({fields: [
					{label: 'Name', name:'name', required: true},
        			{label: 'Slug', name:'slug', required: true},
        			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
					{label: 'Group', name:'group_id', required: true, type:'hidden'},
					{label: 'App', name:'app_id', required: true, type:'hidden'},
					{name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				],attributes:data, actions:false, name:'main'})
				$('#save').on('click',function(){
					var item = Berries.main.toJSON();
					item.options = Berries.options.toJSON();
					item.user_options_default = Berries.user_options_default.toJSON();
					item.resources = Berries.resources.toJSON().resources;

					$.ajax({url: '/api/appinstances/'+item.id, type: 'PUT', data: item, success:function(){
							toastr.success('', 'Successfully updated App Instance')
						}.bind(this),
						error:function(e) {
							toastr.error(e.statusText, 'ERROR');
						}
					});

				})
				if(data.app.code.forms[0].content){
					$('#optionstab').show();
					var options = $.extend(true,{actions:false}, JSON.parse(data.app.code.forms[0].content)) 
					options.attributes = data.options || {};
					options.attributes.id = data.id;
					options.name = 'options';
					$('#options .col-sm-9').berry(options);
				}
				if(data.app.code.forms[1].content){
					$('#useroptionstab').show();
					var user_options_default = $.extend(true,{actions:false}, JSON.parse(data.app.code.forms[1].content)) 
					user_options_default.attributes = data.user_options_default || {};
					user_options_default.attributes.id = data.id;
					user_options_default.name = 'user_options_default';
					$('#user_options_default .col-sm-9').berry(user_options_default);
				}
				if(data.app.code.resources[0].name !== '') {	
					$('#resoucestab').show();

					var attributes = $.extend(true, [],data.app.code.resources, data.resources);
					$('#resources .col-sm-9').berry({name:'resources', actions:false,attributes: {resources:attributes},fields:[
						{name:'container', label: false,  type: 'fieldset', fields:[

							{"multiple": {"duplicate": false},label: '<hr>', name: 'resources', type: 'fieldset', fields:[
								{label: 'Name',columns:6, enabled:false},
								{label: 'Endpoint',columns:6, type: 'select', choices: '/api/groups/'+data.group_id+'/endpoints'}
							]}
						]},
					]} )
				}
			}
		});
}

initializers['sites'] = function() {
		$('.navbar-header .nav a h4').html('Sites');
		$.ajax({
			url: '/api/'+route,
			success: function(data){
				tableConfig.schema = [
					{label: 'Site Name', name:'name', required: true},
					{label: 'Domain', name:'domain', required: true},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.name = "sites";
				tableConfig.click = function(model){window.location.href = '/admin/sites/'+model.attributes.id};
				bt = new berryTable(tableConfig)
			}
		});
}

initializers['site'] = function() {
	$('.navbar-header .nav a h4').html('Site');
	$.ajax({
		url: '/api/sites/'+resource_id,
		success: function(data) {				
			$('#table').html(`
			<div style="margin:21px">
<div class="btn-group pull-right">
<button type="button" class="btn btn-primary" id="save">Save</button>
<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
<span class="caret"></span>
<span class="sr-only">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
<li><a href="/app/`+data.slug+`">Visit</a></li>
</ul>
</div>
<!-- Nav tabs -->
<ul class="nav nav-tabs" role="tablist">
<li role="presentation" class="active"><a href="#main" aria-controls="main" role="tab" data-toggle="tab">Main</a></li>
<li role="presentation"><a href="#theme" aria-controls="theme" role="tab" data-toggle="tab">Theme</a></li>
<li role="presentation"><a href="#cas_config" aria-controls="cas_config" role="tab" data-toggle="tab">CAS</a></li>
<li role="presentation"><a href="#templates" aria-controls="templates" role="tab" data-toggle="tab">Templates</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
	<div role="tabpanel" class="tab-pane active" id="main" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="theme" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
	<div role="tabpanel" class="tab-pane" id="cas_config" style="padding-top: 20px;">
		<div class="row">
			<div class="col-sm-9 styles">
				<div class="cas_config_form"></div>
				<div class="external_user_lookup_form"></div>								
				<div class="cas_data_map_default_form"></div>
				<div class="cas_data_map_additional_form"></div>
			</div>
			<div class="col-sm-3"></div>
		</div>
	</div>	
	<div role="tabpanel" class="tab-pane" id="templates" style="padding-top: 20px;"><div class="row"><div class="col-sm-9 styles"></div>
	<div class="col-sm-3"></div></div></div>
</div>

</div>
			`)

			$('#main .col-sm-9').berry({fields: [
				{label: 'Name', name:'name', required: true},
				{label: 'Domain', name:'domain', required: true},
				{label: 'Auth Type', name:'auth', required: true,type:"select",options:[
					'Default','CAS'
				],type:'select'},
				{name: 'id', type:'hidden'},				
			],attributes:data, actions:false, name:'main'})

			$('#theme .col-sm-9').berry({fields: [
				{label: 'Icon', name:'icon', required: true},
				{label: 'CSS', name:'css', required: true, type:'ace', mode:'ace/mode/css'},
			],attributes:data.theme, actions:false, name:'theme'})

			$('#cas_config .cas_config_form').berry({fields: [
				{label: 'CAS Hostname', name:'cas_hostname', required: true},		
				{label: 'CAS Real Hosts', name:'cas_real_hosts', required: true},
				{label: 'CAS URI', name:'cas_uri', required: true, placeholder:'/cas'},
				{label: 'CAS Port', name:'cas_port', required: true, type:'select',options:[
					{name:'HTTP (80)', value:'80'},{name:'HTTPS (443)', value:'443'},
				]},
				{label: 'CAS Login URL', name:'cas_login_url', required: false},
				{label: 'CAS Logout URL', name:'cas_logout_url', required: false},
				{label: 'CAS Enable SAML', name:'cas_enable_saml', required: true,options:[
					{label:'Enabled',value:true},{label:'Disabled',value:false}
				],type:'select'},
			],attributes:data.auth_config, actions:false, name:'cas_config'})

			$('#cas_config .external_user_lookup_form').berry({fields: [
				{label: 'External User Lookup Enabled',name:"enabled",options:[
					{label:'Enabled',value:true},{label:'Disabled',value:false}
				],type:'select'},
				{label: 'External User Lookup URL',name:"url"},
				{label: 'External User Lookup Verb',name:"verb",type:"select",options:[
					'POST','GET'
				]},
			],attributes:data.auth_config.external_user_lookup, actions:false, name:'external_user_lookup'})

			if (typeof data.auth_config.cas_data_map === 'undefined') {data.auth_config.cas_data_map = {
				default:{},additional:{}
			}}
			$('#cas_config .cas_data_map_default_form').berry({fields: [
				{label: 'Email',name:"email"},
				{label: 'First Name',name:"first_name"},
				{label: 'Last Name',name:"last_name"},
				{label: 'Unique ID',name:"unique_id"},
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
				item.auth_config = Berries.cas_config.toJSON();
				item.auth_config.cas_data_map = {};
				item.auth_config.cas_data_map.default = Berries.cas_data_map_default.toJSON();
				item.auth_config.cas_data_map.additional = 
					_.object(_.map(Berries.cas_data_map_additional.toJSON().additional, function(x){return [x.name, x.value]}))
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
var partials = _.indexBy(partials, 'name')
for(var i in partials){
	partials[i] = partials[i].content;
}
				item.templates = {partials:partials}
				if(!item.templates.partials.main.length){
				 delete item.templates.partials.main;
				}
				// item.templates.partials = partials;

				$.ajax({url: '/api/sites/'+item.id, type: 'PUT', data: item, success:function(){
						toastr.success('', 'Successfully updated App Instance')
					}.bind(this),
					error:function(e) {
						toastr.error(e.statusText, 'ERROR');
					}
				});
			})

		}
	});
}

initializers['pages'] = function(){
		var url = '/api/'+route;
		if(resource_id !== ''){
			url= '/api/groups/'+resource_id+'/'+route
		}
		$.ajax({
			url: url,
			success: function(data){
				$('.navbar-header .nav a h4').html('Pages');
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Slug', name:'slug', required: true},
					{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
					{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },				
					{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/page/'+model.attributes.group_id+'/'+model.attributes.slug};


				if(resource_id !== ''){

					tableConfig.events = [
						{'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){

							var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)

							// tempdata = _.sortBy(tempdata, 'order');
							mymodal = modal({title: "Sort Pages", content: templates.listing.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});

							Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
		

						}, global: true}
					]
				}


				$('body').on('click','.save-sort',function(){
					$.ajax({
						url: '/api/pages/order/'+resource_id,
						type: 'POST',
						data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
						success: function(data) {
							toastr.success('', 'Order successfully updated')
							mymodal.ref.modal('hide')
						}
					})
				})
				tableConfig.defaultSort = 'order';

				tableConfig.data = data;
				tableConfig.name = "pages";
				tableConfig.multiEdit = ['unlisted', 'public', 'group_id'],
				bt = new berryTable(tableConfig)
			}
		});
}

initializers['endpoints'] = function() {
		$('.navbar-header .nav a h4').html('Endpoints');
		var url = '/api/'+route;
		if(resource_id !== ''){
			url= '/api/groups/'+resource_id+'/'+route
		}
		$.ajax({
		url: url,
			success: function(data){
				tableConfig.schema = [
					{label: 'Name', name:'name', required: true},
					{label: 'Auth Type', name:'type', type: 'select', choices:[
						{label:'HTTP No Auth', value:'http_no_auth'}, 
						{label:'HTTP Basic Auth', value:'http_basic_auth'}, 
						{label:'Google Sheets', value:'google_sheets'},
					], required: true},
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'Configuration', name:'config', showColumn:false, fields:[
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
						{label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
						{label:'Sheet ID', name:'sheet_id', type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Google Redirect URL', name:'google_redirect', enabled:false, type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
						{label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
						{label:'Password', 'name':'secret', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
					]},
					{name: 'id', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.name = "endpoints";

				bt = new berryTable(tableConfig)
			}
		});
}

initializers['links'] = function() {
	$('.navbar-header .nav a h4').html('Links');
	$.ajax({
		url: '/api/'+route,
		success: function(data){
			tableConfig.schema = [
				{label: 'Title', name:'title', required: true},
				{label: 'Link', name:'link', required: true},
				{label: 'Image', name:'image', required: false,template:'<img src="{{value}}" style="height:18px;">',showColumn: false},
				{label: 'Icon', name:'icon', 
				type:'select', choices:'/assets/data/icons.json',
				required: false,template:'{{#attributes.image}}<img src="{{attributes.image}}" style="height:18px;">{{/attributes.image}}{{^attributes.image}}<i class="{{value}}" style="color:{{attributes.color}}"></i>{{/attributes.image}}'},
				{label: 'Color', name:'color', required: false,template:'<div style="background-color:{{value}};width:30px;height:18px;"></div>',showColumn: false},
				{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
				{name: 'id', type:'hidden'}
			];
			tableConfig.data = data;
			tableConfig.name = "links";
			bt = new berryTable(tableConfig)
		}
	});
}

initializers['tags'] = function() {
	$('.navbar-header .nav a h4').html('Tags');
	var url = '/api/'+route;
	if(resource_id !== ''){
		url= '/api/groups/'+resource_id+'/'+route
	}
	$.ajax({
		url: url,
		success: function(data){
			tableConfig.schema = [
				{label: 'Name', name:'name', required: true},
				{label: 'Value', name:'value', required: true},
				{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
				{name: 'id', type:'hidden'}
			];
			tableConfig.data = data;
			tableConfig.name = "tags";
			bt = new berryTable(tableConfig)
		}
	});
}

initializers['images'] = function() {
	$('.navbar-header .nav a h4').html('Images');
	var url = '/api/'+route;
	if(resource_id !== ''){
		url= '/api/groups/'+resource_id+'/'+route
	}
	$.ajax({
		url: url,
		success: function(data){
			tableConfig.schema = [
				{label: 'Group', name:'group_id', required: true,enabled:false, type:'select', choices: '/api/groups?limit=true'},
				{label: 'Image', name:'filename',show:false, required: true, template: '<div style="width:150px;margin:0 auto;"><img style="max-width:150px;max-height:50px" src="/image/{{attributes.id}}.{{attributes.ext}}"/></div>'},
				{label: 'Name', name:'name', required: true},
				// {label: 'Ext', name:'ext', required: true},
				{name: 'id', type:'hidden'}
			];

				tableConfig.events = [
					{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){

							$().berry({name:'newimage',actions:['cancel'],legend: 'Add Image(s)', fields:[
								{label: 'Group', name:'group_id', type: 'select', choices: '/api/groups?limit=true', required: true, default: {label:"Choose a group", value:'-'}},
								{show:{"not_matches": {"name": "group_id","value": "-"}},type: 'upload', label: false, path: '/api/images?group_id=', name: 'image_filename'}]}).on('uploaded:image_filename', $.proxy(function(){
										var temp = Berries.newimage.fields.image_filename.value;
										// temp.group = _.findWhere(this.groups,{id:parseInt(Berries.newimage.fields.image_filename.value.group_id, 10)}).name;
										bt.add(temp);
										Berries.newimage.trigger('close');
							}, this) ).on('change:group_id', function(){
									var groupid =this.fields.group_id.toJSON();
									this.fields.image_filename.update({path:'/api/images?group_id='+groupid}, true)
							});

					}}
				]

			
			tableConfig.data = data;
			tableConfig.name = "images";
			bt = new berryTable(tableConfig)
		}
	});
}

initializers['users'] = function() {
	$('.navbar-header .nav a h4').html('Users');
	$.ajax({
		url: '/api/'+route,
		success: function(data) {
			tableConfig.schema = [
				{label: 'First Name', name:'first_name', required: true},
				{label: 'Last Name', name:'last_name', required: true},
				{label: 'Email', name:'email', type: 'email', required: true},
				{name: 'id', type:'hidden'}
			];
			tableConfig.data = data;
			bt = new berryTable(tableConfig)
		}
	});
}




initializers['groups'] = function() {
	$('.navbar-header .nav a h4').html('Groups');
	$.ajax({
		url: '/api/'+route,
		success: function(data) {
			tableConfig.schema = [
				{label: 'Name', name:'name', required: true},        
				{label: 'Slug', name:'slug', required: true},
				{name: 'id', type:'hidden'}
			];
			tableConfig.events = [
				{'name': 'config', 'label': '<i class="fa fa-lock"></i> Admins', callback: function(model){
					window.location.href = '/admin/groups/'+model.attributes.id+'/admins'
				}},
				{'name': 'resources', 'label': '<i class="fa fa-users"></i> Members', callback: function(model){
					window.location.href = '/admin/groups/'+model.attributes.id+'/members'
				}},
				{'name': 'composites', 'label': '<i class="fa fa-puzzle-piece"></i> Composites', callback: function(model){
					window.location.href = '/admin/groups/'+model.attributes.id+'/composites'
				}},
				{'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){

					var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)

					// tempdata = _.sortBy(tempdata, 'order');
					mymodal = modal({title: "Sort Groups", content: templates.listing.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});

					Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});

				}, global: true}
			]
			tableConfig.defaultSort = 'order';

			$('body').on('click','.save-sort',function(){
				// console.log(_.map($('#sorter').children(),function(item,index){return {key:item.dataset.id,index:index}}))
			$.ajax({
				url: '/api/groups/order',
				type: 'POST',
				data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
				success: function(data) {
					toastr.success('', 'Order successfully updated')
					mymodal.ref.modal('hide')
				}
			})
			})
			tableConfig.data = data;
			tableConfig.click = function(model){window.location.href = '/admin/groups/'+model.attributes.id};

			tableConfig.name = "groups";

			bt = new berryTable(tableConfig)
		}
	});

}
initializers['members'] = function() {
		$('.navbar-header .nav a h4').html('Members');
		$.ajax({
			url: '/api/groups/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'user_id', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}'},
					// {name:'user', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/members/'+model.attributes.user_id, type: 'POST', data: model.attributes,
							success:function(data){
								this.set(data);
								this.owner.draw();
								toastr.success('', 'Member successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Member already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				};
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/members/'+model.attributes.user_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Member successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}

				tableConfig.events = [
					{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){
					$().berry({
						name:'user_search',
						actions:['cancel'],
						legend: 'User Search',
						fields:[
							{name:'query',label:'Search'},
							{type:'raw',value:'',name:'results',label:false}
						]}).delay('change:query',function(){
							$.ajax({
								url: '/api/users/search/'+this.toJSON().query,
								success: function(data) {
									this.fields.results.update({/*options:data,*/value:templates['user_list'].render({users:data})})
								}.bind(this)
							})
						})
					}}
				]

				$('body').on('click','.list-group-item.user', function(e){
					// _.find(Berries.user_search.fields.results.options,{id:parseInt(e.currentTarget.dataset.id)})
					bt.add({user_id:e.currentTarget.dataset.id})
					Berries.user_search.trigger('close');
				})

				bt = new berryTable(tableConfig)

			}
		});

}
initializers['admins'] = function() {
		$('.navbar-header .nav a h4').html('Admins');
		$.ajax({
			url: '/api/groups/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'user_id', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}'},
					// {name:'user', type:'hidden'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/admins/'+model.attributes.user_id, type: 'POST', data: model.attributes,
							success:function(data){
								this.set(data);
								this.owner.draw();
								toastr.success('', 'Admin successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Admin already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/admins/'+model.attributes.user_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Admin successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				tableConfig.events = [
					{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){
					$().berry({
						name:'user_search',
						actions:['cancel'],
						legend: 'User Search',
						fields:[
							{name:'query',label:'Search'},
							{type:'raw',value:'',name:'results',label:false}
						]}).delay('change:query',function(){
							$.ajax({
								url: '/api/users/search/'+this.toJSON().query,
								success: function(data) {
									this.fields.results.update({/*options:data,*/value:templates['user_list'].render({users:data})})
								}.bind(this)
							})
						})
					}}
				]
				$('body').on('click','.list-group-item.user', function(e){
					bt.add({user_id:e.currentTarget.dataset.id})
					Berries.user_search.trigger('close');
				})

				bt = new berryTable(tableConfig)
			}
		});
}
initializers['composites'] = function() {
		$('.navbar-header .nav a h4').html('Group Composites');
		$.ajax({
			url: '/api/groups/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'Group', name:'composite_group_id', required: true, type:'select', choices: '/api/groups?limit=true', label_key:'composite_group_id'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.composite_group_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/composites/'+model.attributes.composite_group_id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Composite successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Composite already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/composites/'+model.attributes.composite_group_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Composite successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				bt = new berryTable(tableConfig)
			}
		});
}
initializers['developers'] = function() {
		$('.navbar-header .nav a h4').html('Developers');
		$.ajax({
			url: '/api/apps/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'id', type:'select', template:'{{attributes.first_name}} {{attributes.last_name}} - {{attributes.email}}'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({id:parseInt(model.attributes.id)}).length){
						$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Developer successfully Added')
								this.set(data);
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Developer already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Developer successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				tableConfig.events = [
					{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){
					$().berry({
						name:'user_search',
						actions:['cancel'],
						legend: 'User Search',
						fields:[
							{name:'query',label:'Search'},
							{type:'raw',value:'',name:'results',label:false}
						]}).delay('change:query',function(){
							$.ajax({
								url: '/api/users/search/'+this.toJSON().query,
								success: function(data) {
									this.fields.results.update({/*options:data,*/value:templates['user_list'].render({users:data})})
								}.bind(this)
							})
						})
					}}
				]

				$('body').on('click','.list-group-item.user', function(e){
					bt.add({id:e.currentTarget.dataset.id})
					Berries.user_search.trigger('close');
				})
				bt = new berryTable(tableConfig)
			}
		});
}

$('[href="/admin/'+route+'"]').parent().addClass('active');
initializers[route]();

}

