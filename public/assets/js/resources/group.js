// initializers['group'] = function() {
		// $('.navbar-header li').html('<a href="/admin/groups" style="display:inline-block"><h4 style="margin:0">Group</h4></a>');
    $('.navbar-header .nav a h4').html('Group');

		// $('.navbar-header .nav a h4').html('<a href="/admin/groups">Groups</a> - Group Summary');
		$.ajax({
			url: '/api/'+route+'s/'+resource_id+'/summary',
			success: function(data) {
				data.group_slug = data.slug;
				$('#table').html(templates.group_summary.render(data,templates));
			}
		});
// }