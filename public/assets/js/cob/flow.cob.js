//methods => evalmethods ?? this could be a problem if methods['name'] are called directly

Cobler.types.Workflow = function(container){
	function get(){ return {widgetType:'Workflow',...item};}
	function set(newItem){
    $.extend(item, newItem);
    ({submission, workflow, instance_id, guid, user, resources} = item);
    ({flow, form, methods} = workflow.version.code);
    flowState = (_.find(flow,{name:workflow.configuration.initial})||flow[0]||{"actions": []});
    formData._flowstate = flowState.name;
    rootPath = '/api/workflowsubmissions/'+instance_id;
    $g.emit('workflow_summary', {submission:submission})
    if(submission){
      gform.collections.update('files', _.map(submission.files||[], $g.formatFile))
      submission = $g.formatDates(submission);
      formData._state = submission.data;
      let oldId = formData.id;
      formData.id = submission.id;
      if(typeof oldId !== 'undefined' && oldId !== submission.id){
        loadForm();
      }
    }
  }
  // function reload(){location.reload();}

  //additionalInfo
  //  action: required
  //  signature: used if required
  function submitFlow(additionalInfo) {
    gform.types.fieldset.edit.call(workflowForm.find('_state'),false)
    workflowForm.find('_state').el.style.opacity = .7
    $('.gform-footer').hide();

    $.ajax({
      url: rootPath+'/submit',
      dataType: 'json', contentType: 'application/json', type: 'POST',
      data: JSON.stringify((()=>{
        return {...workflowForm.get(), ...additionalInfo, _state: JSON.stringify(formData['_state'])}
      })()),
      success: response=>{
        document.location = "/workflows/report/"+response.id;
      },
      error: ()=>{
        workflowForm.find('_state').el.style.opacity = 1
        gform.types.fieldset.edit.call(workflowForm.find('_state'), true)
        $('.gform-footer').show();
        toastr.error("An error occured submitting this form. Please try again later", 'ERROR')
      }
    })
  }

  function updateRequiredFields(form) {
    // if(!workflowForm)return;
    let required = _.uniq(_.compact(_.map(
      gform.items.filter.call(form.find({name: "_state"}), {active: true, required: true}, {stopOnFail: false})
      , e => {
        return {..._.pick(e,'label','id'),satisfied:e.satisfied()};
      }
    )));
    $g.emit('workflow_summary', {required:required,satisfied:_.countBy(required,'satisfied')})
  }

  function processAction(e) {
    var action = _.find(flowState.actions, {name: e.field.name});
            
    if(action.validate !== false && !workflowForm.validate(true)){
      if(action.invalid_submission !== true || !confirm(gform.renderString("This form has the following errors:\r\n\r\n{{#errors}}{{.}}\r\n{{/errors}}\r\nWould you like to submit anyway?",{errors:_.values(e.form.errors)}) )){
        toastr.error("Form invalid, please check for errors!", 'ERROR');
        return;
      }
    }
    
    if(action.signature){
      signature = new gform({legend:"Signature Required", actions:[{type:"cancel",label:'<i class="fa fa-times"></i> Clear'},{type:"save"}]}).
      on('cancel', signatureEvent=>{
        signatureEvent.form.set({signature:null})
        signatureEvent.form.clearValidation();
        action = null;
      }).
      on('save', signatureEvent=>{
        if(signatureEvent.form.validate()){
          signatureEvent.form.trigger('close')
          submitFlow({action:action.name,signature:signatureEvent.form.get('signature')})
          // submitFlow.call(null, e, {...e.form.toJSON(),signature:signatureEvent.form.get('signature'),action:action.name})
        }
        action = null;
      }).on('input',function(e){
        if(e.form.el.classList.contains('in'))e.form.validate()                  
      }).modal()

        signature.add({type:'signaturePad',required:true,label:"Signature",hideLabel:true,help:(action.signature_text || "Please Sign Above"),name:"signature"})
    }else{
      submitFlow({action:action.name})
    }
  }

  var update = (file, response)=>{
    var files = submission.files = submission.files || gform.collections.get('files')

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
      gform.collections.update('files', _.map(files, $g.formatFile))
    }
    

    //update selected field if exists
    var field = workflowForm.find({shown: true, type: 'files'});
    if(field){
      field.set(response.name)
      field.renderMenu();
      $('[href="'+_.find(field.options,{id:response.id}).path+'"]').click()
    }
  }
  
  function saveFlow(data, callback, onError) {
    $g.setData(rootPath+'/save',
      {data:{...data, _state: JSON.stringify(data['_state'])}},
      callback, onError
    )
  }
  
  var sync = newFormData=>{
    if(message.status || !submission || typeof submission.id == 'undefined'){
      $g.waiting = 'Waiting...';
      saveFlow(newFormData || workflowForm.get(), response=>{
        message.status = 'success';
        initialFormState = response.data;

        response.files = gform.collections.get('files')
        set({submission:response});

        // if(gform.instances.workflow){
        //   workflowForm.find('id').set(formData.id);
        // }else{
        //   loadForm();
        // }
        if(!workflowForm.valid)workflowForm.validate();
      }, e=>{
        message.status = 'error';
        toastr.error("An error occured durring autosave - please try refreshing before proceeding or you may lose your work", 'ERROR');
      });
    }
  }
  
  var loadForm = ()=>{
    evalMethods = [];
    _.each(methods,function(item,index){
      eval('evalMethods["method_'+index+'"] = function(data,e){'+item.content+'\n}.bind(formData,formData.data)');
    })
    var formSetup = {
      "data":formData,
      "name":"workflow",
      "events":form.events||{},
      "actions": [
        {
          "type": "cancel",
          "action":"canceled",
          "label": "<i class='fa fa-times'></i> Clear"
        }
        // ,{
        //   "type": "button",
        //   "name": "_save_for_later",
        //   "action": "archive",
        //   "modifiers": "btn btn-info pull-right",
        //   "label": "<i class='fa fa-save'></i> Save For later"
        // }
        ,{
          "type": "hidden",
          "name": "_flowstate"
        },{
          "type": "hidden",
          "name": "id",
          "parse": [{type: "not_matches", value:""}]
        }
      ],
      "fields":[
          {"name": "_state", "label": false, "type": "fieldset", "fields": form.fields
        }
      ]
    }

    formSetup.actions = formSetup.actions.concat(_.filter(flowState.actions, action=>{
      if(typeof assignment == 'undefined')return true;
      let {type,id} = action.assignment;

      if(type == "user" && gform.m(id, formData.data) == formData.data.actor.id.toString())return true;      
      if(type == "group" && formData.data.actor.groups.indexOf(parseInt(gform.m(id, formData.data))) >=0)return true;

      return false;
    }))

    formSetup.data._state = formSetup.data._state || {};

    if(form.resource !== ''){
      if(form.resource in formData.data.resources){
        _.extend(formSetup.data._state,formData.data.resources[form.resource]);
      }
      if(form.resource in evalMethods){
        _.extend(formSetup.data._state,evalMethods[form.resource](formData));
      }
    }

    if(submission != null){
      initialFormState = submission.data;
      gform.collections.update('files', _.map(submission.files||[], $g.formatFile))
    }else{
      gform.collections.update('files', [])
    }

    workflowForm = new gform(formSetup, '.g_'+guid)
    .on('validation', e=>{
      let status = {errors:[]}
      if(!e.form.valid){
        var invalid_fields = gform.items.filter.call(workflowForm.find({name:"_state"}),{active:true,valid:false},{stopOnFail:false})
        status.errors = _.compact(_.map(invalid_fields,e=>{
          return {label: e.label, id: e.id, errors: e.errors.split('<br>')};
        }))
        invalid_fields[0].focus();
      }
      $g.emit('workflow_summary', status)
    })
    // .on('invalid', e=>{
    //   var invalid_fields = gform.items.filter.call(workflowForm.find({name:"_state"}),{active:true,valid:false},{stopOnFail:false})

    //   $g.emit('workflow_summary',{errors: _.compact(_.map(invalid_fields,e=>{
    //     return !e.valid?{label: e.label, id: e.id,errors: e.errors.split('<br>')}: null}))
    //   })
    //   invalid_fields[0].focus();
    // })
    // .on('valid', ()=>{$g.emit('workflow_summary',{errors:[]})})
    .on('save', processAction)
    // .on('archive', addComment)
    .on('canceled', e=>{
      set({submission:{...initialFormState,id:submission.id}});
      loadForm();
    })
    .on('input canceled reset', _.throttle(e=>{
      if(!_.isEqual(initialFormState, e.form.get('_state'))) {
        message.status = "saving";
      }else{
        message.status = "success";
      }
      updateRequiredFields(e.form);
    },500));

    workflowForm.trigger('input')

    initialFormState = initialFormState||gform.instances['workflow'].get();

    if(typeof fileLoader == "undefined" && submission && form.files && flowState.uploads){
      debugger;
      if($('#myId').length){
        $('#myId').html('');
        fileLoader = new Dropzone("div#myId", {timeout:60000, url: "/api/workflowsubmissions/"+submission.id+"/files", init: function() {
          this.on("success", update);
        }});
      }
      update();
    }
    $('.f_'+guid).off('click');
    $('.f_'+guid).on('click','[data-id]', e=>{
      e.stopPropagation();
      e.preventDefault();
      if(e.currentTarget.dataset.action == 'delete'){
        $.ajax({
          url:'/api/workflowsubmissions/'+submission.id+'/files/'+e.currentTarget.dataset.id,
          type: 'delete',
          success: update.bind(null,{}),
          error:()=>{}
        })

      }else if(e.currentTarget.dataset.action == 'edit'){
        new gform({legend:"Edit file name",data: _.find(submission.files,{id:parseInt(e.currentTarget.dataset.id)}), fields: [
          {name:"name",label:false},
          {name:"id", type:"hidden"}
        ]}).on('cancel',e=>{
          e.form.destroy()
        })
        .on('save',e=>{
          $.ajax({
            url:'/api/workflowsubmissions/'+submission.id+'/files/'+e.form.get('id'),
            dataType: 'json', contentType: 'application/json', type: 'PUT',
            data: JSON.stringify(e.form.get()),
            success: update.bind(null, {}),
            error:()=>{}
          })
          e.form.trigger('close');
        }).modal();
      }
    })

    if(!submission){
      sync();
    }
  }

  var addComment = ()=>{

    new gform({legend:"Comment associated with this submission",name:"submission_comment",modal:{header_class:'bg-success'},fields:[{label:"Comment"}],actions:[{type:'save'},{type:'cancel'},{type:'save',label:"Save and start new",action:"save_create"}] }).modal()
    .on('save_create save', e=>{
      if(!e.form.validate())return;
      $g.waiting = "Updating Comment...";
      e.form.trigger('close')
      $.ajax({
        url:'/api/workflowsubmissions/'+instance_id+'/save',
        dataType : 'json', contentType: 'application/json', type: 'POST',
        data: JSON.stringify({...submission, ...e.form.get()}),
        success: submission=>{
          set({submission:submission});
          e.form.trigger('close');
          message.status = (e.event=='save')?'success':'create';
        },
      })
    }).on('save cancel',e=>{
      e.form.dispatch('close');
      e.form.destroy();
    })
  }
  
	var item = {guid: generateUUID()}

	var fields = {
		Title: {},
		'Workflow ID': {type: 'select', options: '/api/groups/'+group_id+'/workflowinstances', format: {label: "{{name}}", value: "{{id}}"}},
	}

  var submission, instance_id, rootPath, guid, user, resources, initialFormState, flowState, workflowForm, fileLoader, flow, form, methods,
    workflow={configuration:{}}, 
    evalMethods = [],
    formData = {
      user:user,
      data:{
        actor: user,
        form: {},
        owner:null,
        // state: workflow.configuration.initial,
        history: [],
        // datamap: _.reduce(workflow.configuration.map, (datamap, item)=>{
        //     datamap[item.name] = item.value;
        //     return datamap;
        //   },{})
      }
    };

  var message = (()=>{
    let _saveDelay;
    let _message = "";
    
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
        $g.waiting = false;
        switch(e){
          case "saving":
            _message = 'Auto Saving...';
            $g.waiting = _message;
            _saveDelay = setTimeout(sync, 1500);
            break;
          case "create":
            _message = 'Creating New...';
            $g.waiting = _message;
            workflowForm.destroy();
            sync({});
            break;
          case "loading":
            _message = 'Loading...';
            $g.waiting = _message;
            workflowForm.destroy();
            break;
          case "error":
            _message = 'Error Saving';
            el.addClass('label-danger')
            break;
          case "success":
            _message = 'All Changes Saved';
            el.addClass('label-success')
            break;
          default:
          _message = '';
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
    // message: message,
    fileLoader:fileLoader,
    // sync: sync,
		render: ()=>{
      return gform.renderString(workflow_report.workflow, {
        ...item,
        workflow_admin: group_admin,
        allowFiles: (form.files && flowState.uploads)
      })},
    load: function(){
      this.container.elementOf(this).querySelector('.flow-title').innerHTML = workflow.workflow.name;

      formData.data.datamap = _.reduce(workflow.configuration.map, (datamap, item)=>{
        datamap[item.name] = item.value;
        return datamap;
      },{})

      formData.data.resources = _.reduce(resources, (resources, item, name)=>{
        gform.collections.add(name, _.isArray(item)?item:[])
        resources[name] = item;
        return resources;
      }, {})

      if(
        (!this.container.owner.options.disabled) ||
        (resource_type !== 'workflow') ||

        //nothing started - we can assume starting a new one
        (submission == null) ||
        (submission.updated_at == submission.created_at) ||

        _.isEqual(submission.data, new gform({fields: form.fields,private:true}).get()) ||
        
        parseInt(window.location.search.split('?saved=')[1]) == submission.id

      ){
        //{{updated_at.date}} @ {{{updated_at.time}}}
        // toastr.success($g.render("Continuing from data last updated {{updated_at.fromNow}}", submission))

      }else{
        toastr.success($g.render("Continuing from data last updated {{updated_at.fromNow}}", submission))

      }
      // else{
      //   // formData._state = submission.data

      // }

      loadForm()
      
    },

		initialize: function(el) {
      gform.collections.add('files', []);
      gform.collections.on('files', e=>{
        $('.f_'+guid).html(gform.renderString(workflow_report.attachments, submission))
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

      $g.on('workflow_select', e=>{
        if(fileLoader)fileLoader.removeAllFiles();
        gform.collections.update('files', []);
        message.status = "Loading...";
        $g.getData('/api/workflowsubmissions/'+e.data.id+'/context', context=>set(context))
      })
      $g.on('workflow_action', e=>{
        console.log(e.data.action);
        _.each(e.data.action.split(' '),action=>{
          switch(action){
            case 'new':
              message.status = 'create';
              break;
            case 'save':
              addComment();
              break;
            case 'discard':
              $.ajax({
                url:'/api/workflowsubmissions/'+submission.id,
                type: 'delete',
                success: e=>{
                  submission.deleted_at = true;
                  $g.emit('workflow_summary', {submission:submission})
                  this.get()
                  item.all = _.filter(item.all,item=>{
                    return item.id !== submission.id;
                  })
                  if(item.all.length){
                    debugger;
                    set({submission:item.all[0]});
                    // loadForm();
                  }else{
                    message.status = 'create';
                  }
                }
              })
              break;
          }
        })
      })

      $g.on('workflow_status', e=>{
        updateRequiredFields(workflowForm);
      })
		}
	}
}



///sync files and reset uploads - finish testing
//initialFormState