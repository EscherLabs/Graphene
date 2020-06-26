$('.navbar-header .nav a h4').html('Workflow Instance Raw Data Report');
$('[href="/admin/workflowinstances"]').parent().addClass('active');

$.ajax({
	url: '/api/workflowinstances/'+resource_id,
	success: function(workflow_instance) {
		$('.navbar-header .nav a h4').append(' - '+workflow_instance.workflow.name+'');
		$.ajax({
			url:'/api/workflowinstances/'+resource_id+'/raw',
			dataType : 'json',
			type: 'GET',
			success  : function(raw_data){
				mygrid = new GrapheneDataGrid({
					actions:[{type:"info",name:"d_csv",label:'<i class="fa fa-download"></i> Download CSV'}],
					autoSize:10,name:"workflow_submissions_raw_"+workflow_instance.id,schema:raw_data.schema,data:raw_data.data,download:false,upload:false,el:document.body.querySelector('#table')}).on('click',function(e){
					document.location = "/workflows/report/"+e.model.attributes._w_id;
				}.bind(this)).on('d_csv',function(e){
					document.location = "/api/workflowinstances/"+resource_id+"/csv"
				})
				mygrid.fixStyle();
			}.bind(this)
		})
}})
