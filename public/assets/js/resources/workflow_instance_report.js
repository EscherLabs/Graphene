$('.navbar-header .nav a h4').html('Workflow Instance Report');
$('[href="/admin/workflowinstances"]').parent().addClass('active');

getData([`/api/workflowinstances/${resource_id}`, `/api/workflowinstances/${resource_id}/submissions`], (workflow_instance, submissions) => {
		$('.navbar-header .nav a h4').append(' - '+workflow_instance.workflow.name);

		submissions.forEach($g.formatDates)
		mygrid = new GrapheneDataGrid({
			actions:[
				{type: "info", name: "d_csv", label: '<i class="fa fa-download"></i> Download CSV'},'','',
				{type: "danger", name: "delete", label: 'Delete Submission <i class="fa fa-exclamation-triangle"></i>'},
                {type: "warning", name: "upgrade_version", label: 'Upgrade Version <i class="fa fa-exclamation-triangle"></i>', min:1}
			],
			autoSize: 10,
			name: "workflow_submissions",
			schema:[
                {label: "ID", name: "id"},
				{label: "Name", name: "name", template: "{{attributes.user.first_name}} {{attributes.user.last_name}}"},
				{name:"created_at", label:"Created", template: "{{attributes.created_at.fromNow}}"},
				{name:"updated_at", label:"Last Action", template: "{{attributes.updated_at.fromNow}}"},
				{label:"State", name: "state"},
				{label:"Status", name: 'status', type:"select", options: [
					{label: "Closed", value: "closed"},
					{label: "Open", value: "open"}
				]},
				{label:"Assigned", name:"assigned", template: "{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}}"},
                {label: "Version ID", name: "workflow_version_id"},
			],
			data: submissions,
			download:false,
			upload:false,
			el: document.body.querySelector('#table')
		})
		.on('click', e => {
			document.location = "/workflows/report/"+e.model.attributes.id;
		})
		.on('d_csv', () => {
			document.location = "/api/workflowinstances/"+resource_id+"/csv"
		}).on("model:deleted", e => {
			$.ajax({
				url:'/api/workflowsubmissions/'+e.model.attributes.id,
				dataType:'json',
				type:'DELETE',
				success: () => {
					toastr.success('Submission Was Sucessfully Deleted')
				},
				error: () => {
					toastr.error('Unable to Delete Submission')
				}
			});
        }).on("upgrade_version", e => {
            if (confirm('Are you sure you want to upgrade the selected versions to the current workflow version?  This action cannot be undone, and may break older submissions!')) {
                toastr.warning('Upgrading Versions!');
                _.each(e.grid.getSelected(),function(model) {
                    $.ajax({
                        url:'/api/workflowsubmissions/'+model.attributes.id+'/upgrade',
                        dataType:'json',
                        type:'GET',
                        success: () => {
                            toastr.success('Upgraded Sumission: '+model.attributes.id)
                        },
                        error: () => {
                            toastr.error('Unable to Upgrade Submission: '+model.attributes.id)
                        }
                    });
                });
            }
        });

		mygrid.state.set(_.extend({},mygrid.state.get(),{filters:{status:'open'}}))
		customFilter = function(status){
			$('[data-status]').removeClass('panel-primary');
			mygrid.state.set(_.extend({},mygrid.state.get(),{filters:{status:status}}))
			$('[data-status="'+status+'"]').addClass('panel-primary');
		}
		document.body.querySelector('#table').parentNode.insertBefore(gform.create('<div style="    margin-top: 40px;margin-bottom: -20px;" class="row"><div class="col-sm-2 hidden-xs"><div class="panel panel-default panel-primary" data-status="open" onClick="customFilter(\'open\')"> <div class="panel-heading"> <h3 class="panel-title">Open</h3> </div> <div class="panel-body"><center>'+mygrid.find({status:'open'}).length+'</center></div></div> </div><div class="col-sm-2 hidden-xs"><div class="panel panel-default" data-status="closed" onClick="customFilter(\'closed\')"> <div class="panel-heading"> <h3 class="panel-title">Closed</h3> </div> <div class="panel-body"><center>'+mygrid.find({status:'closed'}).length+'</center></div> </div></div></div>'),document.body.querySelector('#table'))
		mygrid.fixStyle();
})
