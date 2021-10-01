Cobler.types.WorkflowSummary = function(container){
  function get() {
		item.widgetType = 'WorkflowSummary';
		return item;
	}
	var item = {
		guid: generateUUID()}
  var fields = {
		Title: {},
		'Workflow ID': {type: 'select', choices: '/api/groups/'+group_id+'/workflowinstances'},
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      return gform.renderString(workflow_report.workflow_summary_container, get());
    },
		edit: defaultCobEditor.call(this, container),
		toJSON: get,
    get: get,
    redraw:function(newItem){
      if(typeof newItem !== 'undefined')this.set(newItem)
      this.ractive.set(item);
    },
		set: function (newItem) {
      // if(typeof newItem.current == 'undefined' || !_.isEqual(_.pick(newItem.current,'created_at','updated_at','title','comment'),_.pick(item.current,'created_at','updated_at','title','comment'))){
        $.extend(item, newItem);
        item.current = $g.formatDates(item.current)

        
      //   if(this.container.getItems().length)this.container.update(item,this);
      // }
		},
    saveFlow:function(e,data){
      $.ajax({
        url:'/api/workflowsubmissions/'+this.get().instance_id,
        dataType : 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        type: 'POST',
        success  : function(data){
          e.form.find('_state').el.style.opacity = 1
          document.location = "/workflows/report/"+data.id;
        }.bind(this),
        error:function(){
          e.form.find('_state').el.style.opacity = 1
          gform.types.fieldset.edit.call(e.form.find('_state'),true)
          $('.gform-footer').show();
          toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
        }
      })
    },
		initialize: function(el) {

  this.ractive = new Ractive({el: this.container.elementOf(this), template: workflow_report.workflow_summary, data:  this.get(), partials: {}});

  $('.current-panel').on('click','.error-field, .missing-field',function(e){
    gform.instances.workflow.find({id:e.currentTarget.dataset.id}).focus()
  })

  $('.saved-panel').on('click','[data-id]',function(e){

    // console.log(_.find(this.get().all,{id:parseInt(e.currentTarget.dataset.id)} ));
    var data = _.extend({},_.find(this.get().all,{id:parseInt(e.currentTarget.dataset.id)} ))
    if(!_.isEmpty(data)){
        data = $g.formatDates(data);
        var modal = new gform({legend:"Previously started workflow",actions:[{type:"cancel",action:"discard","modifiers": "btn btn-danger",label:'<i class="fa fa-times"></i> Discard instance'},{type:"button",action:"switch",label:'<i class="fa fa-check"></i> Switch to this instance'},{type:"button",action:"update",label:'<i class="fa fa-check"></i> Update Comment'}],data:data,name:"modal",fields:[{label:false,name:"title",
        type:"output",format:{value:`{{#owner.options.data}}
        <dl class="dl-horizontal">
<dt>Title</dt>
<dd>{{{title}}}</dd>
<dt>Comment</dt>
<dd>{{{comment}}}</dd>
<dt>Started</dt>
<dd>{{created_at.date}} @ {{{created_at.time}}}</dd>
<dt>Last Updated</dt>
<dd>{{updated_at.date}} @ {{{updated_at.time}}}</dd>
</dl>
        {{/owner.options.data}}`}
      },{

        label:"New Comment",name:"comment"
      }]}).on('discard',function(e){
        if(confirm('Are you sure you want to discard this submission? This can not be undone')){
          $.ajax({
            url:'/api/workflowsubmissions/'+e.form.options.data.id
,
            type: 'delete',
            success  : function(){

              location.reload();
            },
            error:function(){

            }
          })
        }
      }).on('update',function(e){
        $g.waiting = "Updating Comment..."

        e.form.trigger('close')
          $.ajax({
            url:'/api/workflowsubmissions/'+e.form.options.data.workflow_instance_id+'/save',
            dataType : 'json',
            contentType: 'application/json',
            data: JSON.stringify(_.extend(e.form.options.data,{comment:e.form.get('comment')})),
            type: 'POST',
            success  : function(form,result){
              form.trigger('close')

              this.get().all[_.findIndex(this.get().all,{id:result.id})] = result
              // this.container.update(this.get(),this)
              this.redraw();
              $g.waiting = false;

              // location.reload();
              // myResolve();
              //  $('.flow-title .status').html('All Changes Saved').addClass('label-success')
              // this.id = data.id;
              // if(typeof this.Dropzone == "undefined" && this.get().workflow.version.code.form.files && _.find(this.get().workflow.version.code.flow,{name:this.get().workflow.configuration.initial}).uploads){
              //   $('#myId').html('');
              //   this.Dropzone = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+this.id+"/files", init: function() {
              //     this.on("success", update);
              //   }});
              // }
              // this.initialstate = data.data;
              // data.data.files = this.form.collections.get('files')
              // this.set({current:data});
            }.bind(this,e.form),
            error:function(){
          
              // this.form.find('_state').el.style.opacity = 1
              // gform.types.fieldset.edit.call(e.form.find('_state'),true)
          
              // $('.gform-footer').show();
              // toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
          
          
            }})
           
      }.bind(this)).on('switch',function(context,e){
        // context.form.set({_state:_.find(context.get().all,{id:e.form.options.data.id}).data})
        // context.container.elementOf(context).querySelector('.submission-title').innerHTML = e.form.get('title')
        e.form.trigger('cancel');
        document.location = "?saved="+e.form.options.data.id
      }.bind(null,this)).modal()

    }
  }.bind(this))
  
    $g.on('workflow_summary',function(e){
      this.redraw(e.data);
    }.bind(this))

		}
	}
}

