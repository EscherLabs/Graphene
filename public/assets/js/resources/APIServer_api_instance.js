$('.navbar-header .nav a h4').html('API Instance');
url = "/api/proxy/"+slug+"/api_instances/"+resource_id;
api = url;
myapi = {};
$.ajax({
	url: url,		
	success: function(api){
		myapi = api;
		api.server = server;
		$('#table').html(templates.api_instance.render(api));
		$.ajax({
			url: '/api/proxy/'+slug+'/apis/'+api.api_id+'/versions',		
			success: function(versions){

				versions.unshift({id:0,label:'Latest Published'})
				versions.unshift({id:-1,label:'Latest (Working or Published)'})
				$('.main').berry({
					name:'main',
					attributes:api,
					"flatten": true,			
					actions:false,
					fields:[
						{label: 'Name', name:'name', required: true},
						{label: 'Slug', name:'slug', required: true},
						{label: 'Environment', name:'environment_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/environments',label_key:'name',value_key:'id'},
						
						{label: 'API', name:'api_id',type:'select', enabled: false,choices:'/api/proxy/'+slug+'/apis',label_key:'name',value_key:'id'},
						{label: 'API Version', name:'api_version_id', enabled: false,type:'select',options:versions,label_key:'label',value_key:'id'},			
					]})
				if(api.api_version.resources.length >1 || api.api_version.resources[0].name.length){
					$('.resources').berry({
						name: 'resources',
						attributes: _.merge(api,api.api_version),
						"flatten": true,			
						actions:false,
						
						fields:[
							{name:'container', label: false,  type: 'fieldset', fields:[
								{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
									{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
									{name: 'resource',label:false,columns:8, type: 'select', choices: '/api/proxy/'+slug+'/resources'},
									{label:false, name: 'name',columns:0, type:'hidden'}
								]}
							]},			
					]
					})
				}else{
					$('#resourcestab').hide();
				}

		var routes_partials = []
		_.map(_.pluck(api.api_version.routes,'path'),function(item){
			var thisTemp = '';
			var parts = item.split('/')
			for (var i = 0, len = parts.length; i < len; i++) {
				if(parts[i]!== '*'){
					// if((i+1)<len){
					// thisTemp += parts[i]+'/';
					// }else{
						thisTemp += parts[i]
					// }
					routes_partials.push(thisTemp);	
					// routes_partials.push({value:thisTemp,label:thisTemp+'*'});	

					thisTemp += '/';			
				}		
			}
		})
		routes_partials = _.map(_.uniq(routes_partials),function(item){
			return {value:item,label:item+'*'}
		})

		var options = {
			container: '.permissions',
		// inlineEdit:true,
		// filter: false,
		// sort: false,
		// search: false,
		// columns: false,
		// upload:false,
		// download:false,
		// autoSize: 10,
		// multiEdit:['berry_id', 'status'],
		title:'Permissions',
		edit:true,
		// editComplete:function(models){

		// 	console.log(models)
		// },
		add: true,
		// click: function(model){
		// 	model.toggle();
		// },
		name:"permissions",
		delete:true,
		// entries:[2,5,10],
		// count:10000,
		// defaultSort: 'order',
		// onSort: function(){

		// },

		preDraw: function(model){
			// model.stuff = 'yippe';
		},
		events:[
			{'name': 'params', 'label': '<i class="fa fa-info"></i> Parameters', callback: function(model){
				$().berry({
					name:'param_form',
					attributes:model.attributes,
					legend:'Parameters',
					fields:[
						
						{
							"name": "parameters",
							"label": false,
							"fields": {
								"params": {
									"label": false,
									"multiple": {
										"duplicate": true
									},
									fields:[
									{'name':'name','label':'Name',"inline":true,columns:6},
										{'name':'value','label':'Value',"inline":true,columns:6},
									]
								}
							}
						}
					]
					}).on('save',function(){
						var temp = this.attributes;
						temp.params = Berries.param_form.toJSON().params
						this.set(temp)
						this.owner.draw();

						Berries.param_form.trigger('close')
						
						// model.update
					}.bind(model))
			}, multiEdit: false},
	
		],
		schema:[
			{name: 'api_user',label:'Auth User', type: 'select', choices: '/api/proxy/'+slug+'/api_users',label_key:'app_name'},
							{label:'Path', name: 'route', type:'select', options:routes_partials},
							{label: 'Verb',name:'verb',type:'select',options:["ALL", "GET", "POST", "PUT", "DELETE"], required:true},
							{label:'Params',show:false,name:'params',template:'{{#attributes.params}}<b>{{name}}</b>:{{ value }}<br>{{/attributes.params}}'}
		], data: api.route_user_map}

		bt = new berryTable(options)
		// $('.permissions').berry({
		// 	// legend:'Permissions',
		// 	name:'permissions',
		// 	attributes:api,
		// 	"flatten": false,
		// 	actions:false,
		// 	fields:[
		// 		{name:'container', label: false,  type: 'fieldset', fields:[
		// 			{"multiple": {"duplicate": true},label: '', name: 'route_user_map', type: 'fieldset', fields:[
		// 				{name: 'api_user',label:'Auth User', type: 'select', choices: '/api/proxy/'+slug+'/api_users',label_key:'app_name'},
		// 				{label:'Path', name: 'route', options:_.uniq(routes_partials)},
		// 				{label: 'Verb',name:'verb',type:'select',options:["ALL", "GET", "POST", "PUT", "DELETE"], required:true},
		// 				{
		// 					columns:6,
		// 					offset:4,
		// 					"name": "parameters",
		// 					"label": "Parameters",
		// 					"template":'{{#attributes.params}}{{#required}}<b>{{/required}}{{name}}{{#required}}</b>{{/required}}<br> {{/attributes.params}}',
		// 					"fields": {
		// 						"params": {
		// 							"label": false,
		// 							"flatten": true,
									
		// 							"multiple": {
		// 								"duplicate": true
		// 							},
		// 							fields:[
		// 								{'name':'name','label':'Name',"inline":true,columns:6},
		// 								{'name':'value','label':'Value',"inline":true,columns:6},
		// 							]
		// 						}
		// 					}
		// 				}
		// 			]}
		// 		]},			
		// 	]
		// 	})

			$('body').on('click','#version', function(){
				$().berry({name:'versionForm',attributes:api,legend:'Select Version',fields:[
						{label: 'Version', name:'api_version_id', required:true, options:versions,type:'select', value_key:'id',label_key:'label'},
				]}).on('save',function(){

					$.ajax({url: url, type: 'PUT', data: Berries.versionForm.toJSON(),
					success:function(data) {
						window.location.reload(true);
					},
					error:function(e) {
						toastr.error(e.statusText, 'ERROR');
					}
				});
				},this)
			})	

		}});




		$('#save').on('click',function(){
			if(_.findWhere(Berry.collection.get('/api/proxy/'+slug+'/environments'),{id:myapi.environment_id}).type !== 'prod' || confirm('CAUTION: You are about to make updates in a production environment.\n\nWould you like to proceed?')){

        $().berry({legend:'Update Comment', fields:[{name:'comment',label:'Comment',required:true}]}).on('save',function(){
				api.comment = this.toJSON().comment;
				$.extend(api,Berries.main.toJSON());
				if(typeof Berries.resources !== 'undefined'){
					api.resources =  Berries.resources.toJSON().resources;
				}
				// var temp = Berries.permissions.toJSON().container.route_user_map;
				// api.route_user_map = _.each(temp,function(item){
				// 	item.params = item.parameters.params;
				// 	delete item.parameters;
				// })
				api.route_user_map = _.pluck(bt.models,'attributes')
				
				
				$.ajax({url: url, type: 'PUT', data: api, success:function(){
						toastr.success('', 'Successfully updated API Instance')
					}.bind(this),
					error:function(e) {
						toastr.error(e.statusText, 'ERROR');
					}
				});
				this.trigger('close')
			})






			}
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