// initializers['images'] = function() {

	$('.navbar-header .nav a h4').html('Images');
	
	$.ajax({
		url: url,
		success: function(data){


			tableConfig.schema = [
				{label: 'Group', name:'group_id', required: true,enabled:false, type:'select', choices: '/api/groups?limit=true'},
				{label: 'Image', name:'filename',show:false, required: true, template: '<div style="width:150px;margin:0 auto;"><img style="max-width:150px;max-height:50px" src="/image/{{attributes.id}}.{{attributes.ext}}"/></div>'},
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

			
			tableConfig.data = data;
			tableConfig.name = "images";
			bt = new berryTable(tableConfig)
		}
	});
// }