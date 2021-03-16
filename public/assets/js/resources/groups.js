$('.navbar-header .nav a h4').html('Groups');
getData(url, function(data){
	tableConfig.form = {fields:[
		{label: 'Name', name:'name', required: true},        
		{label: 'Slug', name:'slug', required: true},
		{name: 'order', type:'hidden'},
		{name: 'id', type:'hidden'}
	]};
	
	tableConfig.actions=[
		{'name':'delete'},'|',
		{'name':'edit',max:1},
		{'name': 'admins',max:1,min:1, 'label': '<i class="fa fa-lock"></i> Admins'},
		{'name': 'members',max:1,min:1, 'label': '<i class="fa fa-users"></i> Members'},
		{'name': 'composites',max:1,min:1, 'label': '<i class="fa fa-puzzle-piece"></i> Composites'},
		'|',
		{'name':'create'},
		{'name': 'sort',max:1, 'label': '<i class="fa fa-sort"></i> Sort'}

	]

	$('body').on('click','.save-sort',function(){
		$.ajax({
			url: '/api/groups/order',
			type: 'POST',
			data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
			success: function(data) {
				_.each(data,function(item){
					var temp = grid.find({id:parseInt(item.id)});
					if(typeof temp !== 'undefined' && temp.length){
					temp[0].update({order:item.index},true)
					}
				})
				toastr.success('', 'Order successfully updated')
				mymodal.ref.modal('hide')
				grid.state.set({sort:'order',reverse:true})
			}
		})
	})
	
	tableConfig.sortBy = 'order';
	tableConfig.data = data;
	tableConfig.name = "groups";

	grid = new GrapheneDataGrid(tableConfig).on('click',function(e){window.location.href = '/admin/groups/'+e.model.attributes.id}).on('model:admins',function(e){
		window.location.href = '/admin/groups/'+e.model.attributes.id+'/admins'
	}).on('model:members',function(e){
		window.location.href = '/admin/groups/'+e.model.attributes.id+'/members'
	}).on('model:composites',function(e){
		window.location.href = '/admin/groups/'+e.model.attributes.id+'/composites'
	}).on('sort',function(e){
		var tempdata = _.map(e.grid.models, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)
		mymodal = modal({title: "Sort Groups", content: templates.sortlist.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
		Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
	});
	
  })
