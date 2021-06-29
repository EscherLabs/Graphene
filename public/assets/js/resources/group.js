$('.navbar-header .nav a h4').html('Group');
$('[href="/admin/groups"]').parent().addClass('active');

getData('/api/'+route+'s/'+resource_id+'/summary', group => {
        group.mypages = group.pages; // TJC -- For some reason, can't reference pages in the mustache template.
		$('#table').html(templates.group_summary.render({...group, group_slug: group.slug}, templates));
	}
);
