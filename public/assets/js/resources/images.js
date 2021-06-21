$('.navbar-header .nav a h4').html('Images');
$('[href="/admin/groups"]').parent().addClass('active');

getData([url,'/api/groups'], (images, groups) => {
	new GrapheneDataGrid({...tableConfig, schema: [
		fieldLibrary.group,
		{label: 'Image', name:'filename',show:false, parse:false, required: true, template: '<div style="width:150px;margin:0 auto;"><img style="max-width:150px;max-height:50px" src="/image/{{attributes.id}}"/></div>'},
		{label: 'Name', name:'name', required: true},
		{label: 'Public', name:'public', type:'checkbox'},
		{name: 'id', type:'hidden'}
	],
		name:'images',
		data: images
	})
	.on('click', e => {
		const link = '/image/'+e.model.attributes.id+'.'+e.model.attributes.ext
		modal({
			legend: e.model.attributes.name, 
			content: '<div style="text-align:center"><a target="_blank" href="'+link+'"><img style="max-width:100%" src="'+link+'"/></a></div>',
			footer: `<div style="text-align:center"><h3><a target="_blank" href="`+link+`">`+window.location.protocol+`//`+window.location.host+link+`</a></h3></div>`
		});
	})
	.on('create', e => {
		e.preventDefault();
		e.stopPropagation();
		let grid = e.grid;
		new gform({name:'newimage',actions:[{type:'cancel'}],legend: 'Add Image(s)', fields:[
			fieldLibrary.group,
			{label: false, name: 'image_filename', type: 'upload', show: [{type: "not_matches", name: "group_id", value: ""}], path: '/api/images?group_id='+resource_id}
		]})
		.on('change:group_id', e => e.form.find('image_filename').update({path: '/api/images?group_id='+e.field.get() }, true))
		.on('uploaded', e => {
			grid.add(e.response, { validate: false, silent: true});
			e.form.trigger('close');
		}).on('cancel',function(e){e.form.dispatch('close')})
		.modal()
	})
});