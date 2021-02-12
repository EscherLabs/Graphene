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
				mygrid = new GrapheneDataGrid({
					actions:[{type:"info",name:"d_csv",label:'<i class="fa fa-download"></i> Download CSV'},'','',{type:"danger",name:"delete",label:'Delete Submission <i class="fa fa-exclamation-triangle"></i>'}],
					autoSize:10,name:"workflow_submissions",schema:[{label:"Name",name:"name",template:"{{attributes.user.first_name}} {{attributes.user.last_name}}"},{name:"created_at",label:"Created",template:"{{attributes.created_at.fromNow}}"},{name:"updated_at",label:"Last Action",template:"{{attributes.updated_at.fromNow}}"},{label:"State",name:"state"},{label:"Status",name:'status',type:"select",options:[{label:"Closed",value:"closed"},{label:"Open",value:"open"}]},{label:"Assigned",name:"assigned",template:"{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}}"}],data:data,download:false,upload:false,el:document.body.querySelector('#table')}).on('click',function(e){
					document.location = "/workflows/report/"+e.model.attributes.id;
				}.bind(this)).on('d_csv',function(e){
					document.location = "/api/workflowinstances/"+resource_id+"/csv"
				}).on("model:deleted",function(grid_event) {
                    $.ajax({url:'/api/workflowsubmissions/'+grid_event.model.attributes.id,dataType:'json',type:'DELETE',success:function(data){
                        toastr.success('Submission Was Sucessfully Deleted')
                    },error:function(data){
                        toastr.error('Unable to Delete Submission')
                    }});
                })
				mygrid.state.set(_.extend({},mygrid.state.get(),{filters:{status:'open'}}))
				customFilter = function(status){
					$('[data-status]').removeClass('panel-primary');
					mygrid.state.set(_.extend({},mygrid.state.get(),{filters:{status:status}}))
					$('[data-status="'+status+'"]').addClass('panel-primary');
				}
				document.body.querySelector('#table').parentNode.insertBefore(gform.create('<div style="    margin-top: 40px;margin-bottom: -20px;" class="row"><div class="col-sm-2 hidden-xs"><div class="panel panel-default panel-primary" data-status="open" onClick="customFilter(\'open\')"> <div class="panel-heading"> <h3 class="panel-title">Open</h3> </div> <div class="panel-body"><center>'+mygrid.find({status:'open'}).length+'</center></div></div> </div><div class="col-sm-2 hidden-xs"><div class="panel panel-default" data-status="closed" onClick="customFilter(\'closed\')"> <div class="panel-heading"> <h3 class="panel-title">Closed</h3> </div> <div class="panel-body"><center>'+mygrid.find({status:'closed'}).length+'</center></div> </div></div></div>'),document.body.querySelector('#table'))
				mygrid.fixStyle();
			}.bind(this)
		})
}})
