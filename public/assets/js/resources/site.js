
// initializers['site'] = function() {
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
// }