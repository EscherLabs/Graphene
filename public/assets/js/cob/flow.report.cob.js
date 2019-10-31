workflow_report = {
file:` <a {{^deleted_at}}href="{{path}}/download"{{/deleted_at}} style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file">
<div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}{{^deleted_at}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/deleted_at}}{{/icon}}position:absolute;top:5px;left:5px">
{{{icon}}}
</div>{{name}}
<div style="margin-top:5px" class="text-muted">{{mime_type}}<span class="pull-right">{{date}}</span></div>
{{^deleted_at}}
{{#current_state.uploads}}
<div style="position: absolute;right: 10px;top: 5px;" class="btn-group parent-hover">
  <span data-id="{{id}}" data-action="edit" class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span>
  <span data-id="{{id}}" data-action="delete" class="remove-item btn btn-danger fa fa-trash-o" data-title="Delete"></span>
</div>
{{/current_state.uploads}}
{{/deleted_at}}
</a>
`,
files:`
<ul class="list-group workflow-files" style="margin:10px 0 0">
{{#history}}
  {{#file}}
  {{^deleted_at}}{{>file}}{{/deleted_at}}
  {{/file}}
{{/history}}
</ul>
`,
history:`<ul class="list-group workflow-history" style="margin:10px 0 0">
<div class="filterable submission list-group-item" target="_blank" data-current=true data-id="{{latest.id}}">
<div>{{owner.first_name}} {{owner.last_name}} (Originator)
<span class="label pull-right label-success{{#latest.closed}} label-danger{{/latest.closed}}">{{latest.end_state}}</span>
</div>
<hr>
<div><h5 style="text-align:right"><span data-toggle="tooltip" title="{{latest.updated_at.date}} @ {{latest.updated_at.time}}" data-placement="top">({{latest.updated_at.fromNow}})</span></h5></div>
</div>
<div class="list-group-item bg-info" style="color: white;background: #aaa;"><h4>History</h4></div>
{{#history}}
  {{#log}}
    <div class="filterable list-group-item submission" target="_blank" data-id="{{id}}" ><div><h5>{{action}} <span class="text-muted">by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>
    <span class="label label-default">{{previous.state}}</span> <i class="fa fa-long-arrow-right text-muted"></i> <span class="label label-success{{#closed}} label-danger{{/closed}}">{{state}}</span>
    <span style="display:none" class="pull-right text-muted">{{updated_at.date}} @ {{updated_at.time}} </span>
    {{#comment}}<h5>Comment:</h5><p>{{comment}}</p>{{/comment}}</div>
  {{/log}}
  {{#file}}
    <div style="height:60px;padding-left:70px" target="_blank" data-id="{{id}}" class="filterable list-group-item file {{#deleted_at}}list-group-item-danger{{/deleted_at}}">
    <div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;{{^icon}}{{^deleted_at}}background-image: url('{{path}}');background-size: contain;background-repeat: no-repeat;background-position: center;{{/deleted_at}}{{/icon}}position:absolute;top:5px;left:5px">
    {{{icon}}}
    </div>
    <div><h5><div style="position: relative;top: -5px;">{{name}}</div> <span class="text-muted">{{^deleted_at}}Attached{{/deleted_at}}{{#deleted_at}}Deleted {{/deleted_at}} by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>    </div>
  {{/file}}
{{/history}}
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
<dt>State</dt><dd>{{state}}</dd>
<dt>Original Submission</dt> <dd>{{original.created_at.date}} @ {{original.created_at.time}}</dd>
<dt>Last Action</dt> <dd>{{latest.updated_at.date}} @ {{latest.updated_at.time}}</dd>
<dt>Assignee</dt><dd>{{assignment.group.name}}{{^assignment.group.name}}{{assignment.user.first_name}} {{assignment.userlast_name}}{{/assignment.group.name}} ({{assignment.type}})</dd>
<dt>Submission ID</dt> <dd>{{original.workflow_submission_id}}</dd>

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
  </div>
      {{#workflow.instance.version.code.form.files}}
      <div>
      <h3>Attachments</h3><hr/>
      {{>files}}
      </div>
      {{#current_state.uploads}}
      <div class="dropzone" id="myId"><center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center></div>
      {{/current_state.uploads}}
      {{/workflow.instance.version.code.form.files}}
`,
view:`<div class="panel panel-default">
<div class="panel-heading" style="position:relative">
    <h3 class="panel-title">{{options.workflow_instance.name}}</h3>
  </div>
  <div class="panel-body" style="padding-right: 50px;padding-left: 35px;">
    <div class="view_container" style="padding-right: 50px;padding-left: 35px;"></div>
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
      // if(typeof log.deleted_at !== 'undefined'){
      //   log.deleted_at = {
      //     original:log.deleted_at,
      //     time:uat.format('h:mma'),
      //     date:uat.format('MM/DD/YY'),
      //     fromNow:uat.fromNow()
      //   }
      // }
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
          processFile = function(file){
            file = this.processDates(file);
            file.file = true;
            switch(file.mime_type){
              case "image/jpeg":
              case "image/png":
              case "image/jpg":
              case "image/gif":
                  if(file.deleted_at){
                    file.icon = '<i class="fa fa-image fa-3x" style="padding-top: 4px;"></i>';
                  }
                  file.preview = '<div style="text-align:center;padding:10px;"><img style="max-width:100%" src="'+file.path+'"/></div>';

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


              if(file.ext == "pdf"){
                file.preview = '<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>';
              }

            return file;
          }.bind(this)

          data = _.orderBy(_.map(response.logs, function(log){
            log = this.processDates(log);
            log.log = true;
            return log;
          }.bind(this)).concat(_.map(response.files, processFile)),'date','desc')
          

          templates = _.merge({},workflow_report, _.mapValues(_.keyBy(_.filter(this.get().options.workflow_version.code.templates,function(e){
            return e.content.length;
          }),function(e){return e.name.toLowerCase();}),'content'))

 
 
 
 
 
          mappedData = _.pick(this.get().options,'status','state')
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
          mappedData.current_state = _.find(mappedData.workflow.instance.version.code.flow,{name:mappedData.state});


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
            var newEvent = _.pick(event,'user','deleted_by','id','data','comment','action','status','created_at','updated_at','file','log','mime_type','path','name','icon','preview','date','deleted_at','deleted_by');

            newEvent.assignemnt = {type:event.assignment_type,id:event.assignment_id};
            newEvent.state = event.end_state;
            newEvent.actor = _.pick(event.deleted_by||event.user,'first_name','last_name','email','unique_id','id','params')
            newEvent.actor.is = {owner:mappedData.owner.unique_id == newEvent.actor.unique_id}
            newEvent.previous ={state:event.start_state}
            newEvent.is ={
              open:(newEvent.status == 'open'),
              closed:(newEvent.status == 'closed'),
              initial:(newEvent.state == mappedData.workflow.instance.configuration.initial)
            }
            return newEvent
          })

          mappedData.original = data[data.length-1];
          mappedData.latest = _.find(data, {log:true});

          if(typeof this.history !== 'undefined'){
            this.history.teardown();
          }
 
          this.history = new Ractive({el: this.container.elementOf(this).querySelector('.row .list'), template: templates.history, data: mappedData, partials: templates});

          // this.container.elementOf(this).querySelector('.row .list').innerHTML = gform.renderString(workflow_report.history, {workflow: this.get().options, data:data});
          $('[data-toggle="tooltip"]').tooltip()

          $('.filterable.file').on('click',function(e){
            debugger;
            $('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
            if(typeof previewForm !== 'undefined'){previewForm.destroy();}

            document.querySelector('.report').innerHTML = gform.renderString(workflow_report.view, this.get());
            // $('.report .view_container').append(gform.renderString(workflow_report.file, file))
            var file = _.find(mappedData.history,{selected:true});
            if(typeof file !== 'undefined'){
              file.selected = false;
            }
            file = _.find(mappedData.history,{id:parseInt(e.currentTarget.dataset.id),file:true});
            if(typeof file !== 'undefined'){
              file.selected = true;
            }

            var temp = `
            {{#history}}
            {{#selected}}
              {{>file}}
              <div><h5> <span class="text-muted">Attached by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{created_at.date}} @ {{created_at.time}}" data-placement="top">({{created_at.fromNow}})</span></h5></div>
              
              {{#deleted_at}}<div><h5><span class="text-muted">Deleted by {{deleted_by.first_name}} {{deleted_by.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>{{/deleted_at}}
              {{^deleted_at}}{{{preview}}}{{/deleted_at}}
            {{/selected}}{{/history}}`
            // $('.report .view_container').append(gform.renderString(temp,file))

            if(typeof this.ractive !== 'undefined'){
              this.ractive.teardown();
            }
            this.ractive = new Ractive({el: document.querySelector('.report .view_container'), template: temp, data: mappedData, partials: templates});
            $('[data-toggle="tooltip"]').tooltip()

          }.bind(this))
          
          update = function (dummy, response){
            if(typeof response !== 'undefined'){
       
              var event = processFile(response);
              if(typeof event.user == 'undefined' && event.user_id_created == this.get().user.id){
                event.user = this.get().user;
              }
              if(event.deleted_at && typeof event.deleted_by == 'undefined' && event.user_id_deleted == this.get().user.id){
                event.deleted_by = this.get().user;
              }
              var newEvent = _.pick(event,'user','deleted_by','id','data','comment','action','status','created_at','updated_at','file','log','mime_type','path','name','icon','preview','date','deleted_at','deleted_by');

              newEvent.assignemnt = {type:event.assignment_type,id:event.assignment_id};
              newEvent.state = event.end_state;

       
              
              newEvent.actor = _.pick(event.deleted_by||event.user,'first_name','last_name','email','unique_id','id','params')
              newEvent.actor.is = {owner:mappedData.owner.unique_id == newEvent.actor.unique_id}
              newEvent.previous ={state:event.start_state}
              newEvent.is ={
                open:(newEvent.status == 'open'),
                closed:(newEvent.status == 'closed'),
                initial:(newEvent.state == mappedData.workflow.instance.configuration.initial)
              }
              var exists = _.find(mappedData.history,{id:response.id});

              if(typeof exists !== 'undefined'){
                _.merge(exists,newEvent);
              }else{
                mappedData.history.unshift(newEvent)

              }
          
              this.history.update(mappedData)
              this.ractive.update(mappedData)
            }
          }.bind(this)


          $('.row .list').on('click','.filterable.submission', function(e){
            $('.active').removeClass('active')
            $(e.currentTarget).addClass('active')
            if(typeof previewForm !== 'undefined'){previewForm.destroy();}

            var log = _.find(mappedData.history,{id:parseInt(e.currentTarget.dataset.id),log:true});




            form = {
              name:"display",
              actions:[],
              data:{
                _state:log.data
              },
              "fields":[
                {"name":"_state",edit:false,"label":false,"type":"fieldset","fields": this.get().options.workflow_version.code.form.fields},
                {
                  "type": "hidden",
                  "name": "_flowstate",
                  "value": log.start_state||mappedData.workflow.instance.configuration.initial
                }
              ]
            }
            
            if(e.currentTarget.dataset.current){
              var states =  _.map(mappedData.history,function(item){return item.state;})
              states.push(mappedData.workflow.instance.configuration.initial)
              form.fields[1].value = _.uniq(_.compact(states));

              previewForm = new gform(form);
              previewForm.collections.update('files',_.where(mappedData.history,{file:true}));
              // file = _.find(mappedData.history,{file:true});
              // debugger;

              if(typeof templates.preview == 'undefined'){
                previewForm.on('change',function(e){
                  $('#previewForm').html(e.form.toString('_state'))
                })
                templates.preview = '<h4>Current Data</h4><div id="previewForm">'+previewForm.toString('_state')+'</div>';
              }


              if(typeof this.ractive !== 'undefined'){
                this.ractive.teardown();
              }
              mappedData.form = previewForm.toString('_state',true);
              // mappedData.form = log.data;
              this.ractive = new Ractive({el: document.querySelector('.report'), template: templates.report, data: mappedData, partials: templates});
              previewForm.on('change',function(e){
                this.ractive.set({form:e.form.toString('_state',true)}) 
              }.bind(this))

              if(mappedData.workflow.instance.version.code.form.files && mappedData.current_state.uploads){
                $('#myId').html('');
                this.Dropzone = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+mappedData.original.workflow_submission_id+"/files", init: function() {
                  this.on("success", update);
                }});
                
                update();
              }
              
              $('.workflow-files, .report').on('click','[data-id]',function(e){
   
                if(e.currentTarget.dataset.action == 'delete'){
                  e.stopPropagation();
                  e.preventDefault();
                  $.ajax({
                    url:'/api/workflowsubmissions/'+mappedData.original.workflow_submission_id+'/files/'+e.currentTarget.dataset.id,
                    type: 'delete',
                    success  : update.bind(null,{}),
                    error:function(){
        
                    }
                  })
        
                }else if(e.currentTarget.dataset.action == 'edit'){
                  e.stopPropagation();
                  e.preventDefault();
                  myModal = new gform({legend:"Edit file name",data:_.find(mappedData.history,{id:parseInt(e.currentTarget.dataset.id)}),fields:[
                    {name:"name",label:false},
                    {name:"id", type:"hidden"}
                  ]}).on('cancel',function(e){
                    e.form.trigger('close');
                  }).on('save',function(e){
                    $.ajax({
                      url:'/api/workflowsubmissions/'+mappedData.original.workflow_submission_id+'/files/'+e.form.get('id'),
                      type: 'put',
                      dataType : 'json',
                      contentType: 'application/json',
                      data: JSON.stringify(e.form.get()),
                      success  : update.bind(null,{}),
                      error:function(){
          
                      }
                    })
                    e.form.trigger('close');
                  }.bind(this)).modal();
                }
              }.bind(this))


            }else{
              document.querySelector('.report').innerHTML = gform.renderString(workflow_report.view, this.get());
              form.fields.push({
                "type": "hidden",
                "name": "_flowaction",
                "value": log.action
              })

              previewForm = new gform(form, document.querySelector('.view_container'))
            }
          }.bind(this))

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
                success  : function(data){ document.location.reload(); }
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

debug = {};
Object.defineProperty(debug,'about',{
  get: function(){
    console.log('%c Workflow:\t%c'+mappedData.workflow.name+' %c(ID: '+mappedData.workflow.instance.workflow_id+')','color: #d85e16','color: #aaa','color: #aaa')
    console.log('%c Instance:\t%c'+mappedData.workflow.instance.name+' %c(ID: '+mappedData.workflow.instance.id+')','color: #d85e16','color: #aaa','color: #aaa')
    console.log('%c Version:\t%c'+(mappedData.workflow.instance.version_id||'Latest')+' %c(Using ID: '+mappedData.workflow.instance.version.id+')  %cUpdated  %c'+mappedData.workflow.instance.updated_at,'color: #d85e16','color: #aaa','color: #aaa','color: #d85e16','color: #aaa')
  },
  configurable: false,
});
Object.defineProperty(debug,'summary',{
  get: function(){
    console.log('%c Status:\t\t%c'+mappedData.status,'color: #d85e16','color: #aaa')
    console.log('%c State:\t\t\t%c'+mappedData.state,'color: #d85e16','color: #aaa')

    if(typeof gform.instances.display !== 'undefined'){
      console.log('%c _flowstate:\t%c'+gform.instances.display.get('_flowstate'),'color: #d85e16','color: #aaa')
      console.log('%c Current Form Data:','color: #0088FF',)
      console.log(gform.instances.display.get('_state'))
    }
    console.log('%c Template Data:','color: #0088FF',)
    console.log(mappedData)
  },
  configurable: false,
});
Object.defineProperty(debug,'form',{
  get: function(){
    if(typeof gform.instances.display !== 'undefined'){
      return gform.instances.display;
    }
  },
  configurable: false,
});
Object.defineProperty(debug,'data',{
  get: function(){
    return mappedData;
  },
  configurable: false,
});

Object.defineProperty(debug,'history',{
  get: function(){
    console.table(_.map(mappedData.history,function(item){
      // item = _.omit(item,'is','log','file','data','date');
      item.owner = item.user.first_name+' '+item.user.last_name;
      item.created_at = item.created_at.date+' '+item.created_at.time;
      item.updated_at = item.updated_at.date+' '+item.updated_at.time;
      if(item.assignemnt.type == "group"){
        item.assignemnt = "Group:"+item.assignemnt.id
      }else{
        item.assignemnt = "User:"+item.assignemnt.id
      }
      item.actor = item.actor.first_name+' '+item.actor.last_name;
      item.previous = item.state+'('+item.status+')';

      // item.user = item.user.first_name+' '+item.user.last_name;
      return _.omit(item,'is','log','file','data','date','user');
    }))
  },
  configurable: false,
});
Object.defineProperty(window,'help',{
  get: function(){
    console.log('%c debug.about\t%c - info about the workflow configuration','color: #0088FF','color: #aaa')
    console.log('%c debug.summary\t%c - summary','color: #0088FF','color: #aaa')
    console.log('%c debug.form\t\t%c - reference to the displayed form','color: #0088FF','color: #aaa')
    console.log('%c debug.data\t\t%c - template data','color: #0088FF','color: #aaa')
    console.log('%c debug.history\t%c - template data','color: #0088FF','color: #aaa')
  },
  configurable: false,
});
