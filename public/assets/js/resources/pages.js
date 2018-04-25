
// initializers['pages'] = function(){

		$('.navbar-header .nav a h4').html('Pages');
		
		$.ajax({
			url: url,
			success: function(data){
				tableConfig.schema = [
					{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
					{label: 'Name', name:'name', required: true},
					{label: 'Slug', name:'slug', required: true},
					{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
					{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },				
					{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
					{name: 'id', type:'hidden'}
				];
				tableConfig.click = function(model){window.location.href = '/page/'+model.attributes.group_id+'/'+model.attributes.slug};


				if(resource_id !== ''){
					tableConfig.schema[0].enabled = false;
					tableConfig.schema[0].value = resource_id;
					tableConfig.events = [
						{'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort', callback: function(collection){

							var tempdata = _.map(collection, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)

							// tempdata = _.sortBy(tempdata, 'order');
							mymodal = modal({title: "Sort Pages", content: templates.listing.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});

							Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
		

						}, global: true}
					]
				}


				$('body').on('click','.save-sort',function(){
					$.ajax({
						url: '/api/pages/order/'+resource_id,
						type: 'POST',
						data:{order:_.map($('#sorter').children(),function(item,index){return {id:item.dataset.id,index:index}})},
						success: function(data) {
							toastr.success('', 'Order successfully updated')
							mymodal.ref.modal('hide')
						}
					})
				})
				tableConfig.defaultSort = 'order';

				tableConfig.data = data;
				tableConfig.name = "pages";
				tableConfig.multiEdit = ['unlisted', 'public', 'group_id'];
				bt = new berryTable(tableConfig)
			}
		});
// }