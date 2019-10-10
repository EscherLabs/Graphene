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
$('[href="/admin/apps"]').parent().addClass('active');

var root = '/api/apps/';
function load(app_version) {




	$('.nav-tabs').stickyTabs();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    bt.fixStyle()
  })

  loaded.code = $.extend(true, {scripts:[{name:'Main',content:'', disabled: true}],templates:[{name:'Main',content:'', disabled: true}],
  forms:[{name:'Options',content:'', disabled: true},{name:'User Options',content:'', disabled: true}]
  },app_version)

  attributes= $.extend(true,{},{code:{user_preference_form:"",form:"", css:""}}, loaded);
  $('.navbar-header .nav a h4').html('MicroApp - '+attributes.app.name);

  $('#version').html((attributes.summary || 'Working Version'));

  if(typeof Berries.style !== 'undefined'){
    Berries.style.destroy();
  }
  $('.styles').berry({
    actions:false,
    name: 'style',
    attributes:attributes,
    inline:true,
    flatten:false,
    fields:[
      {name:'code', label: false,  type: 'fieldset', fields:[
        {label:false, name:'css', type:'ace', mode:'ace/mode/css'},
      ]}
    ]
  })
  

  var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: -20,
		container: '.resources',
    edit:true,delete:true,add:true
	}


  tableConfig.schema = [
    {label: 'Name',name: 'name'},
    {label: 'Modifier',name: 'modifier', type: 'select', options:[{label: 'None', value: 'none'},{label: 'XML', value: 'xml'}, {label: 'CSV', value: 'csv'}, {label: 'Include as Script', value: 'script'}, {label: 'Include as CSS', value: 'css'}]},
    {label: 'Path',name:'path'},
    {label: 'Fetch', type: 'checkbox',name:'fetch'},
    {label: 'Cache', type: 'checkbox',name:'cache'}
  ];
  tableConfig.data = attributes.code.resources;
  if(typeof bt !== 'undefined'){
    bt.destroy();
  }
  bt = new berryTable(tableConfig)

  var temp = $(window).height() - $('.nav-tabs').offset().top -77;

  $('body').append('<style>.ace_editor { height: '+temp+'px; }</style>')

  templatePage = new paged('.templates', {name:'templates', items:attributes.code.templates, label:'Template'});
  scriptPage = new paged('.scripts',{name:'scripts', items:attributes.code.scripts, mode:'ace/mode/javascript', label:'Script'});
  // formPage = new paged('.forms',{name:'forms', items:attributes.code.forms, mode:'ace/mode/javascript', label:'Form',extra: function(item){

  //   item.content = this.berry.fields[this.active].toJSON();
  //   if (!_.some(JSON.parse(item.content||'{}').fields, function(o) { return _.has(o, "fields"); })) {
  //     modalForm(item.content, item.name, function() {
  //       var old = formPage.getCurrent();
  //       formPage.update(old.key, JSON.stringify($.extend(false, {}, JSON.parse(old.content||'{}'),{"fields":cb.toJSON({editor:false})[0]}), null, 2 ))
  //     });
  //   }else{
  //     toastr.error('If you would like to continue using the form builder UI you will need to remove any fieldsets', 'Fieldsets Not Currently Supported');
  //   }
  // }});
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

// function modalForm(form, name, onSave) {

//   if(typeof cb === 'undefined'){
//     if(typeof form === 'string'){
//       form = JSON.parse(form || '{}');
//     }
//     form = form || {};
//     $('#myModal').remove();
//     this.onSave = onSave;
//     this.ref = $(templates.modal.render({title: 'Form Editor: '+ name}));
//     $(this.ref).appendTo('body');
//     this.ref.find('.modal-body').html(templates.formEditor.render());
//     this.ref.find('.modal-footer').html('<div id="saveForm" class="btn btn-success"><i class="fa fa-check"></i> Save</div>');
//     this.ref.on('hide.bs.modal', function(){
//       cb.destroy();
//       delete cb;
//     });
//     this.ref.find('#saveForm').on('click', function(){
//       this.onSave.call(this)
//       this.ref.modal('hide');
      
//     }.bind(this))
//     this.ref.modal({backdrop: 'static'});

//     cb = new Cobler({formOptions:{inline:true},formTarget:$('#form'), disabled: false, targets: [document.getElementById('editor')],items:[[]]});
//     $('.modal #form').keydown(function(event) {
//       switch(event.keyCode) {
//         case 27://escape
//             event.stopPropagation();
//             cb.deactivate();
//             return false;
//           break;
//       }
//     });
//     list = document.getElementById('sortableList');
//     cb.addSource(list);
//     cb.on('activate', function(){
//       if(list.className.indexOf('hidden') == -1){
//         list.className += ' hidden';
//       }
//       $('#form').removeClass('hidden');
//     })
//     cb.on('deactivate', function(){
//       list.className = list.className.replace('hidden', '');
//       $('#form').addClass('hidden');
//     })
//     document.getElementById('sortableList').addEventListener('click', function(e) {
//       cb.collections[0].addItem(e.target.dataset.type);
//     })
//   }

//   if(typeof form !== 'undefined'){
//     var temp = $.extend(true, {}, form);
//     for(var i in temp.fields){

//       temp.fields[i] = Berry.normalizeItem(temp.fields[i], i);
//       switch(temp.fields[i].type) {
//         case "select":
//         case "radio":
//           temp.fields[i].widgetType = 'select';
//           break;
//         case "checkbox":
//           temp.fields[i].widgetType = 'checkbox';
//           break;
//         default:
//           temp.fields[i].widgetType = 'textbox';
//       }

//     }

//     list.className = list.className.replace('hidden', '');
//     cb.collections[0].load(temp.fields);
//   }
// }

$('#save').on('click',function() {
  template_errors = templatePage.errors();
  script_errors =scriptPage.errors();
  var data = {code:{}};
  data.code.css = Berries.style.toJSON().code.css;
  data.code.resources = _.map(bt.models,'attributes');
  data.code.templates = templatePage.toJSON();

  try{
    _.each(data.code.templates, function(partial){
      try{
          Ractive.parse(partial.content);
        }catch(e){
          template_errors.push({
            type: e.name,
            name: partial.name,
            message: e.message
          });
        }
    })
  }catch(e) {
      toastr.error(e.message, e.name);
      return false;
  }
  var errorCount = template_errors.length+ script_errors.length;//+ css_errors.length

  if(!errorCount){
    data.code.scripts = scriptPage.toJSON();
    var temp = formPage.toJSON();
    data.code.forms = formPage.toJSON();
    data.updated_at = attributes.updated_at;

    $.ajax({
      url: root+attributes.app_id+'/code',
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
            conflictResults.sources = (JSON.stringify(test.sources) !== JSON.stringify(this.model.sources));
            conflictResults.css = (JSON.stringify(test.css) !== JSON.stringify(this.model.css));
            conflictResults.options = (JSON.stringify(test.options) !== JSON.stringify(this.model.options));
            conflictResults.scripts = (JSON.stringify(test.script) !== JSON.stringify(this.model.script));
            conflictResults.template = (JSON.stringify(test.template) !== JSON.stringify(this.model.template));
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
    $().berry({name: 'update', inline: true, legend: '<i class="fa fa-cube"></i> Update Microapp',fields: [	{label: 'Descriptor', type: 'textarea'}]}).on('save', function(){
      $.ajax({
        url: root+attributes.app_id+'/code',
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
    $().berry({name: 'publish', inline: true, legend: '<i class="fa fa-cube"></i> Publish Microapp',fields: [	
        {label: 'Summary', required: true},
        {label: 'Description', type: 'textarea'}
      ]}).on('save', function() {
        if(Berries.publish.validate()){
          $.ajax({
            url: root + attributes.app_id + '/publish',
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
  viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a href="/app/{{group_id}}/{{slug}}" target="_blank">{{name}}</a><a class="btn btn-warning" style="position: absolute;top: 3px;right: 3px;" href="/admin/appinstances/{{id}}" target="_blank"><i class="fa fa-pencil"></i></a></div>{{/items}}</div>');
  $.get('/api/appinstances?app_id=' + loaded.app_id, function(data) {
    if(data.length > 0){
      modal({title: 'This App has the following instances', content: viewTemplate.render({items: data})});
    }else{
      modal({title: 'No instances Found', content: 'This App is not currently instantiated.'});
    }
  })
});

$('#versions').on('click', function() {
  $.ajax({
    url: root + loaded.app_id + '/versions',
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

      $().berry({actions:['cancel','switch'],name:'modal',attributes:{app_version_id:loaded.id},legend:'Select Version',fields:[
        {label: 'Version', name:'app_version_id', options:data,type:'select', value_key:'id',label_key:'label'},
      ]}).on('save', function() {
        //switch version
        $.ajax({
          url: root+attributes.app_id+'/versions/'+this.toJSON().app_version_id,
          method: 'get',
          data: data,
          success:function(data) {
            data.app = loaded.app;
            loaded = data;
            load(loaded.code);
            Berries.modal.trigger('close');
          }
        })
      })
    }
  })
})







renderBuilder = function(){
  var target = document.querySelector('.target');
  $(target).html('<div data-map="" style="padding:15px;width: 100%;text-overflow: ellipsis;overflow: hidden;" class="btn btn-default">'+working_forms[formIndex].label+'</div>')
  var form = myform;
  var map = "";
  _.each(path,function(p){
    form = _.find(form.fields,{name:p})
    map += form.name+',';
    $(target).append('<div style="text-align:center;padding:5px;color: #555;"><i class="fa fa-long-arrow-down fa-2x"> </i></div><div style="padding:15px;width: 100%;text-overflow: ellipsis;overflow: hidden;" data-map="'+map+'" class="btn btn-default">'+(form.label||form.name)+'</div>')
  })
  target.querySelectorAll('.btn-default')[target.querySelectorAll('.btn-default').length-1].style.border = "solid 2px #d85e16";

  
  $(target).append('<hr>')

  
  if(typeof cb === 'undefined'){

    cb = new Cobler({formTarget:$('#form') ,disabled: false, targets: [document.getElementById('editor')],items:[[]]})
    list = document.getElementById('sortableList');
    cb.addSource(list);
    cb.on('activate', function(e){
      // if(list.className.indexOf('hidden') == -1){
      //   list.className += ' hidden';
      // }
      $('#form').removeClass('hidden');
    })
    cb.on('deactivate', function(){
      if(typeof gform.instances.editor !== 'undefined'){
          gform.instances.editor.destroy();
      }
      // list.className = list.className.replace('hidden', '');
      $('#form').addClass('hidden');
      mainForm();
    })
    document.getElementById('sortableList').addEventListener('click', function(e) {
      // debugger;
      cb.deactivate();
      cb.collections[0].addItem(e.target.dataset.type || e.target.parentElement.dataset.type);
    })
    cb.on("change", function(){
      var workingForm = myform;
      _.each(path,function(p){
        workingForm = _.find(workingForm.fields,{name:p})
      })
      workingForm.fields = cb.toJSON()[0];
      
    })
    cb.on('remove', function(e){
      if(typeof gform.instances.editor !== 'undefined' && gform.instances.editor.options.cobler == e[0]){
        cb.deactivate();
      }
    });
  }

  if(typeof form !== 'undefined'){
    var temp = $.extend(true, {}, form);
    for(var i in temp.fields){
      // var mapOptions = new gform.mapOptions(temp.fields[i],undefined,0,gform.collections)
      // temp.fields[i].options = mapOptions.getobject()
      switch(temp.fields[i].type) {
        case "select":
        case "radio":
        case "scale":
        case "range":
        case "grid":
        case "user":
        case "groups":
        case "smallcombo":
          temp.fields[i].widgetType = 'collection';
          break;
        case "checkbox":
        case "switch":
          temp.fields[i].widgetType = 'bool';
          break;
        case "fieldset":
        case "grid":
          temp.fields[i].widgetType = 'section';
          break;
        default:
          temp.fields[i].widgetType = 'input';
      }
    }
    
    list.className = list.className.replace('hidden', '');
    cb.collections[0].load(temp.fields);
  }
  // mainForm(form,map);

  if(typeof gform.instances.editor !== 'undefined'){
    gform.instances.editor.destroy();
  }

  mainForm();
} 
mainForm = function(){
  var form = myform;
  _.each(path,function(p){
    form = _.find(form.fields,{name:p})
  })
  if(!path.length){
    new gform({
      name:"editor",
      data: form,
      actions:[],
      fields: [
        {name:"legend",label:"Label",columns:6},
        {name:"name",label:"Name",columns:6},
        {name:"default",label:false,type:'fieldset',fields:[
          {name:"horizontal",label:"Horizontal",type:"checkbox"}
        ]},
        {name:"horizontal",label:"Horizontal",value:true,type:"checkbox",show:false,parse:true},
        // {type: 'switch', label: 'Custom Actions', name: 'actions',parse:false, show:[{name:"type",value:['output'],type:"not_matches"}]},
        // {type: 'fieldset',columns:12,array:true, label:false,name:"actions",parse:'show', show:[{name:"actions",value:true,type:"matches"}],fields:[
          
        //   {name:"type",columns:6,label:"Type",type:"smallcombo",options:["cancel","save"]},
        //   // {name:"name",columns:6,label:"Name"},
        //   {name:"action",columns:6,label:"Action"},
        //   {name:"label",columns:6,label:"Label"},
        //   {name:"modifiers",columns:6,label:"Classes",type:"smallcombo",options:[
        //     {label:"Danger",value:"btn btn-danger"},
        //     {label:"Success",value:"btn btn-success"},
        //     {label:"Info",value:"btn btn-info"}]}

        // ]},

      ],
      legend: 'Edit Form',
    }, '#mainform').on('input:type',function(e){
      if(e.field.value == 'cancel'){
        e.field.parent.set({
          "label":"<i class=\"fa fa-times\"></i> Cancel",
          "action":"cancel",
          "modifiers": "btn btn-danger"})
      }
    }).on('input', _.throttle(function(e){
      form = _.extend(form,e.form.get());
      // if(typeof e.form.get().actions == 'undefined'){
      //   delete form.actions;
      // }
      // if(typeof e.field !== 'undefined' && e.field.name == 'horizontal'){
      //   renderBuilder()
      // }

    }) ).on('input:horizontal',function(){
      renderBuilder();
    })
  }else{
    var temp = new Cobler.types[gform.types[form.type].base]();
    $("#mainform").html(gform.renderString(accordion))

    $('.panelOptions').toggle(false);
    
    new gform({
      name:"editor",
      nomanage:true,
      data: form,
      actions:[],
      clear:false,
      fields: temp.fields,
      legend: 'Edit Fieldset',
    }, '#mainform').on('change', function(e){
      // form = _.extend(form,e.form.get())
      var workingForm = myform;
        _.each(path,function(p){
          workingForm = _.find(workingForm.fields,{name:p})
        })
        
      // workingForm = 
      _.extend(workingForm,e.form.get())
      

    })

  }
}


// $('#cobler').on('click', function(e) {

// });


$('.target').on('click','[data-map]', function(e) {
path = _.compact(e.currentTarget.dataset.map.split(','));
cb.deactivate();
renderBuilder()
});


setupform = function(index){
  formIndex = index;
  myform = working_forms[formIndex].content || {};
  $('#formlist').html(
    gform.renderString(
`<div class="btn-group">
  <button type="button" class="btn btn-success go pages_new">New</span></button>
  <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  <span class="visible-lg-inline"> Change</span> <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu dropdown-menu-right">
  {{#forms}}
    <li><a href="javascript:void(0);" data-index="{{i}}" class="form_edit" >{{label}}</a></li>
  {{/forms}}
  </ul>
  </div>
`
  ,{forms:working_forms}))

  // $('#cobler').click();
  path = [];
  // $(e.target).siblings().removeClass('active');
  // $(e.target).addClass('active');
  // $('#form').addClass('hidden');
  // $('.view_source').removeClass('hidden');
  renderBuilder();

}


document.addEventListener('DOMContentLoaded', function(){
  // myform = JSON.parse(($.jStorage.get('form') || "{}"));
  formIndex = 0;
  working_forms = _.each(loaded.code.forms,function(form,i){
    form.content = JSON.parse(form.content);
    form.content.name = form.name || form.content.name;
    form.i = i+'';
    form.label = form.content.legend||form.content.name;
  })
  $('#formlist').on('click','.form_edit',function(e){
    setupform(parseInt(e.target.dataset.index))
  })
  setupform(formIndex);


});
