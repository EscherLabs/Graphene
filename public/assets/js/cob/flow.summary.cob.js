Cobler.types.WorkflowSummary = function(container){
  function get(){ return {widgetType:'WorkflowSummary',...item};}
	var item = {guid: generateUUID()}

  return {
    container:container,
		fields: [],
		render: ()=>gform.renderString(workflow_report.workflow_summary_container, get()),
		edit: defaultCobEditor.call(this, container),
		toJSON: get,
    get: get,
    redraw: function(newItem){
      if(typeof newItem !== 'undefined')this.set(newItem)
      this.ractive.set(item);
    },
		set: newItem=>{
      $.extend(item, newItem);
      item.current = $g.formatDates(item.current);
		},
		initialize: function(el) {
      workflowsummary = this;
      this.ractive = new Ractive({el: this.container.elementOf(this), template: workflow_report.workflow_summary, data:  this.get(), partials: {}});

      $('.current-panel').on('click','.error-field, .missing-field', e=>{
        debugger;
        gform.instances.workflow.find({id:e.currentTarget.dataset.id}).focus()
      })
      $('.saved-panel').on('click', '[data-id]', e=>{
        var data = _.extend({},_.find(this.get().all,{id:parseInt(e.currentTarget.dataset.id)} ))
        if(!_.isEmpty(data)) {
            data = $g.formatDates(data);
            var modal = new gform({legend:"Previously started workflow",actions:[{type:"cancel",action:"discard","modifiers": "btn btn-danger",label:'<i class="fa fa-times"></i> Discard instance'},{type:"button",action:"update","modifiers": "btn btn-info",label:'<i class="fa fa-check"></i> Update Comment'},{type:"button",action:"switch","modifiers": "btn btn-success",label:'<i class="fa fa-refresh"></i> Switch to this instance'}],data:data,name:"modal",fields:[{label:false,name:"title",
            type:"output",format:{value:'{{#owner.options.data}}'+workflow_report.prompt_summary+'{{/owner.options.data}}'}
          } , {
            label:"New Comment",name:"comment"
          }]}).on('discard', e=>{
            if(confirm('Are you sure you want to discard this submission? This can not be undone')){
              $.ajax({
                url:'/api/workflowsubmissions/'+e.form.options.data.id,
                type: 'delete',
                success: ()=>{ location.reload(); },
                error: ()=>{}
              })
            }
          }).on('update', e=>{
            $g.waiting = "Updating Comment...";
            e.form.trigger('close')
              $.ajax({
                url:'/api/workflowsubmissions/'+e.form.options.data.workflow_instance_id+'/save',
                dataType : 'json', contentType: 'application/json', type: 'POST',
                data: JSON.stringify(_.extend(e.form.options.data,{comment:e.form.get('comment')})),
                success: result=>{
                  e.form.trigger('close');
                  this.get().all[_.findIndex(this.get().all, {id: result.id})] = result;
                  this.redraw();
                  $g.waiting = false;
                },
                error: ()=>{}
              })
              
          }).on('switch', e=>{
            // e.form.trigger('cancel');
            document.location = "?saved="+e.form.options.data.id
          }).modal()
        }
      })
      
      $g.on('workflow_summary', e=>{
        this.redraw(e.data);
      })
		}
	}
}

