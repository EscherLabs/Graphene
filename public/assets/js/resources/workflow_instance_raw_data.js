$('.navbar-header .nav a h4').html('Workflow Instance Raw Data Report');
$('[href="/admin/workflowinstances"]').parent().addClass('active');


getData(['/api/workflowinstances/'+resource_id, '/api/workflowinstances/'+resource_id+'/raw'], (workflow_instance, raw_data) => {

	$('.navbar-header .nav a h4').append(' - '+workflow_instance.workflow.name+'');

	new GrapheneDataGrid({
		...raw_data,
		actions:[
			{type: "info", name: "d_csv", label: '<i class="fa fa-download"></i> Download CSV'},'','',
			{type: "danger", name: "delete", label: 'Delete Submission <i class="fa fa-exclamation-triangle"></i>'}
		],
		autoSize:10,
		name: "workflow_submissions_raw_"+workflow_instance.id,
		download: false,
		upload: false,
		el: document.body.querySelector('#table')
	})
	.on('click', e => {
		document.location = "/workflows/report/"+e.model.attributes._w_id;
	})
	.on('d_csv', e => {
		document.location = "/api/workflowinstances/"+resource_id+"/csv"
	})
	.on("model:deleted", e => {
		$.ajax({
			url:'/api/workflowsubmissions/'+e.model.attributes._w_id,
			dataType:'json',
			type:'DELETE',
			success: () => {
				toastr.success('Submission Was Sucessfully Deleted')
			},
			error: () =>{
				toastr.error('Unable to Delete Submission')
			}
		});
	}).fixStyle();
})
