$('.navbar-header .nav a h4').html('Service Instance');
// url = "/admin/apiserver/fetch/service_instances";
url = "/api/proxy/"+slug+"/service_instances/"+resource_id;
api = url;
$.ajax({
	url: url,		
	success: function(service){

		$('#table').html(templates.service_instance.render(service));
		$.ajax({
			url: "/api/proxy/"+slug+"/service_versions/"+service.service_version_id,		
			success: function(version){
				$('.main').berry({
					// legend:'Main',
					name:'main',
					attributes:service,
					"flatten": true,			
					actions:false,
					fields:[
				{label: 'Name', name:'name', required: true},
				{label: 'Slug', name:'slug', required: true},
				{label: 'Environment', name:'environment_id', required: true,type:'select',choices:'/api/proxy/'+slug+'/environments',label_key:'name',value_key:'id'},
				
				{label: 'Service', name:'service_id',type:'select', enabled: false,choices:'/api/proxy/'+slug+'/services',label_key:'name',value_key:'id'},
				{label: 'Service Version', name:'service_version_id', enabled: false,type:'select',choices:'/api/proxy/'+slug+'/service_versions',label_key:'summary',value_key:'id'},			
					]})

				$('.resources').berry({
					// legend:'Map',
					name:'resources',
					attributes:service,
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

						// {
						// 	"name": "resources",
						// 	"label": false,
						// 	"fields": {
						// 	"resource": {
						// 		"label": false,
						// 		"multiple": {
						// 		"duplicate": false
						// 		},
						// 		fields:[
						// 		// {'name':'name','label':'Name',"inline":true,columns:8},
						// 		// {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
						// 		]
						// 	}
							
						// 	}
						// }				
				]
				})
				// .on('saved',function(){
				// 	// this.set(Berries.map.toJSON())			
				// 	this.owner.options.edit(this);
				// 	this.owner.draw();
				// }.bind(model))






		var routes_partials = []
		_.map(_.pluck(version.routes,'path'),function(item){
			var thisTemp = '';
			var parts = item.split('/')
			for (var i = 0, len = parts.length; i < len; i++) {
				if(parts[i]!== '*'){
					thisTemp += parts[i]+'/';
					routes_partials.push(thisTemp+'*');				
				}		
			}
		})



		$('.permissions').berry({
			// legend:'Permissions',
			name:'permissions',
			attributes:service,
			"flatten": false,
			actions:false,
			fields:[
				{name:'container', label: false,  type: 'fieldset', fields:[
					{"multiple": {"duplicate": true},label: '', name: 'route_user_map', type: 'fieldset', fields:[
						{name: 'api_user',label:'Auth User', type: 'select', choices: '/api/proxy/'+slug+'/api_users',label_key:'app_name'},
						{label:'Path', name: 'route', options:_.uniq(routes_partials)},
						{label: 'Verb',name:'verb',type:'select',options:["ALL", "GET", "POST", "PUT", "DELETE"], required:true},
						{
							columns:6,
							offset:4,
							"name": "parameters",
							"label": "Parameters",
							"template":'{{#attributes.params}}{{#required}}<b>{{/required}}{{name}}{{#required}}</b>{{/required}}<br> {{/attributes.params}}',
							"fields": {
								"params": {
									"label": false,
									"flatten": true,
									
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
					]}
				]},			
			]
			})
			// .on('saved',function(){
			// 	// this.set(Berries.map.toJSON())	
			// 	debugger;		
			// 	this.owner.options.edit(this);
			// 	this.owner.draw();
			// }.bind(model))




		}});


		$('#save').on('click',function(){
			$.extend(service,Berries.main.toJSON());
			service.resources =  Berries.resources.toJSON().resources;
			var temp = Berries.permissions.toJSON().container.route_user_map;
			service.route_user_map = _.each(temp,function(item){
				item.params = item.parameters.params;
				delete item.parameters;
			})
			// service.route_user_map = Berries.permissions.toJSON().container.route_user_map;
			
			// debugger;
			$.ajax({url: url, type: 'PUT', data: service, success:function(){
					toastr.success('', 'Successfully updated Service Instance')
				}.bind(this),
				error:function(e) {
					toastr.error(e.statusText, 'ERROR');
				}
			});

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