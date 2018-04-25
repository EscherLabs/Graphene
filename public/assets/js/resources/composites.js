// initializers['composites'] = function() {
		// $('.navbar-header .nav a h4').html('Group Composites');
		
		var url= '/api/groups/'+resource_id+'/'+route;
		$('.navbar-header .nav a h4').html('Group Composites');

		$.ajax({
			url: url,
			success: function(data) {
				tableConfig.schema = [
					{label: 'Group', name:'composite_group_id', required: true, type:'select', choices: '/api/groups?limit=true', label_key:'composite_group_id'}
				];
				tableConfig.data = data;
				tableConfig.add = function(model){
					if(!model.owner.find({user_id:parseInt(model.attributes.composite_group_id)}).length){
						$.ajax({url: '/api/groups/'+resource_id+'/composites/'+model.attributes.composite_group_id, type: 'POST', data: model.attributes,
							success:function(data){
								toastr.success('', 'Composite successfully Added')
							}.bind(model),
							error:function(e){
								this.delete();
								this.owner.draw();
			                    toastr.error(e.statusText, 'ERROR');
							}.bind(model)
						});
					}else{
						toastr.error('Composite already exists', 'Duplicate')
						model.delete();
						model.owner.draw();
					}
				},
				tableConfig.edit = false,
				tableConfig.delete = function(model){
						$.ajax({url: '/api/groups/'+resource_id+'/composites/'+model.attributes.composite_group_id, type: 'DELETE',
							success:function(){
								toastr.success('', 'Composite successfully Removed')
							},
							error:function(e){
			                    toastr.error(e.statusText, 'ERROR');
							}
						});
				}
				bt = new berryTable(tableConfig)
			}
		});
// }