$('.navbar-header .nav a h4').html('Workflow Instance Raw Data Report');
$('[href="/admin/workflowinstances"]').parent().addClass('active');

$.ajax({
	url: '/api/workflowinstances/'+resource_id,
	success: function(data) {
		$('.navbar-header .nav a h4').append(' - '+data.workflow.name+'');
		
		$.ajax({
			url:'/api/workflowinstances/'+resource_id+'/raw',
			dataType : 'json',
			type: 'GET',

			success  : function(data){
				mygrid = new GrapheneDataGrid({
					actions:[{type:"info",name:"d_csv",label:'<i class="fa fa-download"></i> Download CSV'}],
					autoSize:10,name:"workflow_submissions",schema:data.schema,data:data.data,download:false,upload:false,el:document.body.querySelector('#table')}).on('click',function(e){
					document.location = "/workflows/report/"+e.model.attributes._w_id;
				}.bind(this)).on('d_csv',function(e){
					document.location = "/api/workflowinstances/"+resource_id+"/csv"
				})
				mygrid.state.set(_.extend({},mygrid.state.get(),{filters:{"_w_status":'open'}}))
				mygrid.fixStyle();
			}.bind(this)
		})
}})
