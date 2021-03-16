$('.navbar-header .nav a h4').html('Group');
$('[href="/admin/groups"]').parent().addClass('active');

getData('/api/'+route+'s/'+resource_id+'/summary', function(data){
		data.group_slug = data.slug;
		$('#table').html(templates.group_summary.render(data,templates));
	}
);
