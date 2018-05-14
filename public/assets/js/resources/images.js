// initializers['images'] = function() {

	$('.navbar-header .nav a h4').html('Images');
	
	$.ajax({
		url: url,
		success: function(data){


			tableConfig.schema = [
				{label: 'Group', name:'group_id', required: true,enabled:false, type:'select', choices: '/api/groups?limit=true'},
				{label: 'Image', name:'filename',show:false, required: true, template: '<div style="width:150px;margin:0 auto;"><img style="max-width:150px;max-height:50px" src="/image/{{attributes.id}}"/></div>'},
				{label: 'Name', name:'name', required: true},
				// {label: 'Ext', name:'ext', required: true},
				{name: 'id', type:'hidden'}
			];

				tableConfig.events = [
					{'name': 'add', 'label': '<i class="fa fa-code"></i> Add', callback: function(model){
							$().berry({name:'newimage',actions:['cancel'],legend: 'Add Image(s)', fields:[
								{label: 'Group', name:'group_id', type: 'select', choices: '/api/groups?limit=true', required: true, default: {label:"Choose a group", value:'-'},value:resource_id,enabled: (resource_id == '') },
								{show:{"not_matches": {"name": "group_id","value": "-"}},type: 'upload', label: false, path: '/api/images?group_id=', name: 'image_filename'}]}).on('uploaded:image_filename', $.proxy(function(){
										var temp = Berries.newimage.fields.image_filename.value;
										// temp.group = _.findWhere(this.groups,{id:parseInt(Berries.newimage.fields.image_filename.value.group_id, 10)}).name;
										bt.add(temp);
										Berries.newimage.trigger('close');
							}, this) ).on('change:group_id', function(){
									var groupid =this.fields.group_id.toJSON();
									this.fields.image_filename.update({path:'/api/images?group_id='+groupid}, true)
							});

					}}
				]

			tableConfig.click = function(model){
				// debugger;window.location.href = '/admin/'+route+'/'+model.attributes.id
				new modal({legend: model.attributes.name, content:'<div style="text-align:center"><img style="max-width:100%" src="/image/'+model.attributes.id+'.'+model.attributes.ext+'"/><h3>'+window.location.protocol+'//'+window.location.host+'/image/'+model.attributes.id+'.'+model.attributes.ext+'</h3></div>'});
				
			},
				
			tableConfig.data = data;
			tableConfig.name = "images";
			bt = new berryTable(tableConfig)
		}
	});
// }