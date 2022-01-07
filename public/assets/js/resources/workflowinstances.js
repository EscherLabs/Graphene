$('.navbar-header .nav a h4').html('Workflow Instances');
$('[href="/admin/groups"]').parent().addClass('active');

$g.getData([url, '/api/groups', '/assets/data/icons.json', '/api/workflows/group/' + resource_id], (workflowinstances, groups, icons, workflows) => {
	grid = new GrapheneDataGrid({
		...tableConfig,
		schema: [
			fieldLibrary.group,
			{ label: 'Workflow', name: 'workflow_id', type: "select", options: 'workflows', format: { label: "{{name}}", value: function (e) { return e.id } } },
			// {label: 'Version', name:'workflow_version_id', type:'hidden'},
			...fieldLibrary.content,
			{ name: 'workflow', type: 'hidden' },
			{ name: 'id', type: 'hidden' }
		],
		actions: [
			{ 'name': 'delete' }
		].concat((resource_id !== '') ? [
			'|',
			{ 'name': 'edit', max: 1 }, { 'name': 'version', max: 1, min: 1, 'label': '<i class="fa fa-cogs"></i> Version' }
			, { 'name': 'report', max: 1, min: 1, 'label': '<i class="fa fa-list-ol"></i> Report' }
			, { 'name': 'raw_data', max: 1, min: 1, 'label': '<i class="fa fa-table"></i> Raw Data' }
			, '|',
			{ 'name': 'create' },
			{ 'name': 'sort', 'label': '<i class="fa fa-sort"></i> Sort' },
		] : []),
		data: workflowinstances.map(instance => {
			instance.groups = instance.groups || [];
			return instance;
		}),
		name: "workflowinstances",
		sortBy: 'order'
	})
		.on('click', e => {
			window.location = '/admin/workflowinstances/' + e.model.attributes.id;
		})
		.on('model:report', e => {
			document.location = "/admin/workflowinstances/" + e.model.attributes.id + "/report";
		})
		.on('model:raw_data', e => {
			document.location = "/admin/workflowinstances/" + e.model.attributes.id + "/raw";
		})
		.on('sort', e => {
			var tempdata = _.map(e.grid.models, model => model.attributes).reverse();
			mymodal = modal({ title: "Sort Workflow Instances", content: templates.sortlist.render({ items: tempdata }, templates), footer: '<div class="btn btn-success save-sort">Save</div>' });
			Sortable.create($(mymodal.ref).find('.modal-content ol')[0], { draggable: 'li' });
		})
		.on('model:version', e => {
			$.ajax({
				url: '/api/workflows/' + e.model.attributes.workflow_id + '/versions',
				success: function (e, data) {
					new gform({
						name: "version", data: e.model.attributes, legend: 'Select Version', fields: [
							{ label: 'Version', name: 'workflow_version_id', required: true, options: [{ type: 'optgroup', options: [{ id: null, label: 'Latest (working or stable)' }, { id: 0, label: 'Latest Stable' }] }, { type: 'optgroup', options: data }], type: 'select', format: { value: function (e) { return e.id; } } },
						]
					}).on('save', function (e, g) {
						e.model.update(g.form.toJSON());
						e.model.owner.eventBus.dispatch('model:edited', e.model)
						e.model.owner.draw();
						g.form.trigger('close');
					}.bind(null, e)).on('cancel', function (e) { e.form.trigger('close') }).modal()
				}.bind(null, e)
			})
		})
});








