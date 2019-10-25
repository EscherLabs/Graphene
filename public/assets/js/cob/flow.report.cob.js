workflow_report = {
file:` <div style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file {{#deleted_at}}list-group-item-danger{{/deleted_at}}">
<div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/icon}}position:absolute;top:5px;left:5px">
{{{icon}}}
</div>{{name}}
<div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div>
</div>`,
history:`<ul class="list-group workflow-history" style="margin:10px 0 0">
<div class="filterable submission list-group-item" target="_blank" data-current=true data-id="{{data.0.id}}">
<div>{{workflow.user.first_name}} {{workflow.user.last_name}} (Originator)
<span class="label pull-right label-success{{#data.0.closed}} label-danger{{/data.0.closed}}">{{data.0.end_state}}</span>

</div>
<hr>
<div><h5 style="text-align:right"><span data-toggle="tooltip" title="{{data.0.updated_at.date}} @ {{data.0.updated_at.time}}" data-placement="top">({{data.0.updated_at.fromNow}})</span></h5></div>
</div>
<div class="list-group-item bg-info" style="color: white;background: #aaa;" ><h4>History</h4></div>
{{#data}}
  {{#log}}
    <div class="filterable list-group-item submission" target="_blank" data-id="{{id}}" ><div><h5>{{action}} <span class="text-muted">by {{user.first_name}} {{user.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>
    <span class="label label-default">{{start_state}}</span> <i class="fa fa-long-arrow-right text-muted"></i> <span class="label label-success{{#closed}} label-danger{{/closed}}">{{end_state}}</span>
    <span style="display:none" class="pull-right text-muted">{{updated_at.date}} @ {{updated_at.time}} </span>
    {{#comment}}<h5>Comment:</h5><p>{{comment}}</p>{{/comment}}</div>
  {{/log}}
  {{#file}}
    {{>file}}
  {{/file}}
{{/data}}
</ul>`,
container:`<div class="row">
<div class="list col-md-4 hidden-xs hidden-sm " style="">
<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
</div>
<div class="col-md-8 col-md-offset-4 report" style="top:-20px">

</div>
</div>
<style>
.list-group-item.active{
background-color:#606971;
    border-color: #606971 !important;
}
.list-group-item.active .text-muted{
  color:#a5a5a5
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
actions:`{{#is.actionable}}<div class="hidden-print"><legend>Available Actions</legend><div>{{#actions}}<span class="btn btn-{{type}}{{^type}}default{{/type}}" style="margin:2px 5px 2px 0" data-id="{{id}}" data-event="{{name}}">{{label}}</span>{{/actions}}</div><br></div>{{/is.actionable}}`,
summary:`<dl class="dl-horizontal">
<dt>Status</dt><dd style="text-transform: capitalize;">{{status}}</dd>
<dt>State</dt><dd style="text-transform: capitalize;">{{state}}</dd>
<dt>Original Submission</dt> <dd>{{original.created_at.date}} @ {{original.created_at.time}}</dd>
<dt>Last Action</dt> <dd>{{history.0.updated_at.date}} @ {{history.0.updated_at.time}}</dd>
<dt>Assignee</dt><dd>{{assignment.user.name}}{{^assignment.user.name}}{{assignment.user.first_name}} {{assignment.userlast_name}}{{/assignment.user.name}} ({{assignment.type}})</dd>

</dl>`,
report:`
<div>
    <span class="label pull-right label-success{{#data.closed}} label-danger{{/data.closed}}">{{data.end_state}}</span>
    Submitted {{workflow.created_at.fromNow}} by <h4>{{owner.first_name}} {{owner.last_name}}</h4><hr>
    <div class="row">
      <div class="col-md-6">
      {{>summary}}
      </div>
      <div class="col-md-6">
      {{>actions}}
      </div>
    </div>
    </div>
<div class="panel">
  <div class="panel-body">
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
    processDates:function(log){
      var cat = moment(log.created_at);
      var uat = moment(log.updated_at);
      log.created_at = {
        original:log.created_at,
        time:cat.format('h:mma'),
        date:cat.format('MM/DD/YY'),
        fromNow:cat.fromNow()
      }
      log.updated_at = {
        original:log.updated_at,
        time:uat.format('h:mma'),
        date:uat.format('MM/DD/YY'),
        fromNow:uat.fromNow()
      }
      log.date = log.created_at.original;
      log.closed = log.status == 'closed';
      log.open = log.status == 'open';
      return log;
    },
		initialize: function(el){
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
      $.ajax({
        url:'/api/workflowsubmissions/'+this.get().options.id+'/history',
        dataType : 'json',
        type: 'GET',
        success  : function(response){
          this.get().options = this.processDates(this.get().options)
        
          data = _.orderBy(_.map(response.logs, function(log){
            log = this.processDates(log);
            log.log = true;
            return log;
          }.bind(this)).concat(_.map(response.files, function(file){
            file = this.processDates(file);
            file.file = true;
            switch(file.mime_type){
              case "image/jpeg":
              case "image/png":
              case "image/jpg":
              case "image/gif":
                break;
              // case "application/pdf":
              //   file.icon = '<i class="fa fa-file-pdf-o fa-3x" style="padding-top: 4px;"></i>';
              //   break;
              // case "application/zip":
              //   file.icon = '<i class="fa fa-file-zip-o fa-3x" style="padding-top: 4px;"></i>';
              //   break;
              default:
                var icons = {
                  // Media
                  image: "fa-file-image-o",
                  audio: "fa-file-audio-o",
                  video: "fa-file-video-o",
                  // Documents
                  "application/pdf": "fa-file-pdf-o",
                  "application/msword": "fa-file-word-o",
                  "application/vnd.ms-word": "fa-file-word-o",
                  "application/vnd.oasis.opendocument.text": "fa-file-word-o",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml":
                    "fa-file-word-o",
                  "application/vnd.ms-excel": "fa-file-excel-o",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml":
                    "fa-file-excel-o",
                  "application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel-o",
                  "application/vnd.ms-powerpoint": "fa-file-powerpoint-o",
                  "application/vnd.openxmlformats-officedocument.presentationml":
                    "fa-file-powerpoint-o",
                  "application/vnd.oasis.opendocument.presentation": "fa-file-powerpoint-o",
                  "text/plain": "fa-file-text-o",
                  "text/html": "fa-file-code-o",
                  "application/json": "fa-file-code-o",
                  // Archives
                  "application/gzip": "fa-file-archive-o",
                  "application/zip": "fa-file-archive-o"
                }
                var icon = icons[file.mime_type] || icons[file.mime_type.split('/')[0]] || icons[file.ext] || "fa-file-o";
                file.icon = '<i class="fa '+icon+' fa-3x" style="padding-top: 4px;"></i>';
              }


            return file;
          }.bind(this) )),'date','desc')
          

          var templates = _.merge({},workflow_report, _.mapValues(_.keyBy(_.filter(this.get().options.workflow_version.code.templates,function(e){
            return e.content.length;
          }),function(e){return e.name.toLowerCase();}),'content'))

          if(typeof this.history !== 'undefined'){
            this.history.teardown();
          }

          this.history = new Ractive({el: this.container.elementOf(this).querySelector('.row .list'), template: templates.history, data: {workflow: this.get().options,data:data}, partials: templates});



          // this.container.elementOf(this).querySelector('.row .list').innerHTML = gform.renderString(workflow_report.history, {workflow: this.get().options, data:data});
  $('[data-toggle="tooltip"]').tooltip()

  $('.filterable.file').on('click',function(data,e){
    $('.active').removeClass('active')
    $(e.currentTarget).addClass('active')
    if(typeof previewForm !== 'undefined'){previewForm.destroy();}
    var file = _.find(data,{id:parseInt(e.currentTarget.dataset.id),file:true});
    if(file.ext == "pdf"){
      $('.report').html('<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>')
    }else{
      $('.report').html('<img src="'+file.path+'"/>')
    }
  }.bind(null,data))
          $('.filterable.submission').on('click',function(data,e){
            $('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
            if(typeof previewForm !== 'undefined'){previewForm.destroy();}

            var log = _.find(data,{id:parseInt(e.currentTarget.dataset.id),log:true});

            form = {
              actions:[],
              data:{
                _state:log.data
              },
              "fields":[
                {"name":"_state",edit:false,"label":false,"type":"fieldset","fields": this.get().options.workflow_version.code.form.fields},
                {
                  "type": "hidden",
                  "name": "_flowstate",
                  "value": log.start_state
                }
              ]
            }
            
            if(e.currentTarget.dataset.current){



              // this.preview = (_.find(this.get().options.workflow_version.code.templates,{name:"Preview"})||{content:''});
              // if(this.preview.content.length){
              //   this.preview = this.preview.content;
              // }else{
                previewForm = new gform(form)
              if(typeof templates.preview == 'undefined'){
                previewForm.on('change',function(e){
                  $('#previewForm').html(e.form.toString('_state'))
                })
                templates.preview = '<h4>Current Data</h4><div id="previewForm">'+previewForm.toString('_state')+'</div>';
              }
              // workflow_report.preview = this.preview;
              
              // reportData =  {
              //   workflow:this.get().options,
              //   assignment:this.get().assignment,
              //   data:data[0]
              // }
              // if(this.get().is_assigned){
              //   reportData.actions_data = (_.find(this.get().options.workflow_version.code.flow,{name:this.get().options.state}) || {"actions": []}).actions
              // }


              // console.log(reportData)
              var mappedData = _.pick(this.get().options,'status','state')
  
              if(this.get().is_assigned){
                mappedData.actions = (_.find(this.get().options.workflow_version.code.flow,{name:this.get().options.state}) || {"actions": []}).actions
              }



              mappedData.report_url = this.get().report_url;

              mappedData.owner = _.pick(this.get().options.user,'first_name','last_name','email','unique_id','id','params')
              mappedData.actor = _.pick(this.get().user,'first_name','last_name','email','unique_id','id','params')
              mappedData.owner.is = {actor:mappedData.owner.unique_id == mappedData.actor.unique_id}
              mappedData.actor.is = {owner:mappedData.owner.unique_id == mappedData.actor.unique_id}
              mappedData.assignment = {type:this.get().options.assignment_type,id:this.get().options.assignment_id};
              if(mappedData.assignment.type == "user"){
                mappedData.assignment.user = _.pick(this.get().assignment,'first_name','last_name','email','unique_id','id','params')
              }else{
                mappedData.assignment.group = this.get().assignment;
              }
              mappedData.workflow = {name:this.get().options.workflow.name,description:this.get().options.workflow.description ,instance:this.get().options.workflow_instance};

              mappedData.is ={
                open:(mappedData.status == 'open'),
                closed:(mappedData.status == 'closed'),
                initial:(mappedData.state == mappedData.workflow.instance.configuration.initial),
                actionable:(this.get().is_assigned && mappedData.actions.length)
              }

              if(data.length>1){
                mappedData.previous = _.pick(data[1],'state','status')
                mappedData.previous.state = mappedData.previous.end_state||mappedData.workflow.instance.configuration.initial;
                mappedData.was ={
                  open:(mappedData.previous.status == 'open'),
                  closed:(mappedData.previous.status == 'closed'),
                  initial:(mappedData.previous.state == mappedData.workflow.instance.configuration.initial)
                }
              }

              mappedData.history = _.map(data, function(event){
                var newEvent = _.pick(event,'id','data','comment','action','status','created_at','updated_at');
                newEvent.assignemnt = {type:event.assignment_type,id:event.assignment_id};
                newEvent.state = event.end_state;
                newEvent.actor = _.pick(event.user,'first_name','last_name','email','unique_id','id','params')
                newEvent.actor.is = {owner:mappedData.owner.unique_id == newEvent.actor.unique_id}
                newEvent.previous ={state:event.start_state}
                newEvent.is ={
                  open:(newEvent.status == 'open'),
                  closed:(newEvent.status == 'closed'),
                  initial:(newEvent.state == mappedData.workflow.instance.configuration.initial)
                }
                // return event;
                return newEvent
              })

              mappedData.original = data[data.length-1];

              // console.log(mappedData);

              // document.querySelector('.report').innerHTML =  gform.renderString(templates.report, _.extend({}, templates,reportData));
              // document.querySelector('.report').innerHTML =  gform.renderString(templates.report, _.extend({}, templates, mappedData));

              if(typeof this.ractive !== 'undefined'){
                this.ractive.teardown();
              }
              mappedData.form = previewForm.toString('_state',true);
              // debugger;
              // mappedData.form = data[0].data;
              console.log(mappedData.actions)
              debugger;

              this.ractive = new Ractive({el: document.querySelector('.report'), template: templates.report, data: mappedData, partials: templates});
              previewForm.on('change',function(e){
                this.ractive.set({form:e.form.toString('_state',true)}) 
              }.bind(this))

            }else{
              document.querySelector('.report').innerHTML = gform.renderString(workflow_report.form, this.get());
              
              previewForm = new gform(form, document.querySelector('.form'))
            }
          }.bind(this,data))

          $('.filterable').first().click();

          $('.report').on('click','[data-event]',function(e){
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
            if(_.find((_.find(this.get().options.workflow_version.code.flow,{name:this.get().options.state}) || {"actions": []}).actions,{name:e.currentTarget.dataset.event}).form){
              formStructure.data = {_state:this.get().options.data},
              formStructure.fields.splice(0,0,{"name":"_state","label":false,"type":"fieldset","fields": this.get().options.workflow_version.code.form.fields})
            }

            new gform(formStructure).on('save',function(e){
              document.querySelector('.report').innerHTML = '<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>';

              if(!e.form.validate(true))return;

              e.form.trigger('close')
              formData = {comment:e.form.get('comment'),action:e.form.get('_flowaction')}

              if(typeof e.form.find('_state') !== 'undefined'){
                formData._state =e.form.get('_state')
              }
              $.ajax({
                url:'/api/workflowsubmissions/'+e.form.get('_id'),
                dataType : 'json',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                type: 'PUT',
                success  : function(data){
                  document.location.reload();
                  // data.actions = (_.find(data.workflow_version.code.flow,{name:data.state}) || {"actions": []}).actions;
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