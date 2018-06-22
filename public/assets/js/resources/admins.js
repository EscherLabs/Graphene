var url= '/api/groups/'+resource_id+'/'+route;
$('.navbar-header .nav a h4').html('Admins');

$.ajax({
	url: url,
	success: function(data) {
		tableConfig.schema = [
			{label: 'User', name:'user_id', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}'},

					{name:'apps_admin',label:'Application Admin',type: 'checkbox',truestate:1,falsestate:0 },
					{name:'content_admin',label:'Content Admin',type: 'checkbox',truestate:1,falsestate:0 }
			// {name:'user', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.add = function(model){
			if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
				$.ajax({url: '/api/groups/'+resource_id+'/admins/'+model.attributes.user_id, type: 'POST', data: model.attributes,
					success:function(data){
						this.set(data);
						this.owner.draw();
						toastr.success('', 'Admin successfully Added')
					}.bind(model),
					error:function(e){
						this.delete();
						this.owner.draw();
						toastr.error(e.statusText, 'ERROR');
					}.bind(model)
				});
			}else{
				toastr.error('Admin already exists', 'Duplicate')
				model.delete();
				model.owner.draw();
			}
		},
		tableConfig.edit = false,
		tableConfig.delete = function(model){
				$.ajax({url: '/api/groups/'+resource_id+'/admins/'+model.attributes.user_id, type: 'DELETE',
					success:function(){
						toastr.success('', 'Admin successfully Removed')
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
			}},
			{'name': 'content', 'label': '<i class="fa fa-lock"></i> Admin Types', 'global': false, callback: function(model){
				$().berry({
				name:'types',
				legend: '<i class="fa fa-page"></i> Admin Types',
				attributes: model.attributes,
				fields:[
					// {name:'apps_admin',label:'Application Admin',type: 'checkbox'},
					// {name:'content_admin',label:'Content Admin',type: 'checkbox'}
				
					{name:'apps_admin',label:'Application Admin',type: 'checkbox',truestate:1,falsestate:0 },
					{name:'content_admin',label:'Content Admin',type: 'checkbox',truestate:1,falsestate:0 }
				]}).on('save', function(){
					var types = Berries.types.toJSON();


					$.ajax({url: '/api/groups/'+resource_id+'/admins/'+this.attributes.user_id, type: 'POST', data: $.extend({},this.attributes,types),
						success:function(data){
							this.set(data);
							this.owner.draw();
							Berries.types.trigger('close');
							toastr.success('', 'Admin successfully Added')
						}.bind(model),
						error:function(e){
							this.delete();
							this.owner.draw();
							toastr.error(e.statusText, 'ERROR');
						}.bind(model)
					});





					debugger;
				}, model)
			}},
		]
		$('body').on('click','.list-group-item.user', function(e){
			bt.add({user_id:e.currentTarget.dataset.id})
			Berries.user_search.trigger('close');
		})

		bt = new berryTable(tableConfig)
	}
});