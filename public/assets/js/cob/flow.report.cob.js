
workflow_report = {
history:`<ul class="list-group available_workflow" style="margin:10px 0 0">
<div class="filterable list-group-item" target="_blank" data-current=true data-id="{{data.0.id}}">
<div>{{workflow.user.first_name}} {{workflow.user.last_name}}
<span class="label pull-right label-success{{#data.0.closed}} label-danger{{/data.0.closed}}">{{data.0.end_state}}</span>

</div>
<hr>
<div><h5 style="text-align:right"><span>({{data.0.updated_at.fromNow}})</span></h5></div>
</div>
<div class="list-group-item bg-primary" ><h5>History</h5></div>
{{#data}}<div class="filterable list-group-item" target="_blank" data-id="{{id}}" ><div><h5>{{action}} <span class="text-muted">by {{user.first_name}} {{user.last_name}}</span><span class="pull-right">({{updated_at.fromNow}})</span></h5></div>
<span class="label label-default">{{start_state}}</span> <i class="fa fa-long-arrow-right text-muted"></i> <span class="label label-success{{#closed}} label-danger{{/closed}}">{{end_state}}</span><span class="pull-right text-muted">{{updated_at.date}} @ {{updated_at.time}} </span>{{#comment}}<h5>Comment:</h5><p>{{comment}}</p>{{/comment}}</div>{{/data}}
</ul>`,
container:`<div class="row">
<div class="list col-md-4 hidden-xs hidden-sm " style="margin: -15px 0 -15px -15px;background:#e8e8e8;padding:15px;position: fixed;overflow: scroll;top: 111px;bottom: 0;">
<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
</div>
<div class="col-md-8 col-md-offset-4 report" style="top:-20px">

</div>
</div>
<style>
.list-group-item.active{
background-color:#606971
}
.list-group-item.filterable:hover{
background-color:#f0f0f0;
cursor:pointer
}
.list-group-item.active:hover{
background-color:#606971
}
hr{
margin:10px 0
}
</style>`,
actions:`<div>{{#actions_data}}<span class="btn btn-{{type}}{{^type}}default{{/type}}" style="margin:2px 5px 2px 0" data-id="{{id}}" data-event="{{name}}">{{label}}</span>{{/actions_data}}</div>`,
report:`
<div class="panel">
  <div class="panel-body" style="padding-right: 50px;padding-left: 35px;">
    <div>
      <h3>{{workflow.user.first_name}} {{workflow.user.last_name}}</h3>
      <dl></dl>
      {{workflow.created_at}}
      <div>{{workflow.assignment_type}}:{{workflow.assignment_id}}</div>
      {{>actions}}
      <hr>
    </div>
    {{>preview}}
  </div>
</div>`,
form:`<div class="panel panel-default">
<div class="panel-heading" style="position:relative">
    <h3 class="panel-title">{{options.workflow_instance.name}}</h3>
  </div>
  <div class="panel-body" style="padding-right: 50px;padding-left: 35px;">
    <div class="form" style="padding-right: 50px;padding-left: 35px;"></div>
  </div>
</div>`

}


Cobler.types.WorkflowSubmissionReport = function(container){
	function get() {return item;}
	var item = {guid: generateUUID()}
	var fields = {}
	return {
    container:container,
		fields: fields,
		render: function() {return workflow_report.container;},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {$.extend(item, newItem);},
    stuff:function(fields, data){
      _.each(fields,function(data, field){
        switch(field.type){
          case 'fieldset':
              this.preview += '<h4>'+field.label+'</h4><hr><dl style="margin-left:10px">';
              if(field.array){
                _.each(data[field.name],function(data){
                  this.stuff(field.fields,data)
                }.bind(this))

              }else{
                this.stuff(field.fields,data[field.name])
              }
              this.preview += '</dl>';
            break;
          case 'radio':
          case 'select':
          case 'checkbox':
            if(data[field.name]){
              this.preview += '<dt>'+field.label+'</dt> <dd>'+_.find(field.options,{value:data[field.name]}).label+'</dd>';
            }else{
              this.preview += '<dt>'+field.label+'</dt> <dd>'+(data[field.name]||'(no selection)')+'</dd>';
            }
            break
          default:
              this.preview += '<dt>'+field.label+'</dt> <dd>'+(data[field.name]||'(empty)')+'</dd>';
        }

        this.preview += '<hr>';
      }.bind(this, data))
    },


		initialize: function(el){
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
      $.ajax({
        url:'/api/workflow/'+this.get().options.id+'/log',
        dataType : 'json',
        type: 'GET',
        success  : function(data){
        
          data = _.map(data, function(log){
            log.created_at = {
              original:log.created_at,
              time:moment(log.created_at).format('LTS'),
              date:moment(log.created_at).format('L'),
              fromNow:moment(log.created_at).fromNow()
            }
            log.updated_at = {
              original:log.updated_at,
              time:moment(log.updated_at).format('LTS'),
              date:moment(log.updated_at).format('L'),
              fromNow:moment(log.updated_at).fromNow()
            }
            log.closed = log.status == 'closed';
            log.open = log.status == 'open';
            return log;
          })

          
          this.container.elementOf(this).querySelector('.row .list').innerHTML = gform.renderString(workflow_report.history, {
            workflow:this.get().options,
            data:data,
            actions:(_.find(JSON.parse(this.get().options.workflow_version.code.flow),{name:this.get().options.state}) || {"actions": []}).actions
          });



          $('.filterable').on('click',function(data,e){
            $('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
            if(typeof previewForm !== 'undefined'){previewForm.destroy();}
            if(e.currentTarget.dataset.current){

              this.preview = _.find(this.get().options.workflow_version.code.templates,{name:"Preview"});
              if(typeof this.preview !== 'undefined' && this.preview.content.length){
                this.preview = this.preview.content;
              }else{
                this.preview = '<dl class="dl-horizontal">';
                this.preview = '<dl>';
                var fields = (JSON.parse(this.get().options.workflow_version.code.forms[0].content) || {fields:[]}).fields;
                var data = _.find(data,{id:parseInt(e.currentTarget.dataset.id)}).data
                this.stuff(fields, data)

                this.preview += '</dl>';
              }
              workflow_report.preview = this.preview;
              document.querySelector('.report').innerHTML =  gform.renderString(workflow_report.report, _.extend({}, workflow_report, {
                    workflow:this.get().options,
                    data:data[0],
                    actions_data:(_.find(JSON.parse(this.get().options.workflow_version.code.flow),{name:this.get().options.state}) || {"actions": []}).actions
                  }) );

            }else{
              var log = _.find(data,{id:parseInt(e.currentTarget.dataset.id)});
              form = {
                actions:[],
                data:{
                  _state:log.data
                },
                "fields":[
                  {"name":"_state",edit:false,"label":false,"type":"fieldset","fields": JSON.parse(cb.collections[0].getItems()[0].get().options.workflow_version.code.forms[0].content).fields},
                  {
                    "type": "hidden",
                    "name": "_flowstate",
                    "value": log.start_state
                  }
                ]
              }
              document.querySelector('.report').innerHTML = gform.renderString(workflow_report.form, this.get());
              
              previewForm = new gform(form, document.querySelector('.form'))
            }
          }.bind(this,data))

          $('.filterable').first().click();

          $('.report').on('click','[data-event]',function(e){
            // var event = e.currentTarget.dataset.event;
            debugger;
            var formStructure = {
              "legend":this.get().options.workflow_instance.name,
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
                  "value":this.get().options.state
                },{
                  "type": "hidden",
                  "name": "_flowaction",
                  "value": e.currentTarget.dataset.event
                },{
                  "type": "hidden",
                  "name": "_id",
                  "value": this.get().options.id
                }
              ],
              "fields":[
                {"name":"comment","type":"textarea","length":255}
              ]
            }
// item.actions = (_.find(JSON.parse(item.workflow_version.code.flow),{name:item.state}) || {"actions": []}).actions;
if(_.find((_.find(JSON.parse(this.get().options.workflow_version.code.flow),{name:this.get().options.state}) || {"actions": []}).actions,{name:e.currentTarget.dataset.event}).form){
  formStructure.data = {_state:this.get().options.data},
  formStructure.fields.splice(0,0,
    {"name":"_state","label":false,"type":"fieldset","fields": JSON.parse(_.find(this.get().options.workflow_version.code.forms,{name:'Initial Form'}).content).fields}
    )
debugger;
  }


              new gform(formStructure).on('save',function(e){
                document.querySelector('.report').innerHTML = '<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>';

                if(!e.form.validate(true))return;

                e.form.trigger('close')
                formData = {comment:e.form.get('comment'),action:e.form.get('_flowaction')}
                if(typeof e.form.fields._state !== 'undefined'){
                  formData._state =e.form.get('_state')
                }
                $.ajax({
                  url:'/api/workflow/'+e.form.get('_id'),
                  dataType : 'json',
                  type: 'PUT',
                  data: formData,
                  success  : function(data){
                    document.location.reload();
                    // data.actions = (_.find(JSON.parse(data.workflow_version.code.flow),{name:data.state}) || {"actions": []}).actions;
                    // data.updated_at = moment(data.updated_at).fromNow()
                    // e.model.set(data)
                    }
                })
              }.bind(this)).on('canceled',function(e){
                e.form.trigger('close')
              }).modal();
          }.bind(this))

          }.bind(this)
      })
		}
	}
}