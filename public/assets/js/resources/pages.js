composites = _.map(group.composites,function(item){ return item.group})
// debugger;
$('.navbar-header .nav a h4').html('Pages');

getData([url,'/assets/data/icons.json','/api/groups'], function(data,icons,groups){

	tableConfig.schema = [
		{label: 'Group', name:'group_id', required: true, type:'select',edit:false,options:groups,format:{title:'{{{label}}}{{^label}}Group{{/label}} <span class="text-success pull-right">{{value}}</span>',label:"{{name}}",value:"{{id}}"}},
		{label: 'Name', name:'name', required: true},
		{label: 'Slug', name:'slug', required: true},
		{label: 'Icon', name:'icon', type:'smallcombo',template:'<i class="{{attributes.icon}}"></i>',format:{
			title:'Icon <span class="pull-right"><i class="{{value}}"></i></span>',
			label:function(item){
				return item.name.replace(/(\r\n|\s)/gm, "");
			}, value:"{{value}}",template:'<i class="fa fa-{{value}}"></i>',display:'<span style = "text-transform:capitalize;"><i class="{{value}}"></i> {{{label}}}'}, options:icons,
			required: false},


		{label: 'List in page menu', name:'unlisted',value:0, type: 'checkbox',options:[{label:'No',value:true},{label:'Yes',value:false}]},				
		{label: 'Limit Device', name: 'device',type:"select", format:{value:"{{index}}"},value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
		{label: 'Public', name:'public', type: 'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}], edit:  [{type:'matches',name:'limit', value: false}]},
		{label: 'Limit Composite Groups', name: 'limit',value:function(e){
			if(typeof e.form !== 'undefined' && !e.form.isActive){
				return (typeof e.form.options.data.groups !== 'undefined' && _.compact(e.form.options.data.groups).length>0);
			}else{
				return e.initial.value;
			}
		}, type: 'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}],template:"{{#attributes.groups.length}}Yes{{/attributes.groups.length}}{{^attributes.groups.length}}No{{/attributes.groups.length}}", show:  [{type:'matches',name:'public', value: false},{type:'test',test: function(form){return composites.length >0;}} ]},
		{label: 'Composites',get:function(e){
			if(this.visible){
				return gform.types[this.type].get.call(this);
			}
			else{
				return null;
			}

		}, legend: 'Composites',parse:true,array: {min:1,max:composites.length,duplicate:{copy:true}}, name: 'groups', type: 'select', options: composites,format:{label:"{{name}}",value:function(i){return i.id}},'show': [{type:"matches",name: 'limit',value: true}],validate:[{type:'unique',message:"Duplicate group"}]},
		{name: 'order', type:'hidden'},
		{name: 'id', type:'hidden'}
	];

	tableConfig.sortBy = 'order';

	tableConfig.data = _.map(data,function(item){ 
		item.groups = item.groups ||[];
		delete item.content;
		delete item.mobile_order;
		return item;
	});				
	tableConfig.name = "pages";
		//check on multiEdit - I am not sure it is implemented in datagrid

	tableConfig.multiEdit = ['unlisted', 'public', 'group_id'];

	tableConfig.actions=[{'name':'delete'}]

	if(resource_id !== ''){
		tableConfig.schema[0].enabled = false;
		tableConfig.schema[0].value = resource_id;
		tableConfig.actions=tableConfig.actions.concat(['|',
			{'name':'edit',max:1},'|',
			{'name':'create'},
			{'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'},
		])
	}

	grid = new GrapheneDataGrid(tableConfig).on('click',function(e){window.location = '/page/'+e.model.attributes.group_id+'/'+e.model.attributes.slug}).on('sort',function(e){
		var tempdata = _.map(e.grid.models, function(item){return item.attributes}).reverse();//[].concat.apply([],pageData)
		mymodal = modal({title: "Sort Pages", content: templates.sortlist.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
		Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
	})
});


$('body').on('click','.save-sort',function(){
	$.ajax({
		url: '/api/pages/order/'+resource_id,
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