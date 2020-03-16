$('.navbar-header .nav a h4').html('Workflow Instance Report');
$('[href="/admin/workflowinstances"]').parent().addClass('active');

$.ajax({
	url: '/api/workflowinstances/'+resource_id,
	success: function(data) {
		$('.navbar-header .nav a h4').append(' - '+data.workflow.name+'');
		
		$.ajax({
			url:'/api/workflowinstances/'+resource_id+'/submissions',
			dataType : 'json',
			type: 'GET',

			success  : function(data){
				data = _.each(data, function(item){
					item.created_at = {
						original:item.created_at,
						time:moment(item.created_at).format('LTS'),
						date:moment(item.created_at).format('L'),
						fromNow:moment(item.created_at).fromNow()
					}
					item.updated_at = {
						original:item.updated_at,
						time:moment(item.updated_at).format('LTS'),
						date:moment(item.updated_at).format('L'),
						fromNow:moment(item.updated_at).fromNow()
					}
				})
				new GrapheneDataGrid({
					
					actions:[{type:"info",name:"d_csv",label:'<i class="fa fa-download"></i> Download'}],
					autoSize:10,name:"workflow_submissions",schema:[{label:"Name",template:"{{attributes.user.first_name}} {{attributes.user.last_name}}"},{name:"created_at",label:"Created",template:"{{attributes.created_at.fromNow}}"},{name:"updated_at",label:"Last Action",template:"{{attributes.updated_at.fromNow}}"},{label:"State",name:"state"},{label:"Status",name:'status'},{label:"Assigned",template:"{{attributes.assignee.first_name}} {{attributes.assignee.last_name}}"}],data:data,download:false,upload:false,el:document.body.querySelector('#table')}).on('click',function(e){
					document.location = "/workflows/report/"+e.model.attributes.id;
				}.bind(this)).on('d_csv',function(e){
					document.location = "/api/workflowinstances/"+resource_id+"/csv"
				})
			}.bind(this)
		})
}})
