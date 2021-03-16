$('.navbar-header .nav a h4').html('Workflow Instance');
$('[href="/admin/workflowinstances"]').parent().addClass('active');

$.ajax({
	url: '/api/workflowinstances/'+resource_id,
	success: function(data) {
		$('.navbar-header .nav a h4').append(' - '+data.workflow.name+'');
		
		$.ajax({
			url: '/api/workflows/'+data.workflow_id+'/versions',
			success: function(data, versions) {
				versions.unshift({id:0,label:'Latest Published'})
				versions.unshift({id:-1,label:'Latest (Working or Published)'})

				$('#table').html(templates.workflow_instance.render(data));
					viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>');

					$('#find').on('click', function(){
						$.get('/api/workflowinstances/'+data.id+'/pages', function(data){
							if(data.length > 0){
								modal({title:'This Workflow Instance was found on the following pages', content:viewTemplate.render({items:data})});
							}else{
								modal({title: 'No pages Found', content:'This Workflow Instance is not currently placed on any pages.'});
							}
						})
					})			 
					$('body').on('click','#version', function(){
						
						// $.ajax({
						// 	url: '/api/workflows/'+data.workflow_id+'/versions',
						// 	success: function(versions) {
						// 		versions.unshift({id:0,label:'Latest Published'})
						// 		versions.unshift({id:-1,label:'Latest (working or Published)'})
								$().berry({name:'versionForm',attributes:data,legend:'Select Version',fields:[
										{label: 'Version', name:'workflow_version_id', required:true, options:versions,type:'select', value_key:'id',label_key:'label'},
								]}).on('save',function(){

									$.ajax({url: '/api/workflowinstances/'+data.id, type: 'PUT', data: Berries.versionForm.toJSON(),
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
					{label: 'Version', name:'workflow_version_id', enabled: false,options:versions,type:'select', value_key:'id',label_key:'label',after:'<i class="fa fa-pencil" id="version"></i>'},
					{label: 'Name', name:'name', required: true},
					// {label: 'Workflow', name:'workflow_name', enabled: false,parseable:false,value:},
					{label: 'Slug', name:'slug', required: true},
					{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
					{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
					{label: 'Workflow', name:'workflow_id', required: true, type:'hidden'},
					{name: 'workflow', type:'hidden'},
					{name: 'id', type:'hidden'}
				],attributes:data, actions:false, name:'main'})

				var valueField = {columns:8,name:'value',label:"Value",title:'Value <span class="text-success pull-right">{{value}}</span>'}
				data.configuration = data.configuration||{}
				r_options = {data:{suppress_emails:data.configuration.suppress_emails,suppress_email_tasks:data.configuration.suppress_email_tasks,encrypted:data.configuration.encrypted,initial:data.configuration.initial,title:data.configuration.title,map:_.map(data.workflow.code.map,function(resource){
					var r = _.find(data.configuration.map,{name:resource.name});
					if(typeof r !== 'undefined' && r.type == resource.type){
						resource.value = r.value;
					}
					// resource.value = (_.find(data.configuration.map,{name:resource.name})||{value:''}).value 
					return resource;
				})}, actions:[],fields:[
					{columns:6,name:"initial",label:"Initial State", options:_.pluck(data.version.code.flow,'name'), type:"smallcombo"},
					{columns:6,name:"title",label:"Title",placeholder:data.workflow.name},
                    {columns:6,name:"suppress_emails",title:'Suppress Default Emails{{#value}}<div class="text-danger">Default emails will not be sent</div>{{/value}}{{^value}}<div class="text-success">Default emails will be sent</div>{{/value}}',type:"switch",inline:false},
                    {columns:6,name:"suppress_email_tasks",title:'Suppress Email Tasks{{#value}}<div class="text-danger">Custom emails (from email "Tasks") will not be sent</div>{{/value}}{{^value}}<div class="text-success">Custom emails (from email "Tasks") will be sent</div>{{/value}}',type:"switch",inline:false},
                    {name:"encrypted",title:'Encrypt Data at Rest{{#value}}<div class="text-danger">Data will be encrypted at rest</div>{{/value}}{{^value}}<div class="text-success">Data will NOT be encrypted at rest</div>{{/value}}',type:"switch",inline:false},
					// {name:"emails",label:false, type:"fieldset",show:[{type:"matches",name:"suppress_emails",value:true}],fields:[
					// 	{name:"actor",label:"Actor",type:"checkbox",value:true,columns:3},
					// 	{name:"owner",label:"Owner",type:"checkbox",value:true,columns:3},
					// 	{name:"assignee",label:"Assignee",type:"checkbox",value:true,columns:3}
					// ]},
					
					{name:"map",label:false,array:{min:data.workflow.code.map.length,max:data.workflow.code.map.length},type:"fieldset",fields:[
						{name:"name",label:false, columns:8,type:"output",format:{value:'<h4>{{value}} <span class="text-muted pull-right">({{parent.initialValue.type}})</span></h4>'}},

						{columns:0,name:"type",label:false,edit:false},
						_.extend({show:[{type:"matches",name:"type",value:"string"}]},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"user"}],type:"user"},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"email"}],type:"user_email"},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"group"}],type:"group"},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"endpoint"}],type:"select",options:'/api/groups/'+data.group_id+'/endpoints',format:{label:"{{name}}",value:"{{id}}"}},valueField),
					]}
				]}
				map = new gform(r_options,'#map .col-sm-9');
					// $('#map .col-sm-9').berry({name:'map', actions:false,attributes: {},fields:[
					// 	{name:'container', label: false,  type: 'fieldset', fields:[

					// 		{"multiple": {"duplicate": false},label: '', name: 'map', type: 'fieldset', fields:[
					// 			{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
					// 			{name: 'endpoint',label:false,columns:8, type: 'select',default: {name:'None', value:'none'}, choices: '/api/groups/'+data.group_id+'/endpoints'},
					// 			{label:false, name: 'name',columns:0, type:'hidden'}
					// 		]}
					// 	]},
					// ]} ).on('change',function(item, b, c){
					// 	var item = Berries.map.findByID(item.id)
					// 	var url = '';
					// 	url += (_.findWhere(Berry.collection.get('/api/groups/'+this.group_id+'/endpoints'),{id:parseInt(item.value)})||{config:{url:''} }).config.url;
					// 	url+=(_.findWhere(this.workflow.code.map,{name:item.parent.children.name.instances[1].value})||{path:''}).path				
					// 	item.update({help:url, value:item.value}, true)
					// }.bind(data))
				// }
				if(typeof data.workflow.code.resources !== 'undefined' && data.workflow.code.resources.length && data.workflow.code.resources[0].name !== '') {	
					$('#resourcestab').show();
					var attributes = _.map(data.workflow.code.resources,function(resource){
						resource.endpoint = (_.find(this.resources,{name:resource.name}) ||{endpoint:'none'}).endpoint
						return resource
					}.bind({resources:data.configuration.resources}))

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
						url+=(_.findWhere(this.workflow.code.resources,{name:item.parent.children.name.instances[1].value})||{path:''}).path				
						item.update({help:url, value:item.value}, true)
					}.bind(data))
				}


				$('#save').on('click',function(){
					var item = Berries.main.toJSON();

					// if(typeof map !== 'undefined') {
						item.configuration = map.toJSON();
					// }					
					if(typeof Berries.resources !== 'undefined') {
						item.configuration.resources = Berries.resources.toJSON().resources;
					}
					$.ajax({url: '/api/workflowinstances/'+item.id, type: 'PUT', 
					dataType : 'json',
					contentType: 'application/json',
					// data: JSON.stringify(data),
					data: JSON.stringify(item), success:function(){
							toastr.success('', 'Successfully updated Workflow Instance')
						}.bind(this),
						error:function(e) {
							toastr.error(e.statusText, 'ERROR');
						}
					});
				})
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




