
$('.navbar-header .nav a h4').html('Workflow Instances');
$('[href="/admin/groups"]').parent().addClass('active');
composites = _.map(group.composites,function(item){ return item.group})

getData([url,'/assets/data/icons.json','/api/groups','/api/workflows/group/'+resource_id], function(data,icons,groups,workflows){
	tableConfig.schema = [
			{label: 'Group', name:'group_id', required: true, type:'select',options:groups,format:{title:'{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{name}}",value:"{{id}}"}},
			{label: 'Workflow', name:'workflow_id',type:"select", options:workflows, format:{label:"{{name}}",value:function(e){return e.id}}},
			{label: 'Version', name:'workflow_version_id', type:'hidden'},
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Icon', name:'icon', type:'smallcombo',template:'<i class="{{attributes.icon}}"></i>',format:{
				title:'Icon <span class="pull-right"><i class="{{value}}"></i></span>',
				label:function(item){
					return item.name.replace(/(\r\n|\s)/gm, "");
				}, value:"{{value}}",template:'<i class="fa fa-{{value}}"></i>',display:'<span style = "text-transform:capitalize;"><i class="{{value}}"></i> {{{label}}}'}, options:icons,
				required: false},
			{label: 'List in page menu', name:'unlisted',value:0, type: 'checkbox',options:[{label:'No',value:true},{label:'Yes',value:false}]},				
			{name: 'workflow', type:'hidden'},
			{label: 'Limit Device', name: 'device',type:"select", format:{value:"{{index}}"},value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
			{label: 'Public', name:'public', type: 'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}], edit:  [{type:'matches',name:'limit', value: false}]},
			{label: 'Limit Composite Groups', name: 'limit',value:function(e){
				if(typeof e.form !== 'undefined' && !e.form.isActive){
					return (typeof e.form.options.data.groups !== 'undefined' && _.compact(e.form.options.data.groups).length>0);
				}else{
					return e.initial.value;
				}
			}, type: 'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}],template:"{{#attributes.groups.length}}Yes{{/attributes.groups.length}}{{^attributes.groups.length}}No{{/attributes.groups.length}}", show:  [{type:'matches',name:'public', value: false},{type:'test',test: function(form){return composites.length >0;}} ]},
			{label: 'Composites',get:function(e){
				debugger;
				if(this.visible){
					return gform.types[this.type].get.call(this);
				}
				else{
					return null;
				}
			}, legend: 'Composites',parse:true,array: {min:1,max:composites.length,duplicate:{copy:true}}, name: 'groups', type: 'select', options: composites,format:{label:"{{name}}",value:function(i){return i.id}},'show': [{type:"matches",name: 'limit',value: true}],validate:[{type:'unique',message:"Duplicate group"}]},
			{name: 'order', type:'hidden'},
			{name: 'id', type:'hidden'}
	];
	tableConfig.name = "workflowinstances"
	tableConfig.data = _.map(data,function(item){
		item.groups = item.groups||[];
		return item;
	});
	tableConfig.actions=[{'name':'delete'}]
	if(resource_id !== ''){
		tableConfig.schema[0].enabled = false;
		tableConfig.schema[0].value = resource_id;
		tableConfig.actions=tableConfig.actions.concat(['|',
			{'name':'edit',max:1},{'name':'version',max:1,min:1,'label': '<i class="fa fa-cogs"></i> Version'}
			,{'name':'report',max:1,min:1,'label': '<i class="fa fa-list-ol"></i> Report'}
			,{'name':'raw_data',max:1,min:1,'label': '<i class="fa fa-table"></i> Raw Data'}
			,'|',
			{'name':'create'},
			{'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'},
		])
	}
	// 			{'name': 'report', 'label': '<i class="fa fa-list-ol"></i> Report', callback: function(model){
// 				document.location = "/admin/workflowinstances/"+model.attributes.id+"/report";
//             }},
//             {'name': 'raw_data', 'label': '<i class="fa fa-table"></i> Raw Data', callback: function(model){
// 				document.location = "/admin/workflowinstances/"+model.attributes.id+"/raw";
// 			}}

	tableConfig.sortBy = 'order';
	grid = new GrapheneDataGrid(tableConfig).on('click',function(e){
		window.location = '/admin/appinstances/'+e.model.attributes.id;
	}).on('report',function(e){
		document.location = "/admin/workflowinstances/"+model.attributes.id+"/report"
	}).on('raw_data',function(e){
		document.location = "/admin/workflowinstances/"+e.model.attributes.id+"/raw";
	})
	.on('sort',function(e){
		var tempdata = _.map(e.grid.models, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)
		mymodal = modal({title: "Sort Pages", content: templates.sortlist.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
		Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
	}).on('model:version',function(e){
		$.ajax({
			url: '/api/apps/'+e.model.attributes.app_id+'/versions',
			success: function(e,data) {
				new gform({name:"version",data:e.model.attributes,legend:'Select Version',fields:[
					{label: 'Version', name:'app_version_id', required:true, options:[{type:'optgroup',options:[{id:null,label:'Latest (working or stable)'},{id:0,label:'Latest Stable'}]},{type:'optgroup',options:data}],type:'select', format:{value:function(e){return e.id;}}},
				]}).on('save',function(e,g){
					e.model.update(g.form.toJSON());
					e.model.owner.eventBus.dispatch('model:edited', e.model)
					e.model.owner.draw();
					g.form.trigger('close');
				}.bind(null, e)).on('cancel',function(e){e.form.trigger('close')}).modal()
			}.bind(null,e)
		})
	})
});













// $('.navbar-header .nav a h4').html('Workflow Instances');
// composites = _.map(group.composites,function(item){ return item.group})

// $.ajax({
// 	url: url,
// 	success: function(data) {
// 		tableConfig.schema = [
// 			{label: 'Group', name:'group_id', required: true, type:'select',enabled:false, choices: '/api/groups?limit=true'},
// 			{label: 'Workflow', name:'workflow_id', template:'{{attributes.workflow.name}}',type:'raw'},
// 			{label: 'Version', name:'workflow_version_id', type:'hidden'},
// 			{label: 'Name', name:'name', required: true},
// 			{label: 'Slug', name:'slug', required: true},
// 			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
// 			{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
// 			{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},			
// 			{name: 'workflow', type:'hidden'},
// 			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}},
// 			{label: 'Limit Composite Groups', name: 'limit', type: 'checkbox', show:  {matches:{name:'public', value: 0},test: function(form){return composites.length >0;}} },
// 			{label: 'Composites', legend: 'Composites', name:'composites', type:'fieldset', 'show': {
// 					matches: {
// 						name: 'limit',
// 						value: true
// 					}
// 				},fields:[
// 					{label: false, multiple:{duplicate:true}, type:'fieldset', toArray:true, name: 'composite', fields:[
// 						{label: false, name: 'groups', type: 'select', options: composites}
// 					]}
// 						// {label: false, name: 'ids', type: 'select', options: composites}
// 				],
// 				template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
// 			},
// 			{name: 'id', type:'hidden'}
// 		];
// 		tableConfig.click = function(model){window.location.href = '/admin/workflowinstances/'+model.attributes.id};
// 		tableConfig.data = _.map(data,function(item){ item.composites = {composite:{groups:item.groups||[]}};item.limit = !!(item.groups||[]).length; return item;});				
// 		tableConfig.name = "workflowinstances";
// 		tableConfig.events = [
// 			{'name': 'version', 'label': '<i class="fa fa-cogs"></i> Version', callback: function(model){
// 				$.ajax({
// 					url: '/api/workflows/'+model.attributes.workflow_id+'/versions',
// 					success: function(data) {
// 						console.log(data);
// 						data.unshift({id:0,label:'Latest Stable'})
// 						data.unshift({id:-1,label:'Latest (working or stable)'})
// 						$().berry({attributes:model.attributes,m:model,legend:'Select Version',fields:[
// 								{label: 'Version', name:'workflow_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
// 						]}).on('save',function(){
// 							// model.attributes.workflow_version_id = this.toJSON().version;
// 							var temp = $.extend(true,{},this.options.m.attributes,this.toJSON());
// 							// temp.workflow_version_id = parseInt(temp.workflow_version_id);
// 							this.options.m.set(temp);
// 							this.options.m.owner.options.edit(this.options.m);
// 							this.options.m.owner.draw();
// 							this.trigger('close');
// 						})
// 					}
// 				})
// 			}},
// 			{'name': 'report', 'label': '<i class="fa fa-list-ol"></i> Report', callback: function(model){
// 				document.location = "/admin/workflowinstances/"+model.attributes.id+"/report";
//             }},
//             {'name': 'raw_data', 'label': '<i class="fa fa-table"></i> Raw Data', callback: function(model){
// 				document.location = "/admin/workflowinstances/"+model.attributes.id+"/raw";
// 			}}
// 		]
// 		if(resource_id !== ''){
// 			tableConfig.schema = [
// 				{label: 'Group', name:'group_id',value:resource_id, type:'select', choices: '/api/groups?limit=true', enabled:false},
// 				{label: 'Workflow', name:'workflow_id', type:'select', choices:'/api/workflows/group/'+resource_id},
// 				{label: 'Version', name:'workflow_version_id', type:'hidden'},
// 				{label: 'Name', name:'name', required: true},
// 				{label: 'Slug', name:'slug', required: true},
// 				{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
// 				{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
// 				{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},				
// 				{name: 'workflow', type:'hidden'},
// 				{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}},
// 				{label: 'Limit Composite Groups', name: 'limit', type: 'checkbox', show:  {matches:{name:'public', value: 0},test: function(form){return composites.length >0;}} },
// 				{label: 'Composites', legend: 'Composites', name:'composites', type:'fieldset', 'show': {
// 						matches: {
// 							name: 'limit',
// 							value: true
// 						}
// 					},fields:[
// 						{label: false, multiple:{duplicate:true}, type:'fieldset', toArray:true, name: 'composite', fields:[
// 							{label: false, name: 'groups', type: 'select', options: composites}
// 						]}
// 							// {label: false, name: 'ids', type: 'select', options: composites}
// 					],
// 					template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
// 				},
// 				{name: 'id', type:'hidden'}
// 			];
// 			tableConfig.events.push({'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){
// 				var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.workflowly([],pageData)
// 				// tempdata = _.sortBy(tempdata, 'order');
// 				mymodal = modal({title: "Sort Workflow Instances", content: templates.sortlist.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
// 				Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
// 			}, global: true})


// 			tableConfig.add = function(model){
// 				model.attributes.groups = JSON.stringify(_.map(model.attributes.composites.composite.groups, function(item){return parseInt(item)}));
// 				if(!model.attributes.limit){
// 					model.attributes.groups = '';
// 				}
// 				$.ajax({url: api, type: 'POST', data: model.attributes,
// 				success:function(data) {
// 					data.composites = {composite:{groups:data.groups}};
// 					data.limit = !!(data.groups||[]).length;
// 					model.set(data);
// 					Berries.modal.trigger('close')
// 					toastr.success('', 'Successfully Added')
// 				}.bind(model),
// 				error:function(e) {
// 					toastr.error(e.statusText, 'ERROR');
// 				}
// 			});}
// 			tableConfig.edit = function(model){
// 				model.attributes.groups = JSON.stringify(_.map(model.attributes.composites.composite.groups, function(item){return parseInt(item)}));
// 				if(!model.attributes.limit){
// 					model.attributes.groups = '';
// 					model.attributes.composites = {composite:{groups:model.attributes.groups }};
// 				}
// 				$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
// 				success:function(data) {
// 					if(data.groups == null){
// 						data.groups = '';
// 					}
// 					data.composites = {composite:{groups:data.groups}};
// 					data.limit = !!(data.groups||[]).length;
// 					model.set(data);
// 					toastr.success('', 'Successfully Updated')
// 				},
// 				error:function(e) {
// 					toastr.error(e.statusText, 'ERROR');
// 				}
// 			});}
// 		}else{
// 			tableConfig.add = false;
// 			tableConfig.hasEdit = false;
// 		}


// 		$('body').on('click','.save-sort',function(){
// 			$.ajax({
// 				url: '/api/workflowinstances/order/'+resource_id,
// 				type: 'POST',
// 				data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
// 				success: function(data) {
// 					toastr.success('', 'Order successfully updated')
// 					mymodal.ref.modal('hide')
// 				}
// 			})
// 		})


// 		tableConfig.defaultSort = 'order';
// 		bt = new berryTable(tableConfig)
// 	}
// });