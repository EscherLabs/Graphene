Cobler.types.WorkflowAssignments = function(container){
	function get() {
		item.widgetType = 'WorkflowAssignments';
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
        url:'/api/workflowsubmissions/user/assignments',
        dataType : 'json',
        type: 'GET',
        success  : function(assignments){

          this.container.elementOf(this).querySelector('.collapsible').innerHTML = gform.renderString('<h5>These are all of the workflows which require your action</h5><div id="assignmentgrid"></div>');
          assignmentGrid = new GrapheneDataGrid({
            el: "#assignmentgrid",
            autoSize: 50, 
            data: assignments,
            actions:[],upload:false,download:false,columns:false,
            sortBy:"updated_at",
            reverse:true,
            form:{
              fields:[
                {label:"Workflow Name",name:"name",type:"select",options:function(data){
                  return _.uniq(_.map(data,function(item){return item.workflow.name}))
                }.bind(null,assignments),template:"{{attributes.workflow.name}}"},
                {label:"Submitted",name:"submitted_at",template:"<div>{{attributes.submitted_at}}</div> by {{attributes.user.first_name}} {{attributes.user.last_name}}"},
                {label:"Last Updated",name:"updated_at",template:'<div>{{attributes.updated_at}}</div> <div class="label label-default">{{attributes.logs.0.action}}</div> '},
                {label:"Assigned",name:"assignment_type",type:"select",options:[{value:'group',label:'Group'},{value:'user',label:'User'}],template:'<span style="text-transform:capitalize">{{attributes.assignee.name}}{{attributes.assignee.first_name}} {{attributes.assignee.last_name}} ({{attributes.assignment_type}})</span>'},
                {label:"State",name:"state",type:"select",options:function(data){
                  return _.uniq(_.map(data,function(item){return item.state}))
                }.bind(null,assignments)},
                {label:"ID",name:"id",type:"text"}
              ]
            }
          }).on('click',function(e){
            document.location = "/workflows/report/"+e.model.attributes.id;
          }).on("*",function(e){
            if(e.event.startsWith("click_") && !e.model.waiting()){
              e.model.waiting(true);
              if(_.find(e.model.attributes.actions,{name:e.event.split("click_")[1]}).form){
                e.model.waiting(false);
                new gform(
                  {
                    "rootpath":'/workflows/fetch/'+this.get().workflow_id+'/',
                    "legend":e.model.attributes.workflow.name,
                    "data":e.model.attributes.data,
                    "events":e.model.attributes.workflow_version.code.form.events||{},
                    "actions": [
                      {
                        "type": "cancel",
                        "name": "submitted",
                        "action":"canceled",
                      },
                      {
                        "type": "save",
                        "name": "submit",
                        "label": "<i class='fa fa-check'></i> Submit"
                      },{
                        "type": "hidden",
                        "name": "_flowstate",
                        "value":e.model.attributes.state
                      },{
                        "type": "hidden",
                        "name": "_flowstate_history",
                        "value": e.model.attributes.state
                      }

                    ],
                    "fields":[
                      {"name":"_state","label":false,"type":"fieldset","fields": e.model.attributes.workflow_version.code.form.fields},                                
                      {"name":"comment","type":"textarea","length":255}
                    ]
                  }).on('save',function(e,eForm){
                    if(!eForm.form.validate(true))return;

                    e.model.waiting(true);

                    eForm.form.trigger('close')
                    
                    $.ajax({
                      url:'/api/workflowsubmissions/'+e.model.attributes.id,
                      type: 'PUT',
                      dataType : 'json',
                      contentType: 'application/json',
                      data: JSON.stringify({_state:eForm.form.get()._state,comment:eForm.form.get().comment,action:e.event.split("click_")[1]},),
                      success  : function(e,data){
                        e.model.waiting(false);
                        
                        data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
                        // data.updated_at = moment(data.updated_at).fromNow()
                        e.model.set(data)
  
                        }.bind(null,e)
                    })
                  }.bind(null,e)).on('canceled',function(eForm){
                    eForm.form.trigger('close')
                  }).modal();
              }else{
                new gform(
                  {
                    "rootpath":'/workflows/fetch/'+this.get().workflow_id+'/',
                    "legend":e.model.attributes.workflow.name,
                    "data":e.model.attributes.data,
                    "events":e.model.attributes.workflow_version.code.form.events||{},
                    "actions": [
                      {
                        "type": "cancel",
                        "name": "submitted",
                        "action":"canceled",
                      },
                      {
                        "type": "save",
                        "name": "submit",
                        "label": "<i class='fa fa-check'></i> Submit"
                      },{
                        "type": "hidden",
                        "name": "_flowstate",
                        "value":e.model.attributes.state
                      }
                    ],
                    "fields":[
                      {"name":"comment","type":"textarea","length":255}
                    ]
                  }).on('save',function(e,eForm){

                    e.model.waiting(true);

                    eForm.form.trigger('close')
                $.ajax({
                  url:'/api/workflowsubmissions/'+e.model.attributes.id,
                  dataType : 'json',
                  type: 'PUT',
                  contentType: 'application/json',
                  data: JSON.stringify({_state:e.model.attributes.data,comment:eForm.form.get().comment,action:e.event.split("click_")[1]}),
                  success  : function(e,data){
                    e.model.waiting(false);
                    data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
                    e.model.set(data)
                    }.bind(null,e)
                })

              }.bind(null,e)).on('canceled',function(eForm){
                eForm.form.trigger('close')
              }).modal();

            }


            }
          })
        
        }.bind(this)
      })
		}
	}
}

