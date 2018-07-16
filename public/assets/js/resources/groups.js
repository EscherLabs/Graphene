$('.navbar-header .nav a h4').html('Groups');
$.ajax({
	url: url,
	success: function(data) {
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},        
			{label: 'Slug', name:'slug', required: true},
			{name: 'id', type:'hidden'}
		];
		tableConfig.events = [
			{'name': 'config', 'label': '<i class="fa fa-lock"></i> Admins', callback: function(model){
				window.location.href = '/admin/groups/'+model.attributes.id+'/admins'
			}},
			{'name': 'resources', 'label': '<i class="fa fa-users"></i> Members', callback: function(model){
				window.location.href = '/admin/groups/'+model.attributes.id+'/members'
			}},
			{'name': 'composites', 'label': '<i class="fa fa-puzzle-piece"></i> Composites', callback: function(model){
				window.location.href = '/admin/groups/'+model.attributes.id+'/composites'
			}},
			{'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){

				var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)

				// tempdata = _.sortBy(tempdata, 'order');
				mymodal = modal({title: "Sort Groups", content: templates.sortlist.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});

				Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});

			}, global: true}
		]
		tableConfig.defaultSort = 'order';

		$('body').on('click','.save-sort',function(){
			// console.log(_.map($('#sorter').children(),function(item,index){return {key:item.dataset.id,index:index}}))
		$.ajax({
			url: '/api/groups/order',
			type: 'POST',
			data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
			success: function(data) {
				toastr.success('', 'Order successfully updated')
				mymodal.ref.modal('hide')
			}
		})
		})
		tableConfig.data = data;
		tableConfig.click = function(model){window.location.href = '/admin/groups/'+model.attributes.id};

		tableConfig.name = "groups";

		bt = new berryTable(tableConfig)
	}
});