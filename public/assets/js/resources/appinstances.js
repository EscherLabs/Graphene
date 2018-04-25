// initializers['appinstances'] = function() {
			$('.navbar-header .nav a h4').html('App Instances');

			$.ajax({
				url: url,

			success: function(data) {
				tableConfig.schema = [
					{label: 'Group', name:'group_id', required: true, type:'select',enabled:false, choices: '/api/groups?limit=true'},
					{label: 'Name', name:'name', required: true},
					{label: 'Slug', name:'slug', required: true},
					{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
					{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'App', name:'app_id', template:'{{attributes.app.name}}',type:'raw'},
					{label: 'Version', name:'app_version_id', type:'hidden'},
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
								data.unshift({id:0,label:'Latest Stable'})
								data.unshift({id:-1,label:'Latest (working or stable)'})
								$().berry({attributes:model.attributes,m:model,legend:'Select Version',fields:[
										{label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
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
					tableConfig.schema = [
						{label: 'Group', name:'group_id',value:resource_id, type:'select', choices: '/api/groups?limit=true', enabled:false},
						{label: 'Name', name:'name', required: true},
						{label: 'Slug', name:'slug', required: true},
						{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
						{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
						{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
						{label: 'App', name:'app_id', type:'select', choices:'/api/apps/group/'+resource_id},
						{label: 'Version', name:'app_version_id', type:'hidden'},
						{name: 'app', type:'hidden'},
						{name: 'id', type:'hidden'}
					];
					tableConfig.events.push({'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){
						var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)
						// tempdata = _.sortBy(tempdata, 'order');
						mymodal = modal({title: "Sort App Instances", content: templates.listing.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
						Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
					}, global: true})
				}else{
					tableConfig.add = false;
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
// }