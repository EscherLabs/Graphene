// initializers['developers'] = function() {
		$('.navbar-header .nav a h4').html('Developers');
		$.ajax({
			url: '/api/apps/'+resource_id+'/'+route,
			success: function(data) {
				tableConfig.schema = [
					{label: 'User', name:'id', type:'select', template:'{{attributes.first_name}} {{attributes.last_name}} - {{attributes.email}}'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({id:parseInt(model.attributes.id)}).length){
						$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Developer successfully Added')
								this.set(data);
								this.owner.draw();
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Developer already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/apps/'+resource_id+'/developers/'+model.attributes.id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Developer successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				tableConfig.events = [
					{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){
					$().berry({
						name:'user_search',
						actions:['cancel'],
						legend: 'User Search',
						fields:[
							{name:'query',label:'Search'},
							{type:'raw',value:'',name:'results',label:false}
						]}).delay('change:query',function(){
							$.ajax({
								url: '/api/users/search/'+this.toJSON().query,
								success: function(data) {
									this.fields.results.update({/*options:data,*/value:templates['user_list'].render({users:data})})
								}.bind(this)
							})
						})
					}}
				]

				$('body').on('click','.list-group-item.user', function(e){
					bt.add({id:e.currentTarget.dataset.id})
					Berries.user_search.trigger('close');
				})
				bt = new berryTable(tableConfig)
			}
		});
// }
