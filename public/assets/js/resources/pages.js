$('.navbar-header .nav a h4').html('Pages');

getData([url, '/api/groups', '/assets/data/icons.json'], (pages, groups, icons) => {
	grid = new GrapheneDataGrid({...tableConfig,
		schema: [
			fieldLibrary.group,
			...fieldLibrary.content,
			{name: 'id', type:'hidden'}
		],
		actions: [
			{'name':'delete'}
		].concat((resource_id !== '')?[
			'|',
			{'name':'edit',max:1},'|',
			{'name':'create'},
			{'name':'sort', 'label': '<i class="fa fa-sort"></i> Sort'}
		]:[]),
		data: pages.map(page => {
			page.groups = page.groups||[];
			delete page.content;
			delete page.mobile_order;
			return page;
		}),
		name: 'pages',
		sortBy: 'order',
		//multiedit is tricky - i.e. public is dependent on other fields... 
		multiEdit: ['unlisted', 'group_id' /*,'public'*/]
	})
	.on('click', e => {
		// window.location = '/page/'+e.model.attributes.group_id+'/'+e.model.attributes.slug
		window.location = $g.render('/page/{{group_id}}/{{slug}}', e.model.attributes)
		// const {slug, group_id} = e.model.attributes;
		// window.location = `/page/${group_id}/${slug}`
	})
	.on('sort', e =>{
		var tempdata = _.map(e.grid.models, function(item){return item.attributes}).reverse();
		mymodal = modal({title: "Sort Pages", content: templates.sortlist.render({items:tempdata},templates ), footer: '<div class="btn btn-success save-sort">Save</div>'});
		Sortable.create($(mymodal.ref).find('.modal-content ol')[0], {draggable:'li'});
	})
});
