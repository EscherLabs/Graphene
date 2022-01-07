$('.navbar-header .nav a h4').html('Groups');
$g.getData(url, groups => {
	grid = new GrapheneDataGrid({
		...tableConfig,
		schema: [
			{ label: 'Name', name: 'name', required: true },
			{ label: 'Slug', name: 'slug', required: true },
			{ name: 'order', type: 'hidden' },
			{ name: 'id', type: 'hidden' }
		],
		actions: [
			{ 'name': 'delete' }, '|',
			{ 'name': 'edit', max: 1 },
			{ 'name': 'admins', max: 1, min: 1, 'label': '<i class="fa fa-lock"></i> Admins' },
			{ 'name': 'members', max: 1, min: 1, 'label': '<i class="fa fa-users"></i> Members' },
			{ 'name': 'composites', max: 1, min: 1, 'label': '<i class="fa fa-puzzle-piece"></i> Composites' },
			'|',
			{ 'name': 'create' },
			{ 'name': 'sort', max: 1, 'label': '<i class="fa fa-sort"></i> Sort' }
		],
		data: groups,
		name: 'groups',
		sortBy: 'order'
	})
		.on('click', e => {
			window.location.href = '/admin/groups/' + e.model.attributes.id;
		})
		.on('model:admins', e => {
			window.location.href = '/admin/groups/' + e.model.attributes.id + '/admins';
		})
		.on('model:members', e => {
			window.location.href = '/admin/groups/' + e.model.attributes.id + '/members';
		})
		.on('model:composites', e => {
			window.location.href = '/admin/groups/' + e.model.attributes.id + '/composites';
		})
		.on('sort', e => {
			var tempdata = _.map(e.grid.models, function (item) { return item.attributes }).reverse();//[].concat.apply([],pageData)
			mymodal = modal({ title: "Sort Groups", content: templates.sortlist.render({ items: tempdata }, templates), footer: '<div class="btn btn-success save-sort">Save</div>' });
			Sortable.create($(mymodal.ref.container).find('#sorter')[0], { draggable: 'li' });
		});

})