composites = _.map(group.composites,function(item){ return item.group})
$('.navbar-header .nav a h4').html('Pages');
$.ajax({
	url: url,
	success: function(data){
		tableConfig.schema = [
			{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
			{label: 'Name', name:'name', required: true},
			{label: 'Slug', name:'slug', required: true},
			{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
			{label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },				
			{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
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
				template:'{{#attributes.composites.composite}}{{groups}}{{/attributes.composites.composite}}'
			},
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


			tableConfig.add = function(model){
				model.attributes.groups = JSON.stringify(_.map(model.attributes.composites.composite.groups, function(item){return parseInt(item)}));
				if(!model.attributes.limit){
					model.attributes.groups = '[]';
				}
				$.ajax({url: api, type: 'POST', data: model.attributes,
				success:function(data) {
					data.composites = {composite:{groups:data.groups}};
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
					model.attributes.groups = '[]';
				}
				$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
				success:function(data) {
					data.composites = {composite:{groups:data.groups}};
					data.limit = !!(data.groups||[]).length;
					model.set(data);
					toastr.success('', 'Successfully Updated')
				},
				error:function(e) {
					toastr.error(e.statusText, 'ERROR');
				}
			});}

		}else{
			tableConfig.edit = false;
			tableConfig.add = false;
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
		tableConfig.data = _.map(data,function(item){ item.composites = {composite:{groups:item.groups||[]}};item.limit = !!(item.groups||[]).length; return item;});				
		tableConfig.name = "pages";
		tableConfig.multiEdit = ['unlisted', 'public', 'group_id'];
		bt = new berryTable(tableConfig)
	}
});