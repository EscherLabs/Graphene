//methods => evalmethods ?? this could be a problem if methods['name'] are called directly

Cobler.types.Workflow = function(container){
	function get(){ return {widgetType:'Workflow',...item};}
	function set(newItem){
    $.extend(item, newItem);
    ({current, workflow, instance_id, guid, user, resources} = item);
    ({flow, form, methods} = workflow.version.code);
    flowState = (_.find(flow,{name:workflow.configuration.initial})||flow[0]);

    $g.emit('workflow_summary', {current:current})
  }
  function reload(){location.reload();}

  function saveFlow(data) {
    gform.types.fieldset.edit.call(workflowForm.find('_state'),false)
    workflowForm.find('_state').el.style.opacity = .7
    $('.gform-footer').hide();

    $.ajax({
      url:'/api/workflowsubmissions/'+instance_id,
      dataType: 'json', contentType: 'application/json', type: 'POST',
      data: JSON.stringify((()=>{
        return {...workflowForm.get(), ...data, _state: JSON.stringify(data['_state'])}
      })()),
      success: data=>{
        document.location = "/workflows/report/"+data.id;
      },
      error:()=>{
        workflowForm.find('_state').el.style.opacity = 1
        gform.types.fieldset.edit.call(workflowForm.find('_state'),true)
        $('.gform-footer').show();
        toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
      }
    })
  }

  function updateRequiredFields() {
    $g.emit('workflow_summary', {required:
      _.uniq(_.compact(_.map(
        gform.items.filter.call(workflowForm.find({name: "_state"}), {active: true, required: true}, {stopOnFail: false})
        , e => {
          return {..._.pick(e,'label','id'),satisfied:e.satisfied()};
          //  return {label: e.label, id: e.id, satisfied: e.satisfied()}; 
        }
      )))
    })
  }

  function processAction(action){
    var currentAction = _.find(flowState.actions, {name: action});
            
    if(currentAction.validate !== false && !workflowForm.validate(true)){
      if(currentAction.invalid_submission !== true || !confirm(gform.renderString("This form has the following errors:\r\n\r\n{{#errors}}{{.}}\r\n{{/errors}}\r\nWould you like to submit anyway?",{errors:_.values(e.form.errors)}) )){
        toastr.error("Form invalid, please check for errors!", 'ERROR');
        return;
      }
    }
    
    if(currentAction.signature){

      signature = new gform({legend:"Signature Required", actions:[{type:"cancel",label:'<i class="fa fa-times"></i> Clear'},{type:"save"}]}).
      on('cancel', signatureEvent=>{
        signatureEvent.form.set({signature:null})
        signatureEvent.form.clearValidation();
        currentAction = null;
      }).
      on('save', signatureEvent=>{
        if(signatureEvent.form.validate()){
          signatureEvent.form.trigger('close')
          saveFlow({action:currentAction.name,signature:signatureEvent.form.get('signature')})
          // saveFlow.call(null, e, {...e.form.toJSON(),signature:signatureEvent.form.get('signature'),action:currentAction.name})
        }
        currentAction = null;
      }).on('input',function(e){
        if(e.form.el.classList.contains('in'))e.form.validate()                  
      }).modal()

        signature.add({type:'signaturePad',required:true,label:"Signature",hideLabel:true,help:(currentAction.signature_text || "Please Sign Above"),name:"signature"})
    }else{
      saveFlow({action:currentAction.name})

      // saveFlow.call(null, e, {...e.form.toJSON(),action:e.field.name})
    }
  }

  var update = (file, response)=>{
    var files = current.files = current.files || gform.collections.get('files')

    if(typeof response !== 'undefined'){
      var exists = _.find(files,{id:response.id});
      if(typeof exists !== 'undefined'){
        _.merge(exists,response);
      }else{
        files = files || [];
        files.push(response)
      }
    }
    if(files !== "waiting"){
      files = _.map(files,function(file){
        switch(file.mime_type){
          case "image/jpeg":
          case "image/png":
          case "image/jpg":
          case "image/gif":
            break;
          default:
            file.icon = '<i class="fa '+
              (mime_icons[file.mime_type] || mime_icons[file.mime_type.split('/')[0]] || mime_icons[file.ext] || "fa-file-o")
              +' fa-3x" style="padding-top: 4px;"></i>';
        }
        file.date =  moment(file.deleted_at||file.created_at).format('MM/DD/YY h:mm a');
        return file;

      })
    }
    
    gform.collections.update('files', files)

    //update selected field if exists
    var field = workflowForm.find({shown: true, type: 'files'});
    if(field){
      field.set(response.name)
      field.renderMenu();
      $('[href="'+_.find(field.options,{id:response.id}).path+'"]').click()
    }
  }
  
  var sync = ()=>{
    if(message.status){
      $g.waiting = 'Waiting...';
      $g.setData('/api/workflowsubmissions/'+instance_id+'/save',
        {data:{...workflowForm.get(), _state: JSON.stringify(workflowForm.get('_state'))}},
        response=>{
          message.status = 'success';
          if(typeof fileLoader == "undefined" && form.files && flowState.uploads){
            if($('#myId').length){
              $('#myId').html('');
              fileLoader = new Dropzone("div#myId", {timeout: 60000, url: "/api/workflowsubmissions/"+response.id+"/files", init: function() {
                this.on("success", update);
              }});
            }
          }
          initialFormState = response.data;
          response.files = gform.collections.get('files')

          set({current:response});

        },e=>{
          message.status = 'error';
          toastr.error("An error occured durring autosave - please try refreshing before proceeding or you may lose your work", 'ERROR');
        }
      )
    }
  }
  
  var loadForm = data=>{
    evalMethods = [];
    _.each(methods,function(item,index){
      eval('evalMethods["method_'+index+'"] = function(data,e){'+item.content+'\n}.bind(data,data.data)');
    })
    var formSetup = {
      "data":data,
      "name":"workflow",
      "events":form.events||{},
      "actions": [
        {
          "type": "cancel",
          "action":"canceled",
          "label": "<i class='fa fa-times'></i> Clear"
        },{
          "type": "button",
          "name": "_save_for_later",
          "action": "save",
          "modifiers": "btn btn-info pull-right",
          "label": "<i class='fa fa-save'></i> Save For later"
        },{
          "type": "hidden",
          "name": "_flowstate"
        },{
          "type": "hidden",
          "name": "id"
        }
      ],
      "fields":[
          {"name":"_state","label":false,"type":"fieldset","fields": form.fields
        }
      ]
    }

    formSetup.actions = formSetup.actions.concat(_.filter((flowState || {"actions": []}).actions, action=>{
      if(typeof action.assignment == 'undefined')return true;

      if(action.assignment.type == "user"){
        if(gform.m(action.assignment.id, mappedData) == mappedData.actor.id.toString()){
          return true;
        }
      }else if(action.assignment.type == "group"){
        if(mappedData.actor.groups.indexOf(parseInt(gform.m(action.assignment.id, mappedData))) >=0){
          return true;
        }
      }

      return false;
    }))

    formSetup.data._state = formSetup.data._state || {};
    if(form.resource !== ''){
      if(form.resource in mappedData.resources){
        _.extend(formSetup.data._state,mappedData.resources[form.resource]);
      }
      if(form.resource in evalMethods){
        _.extend(formSetup.data._state,evalMethods[form.resource](data));
      }
    }
    if(current != null){
      initialFormState = current.data;
      gform.collections.update('files', current.files||[])
      workflowForm = new gform(formSetup, '.g_'+guid);
    }else{
      gform.collections.update('files', [])
    }

    workflowForm = new gform(formSetup, '.g_'+guid);
    updateRequiredFields();

    workflowForm.on('invalid', e => {
      var invalid_fields = gform.items.filter.call(workflowForm.find({name:"_state"}),{active:true,valid:false},{stopOnFail:false})

      $g.emit('workflow_summary',{errors: _.compact(_.map(invalid_fields,e=>{
        return !e.valid?{label: e.label, id: e.id,errors: e.errors.split('<br>')}: null}))
      })
      invalid_fields[0].focus();
    })
    workflowForm.on('valid', e=>{
      $g.emit('workflow_summary',{errors:[]})
    })
    initialFormState = initialFormState||gform.instances['workflow'].get();

    if(current.id && form.files && flowState.uploads){
      if($('#myId').length){
        $('#myId').html('');
        fileLoader = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+current.id+"/files", init: function() {
          this.on("success", update);
        }});
      }
      update();
    }
    $('.f_'+guid).on('click','[data-id]', e=>{
      e.stopPropagation();
      e.preventDefault();
      if(e.currentTarget.dataset.action == 'delete'){
        $.ajax({
          url:'/api/workflowsubmissions/'+current.id+'/files/'+e.currentTarget.dataset.id,
          type: 'delete',
          success: update.bind(null,{}),
          error:()=>{}
        })

      }else if(e.currentTarget.dataset.action == 'edit'){
        new gform({legend:"Edit file name",data:_.find(current.files,{id:parseInt(e.currentTarget.dataset.id)}),fields:[
          {name:"name",label:false},
          {name:"id", type:"hidden"}
        ]}).on('cancel',e=>{
          e.form.destroy()
          e.form.trigger('close');
        })
        .on('save',e=>{
          $.ajax({
            url:'/api/workflowsubmissions/'+current.id+'/files/'+e.form.get('id'),
            dataType: 'json', contentType: 'application/json', type: 'PUT',
            data: JSON.stringify(e.form.get()),
            success: update.bind(null, {}),
            error:()=>{}
          })
          e.form.trigger('close');
        }).modal();
      }
    })

    workflowForm
    .on('save', e=>{
      if(e.field.name == '_save_for_later') {
        var data = {
          _flowstate: flowState.name,
          _state: e.form.get('_state'),
          user: user,
          data: mappedData
        }

        new Promise((saveResolve, saveReject)=>{
          new gform({legend:"Comment associated with this submission",name:"submission_comment",modal:{header_class:'bg-success'},fields:[{label:"Comment"}]}).modal().on('save',e=>{
            saveResolve(e.form.get('comment'))
          }).on('cancel',()=>{
            saveReject()
          })
        }).then(value=>{
          if(!value)return;
          $.ajax({
            url:'/api/workflowsubmissions/'+instance_id+'/save',
            dataType: 'json', contentType: 'application/json', type: 'POST',
            data: JSON.stringify(_.extend(current, {comment: value})),
            success: data=>{
              set({current:{data:{}}});
              initialFormState = current.data;
              reload();
            },
            error:()=>{}
          })
        }).catch(err=>{
          return err;
        }).finally(()=>{
          gform.instances.submission_comment.dispatch('close');
          gform.instances.submission_comment.destroy();
        })
        return false;
      }
      //check if validation required first
      processAction(e.field.name);
    })
    .on('canceled', e=>{
      e.form.set('_state',initialFormState._state)
    })
    .on('reset', e=>{
      initialFormState._state = get().data||{};
      if(form.resource !== ''){
        if(form.resource in mappedData.resources){
          _.extend(initialFormState._state,mappedData.resources[form.resource]);
        }
        if(form.resource in evalMethods){
          _.extend(initialFormState._state,evalMethods[form.resource](initialFormState));
        }
      }
      e.form.set('_state',initialFormState._state);
    })
    .on('input canceled reset', ()=>{
      if(!_.isEqual(initialFormState, gform.instances['workflow'].get())){
        updateRequiredFields();
        message.status = "saving";
      }else{
        message.status = "success";
      }
    })

    if(!current.id){
      message.status = 'saving';
      sync();
    }
  }
	var item = {guid: generateUUID()}

	var fields = {
		Title: {},
		'Workflow ID': {type: 'select', options: '/api/groups/'+group_id+'/workflowinstances', format: {label: "{{name}}", value: "{{id}}"}},
	}

  var current, instance_id, guid, user, resources, initialFormState, flowState, workflowForm, fileLoader, flow, form, methods,
    workflow={configuration:{}}, 
    evalMethods  = [], 
    mappedData = {
      actor: user,
      form: {},
      owner:null,
      // state: workflow.configuration.initial,
      history: [],
      // datamap: _.reduce(workflow.configuration.map, (datamap, item)=>{
      //     datamap[item.name] = item.value;
      //     return datamap;
      //   },{})
    };

  var message = (()=>{
    let _saveDelay;
    let _message = "";
    let _status = false;
    
    let _obj = {clear:()=>{
      message.status = "";
    }};

    Object.defineProperty(_obj, "value", {
      get: ()=>{
        return _message;
      },
      enumerable: false
    });
    Object.defineProperty(_obj, "status", {
      get: () => $g.waiting,
      set: e => {
        let el = $('#flow-status');
        el.removeClass('label-success').removeClass('label-danger');
        clearTimeout(_saveDelay);

        if(e == "saving"){
          _status = true;
          _message = 'Auto Saving...';
          $g.waiting = _message;
          _saveDelay = setTimeout(sync, 1500);
        }else{
          switch(e){
            case "error":
              _message = 'Error Saving';
              el.addClass('label-danger')
              break;
            case "success":
              _message = 'All Changes Saved';
              el.addClass('label-success')
              break;
            // case "clear":
            default:
            _message = '';
          }
          $g.waiting = false;
        }
        $('#flow-status').html(_message);
      },
      enumerable: false
    });
    return _obj;
  })()
     
	return {
    container: container,
		fields: fields,
    edit: defaultCobEditor.call(this, container),
		toJSON: get,
		get: get,
		set: set,
    message:message,
		render: ()=>{
      debugger;
      return gform.renderString(workflow_report.workflow, {
      ...item,
      workflow_admin: group_admin,
      allowFiles: (form.files && flowState.uploads)
    })},
    load: function(){
      this.container.elementOf(this).querySelector('.flow-title').innerHTML = workflow.workflow.name;

      mappedData.datamap = _.reduce(workflow.configuration.map, (datamap, item)=>{
        datamap[item.name] = item.value;
        return datamap;
      },{})

      /* problem here  */
      // _.each(resources, (item,name)=>{
      //   gform.collections.add(name, _.isArray(item)?item:[])
      // })

      mappedData.resources = _.reduce(resources, (resources, item, name)=>{
        gform.collections.add(name, _.isArray(item)?item:[])
        resources[name] = item;
        return resources;
      }, {})

      var data = {
        _flowstate: flowState.name,
        _state: (current||get()).data,
        user: user,
        data: mappedData,
        id: (current||get()).id
      }
      
      //process Initial load
      new Promise((resolveInitialLoad,  rejectInitialLoad)=>{
        if(
          (!this.container.owner.options.disabled) ||
          (resource_type !== 'workflow') ||

          //nothing started - we can assume starting a new one
          (current == null) ||
          (current.updated_at == current.created_at) ||

          _.isEqual(current.data, new gform({fields: form.fields}).get()) ||
          
          parseInt(window.location.search.split('?saved=')[1]) == current.id

        ){
          resolveInitialLoad();
          return;
        }

        var content = $g.render(workflow_report.prompt, {...workflow_report, saved: current.status == 'saved', current: $g.formatDates(current)});
        new gform({legend: "Workflow in progress", modal: {header_class: 'bg-info'},fields: [{type: 'output', name: 'modal', label: false, format: {}, value: content}],actions: [
          {type:'button',action:'discard',label:'<i class="fa fa-times"></i> Discard',"modifiers": "btn btn-danger pull-left"},
          {type:'save',label:'<i class="fa fa-save"></i> Save For later',"modifiers": "btn btn-info pull-right"},
          {type:'button',action:'use',label:'<i class="fa fa-check"></i> Continue',"modifiers": "btn btn-success pull-right"}
          ]}).modal()
          .on('discard save use cancel',e=>{
            e.form.dispatch('close');
            e.form.destroy();
            if(e.event == 'save'){
              data._state = get().data

              new Promise((saveResolve, saveReject)=>{
                new gform({legend:"Comment associated with this submission",modal:{header_class:'bg-success'},fields:[{label:"Comment"}]}).modal().on('save',e=>{
                  e.form.dispatch('close');
                  e.form.destroy();
                  saveResolve(e.form.get('comment'))
                }).on('cancel',()=>{
                  saveReject()
                })
              }).then(
                comment=>{
                  $.ajax({
                    url:'/api/workflowsubmissions/'+instance_id+'/save',
                    dataType: 'json', contentType: 'application/json', type: 'POST',
                    data: JSON.stringify({...current, comment:comment}),
                    success: ()=>{
                      set({current:{data:{}}})
                      initialFormState = current.data;
                      resolveInitialLoad();
                    },
                    // error:()=>{}
                  })
                },reload)
              
            }else if(e.event == 'discard') {
              debugger;
              $.ajax({
                url:'/api/workflowsubmissions/'+current.id,
                type: 'delete',
                success: reload,
                // error: ()=>{}
              })

            }else{
              data._state = ((e.event == 'use')?current:get()).data
              debugger;
              resolveInitialLoad()
            }
          })
      }).then(
        ()=>{ loadForm(data) },
        error=>{ /* code if some error */ }
      );
    },

		initialize: function(el) {
      $g.workflow = this;
      gform.collections.add('files', []);
      gform.collections.on('files', e => {
        debugger;
        $('.f_'+guid).html(gform.renderString(workflow_report.attachments, current))
      });
      window.addEventListener("beforeunload", e=>{
        if(message.status){
          var confirmationMessage = 'Changes you made May not be saved';
          (e || window.event).returnValue = confirmationMessage; //Gecko + IE
          return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }
      });

      if(typeof instance_id == 'undefined'){return false;};
      this.fields['Workflow ID'].enabled = false;
      if(this.container.owner.options.disabled && get().enable_min) {
        set({collapsed:(Lockr.get(guid) || get()).collapsed});
        $(el).find('.widget').toggleClass('cob-collapsed', get().collapsed)
      }
      if(typeof workflow !== 'undefined'){
        this.load()
      }else{
        $.ajax({
          url:'/api/workflowinstances/'+instance_id,
          type: 'GET',
          success  : function(workflow){
            set({workflow:workflow})
            this.load();
          }.bind(this),
          error:()=>{}
        })
      }
		}
	}
}