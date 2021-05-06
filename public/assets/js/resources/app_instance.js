$('.navbar-header .nav a h4').html('App Instance');
$('[href="/admin/appinstances"]').parent().addClass('active');
root = '/api/appinstances/'+resource_id;
getData([root,'/assets/data/icons.json'], (appinstance, icons) => {
	$('.navbar-header .nav a h4').append(' - '+appinstance.app.name+'');
	const {forms=[], resources=[]} = appinstance.app.code;
	$.ajax({
		url: '/api/apps/'+appinstance.app_id+'/versions',
		success: function(versions) {
			// versions.unshift({id:0,label:'Latest Published'})
			// versions.unshift({id:-1,label:'Latest (Working or Published)'})

			$('#table').html(templates.app_instance.render(appinstance));
				viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>');

				$('#find').on('click', function(){
					$.get(root+'/pages', function(pages){
						if(pages.length > 0){
							modal({title:'This App Instance was found on the following pages', content:viewTemplate.render({items:pages})});
						}else{
							modal({title: 'No pages Found', content:'This App Instance is not currently placed on any pages.'});
						}
					})
				})			 
				$('body').on('click', '#version', function(){
					
					new gform({
						name:'versionForm',
						data:appinstance,
						legend:'Select Version',
						fields:[
							{label: 'Version', name:'app_version_id', required:true, options: [
								{id:-1,label:'Latest (Working or Published)'},
								{id:0,label:'Latest Published'},
								...versions
							], type:'select', format:{value: version=>version.id, label: "{{label}}"}},
						]
					}).on('save', e => {
						$.ajax({
							url: root, 
							type: 'PUT', 
							data: e.form.get(),
							success: () => {
								window.location.reload();
							},
							error: e => {
								toastr.error(e.statusText, 'ERROR');
							}
						});
					}).modal()
					// $.ajax({
					// 	url: '/api/apps/'+appinstance.app_id+'/versions',
					// 	success: function(versions) {
					// 		versions.unshift({id:0,label:'Latest Published'})
					// 		versions.unshift({id:-1,label:'Latest (working or Published)'})
					// 		$().berry({name:'versionForm',attributes:appinstance,legend:'Select Version',fields:[
					// 				{label: 'Version', name:'app_version_id', required:true, options:versions,type:'select', value_key:'id',label_key:'label'},
					// 		]}).on('save',function(){

					// 			$.ajax({url: root, type: 'PUT', data: Berries.versionForm.toJSON(),
					// 				success: () => {
					// 					window.location.reload();
					// 				},
					// 				error: e => {
					// 					toastr.error(e.statusText, 'ERROR');
					// 				}
					// 			});
					// 		},this)
					// 	}.bind(data)
					// })
				})			 
			// $('#main .col-sm-9').berry({fields: [
			// 	{label: 'Group', name:'group_id', required: true, type:'hidden'},
			// 	{label: 'Version', name:'app_version_id', enabled: false,options:versions,type:'select', value_key:'id',label_key:'label',after:'<i class="fa fa-pencil" id="version"></i>'},
			// 	{label: 'Name', name:'name', required: true},
			// 	// {label: 'App', name:'app_name', enabled: false,parseable:false,value:},
			// 	{label: 'Slug', name:'slug', required: true},
			// 	{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
			// 	{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
			// 	{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}},
			// 	{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
			// 	{label: 'App', name:'app_id', required: true, type:'hidden'},
			// 	{name: 'app', type:'hidden'},
			// 	{name: 'id', type:'hidden'}
			// ],attributes:data, actions:false, name:'main'})

			new gform({
				fields: [
					{name:'group_id', required: true, type:'hidden'},
					{label: 'Version', name:'app_version_id', edit: false, options: [
						{id:-1,label:'Latest (Working or Published)'},
						{id:0,label:'Latest Published'},
						...versions
					], type: 'select', format:{ value: version => version.id, label: "{{label}}"} ,post:'<i class="fa fa-pencil" id="version"></i>'},
					...fieldLibrary['content'],
					{name:'app_id', required: true, type:'hidden'},
					// {name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				],
				data: appinstance, 
				actions:[], 
				name:'main'
			},'#main .col-sm-9')
			
			$('#save').on('click',function(){
				debugger;
				var item = {...$g.forms.main.get(),options:{},user_options_default:{},resources:[]};
				if(typeof gform.instances.options !== 'undefined') {
					item.options = gform.instances.options.toJSON();
				}
				if(typeof gform.instances.user_options_default !== 'undefined') {
					item.user_options_default = gform.instances.user_options_default.toJSON();
				}
				if(typeof Berries.resources !== 'undefined') {
					item.resources = Berries.resources.toJSON().resources;
				}
				$.ajax({url: root, type: 'PUT', dataType : 'json',contentType: 'application/json', data: JSON.stringify(item), success:function(){
						toastr.success('', 'Successfully updated App Instance')
					}.bind(this),
					error:function(e) {
						toastr.error(e.statusText, 'ERROR');
					}
				});

			})
			if(forms.find(form => form.name == "Options").content){
				$('#optionstab').show();
				var options = $.extend(true,{actions:[]}, JSON.parse(_.findWhere(forms,{name:"Options"}).content)) 
				$('#optionstab').toggle(!!options.fields.length);
				options.data = appinstance.options || {};
				options.data.id = appinstance.id;
				options.name = 'options';
				new gform(options,'#options .col-sm-9')

			}
			if(forms.find(form => form.name == "User Options").content){
				var user_options_default = $.extend(true,{actions:[]}, JSON.parse(_.findWhere(forms,{name:"User Options"}).content)) 
				$('#useroptionstab').toggle(!!user_options_default.fields.length);
				user_options_default.data = appinstance.user_options_default || {};
				user_options_default.data.id = appinstance.id;
				user_options_default.name = 'user_options_default';
				new gform(user_options_default,'#user_options_default .col-sm-9')

			}
			if(resources.length && resources[0].name !== '') {	
				$('#resourcestab').show();
				var attributes = _.map(resources,function(resource){
					resource.endpoint = (_.find(this.resources,{name:resource.name}) ||{endpoint:'none'}).endpoint
					return resource
				}.bind({resources:appinstance.resources}))
				// var attributes = $.extend(true, [], data.resources,data.app.code.resources);

				$('#resources .col-sm-9').berry({name:'resources', actions:false,attributes: {resources:attributes},fields:[
					{name:'container', label: false,  type: 'fieldset', fields:[

						{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
							{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
							{name: 'endpoint',label:false,columns:8, type: 'select',default: {name:'None', value:'none'}, choices: '/api/groups/'+data.group_id+'/endpoints'},
							{label:false, name: 'name',columns:0, type:'hidden'}
						]}
					]},
				]} ).on('change',function(item, b, c){
					var item = Berries.resources.findByID(item.id)
					var url = '';
					url += (_.findWhere(Berry.collection.get('/api/groups/'+this.group_id+'/endpoints'),{id:parseInt(item.value)})||{config:{url:''} }).config.url;
					url+=(_.findWhere(this.app.code.resources,{name:item.parent.children.name.instances[1].value})||{path:''}).path				
					item.update({help:url, value:item.value}, true)
				}.bind(appinstance))
			}
	
		}
	})
})

$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});