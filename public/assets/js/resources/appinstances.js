$('.navbar-header .nav a h4').html('App Instances');
composites = _.map(group.composites,function(item){ return item.group})

$.ajax({
	url: url,
	success: function(data) {
		tableConfig.schema = [
			{label: 'Group', name:'group_id', required: true, type:'select',enabled:false, choices: '/api/groups?limit=true'},
			{label: 'App', name:'app_id', template:'{{attributes.app.name}}',type:'raw'},
			{label: 'Version', name:'app_version_id', type:'hidden'},
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
			{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
			{name: 'app', type:'hidden'},
			{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}},
			{label: 'Limit Composite Groups', name: 'limit', type: 'checkbox', show:  {matches:{name:'public', value: 0},test: function(form){return composites.length >0;}} },
			{label: 'Composites', legend: 'Composites', name:'composites', type:'fieldset', 'show': {
					matches: {
						name: 'limit',
						value: true
					}
				},fields:[
					{label: false, multiple:{duplicate:true}, type:'fieldset', toArray:true, name: 'composite', fields:[
						{label: false, name: 'groups', type: 'select', options: composites}
					]}
						// {label: false, name: 'ids', type: 'select', options: composites}
				],
				template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
			},
			{name: 'id', type:'hidden'}
		];
		tableConfig.click = function(model){window.location.href = '/admin/appinstances/'+model.attributes.id};
		tableConfig.data = _.map(data,function(item){ item.composites = {composite:{groups:item.groups||[]}};item.limit = !!(item.groups||[]).length; return item;});				
		tableConfig.name = "appinstances";
		tableConfig.events = [
			{'name': 'version', 'label': '<i class="fa fa-cogs"></i> Version', callback: function(model){
				$.ajax({
					url: '/api/apps/'+model.attributes.app_id+'/versions',
					success: function(data) {
						console.log(data);
						data.unshift({id:0,label:'Latest Stable'})
						data.unshift({id:-1,label:'Latest (working or stable)'})
						$().berry({attributes:model.attributes,m:model,legend:'Select Version',fields:[
								{label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
						]}).on('save',function(){
							// model.attributes.app_version_id = this.toJSON().version;
							var temp = $.extend(true,{},this.options.m.attributes,this.toJSON());
							// temp.app_version_id = parseInt(temp.app_version_id);
							this.options.m.set(temp);
							this.options.m.owner.options.edit(this.options.m);
							this.options.m.owner.draw();
							this.trigger('close');
						})
					}
				})
			}}

		]
		if(resource_id !== ''){
			debugger;
			tableConfig.schema = [
				{label: 'Group', name:'group_id',value:resource_id, type:'select', choices: '/api/groups?limit=true', enabled:false},
				{label: 'App', name:'app_id', type:'select', choices:'/api/apps/group/'+resource_id},
				{label: 'Version', name:'app_version_id', type:'hidden'},
				{label: 'Name', name:'name', required: true},
				{label: 'Slug', name:'slug', required: true},
				{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
				{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
				{name: 'app', type:'hidden'},
				{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}},
				{label: 'Limit Composite Groups', name: 'limit', type: 'checkbox', show:  {matches:{name:'public', value: 0},test: function(form){return composites.length >0;}} },
				{label: 'Composites', legend: 'Composites', name:'composites', type:'fieldset', 'show': {
						matches: {
							name: 'limit',
							value: true
						}
					},fields:[
						{label: false, multiple:{duplicate:true}, type:'fieldset', toArray:true, name: 'composite', fields:[
							{label: false, name: 'groups', type: 'select', options: composites}
						]}
							// {label: false, name: 'ids', type: 'select', options: composites}
					],
					template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
				},
				{name: 'id', type:'hidden'}
			];
			tableConfig.events.push({'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){
				var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)
				// tempdata = _.sortBy(tempdata, 'order');
				mymodal = modal({title: "Sort App Instances", content: templates.listing.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
				Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
			}, global: true})


			tableConfig.add = function(model){
				model.attributes.groups = JSON.stringify(_.map(model.attributes.composites.composite.groups, function(item){return parseInt(item)}));
				if(!model.attributes.limit){
					model.attributes.groups = null;
				}
				$.ajax({url: api, type: 'POST', data: model.attributes,
				success:function(data) {
					data.composites = {composite:{groups:data.groups}};
					debugger;
					data.limit = !!(data.groups||[]).length;
					model.set(data);
					// Berries.modal.trigger('close')
					toastr.success('', 'Successfully Added')
				}.bind(model),
				error:function(e) {
					toastr.error(e.statusText, 'ERROR');
				}
			});}
			tableConfig.edit = function(model){
				model.attributes.groups = JSON.stringify(_.map(model.attributes.composites.composite.groups, function(item){return parseInt(item)}));
				if(!model.attributes.limit){
					model.attributes.groups = null;
				}
				$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
				success:function(data) {
					data.composites = {composite:{groups:data.groups}};
					debugger;
					data.limit = !!(data.groups||[]).length;
					model.set(data);
					toastr.success('', 'Successfully Updated')
				},
				error:function(e) {
					toastr.error(e.statusText, 'ERROR');
				}
			});}
		}else{
			tableConfig.add = false;
			tableConfig.hasEdit = false;
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