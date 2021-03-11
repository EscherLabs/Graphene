
Cobler.types.WorkflowSubmissionReport = function(container){
	function get() {return item;}
	var item = {guid: generateUUID()}
	var fields = {}
	return {
    container:container,
		fields: fields,
		render: function() {return workflow_report.container;},
		edit: defaultCobEditor.call(this, container),
		toJSON: get,
		get: get,
    set: function (newItem) {$.extend(item, newItem);},
    processFile:function(file){
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
        default:
          
          // var icon = ;
          file.icon = '<i class="fa '+mime_type_icon_map[file.mime_type] || mime_type_icon_map[file.mime_type.split('/')[0]] || mime_type_icon_map[file.ext] || "fa-file-o"+' fa-3x" style="padding-top: 4px;"></i>';
          file.preview = "";
        }


        if(file.ext == "pdf"){
          file.preview = '<iframe width="100%" height="'+($( document ).height()-$('.report').position().top-100)+'px" src="'+file.path+'"></iframe>';
        }

      return file;
    },
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
      
      $('body').append('<style>@media (min-width: 992px) {.modal.gform .modal-dialog{width:992px}}</style>')

      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }

      $.ajax({
        url:'/workflows/fetch/'+this.get().options.workflow_instance_id+'/all/'+this.get().options.id,
        dataType : 'json',
        type: 'GET',
        success  : function(resources){


          $.ajax({
            url:'/api/workflowsubmissions/'+this.get().options.id+'/history',
            dataType : 'json',
            type: 'GET',
            success  : function(resources, response){
    
    
    
              this.get().options = this.processDates(this.get().options)
              data = _.orderBy(_.map(response.logs, function(log){
                log = this.processDates(log);
                log.log = true;
                return log;
              }.bind(this)).concat(_.map(response.files, this.processFile.bind(this))),'date','desc')
              
    
              templates = _.merge({},workflow_report, _.mapValues(_.keyBy(_.filter(this.get().options.workflow_version.code.templates,function(e){
                return e.content.length;
              }),function(e){return e.name.toLowerCase();}),'content'))
    
     
     
     
     
     
              mappedData = _.pick(this.get().options,'status','state')
    
              mappedData.report_url = this.get().report_url;
              mappedData.owner = _.pick(this.get().options.user,'first_name','last_name','email','unique_id','id','params')
              mappedData.actor = _.pick(this.get().user,'first_name','last_name','email','unique_id','id','params','groups')
              mappedData.owner.is = {actor:mappedData.owner.unique_id == mappedData.actor.unique_id}
              mappedData.actor.is = {owner:mappedData.owner.unique_id == mappedData.actor.unique_id}
              mappedData.assignment = {type:this.get().options.assignment_type,id:this.get().options.assignment_id};
              if(mappedData.assignment.type == "user"){
                mappedData.assignment.user = _.pick(this.get().assignment,'first_name','last_name','email','unique_id','id','params')
              }else{
                mappedData.assignment.group = this.get().assignment;
              }
              mappedData.workflow = {name:this.get().options.workflow.name,description:this.get().options.workflow.description ,instance:this.get().options.workflow_instance};
              mappedData.current_state = _.find(mappedData.workflow.instance.version.code.flow,{name:mappedData.state})||mappedData.workflow.instance.version.code.flow[0];
    
    
              mappedData.is ={
                open:(mappedData.status == 'open'),
                closed:(mappedData.status == 'closed'),
                initial:(mappedData.state == mappedData.workflow.instance.configuration.initial),
                // actionable:(this.get().is_assigned && mappedData.actions.length)
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
                newEvent.created_by = _.pick(event.user,'first_name','last_name','email','unique_id','id','params')
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
              mappedData.datamap = {};
              _.each(mappedData.workflow.instance.configuration.map,function(item){
                mappedData.datamap[item.name] = item.value;
              })
    
              // if(this.get().is_assigned){
                mappedData.actions = _.filter((_.find(this.get().options.workflow_version.code.flow,{name:this.get().options.state}) || {"actions": []}).actions,function(is_assigned,action){
                  if(typeof action.assignment == 'undefined'){
                   if(is_assigned){return true;}
                  }else{
                    if(action.assignment.type == "user"){
                      if(gform.m(action.assignment.id,mappedData) == mappedData.actor.unique_id.toString()){
                        return true;
                      }
                    }else if(action.assignment.type == "group"){
                      if(mappedData.actor.groups.indexOf(parseInt(gform.m(action.assignment.id,mappedData))) >=0){
                        return true;
                      }
                    }
                  }
                  return false;
    
    
                }.bind(null,this.get().is_assigned))
              // }
              mappedData.is.actionable = !!mappedData.actions.length

              /* problem here  */
              gform.options.rootpath = '/workflows/fetch/'+mappedData.workflow.instance.id+'/'

              _.each(resources,function(item,name){
                gform.collections.add(name, _.isArray(item)?item:[])
              })
              mappedData.resources = _.reduce(resources,function(resources, item, name){
                resources[name] = item;
                return resources;
              },{})

              mappedData.hasFiles = (_.filter(mappedData.history,function(item){if(item.file && (item.deleted_at == null)){return item;} }).length>0)
    
              if(typeof this.history !== 'undefined'){
                this.history.teardown();
              }
              this.history = new Ractive({el: this.container.elementOf(this).querySelector('.row .list'), template: templates.history, data: _.extend({},this.methods,mappedData), partials: templates});
    
              // this.container.elementOf(this).querySelector('.row .list').innerHTML = gform.renderString(workflow_report.history, {workflow: this.get().options, data:data});
              $('[data-toggle="tooltip"]').tooltip()
    
              gform.collections.on('change',function(e){
                mappedData.resources[e.collection] = gform.collections.get(e.collection);
                if(typeof this.history !== 'undefined'){
                  this.history.update({data:mappedData});
                }

                if(typeof this.ractive !== 'undefined'){
                  this.ractive.update({data:mappedData});
                }
              }.bind(this))
              $('.filterable.file').on('click',function(e){
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
    
                // var temp = `
                // {{#history}}
                // {{#selected}}
                //   {{>file}}
                //   <div><h5> <span class="text-muted">Attached by {{actor.first_name}} {{actor.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{created_at.date}} @ {{created_at.time}}" data-placement="top">({{created_at.fromNow}})</span></h5></div>
                  
                //   {{#deleted_at}}<div><h5><span class="text-muted">Deleted by {{deleted_by.first_name}} {{deleted_by.last_name}}</span><span class="pull-right" data-toggle="tooltip" title="{{updated_at.date}} @ {{updated_at.time}}" data-placement="top">({{updated_at.fromNow}})</span></h5></div>{{/deleted_at}}
                //   {{^deleted_at}}{{{preview}}}{{/deleted_at}}
                // {{/selected}}{{/history}}`
                // $('.report .view_container').append(gform.renderString(temp,file))
    
                if(typeof this.ractive !== 'undefined'){
                  this.ractive.teardown();
                }
                this.ractive = new Ractive({el: document.querySelector('.report .view_container'), template: workflow_report.file_summary, data:  _.extend({},this.methods,mappedData), partials: templates});
                $('[data-toggle="tooltip"]').tooltip()

    
    
              }.bind(this))
              this.methods = [];
              update = function (dummy, response){
                if(typeof response !== 'undefined'){
                  var event = this.processFile.call(this,response);
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
                  newEvent.created_by = _.pick(event.user,'first_name','last_name','email','unique_id','id','params')
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
              _.each(this.get().options.workflow_version.code.methods,function(item,index){
                eval('this.methods["'+item.name+'"] = this.methods["method_'+index+'"] = function(data,e){'+item.content+'\n}.bind(null,mappedData)');
              }.bind(this))
    
              $('.row .list').on('click','.filterable.submission', function(e){
                $('.active').removeClass('active')
                $(e.currentTarget).addClass('active')
                if(typeof previewForm !== 'undefined'){previewForm.destroy();}
    
                var log = _.find(mappedData.history,{id:parseInt(e.currentTarget.dataset.id),log:true});
    
                var states =  _.map(mappedData.history,function(item){return item.state;})
                states.push(mappedData.workflow.instance.configuration.initial)
                mappedData._flowstate_history = _.uniq(_.compact(states));
    
                form = {
                  name:"display",
                  actions:[],
                  data:{
                    _state:log.data,
                    data:mappedData,
                    user:this.get().user,
                  },
                  "fields":[
                    {"name":"_state",edit:false,"label":"","type":"fieldset","fields": this.get().options.workflow_version.code.form.fields},
                    {
                      "type": "hidden",
                      "name": "_flowstate",
                      "value": log.state||mappedData.workflow.instance.configuration.initial
                    },{
                      "type": "hidden",
                      "name": "_flowstate_history",
                      "value": mappedData._flowstate_history
                    }
                  ]
                }
                form.methods = this.methods;
                // _.each(this.get().options.workflow_version.code.methods,function(item,index){
                //   eval('form.methods["'+item.name+'"] = form.methods["method_'+index+'"] = function(data,e){'+item.content+'}.bind(form.data,form.data.data)');
                // }.bind(this))
                form.events = this.get().options.workflow_version.code.form.events

                // var fd = log.data;
                
                // if(mappedData.workflow.instance.version.code.form.resource !== ''){
                //   if(mappedData.workflow.instance.version.code.form.resource in mappedData.resources){
                //     _.merge(form.data._state,mappedData.resources[mappedData.workflow.instance.version.code.form.resource]);
                //   }
                //   if(mappedData.workflow.instance.version.code.form.resource in form.methods){
                //     _.merge(form.data._state,form.methods[mappedData.workflow.instance.version.code.form.resource]({},data));
                //   }
                // }
                  // debugger;

                if(e.currentTarget.dataset.current){
                  var states =  _.map(mappedData.history,function(item){return item.state;})
                  states.push(mappedData.workflow.instance.configuration.initial)
                  form.fields[2].value = _.uniq(_.compact(states));
    
                  gform.collections.update('files',_.where(mappedData.history,{file:true}));
                  previewForm = new gform(form);

                  // file = _.find(mappedData.history,{file:true});
                  if(typeof templates.preview == 'undefined'){
                    previewForm.on('change',function(e){
                      $('#previewForm').html(e.form.toString('_state'))
                      templates.preview = '<h4>Current Data</h4><div id="previewForm">'+previewForm.toString('_state')+'</div>';
    
                    })
                    templates.preview = '<h4>Current Data</h4><div id="previewForm">'+previewForm.toString('_state')+'</div>';
                  }
    
                  if(typeof this.ractive !== 'undefined'){
                    this.ractive.teardown();
                  }

                  mappedData.preview = previewForm.toString('_state');
                  mappedData.form = previewForm.toString('_state',true);
                  // mappedData.form = log.data;
                  this.ractive = new Ractive({el: document.querySelector('.report'), template: templates.report, data: _.extend({},this.methods,mappedData), partials: templates});

                  previewForm.on('change',function(e){
                    mappedData.form = e.form.toString('_state',true);
                    mappedData.preview = previewForm.toString('_state');

                    this.ractive.set({form:mappedData.form}) 
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
    
                  var states =  _.map(mappedData.history,function(compareDate,item){
                    if(compareDate.isAfter(moment(item.created_at.original))){
                      return item.state;
                    }
                  }.bind(null,moment(log.created_at.original)))
                  states.push(mappedData.workflow.instance.configuration.initial)
                  form.fields[2].value = _.uniq(_.compact(states));
    
                  form.fields[1].value = log.previous.state;
                  previewForm = new gform(form, document.querySelector('.view_container'))
                }
              }.bind(this))
    
              $('.filterable').first().click();
    
              $('.report').on('click','[data-event]',function(e){
                var formStructure = {
                  "legend":this.get().options.workflow_instance.name,
                  "events":this.get().options.workflow_version.code.form.events||{},
                  "data":{user:this.get().user,data:mappedData,_flowstate:this.get().options.state,_flowaction:e.currentTarget.dataset.event,_id:this.get().options.id},
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
                      "name": "_flowstate"
                    },{
                      "type": "hidden",
                      "name": "_flowstate_history",
                      "value": ''
                    },{
                      "type": "hidden",
                      "name": "_flowaction"
                    },{
                      "type": "hidden",
                      "name": "_id"
                    }
                  ],
                  "fields":[
                    {"name":"comment","label":"Comment","type":"textarea","length":255}
                  ]
                }
    
    
                if(_.find((_.find(this.get().options.workflow_version.code.flow,{name:this.get().options.state}) || {"actions": []}).actions,{name:e.currentTarget.dataset.event}).form){
                  formStructure.data._state = this.get().options.data;

                    // formStructure.data._state = formStructure.data._state ||{};
                    // if(this.get().workflow.workflow.code.form.resource !== ''){
                    // if(this.get().workflow.workflow.code.form.resource in mappedData.resources){
                    //   _.merge(formStructure.data._state,mappedData.resources[this.get().workflow.workflow.code.form.resource]);
                    // }
                    // if(this.get().workflow.workflow.code.form.resource in formStructure.methods){
                    //   _.merge(formStructure.data._state,formStructure.methods[this.get().workflow.workflow.code.form.resource](data));
                    // }
                    // }


                  formStructure.fields.splice(0,0,{"name":"_state","label":false,"type":"fieldset","fields": this.get().options.workflow_version.code.form.fields})
                }
    
                var states =  _.map(mappedData.history,function(item){
                  return item.state;
                })
                states.push(mappedData.workflow.instance.configuration.initial)
                formStructure.actions[3].value = _.uniq(_.compact(states));
    
    
                formStructure.methods = [];
                _.each(this.get().options.workflow_version.code.methods,function(item,index){
                  eval('formStructure.methods["method_'+index+'"] = function(e){'+item.content+'\n}.bind(formStructure.data)');
                }.bind(this))
    
                // formStructure.methods = this.methods;
    
                new gform(formStructure).on('save',function(e){
                  document.querySelector('.report').innerHTML = '<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>';
    
                  if(!e.form.validate(true))return;
    
                  e.form.trigger('close')
                  formData = {comment:e.form.get('comment'),action:e.form.get('_flowaction')}
    
                  if(typeof e.form.find('_state') !== 'undefined'){
                    formData._state =e.form.get('_state')
                  }

                  // formData.data._state = formData.data._state ||{};
                  // if(this.get().workflow.workflow.code.form.resource !== ''){
                  //   if(this.get().workflow.workflow.code.form.resource in mappedData.resources){
                  //     _.merge(formData.data._state,mappedData.resources[this.get().workflow.workflow.code.form.resource]);
                  //   }
                  //   if(this.get().workflow.workflow.code.form.resource in formData.methods){
                  //     _.merge(formData.data._state,formData.methods[this.get().workflow.workflow.code.form.resource](data));
                  //   }
                  // }

                  $.ajax({
                    url:'/api/workflowsubmissions/'+e.form.get('_id'),
                    dataType : 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(formData),
                    type: 'PUT',
                    success  : function(data){ document.location.reload(); },
                    error:function(){
                      toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
                    }
                  })
                }.bind(this)).on('canceled',function(e){
                  e.form.trigger('close')
                }).modal();
              }.bind(this))
    
            }.bind(this,resources)
          })


        }.bind(this)})
		}
	}
}