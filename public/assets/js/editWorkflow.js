
gform.stencils.ace = `
<div class="row clearfix form-group" name="{{name}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{^inline}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<div class="formcontrol"><div placeholder="{{placeholder}}" style="min-height: 250px;outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" id="{{id}}container"></div></div>
	</div>
</div>`;
gform.types['ace'] = _.extend({}, gform.types['input'], {
  create: function(){
    var tempEl = document.createElement("span");
    tempEl.setAttribute("id", this.id);
    if(this.owner.options.clear){
      tempEl.setAttribute("class", ''+gform.columnClasses[this.columns]);
    }
    tempEl.innerHTML = this.render();
    return tempEl;
},
// render:function(){
//   return gform.render('textarea',this)
// },
  initialize: function(){
    //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
    //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
      this.onchangeEvent = function(input){
        //   this.input = input;
          this.value = this.get();
          if(this.el.querySelector('.count') != null){
            var text = this.value.length;
            if(this.limit){text+='/'+this.limit;}
            this.el.querySelector('.count').innerHTML = text;
          }
        //   this.update({value:this.get()},true);
        //   gform.types[this.type].focus.call(this)
          this.owner.trigger(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

        //   this.owner.pub('change:'+this.name, this,{input:this.value});
        //   this.owner.pub('change', this,{input:this.value});
        //   this.owner.pub('input:'+this.name, this,{input:this.value});
        //   this.owner.pub('input', this,{input:this.value});
      }.bind(this)
      this.input = this.input || false;
      // this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

      // this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
    this.editor = ace.edit(this.id+"container");
    this.editor.setTheme(this.item.theme || "ace/theme/chrome");
    this.editor.getSession().setMode({path: this.owner.options.default.mode || this.item.mode || "ace/mode/handlebars", inline:this.owner.options.default.inlinemode || this.item.inlinemode});
    this.editor.session.setValue(this.value);
    this.editor.on("change",this.onchangeEvent.bind(null,false))
   
  },
  // update: function(item, silent) {
  //   if(typeof item !== 'undefined' && (
  //       typeof item.options !== undefined ||
  //       typeof item.max !== undefined ||
  //       typeof item.action !== undefined 
  //       )
  //       && typeof this.mapOptions !== 'undefined'){
  //       delete this.mapOptions;
  //       this.item = _.defaults({},item,this.item);

  //       // this.item.options = _.assign([],this.item.options,item.options);
  //       this.options = _.extend([],this.item.options);
  //       this.max = this.item.max;
  //       this.min = this.item.min;
  //       this.path = this.item.path;
  //       this.action = this.item.action;
  //   }
  //   // else if(typeof this.mapOptions !== 'undefined'){
  //   //     debugger;
  //   // }
  //   if(typeof item === 'object') {
  //       _.extend(item,this);
  //   }
  //   this.label = gform.renderString((item||{}).label||this.item.label, this);

  //   // var oldDiv = document.getElementById(this.id);
  //   // debugger;
  //   // var oldDiv = this.owner.el.querySelector('#'+this.id);
  //   var oldDiv = this.el;
  //   this.destroy();
  //   this.el = gform.types[this.type].create.call(this);
  //   oldDiv.parentNode.replaceChild(this.el,oldDiv);
  //   gform.types[this.type].initialize.call(this);

  //   if(!silent) {
  //       this.owner.pub(['change:'+this.name,'change'], this);
  //   }
  //   if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
    
  // },
  set:function(value){
    this.editor.session.setValue(value);
  },
  get:function(){
    return this.editor.getValue()
  },
  focus: function(){
    this.editor.focus();
  }
});

/**
 * jQuery Plugin: Sticky Tabs
 *
 * @author Aidan Lister <aidan@php.net>
 * @version 1.2.0
 */
(function ( $ ) {
  $.fn.stickyTabs = function( options ) {
    var context = this

    var settings = $.extend({
        getHashCallback: function(hash, btn) { return hash }
    }, options );

    // Show the tab corresponding with the hash in the URL, or the first tab.
    var showTabFromHash = function() {
      var hash = window.location.hash;
      var selector = hash ? 'a[href="' + hash + '"]' : 'li.active > a';
      $(selector, context).tab('show');
    }

    // We use pushState if it's available so the page won't jump, otherwise a shim.
    var changeHash = function(hash) {
      if (history && history.pushState) {
        history.pushState(null, null, '#' + hash);
      } else {
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;
        window.location.hash = hash;
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
      }
    }

    // Set the correct tab when the page loads
    showTabFromHash(context)

    // Set the correct tab when a user uses their back/forward button
    $(window).on('hashchange', showTabFromHash);

    // Change the URL when tabs are clicked
    $('a', context).on('click', function(e) {
      var hash = this.href.split('#')[1];
      var adjustedhash = settings.getHashCallback(hash, this);
      changeHash(adjustedhash);
    });

    return this;
};
}( jQuery ));

attributes = {};
$('[href="/admin/workflows"]').parent().addClass('active');

var root = '/api/workflows/';


function setSize(){
  var temp2= $(window).height() - $('.nav-tabs').offset().top -77;
  var temp = $(window).height() - $('#flow-form').offset().top;
  $('body').append('<style>#flow-form { height: '+temp+'px; }</style>')
  $('body').append('<style>.ace_editor { height: '+temp2+'px; }</style>')
}

window.onresize = setSize;
function load(workflow_version) {
	$('.nav-tabs').stickyTabs();
  // $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  //   bt.fixStyle()
  // })

  loaded.code = $.extend(true, {forms:[{name:'Initial Form',content:'', disabled: true}]},workflow_version)

  attributes= $.extend(true,{},{code:{}}, loaded);
  $('.navbar-header .nav a h4').html('Workflow - '+attributes.workflow.name);

  $('#version').html((attributes.summary || 'Working Version'));

  setSize();

  // templatePage = new paged('.templates',{name:'templates', items:attributes.code.templates, label:'Template'});
  // scriptPage = new paged('.scripts',{name:'scripts', items:attributes.code.scripts, mode:'ace/mode/javascript', label:'Script'});
  formPage = new paged('.forms',{name:'forms', items:attributes.code.forms, mode:'ace/mode/javascript', label:'Form',extra: function(item){

    item.content = this.berry.fields[this.active].toJSON();
    if (!_.some(JSON.parse(item.content||'{}').fields, function(o) { return _.has(o, "fields"); })) {
      modalForm(item.content, item.name, function() {
        var old = formPage.getCurrent();
        formPage.update(old.key, JSON.stringify($.extend(false, {}, JSON.parse(old.content||'{}'),{"fields":cb.toJSON({editor:false})[0]}), null, 2 ))
      });
    }else{
      toastr.error('If you would like to continue using the form builder UI you will need to remove any fieldsets', 'Fieldsets Not Currently Supported');
    }
  }});
  r_options = {data:loaded.code, actions:[],fields:[

    {label:false,value:'<h4 style="border-bottom:solid 1px #ccc">Key</h4>',columns:9,type:"output"},
    {label:false,value:'<h4 style="border-bottom:solid 1px #ccc">Type</h4>',columns:3,type:"output"},

    {name:"resources",label:false,array:true,type:"fieldset",fields:[
      {name:"name",label:false,columns:9,placeholder:"Key"},
      {name:"type",label:false,type:"select",columns:3,options:[
        {label:"String",value:"string"},
        {label:"Group",value:"group"},
        {label:"User",value:"user"},
        {label:"Email",value:"email"},
        {label:"Endpoint",value:"endpoint"}
      ]}
    ]}
  ]}
  resources = new gform(r_options,'.resources');

}

load(loaded.code);
orig = $.extend({},loaded);

$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});

function modalForm(form, name, onSave) {
  if(typeof cb === 'undefined'){
    if(typeof form === 'string'){
      form = JSON.parse(form || '{}');
    }
    form = form || {};
    $('#myModal').remove();
    this.onSave = onSave;
    this.ref = $(templates.modal.render({title: 'Form Editor: '+ name}));
    $(this.ref).appendTo('body');
    this.ref.find('.modal-body').html(templates.formEditor.render());
    this.ref.find('.modal-footer').html('<div id="saveForm" class="btn btn-success"><i class="fa fa-check"></i> Save</div>');
    this.ref.on('hide.bs.modal', function(){
      cb.destroy();
      delete cb;
    });
    this.ref.find('#saveForm').on('click', function(){
      this.onSave.call(this)
      this.ref.modal('hide');
      
    }.bind(this))
    this.ref.modal({backdrop: 'static'});

    cb = new Cobler({formOptions:{inline:true},formTarget:$('#form'), disabled: false, targets: [document.getElementById('editor')],items:[[]]});
    $('.modal #form').keydown(function(event) {
      switch(event.keyCode) {
        case 27://escape
            event.stopPropagation();
            cb.deactivate();
            return false;
          break;
      }
    });
    list = document.getElementById('sortableList');
    cb.addSource(list);
    cb.on('activate', function(){
      if(list.className.indexOf('hidden') == -1){
        list.className += ' hidden';
      }
      $('#form').removeClass('hidden');
    })
    cb.on('deactivate', function(){
      list.className = list.className.replace('hidden', '');
      $('#form').addClass('hidden');
    })
    document.getElementById('sortableList').addEventListener('click', function(e) {
      cb.collections[0].addItem(e.target.dataset.type);
    })
  }

  if(typeof form !== 'undefined'){
    var temp = $.extend(true, {}, form);
    for(var i in temp.fields){

      temp.fields[i] = Berry.normalizeItem(temp.fields[i], i);
      switch(temp.fields[i].type) {
        case "select":
        case "radio":
          temp.fields[i].widgetType = 'select';
          break;
        case "checkbox":
          temp.fields[i].widgetType = 'checkbox';
          break;
        default:
          temp.fields[i].widgetType = 'textbox';
      }

    }

    list.className = list.className.replace('hidden', '');
    cb.collections[0].load(temp.fields);
  }
}


function createFlow() {
    // options = new gform({data:attributes.code,actions:[],fields:[
    //   {name:"flow",label:false,type:'ace',mode:'ace/mode/javascript'}
    // ]},".options").on('change',function(e){
    //   try{
    //     var temp = _.map(JSON.parse(options.get().flow),function(item){
    //       var temp = '\n'+item.name+'['+item.name+']';
    //       var stuff = _.map(item.actions,function(i){
    //         return '\n'+item.name+'['+item.name+']'+'-->|'+i.label+'|'+' '+i.to;
    //       })
    //       return temp+stuff.join('')
    //     })
    //     myfunc('graph TB'+temp.join(''))
    //   }catch(e){}
    // })
    // options.trigger('change')

    try{
      var temp = _.map(mappable,function(item){
        var temp = '\n'+item.name+'['+item.name+']';
        var stuff = _.map(item.actions,function(i){
          return '\n'+item.name+'['+item.name+']'+'-->|'+i.label+'|'+' '+i.to;
        })
        return temp+stuff.join('')
      })
      myfunc('graph TB'+temp.join(''))
    }catch(e){}
    
}



// var callback = function(e){
// debugger;
// }

// debugger;
mappable = JSON.parse(attributes.code.flow);
createFlow();




function drawForm(name){


  if(typeof flowForm !== 'undefined'){flowForm.destroy();}  
  flowForm = new gform({
    actions:[],
    legend:"State",
    data: _.find(mappable,{name:name}),
    fields:[
      {name: "name", label: "Name"},
      {type: "fieldset", name: "assignment", label: "Assignment", fields: [
        {name: "type", label: "Type", type: "select", options: [
          {value: "group", label: "Group"},
          {value: "user", label: "User"},
          {value: "url", label: "Url"}
        ]},
        _.extend({show: [{type: "matches", name: "type", value: "user"}], type: "smallcombo", search: "/api/users/search/{{search}}{{value}}", format: {label: "{{first_name}} {{last_name}}", value: "{{unique_id}}", display: "{{first_name}} {{last_name}}<div>{{email}}</div>"}}, valueField),
        _.extend({show: [{type: "matches", name: "type", value: "group"}], type: "smallcombo", options: '/api/groups', format: {label: "{{name}}", value: "{{id}}"}}, valueField),

        {name: "id", label: 'ID (template)', type: "text", show: [{type: "matches", name: "type", value: "url"}]},
        {name: "endpoint",columns:4, label: "Endpoint", type: "select", options: "endpoints", format: {label: "{{name}}", value: "{{name}}"}, show: [{type: "matches", name: "type", value: "url"}]},

        {name: "url",columns:8,placeholder:"\\", type: "url", label: "Path", show: [{type: "matches", name: "type", value: "url"}]},
      ]},
      // {name: "hasOnEnter", label: "Include Tasks On Entering State", type: "switch"},
      {name: "onEnter", type: "fieldset", fields: taskForm, array: true},// show:[{type: "matches", name: "hasOnEnter", value: true}]},
      // {name: "hasOnLeave", label: "Include Tasks On Leaving State", type: "switch"},
      {name: "onLeave", type: "fieldset", fields: taskForm, array: true},// show: [{type: "matches", name: "hasOnLeave", value: true}]},
      {label:"<legend>Actions</legend>",type:"output",name:"actions_label", parse: false},
      {
        name: "actions", label: false, type: "fieldset", fields: [
          {name: "label", label: "Label", columns: 6},
          {name: "name", label: "Name", columns: 6, show: [{type: "not_matches", name: "lable", value: ""}]},
          {name: "type", label: "Type", type: "select", columns: 6, options:[
            {value: "success", label: "Success"},
            {value: "danger", label: "Danger"},
            {value: "info", label: "Info"},
            {value: "warning", label: "Warning"},
            {value: "default", label: "Default"},
            {value: "primary", label: "Primary"},
            {value: "link", label: "Simple"}
          ], show: [{type: "not_matches", name: "label", value: ""}]},
          {name: "to", label: "To", columns: 6, type: "select", options: function(e){
            return _.pluck(mappable, 'name');
          }, show: [{type: "not_matches", name: "label", value: ""}]},
          {name: "tasks", label: "Action Tasks", type: "fieldset", fields: taskForm, array: true}
        ], array: true
      }
    ]
  },'#flow-form').on('input',function(e){
    mappable[_.findIndex(mappable,{name:e.form.options.data.name||e.form.toJSON().name})] = e.form.toJSON();
    if(e.form.toJSON().name !== e.form.options.data.name){
      e.form.options.data.name = e.form.toJSON().name;
      _.each(mappable,function(state){
        _.each(state.actions,function(action){
          if(action.from == e.form.options.data.name){
            action.from = e.form.toJSON().name
          }
          if(action.to == e.form.options.data.name){
            action.to = e.form.toJSON().name
          }
        })
      })
    }
    createFlow();
  })

}

gform.collections.add('endpoints', _.where(attributes.code.resources, {type: "endpoint"}))
var taskForm = [
  {name: "task", label: "Task", columns:12, type: "select", options: [{value: "api", label: "API"}, {value: "email", label: "Email"}]},
  {name: "subject", type:"text", label: "Subject", columns:12,show: [{type: "matches", name: "task", value: 'email'}]},
  {name: "content", type:"textarea", label: "Content",show: [{type: "matches", name: "task", value: 'email'}]},
  {name: "endpoint",columns:4, label: "Endpoint", type: "select", options: "endpoints", format: {label: "{{name}}", value: "{{name}}"},show: [{type: "matches", name: "task", value: 'api'}]},
  {name: "url", type: "url",columns:8,placeholder:8, label: "Path", show: [{type: "matches", name: "task", value: 'api'}]},
  // {name:"data",}
]
var valueField = {columns:12,name:'value',label:'Value <span class="text-success pull-right">{{value}}</span>'}


$('#flow-preview').on('click','.nodes .node',function(e){

  // console.log(e.currentTarget.id);

  drawForm(e.currentTarget.id);
})


$('#add-state').on('click',function() {
  mappable.push({name:"newState"});
  drawForm('newState');

})




$('#save').on('click',function() {

  var data = {code:{flow:JSON.stringify(mappable)}};

  if(true || !errorCount){

    data.code.forms = formPage.toJSON();
    data.updated_at = attributes.updated_at;
    data.code.resources = resources.toJSON().resources;
    $.ajax({
      url: root+attributes.workflow_id+'/code',
      method: 'put',
      data: data,
      success:function(e) {
        attributes.updated_at = e.updated_at;
        toastr.success('', 'Successfully Saved')
      },
      error:function(e) {
        toastr.error(e.statusText, 'ERROR');
      },
        statusCode: {
          404: function() {
            toastr.error('You are no longer logged in', 'Logged Out')
          },
          409: function(error) {
            test = JSON.parse(JSON.parse(error.responseText).error.message);
            toastr.warning('conflict detected:'+error.statusText, 'NOT SAVED')
            conflictResults = {};

            conflictResults.options = (JSON.stringify(test.options) !== JSON.stringify(this.model.options));
            modal({headerClass:'bg-danger' ,title: 'Conflict(s) detected', content: render('conflict', conflictResults)})//, footer:'<div class="btn btn-danger">Force Save</div>'})
          }.bind(this),
          401: function() {
            toastr.error('You are not authorized to perform this action', 'Not Authorized')
          }
        }
    })
  }else{
    toastr.error('Please correct the compile/syntax errors ('+ errorCount +')', 'Errors Found')
    modal({headerClass:'danger' ,title: 'Syntax Error(s)', content: render('error', {count:errorCount, temp: template_errors, script: script_errors/*, css: css_errors*/})})//, footer:'<div class="btn btn-danger">Force Save</div>'})
  }
})

$('#import').on('click', function() {
    $().berry({name: 'update', inline: true, legend: '<i class="fa fa-cube"></i> Update Workflow',fields: [	{label: 'Descriptor', type: 'textarea'}]}).on('save', function(){
      $.ajax({
        url: root+attributes.workflow_id+'/code',
        data: $.extend({force: true, updated_at:''}, JSON.parse(this.toJSON().descriptor)),
        method: 'PUT',
        success: function(){
          Berries.update.trigger('close');
          window.location.reload();
        },
        error: function(e){
          toastr.error(e.statusText, 'ERROR');
        }
      })
  });
});

$('#publish').on('click', function() {
    $().berry({name: 'publish', inline: true, legend: '<i class="fa fa-cube"></i> Publish Workflow',fields: [	
        {label: 'Summary', required: true},
        {label: 'Description', type: 'textarea'}
      ]}).on('save', function() {
        if(Berries.publish.validate()){
          $.ajax({
            url: root + attributes.workflow_id + '/publish',
            data: this.toJSON(),
            method: 'PUT',
            success: function() {
              Berries.publish.trigger('close');
              toastr.success('', 'Successfully Published')
            },
            error: function(e){
              toastr.error(e.responseJSON.message, 'ERROR');
            }
          })
        }
  });
});

$('#instances').on('click', function() {
  viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a href="/workflow/{{group_id}}/{{slug}}" target="_blank">{{name}}</a><a class="btn btn-warning" style="position: absolute;top: 3px;right: 3px;" href="/admin/workflowinstances/{{id}}" target="_blank"><i class="fa fa-pencil"></i></a></div>{{/items}}</div>');
  $.get('/api/workflowinstances?workflow_id=' + loaded.workflow_id, function(data) {
    if(data.length > 0){
      modal({title: 'This Workflow has the following instances', content: viewTemplate.render({items: data})});
    }else{
      modal({title: 'No instances Found', content: 'This Workflow is not currently instantiated.'});
    }
  })
});

$('#versions').on('click', function() {
  $.ajax({
    url: root + loaded.workflow_id + '/versions',
    success: function(data) {
      console.log(data);
      if(!orig.stable) {
        data.unshift({id:orig.id,label:'Working Version'})
      }
      Berry.btn.switch={
        label: 'Switch',
        icon:'reply',
        id: 'berry-submit',
        modifier: 'success pull-right',
        click: function() {
          if(this.options.autoDestroy) {
            this.on('saved', this.destroy);
          }
          this.trigger('save');
        }
      }

      $().berry({actions:['cancel','switch'],name:'modal',attributes:{workflow_version_id:loaded.id},legend:'Select Version',fields:[
        {label: 'Version', name:'workflow_version_id', options:data,type:'select', value_key:'id',label_key:'label'},
      ]}).on('save', function() {
        //switch version
        $.ajax({
          url: root+attributes.workflow_id+'/versions/'+this.toJSON().workflow_version_id,
          method: 'get',
          data: data,
          success:function(data) {
            data.workflow = loaded.workflow;
            loaded = data;
            load(loaded.code);
            Berries.modal.trigger('close');
          }
        })
      })
    }
  })
})

