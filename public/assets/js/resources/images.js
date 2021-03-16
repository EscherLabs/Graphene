$('.navbar-header .nav a h4').html('Images');
$('[href="/admin/groups"]').parent().addClass('active');
/* ATS - not done */
// $.ajax({
// 	url: url,
// 	success: function(data){
// 		tableConfig.schema = [
// 			{label: 'Group', name:'group_id', required: true,enabled:false, type:'select', choices: '/api/groups?limit=true'},
// 			{label: 'Image', name:'filename',show:false, parse:false, required: true, template: '<div style="width:150px;margin:0 auto;"><img style="max-width:150px;max-height:50px" src="/image/{{attributes.id}}"/></div>'},
//             {label: 'Name', name:'name', required: true},
// 			{label: 'Public', name:'public', type:'checkbox'},
// 			{name: 'id', type:'hidden'}
// 		];

// 		tableConfig.events = [
// 			{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){
// 				$().berry({name:'newimage',actions:['cancel'],legend: 'Add Image(s)', fields:[
//                     {label: 'Group', name:'group_id', type: 'select', choices: '/api/groups?limit=true', required: true, default: {label:"Choose a group", value:'-'},value:resource_id,enabled: (resource_id == '') },
// 					{show:{"not_matches": {"name": "group_id","value": "-"}},type: 'upload', label: false, path: '/api/images?group_id='+resource_id, name: 'image_filename'}]}).on('uploaded:image_filename', function(){
// 						var temp = Berries.newimage.fields.image_filename.value;
// 						bt.add(temp);
// 						Berries.newimage.trigger('close');
// 				}.bind(this) ).on('change:group_id', function(){	
// 					this.fields.image_filename.update({path:'/api/images?group_id='+this.fields.group_id.toJSON()}, true)
// 				});
// 			}}
// 		]

// 		tableConfig.click = function(model){
// 			new modal({legend: model.attributes.name, content:'<div style="text-align:center"><img style="max-width:100%" src="/image/'+model.attributes.id+'.'+model.attributes.ext+'"/><h3>'+window.location.protocol+'//'+window.location.host+'/image/'+model.attributes.id+'.'+model.attributes.ext+'</h3></div>'});
			
// 		}
			
// 		tableConfig.add = true;
// 		tableConfig.data = data;
// 		tableConfig.name = "images";
// 		bt = new berryTable(tableConfig)
// 	}
// });


getData([url,'/api/apps/developers'], function(data,developers){
	tableConfig.schema = [
		{label: 'Group', name:'group_id', required: true,enabled:false, type:'select', choices: '/api/groups?limit=true'},
		{label: 'Image', name:'filename',show:false, parse:false, required: true, template: '<div style="width:150px;margin:0 auto;"><img style="max-width:150px;max-height:50px" src="/image/{{attributes.id}}"/></div>'},
		{label: 'Name', name:'name', required: true},
		{label: 'Public', name:'public', type:'checkbox'},
		{name: 'id', type:'hidden'}
	];
	// tableConfig.actions=[{'name':'delete'},'|',
	// {'name':'edit',max:1},{'name':'developers',max:1,min:1,'label': '<i class="fa fa-code"></i> Developers'},'|',
	// {'name':'create'},
	// {'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'}]

	// if(resource_id !== ''){
	// 	tableConfig.schema[0].enabled = false;
	// 	tableConfig.schema[0].value = resource_id;
	// 	tableConfig.actions=tableConfig.actions.concat(['|',
	// 		{'name':'edit',max:1},'|',
	// 		{'name':'create'},
	// 		{'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'},
	// 	])
	// }
	tableConfig.name = "images";
	tableConfig.data = data;

	grid = new GrapheneDataGrid(tableConfig).on('click',function(e){
		new modal({legend: emodel.attributes.name, content:'<div style="text-align:center"><img style="max-width:100%" src="/image/'+e.model.attributes.id+'.'+e.model.attributes.ext+'"/><h3>'+window.location.protocol+'//'+window.location.host+'/image/'+e.model.attributes.id+'.'+e.model.attributes.ext+'</h3></div>'});
	}).on('create',function(e){
		debugger;
e.preventDefault();
e.stopPropagation();
$().berry({name:'newimage',actions:['cancel'],legend: 'Add Image(s)', fields:[
	                    {label: 'Group', name:'group_id', type: 'select', choices: '/api/groups?limit=true', required: true, default: {label:"Choose a group", value:'-'},value:resource_id,enabled: (resource_id == '') },
						{show:{"not_matches": {"name": "group_id","value": "-"}},type: 'upload', label: false, path: '/api/images?group_id='+resource_id, name: 'image_filename'}]}).on('uploaded:image_filename', function(){
							var temp = Berries.newimage.fields.image_filename.value;
							grid.add(temp);
							Berries.newimage.trigger('close');
					}.bind(this) ).on('change:group_id', function(){	
						this.fields.image_filename.update({path:'/api/images?group_id='+this.fields.group_id.toJSON()}, true)
					});
	})
});