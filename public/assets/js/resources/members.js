var url= '/api/groups/'+resource_id+'/'+route;
$('.navbar-header .nav a h4').html('Members');
$('[href="/admin/groups"]').parent().addClass('active');

$.ajax({
	url: url,
	success: function(data) {
		tableConfig.schema = [
			{label: 'User', name:'user_id', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}'},
			// {name:'user', type:'hidden'}
		];
		tableConfig.data = data;
		tableConfig.add = function(model){
			if(!model.owner.find({user_id:parseInt(model.attributes.user_id)}).length){
				$.ajax({url: '/api/groups/'+resource_id+'/members/'+model.attributes.user_id, type: 'POST', data: model.attributes,
					success:function(data){
						this.set(data);
						this.owner.draw();
						toastr.success('', 'Member successfully Added')
					}.bind(model),
					error:function(e){
						this.delete();
						this.owner.draw();
						toastr.error(e.statusText, 'ERROR');
					}.bind(model)
				});
			}else{
				toastr.error('Member already exists', 'Duplicate')
				model.delete();
				model.owner.draw();
			}
		};
		tableConfig.edit = false,
		tableConfig.delete = function(model){
				$.ajax({url: '/api/groups/'+resource_id+'/members/'+model.attributes.user_id, type: 'DELETE',
					success:function(){
						toastr.success('', 'Member successfully Removed')
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
			,
			{'name': 'export', 'label': '<i class="fa fa-file"></i> Export', 
				callback: function(collection){
					$.get('/api/groups/'+resource_id+'/members?all',function(data){
						_.csvify(data,[
							{label:"ID",name:"unique_id"},
							{label:"First Name",name:"first_name"},
							{label:"Last Name",name:"last_name"},
							{label:"Email",name:"email"}
						],group.name)
					})
				}, global: true
			}
		]

		$('body').on('click','.list-group-item.user', function(e){
			// _.find(Berries.user_search.fields.results.options,{id:parseInt(e.currentTarget.dataset.id)})
			bt.add({user_id:e.currentTarget.dataset.id})
			Berries.user_search.trigger('close');
		})

		bt = new berryTable(tableConfig)

	}
});