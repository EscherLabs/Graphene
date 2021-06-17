Cobler.types.WorkflowHistory = function(container){
	function get() {
		item.widgetType = 'WorkflowHistory';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
		Title: {},
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      return gform.renderString(workflow_report.status, temp);
		},
		edit: defaultCobEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el){
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }

      $.ajax({
        url:'/api/workflowsubmissions/user/history',
        dataType : 'json',
        type: 'GET',
        success  : function(history){
              
              var getActions = function(item){
                item.actions = (_.find(item.workflow_version.code.flow,{name:item.state}) || {"actions": []}).actions;
              }

              this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString(`<h5>These are all of the workflows on which you have ever taken an action</h5><div id="historygrid"></div>`,{});


              myGrid = new GrapheneDataGrid({
                el: "#historygrid",
                autoSize: 50, 
                data: history,
                actions:[],
                upload:false,download:false,columns:false,
                sortBy:"updated_at",
                reverse:true,
                form:{
                  fields:[
                    {label:"Workflow Name",name:"name",type:"select",options:function(data){
                      return _.uniq(_.map(data,function(item){return item.workflow.name}))
                    }.bind(null,history),template:"{{attributes.workflow.name}}"},
                    {label:"Submitted",name:"submitted_at",template:"<div>{{attributes.submitted_at}}</div> by {{attributes.user.first_name}} {{attributes.user.last_name}}"},
                    {label:"Last Updated",name:"updated_at",template:'<div>{{attributes.updated_at}}</div> <div class="label label-default">{{attributes.logs.0.action}}</div>'},
                    {label:"Assigned",name:"assignment_type",type:"select",options:[{value:'group',label:'Group'},{value:'user',label:'User'}],template:'<span style="text-transform:capitalize">{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}} <div>({{attributes.assignment_type}})</div></span>'},
                    {label:"Status",name:"status",type:"select",options:['open','closed'],template:'<span style="text-transform:capitalize">{{attributes.status}}</span>'},
                    {label:"State",name:"state",type:"select",options:function(data){
                      return _.uniq(_.map(data,function(item){return item.state}))
                    }.bind(null,history)},
                    {label:"ID",name:"id",type:"text"}
                  ]
                }
              }).on('click',function(e){
                  document.location = "/workflows/report/"+e.model.attributes.id;
              })

        }.bind(this)

      })

		}
	}
}