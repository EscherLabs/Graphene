$('.navbar-header .nav a h4').html('App Instance');
$.ajax({
	url: '/api/appinstances/'+resource_id,
	success: function(data) {		
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
			$('#version').on('click', function(){
				
				$.ajax({
					url: '/api/apps/'+data.app_id+'/versions',
					success: function(versions) {
						versions.unshift({id:0,label:'Latest Stable'})
						versions.unshift({id:-1,label:'Latest (working or stable)'})
						$().berry({name:'version',attributes:this,legend:'Select Version',fields:[
								{label: 'Version', name:'app_version_id', required:true, options:versions,type:'select', value_key:'id',label_key:'label'},
						]}).on('save',function(){

							$.ajax({url: '/api/appinstances/'+this.id, type: 'PUT', data: Berries.version.toJSON(),
							success:function(data) {
								window.location.reload(true);
							},
							error:function(e) {
								toastr.error(e.statusText, 'ERROR');
							}
						});
						},this)
					}.bind(data)
				})
			})			 
	
		$('#main .col-sm-9').berry({fields: [
			{label: 'Group', name:'group_id', required: true, type:'hidden'},
			{label: 'Name', name:'name', required: true},
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
			item.resources = Berries.resources.toJSON().resources;

			$.ajax({url: '/api/appinstances/'+item.id, type: 'PUT', data: item, success:function(){
					toastr.success('', 'Successfully updated App Instance')
				}.bind(this),
				error:function(e) {
					toastr.error(e.statusText, 'ERROR');
				}
			});

		})
		if(_.findWhere(data.app.code.forms,{name:"Options"}).content){
			$('#optionstab').show();
			var options = $.extend(true,{actions:false}, JSON.parse(_.findWhere(data.app.code.forms,{name:"Options"}).content)) 
			$('#optionstab').toggle(!!options.fields.length);
			options.attributes = data.options || {};
			options.attributes.id = data.id;
			options.name = 'options';
			$('#options .col-sm-9').berry(options);
		}
		if(_.findWhere(data.app.code.forms,{name:"User Options"}).content){
			var user_options_default = $.extend(true,{actions:false}, JSON.parse(_.findWhere(data.app.code.forms,{name:"User Options"}).content)) 
			$('#useroptionstab').toggle(!!user_options_default.fields.length);
			user_options_default.attributes = data.user_options_default || {};
			user_options_default.attributes.id = data.id;
			user_options_default.name = 'user_options_default';
			$('#user_options_default .col-sm-9').berry(user_options_default);
		}
		if(data.app.code.resources[0].name !== '') {	
			$('#resoucestab').show();
			var attributes = $.extend(true, [], data.resources,data.app.code.resources);

			$('#resources .col-sm-9').berry({name:'resources', actions:false,attributes: {resources:attributes},fields:[
				{name:'container', label: false,  type: 'fieldset', fields:[

					{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
						{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
						{name: 'endpoint',label:false,columns:8, type: 'select',default: {name:'None', value:'none'}, choices: '/api/groups/'+data.group_id+'/endpoints'},
						{label:false, name: 'name',columns:0, type:'hidden'}
					]}
				]},
			]} )
		}
	}
});