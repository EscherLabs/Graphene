$('.navbar-header .nav a h4').html('Group');
$('[href="/admin/groups"]').parent().addClass('active');

getData('/api/'+route+'s/'+resource_id+'/summary', group => {
		$('#table').html(templates.group_summary.render({...group, group_slug: group.slug}, templates));
	}
);
