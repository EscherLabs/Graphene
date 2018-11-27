$('.navbar-header .nav a h4').html('Group');
$('[href="/admin/groups"]').parent().addClass('active');

$.ajax({
	url: '/api/'+route+'s/'+resource_id+'/summary',
	success: function(data) {
		data.group_slug = data.slug;
		$('#table').html(templates.group_summary.render(data,templates));
	}
});
