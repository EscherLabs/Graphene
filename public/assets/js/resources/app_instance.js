$('.navbar-header .nav a h4').html('App Instance');
$('[href="/admin/appinstances"]').parent().addClass('active');

$.ajax({
	url: '/api/appinstances/'+resource_id,
	success: function(data) {
		$('.navbar-header .nav a h4').append(' - '+data.app.name+'');
		
		$.ajax({
			url: '/api/apps/'+data.app_id+'/versions',
			success: function(data, versions) {
				versions.unshift({id:0,label:'Latest Published'})
				versions.unshift({id:-1,label:'Latest (Working or Published)'})

				$('#table').html(templates.app_instance.render(data));
					viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>');

					$('#find').on('click', function(){
						$.get('/api/appinstances/'+data.id+'/pages', function(data){
							if(data.length > 0){
								modal({title:'This App Instance was found on the following pages', content:viewTemplate.render({items:data})});
							}else{
								modal({title: 'No pages Found', content:'This App Instance is not currently placed on any pages.'});
							}
						})
					})			 
					$('body').on('click','#version', function(){
						
						// $.ajax({
						// 	url: '/api/apps/'+data.app_id+'/versions',
						// 	success: function(versions) {
						// 		versions.unshift({id:0,label:'Latest Published'})
						// 		versions.unshift({id:-1,label:'Latest (working or Published)'})
								$().berry({name:'versionForm',attributes:data,legend:'Select Version',fields:[
										{label: 'Version', name:'app_version_id', required:true, options:versions,type:'select', value_key:'id',label_key:'label'},
								]}).on('save',function(){

									$.ajax({url: '/api/appinstances/'+data.id, type: 'PUT', data: Berries.versionForm.toJSON(),
									success:function(data) {
										window.location.reload(true);
									},
									error:function(e) {
										toastr.error(e.statusText, 'ERROR');
									}
								});
								},this)
						// 	}.bind(data)
						// })
					})			 
				$('#main .col-sm-9').berry({fields: [
					{label: 'Group', name:'group_id', required: true, type:'hidden'},
					{label: 'Version', name:'app_version_id', enabled: false,options:versions,type:'select', value_key:'id',label_key:'label',after:'<i class="fa fa-pencil" id="version"></i>'},
					{label: 'Name', name:'name', required: true},
					// {label: 'App', name:'app_name', enabled: false,parseable:false,value:},
					{label: 'Slug', name:'slug', required: true},
					{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
					{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
					{label: 'App', name:'app_id', required: true, type:'hidden'},
					{name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				],attributes:data, actions:false, name:'main'})
				$('#save').on('click',function(){
					var item = Berries.main.toJSON();
					if(typeof Berries.options !== 'undefined') {
						item.options = Berries.options.toJSON();
					}			
					if(typeof Berries.user_options_default !== 'undefined') {
						item.user_options_default = Berries.user_options_default.toJSON();
					}
					if(typeof Berries.resources !== 'undefined') {
						item.resources = Berries.resources.toJSON().resources;
					}
					$.ajax({url: '/api/appinstances/'+item.id, type: 'PUT', data: item, success:function(){
							toastr.success('', 'Successfully updated App Instance')
						}.bind(this),
						error:function(e) {
							toastr.error(e.statusText, 'ERROR');
						}
					});

				})
				if(typeof data.app.code.forms !== 'undefined' && _.findWhere(data.app.code.forms,{name:"Options"}).content){
					$('#optionstab').show();
					var options = $.extend(true,{actions:false}, JSON.parse(_.findWhere(data.app.code.forms,{name:"Options"}).content)) 
					$('#optionstab').toggle(!!options.fields.length);
					options.attributes = data.options || {};
					options.attributes.id = data.id;
					options.name = 'options';
					$('#options .col-sm-9').berry(options);
				}
				if(typeof data.app.code.forms !== 'undefined' && _.findWhere(data.app.code.forms,{name:"User Options"}).content){
					var user_options_default = $.extend(true,{actions:false}, JSON.parse(_.findWhere(data.app.code.forms,{name:"User Options"}).content)) 
					$('#useroptionstab').toggle(!!user_options_default.fields.length);
					user_options_default.attributes = data.user_options_default || {};
					user_options_default.attributes.id = data.id;
					user_options_default.name = 'user_options_default';
					$('#user_options_default .col-sm-9').berry(user_options_default);
				}
				if(typeof data.app.code.resources !== 'undefined' && data.app.code.resources[0].name !== '') {	
					$('#resoucestab').show();
					var attributes = _.map(data.app.code.resources,function(resource){
						resource.endpoint = (_.find(this.resources,{name:resource.name}) ||{endpoint:'none'}).endpoint
						return resource
					}.bind({resources:data.resources}))
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
					}.bind(data))
				}
		
			}.bind(null,data)
		})
	}
	
});

$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});