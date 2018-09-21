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
var root = '/api/apps/';
function load(app_version) {

	$('.nav-tabs').stickyTabs();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    bt.fixStyle()
  })

  // loaded.code = $.extend(true, {scripts:[{name:'Main',content:'', disabled: true}],templates:[{name:'Main',content:'', disabled: true}],
  // forms:[{name:'Options',content:'', disabled: true},{name:'User Options',content:'', disabled: true}]
  // },app_version)

  attributes= app_version;
  $('.navbar-header .nav a h4').html('Service - '+service.name);

  $('#version').html((attributes.summary || 'Working Version'));

  if(typeof Berries.style !== 'undefined'){
    Berries.style.destroy();
  }
  // $('.styles').berry({
  //   actions:false,
  //   name: 'style',
  //   attributes:attributes,
  //   inline:true,
  //   flatten:false,
  //   fields:[
  //     {name:'code', label: false,  type: 'fieldset', fields:[
  //       {label:false, name:'css', type:'ace', mode:'ace/mode/css'},
  //     ]}
  //   ]
  // })
    $('.resources').berry({
    actions:false,
    name: 'resources',
    attributes:attributes,
    inline:false,
    fields:[
      {type:'raw',name:'test',value:'<div></div>',label:false},
      {
        "name": "resources_contain",
        "legend": '',
        "label": '',
        "fields": {
          "resources": {
            "label": false,
            "multiple": {
              "duplicate": true,
            },
            "fields": [
              // "database": {}
              // {label: false, name:'database',type:'select', required: true,choices:'/api/proxy/databases',label_key:'name',value_key:'id'}
              {label: 'Name', name:'name', required: true, columns:6},
              {label: 'Type', name:'type', type:'select',options:['mysql','constant'], columns:6}
              
            ]
          }
        }
      }
    ]
  })

  var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: -20,
		container: '.routes',
    edit:true,delete:true,add:true
	}


  tableConfig.schema = [
    {label: 'Description',name: 'description'},
    {label: 'Path', name:'path', required:true},
    {label: 'Function Name', name:'function_name', required:true},
    // {label: 'Path',name:'path'},
    {label: 'Verb',name:'verb',type:'select',options:["ALL", "GET", "POST", "PUT", "DELETE"], required:true},
    {
      "show":false,
      "name": "parameters",
      "label": "Parameters",
      "template":'{{#attributes.params}}{{#required}}<b>{{/required}}{{name}}{{#required}}</b>{{/required}}<br> {{/attributes.params}}',
      // "fields": {
      //   "params": {
      //     "label": false,
      //     "multiple": {
      //       "duplicate": true
      //     },
      //     fields:[
      //       {'name':'name','label':'Name',"inline":true,columns:8},
      //       {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
      //     ]
      //   }
      // }
    }
    // {label: 'Optional', name:'optional'},    
    // {label: 'Required', name:'required'},


    // {label: 'Fetch', type: 'checkbox',name:'fetch'},
    // {label: 'Cache', type: 'checkbox',name:'cache'}
  ];
  tableConfig.data = attributes.routes;
  if(typeof bt !== 'undefined'){
    bt.destroy();
  }

  tableConfig.events=[
    {'name': 'params', 'label': '<i class="fa fa-info"></i> Parameters', callback: function(model){
      $().berry({
        model:model,
        legend:'Parameters',
        fields:[
          {label: 'Description',name: 'description',type:'hidden'},
          {label: 'Path', name:'path', type:'hidden'},
          {label: 'Function Name', name:'function_name',type:'hidden'},
          {label: 'Verb',name:'verb',type:'hidden',options:["ALL", "GET", "POST", "PUT", "DELETE"]},
          {
            "name": "parameters",
            "label": false,
            "fields": {
              "params": {
                "label": false,
                "multiple": {
                  "duplicate": true
                },
                fields:[
                  {'name':'name','label':'Name',"inline":true,columns:8},
                  {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
                ]
              }
            }
          }
        ]
        })
    }, multiEdit: false},

  ]
  bt = new berryTable(tableConfig)

  var temp = $(window).height() - $('.nav-tabs').offset().top -77;

  $('body').append('<style>.ace_editor { height: '+temp+'px; }</style>')

  // templatePage = new paged('.templates',{name:'templates', items:attributes.code.templates, label:'Template'});
  scriptPage = new paged('.scripts',{name:'scripts', items:attributes.code, mode:'ace/mode/php', label:'Script'});
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
load(loaded);
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

$('#save').on('click',function() {
  script_errors =scriptPage.errors();
  var data = attributes;
  // data.code.css = Berries.style.toJSON().code.css;
  data.routes = _.map(bt.models,'attributes');
// data.databases = _.uniq(_.pluck(Berries.resources.toJSON().resources,'database'));
  data.resources = Berries.resources.toJSON().resources;
  var errorCount = script_errors.length;//+ css_errors.length

  if(!errorCount){
    data.code = scriptPage.toJSON();
    // var temp = formPage.toJSON();
    // data.code.forms = formPage.toJSON();
    debugger;
    data.updated_at = attributes.updated_at;
    toastr.info('', 'Saving...')
    
    $.ajax({
      url: '/api/proxy/'+slug+'/services/'+attributes.service_id+'/code',
      method: 'PUT',
      data: data,
      success:function(e) {
        debugger;
        attributes.updated_at = e.updated_at;
        toastr.clear()
        
        toastr.success('', 'Successfully Saved')
      },
      error:function(e) {
        toastr.error(e.statusText, 'ERROR');
      },
        // statusCode: {
        //   404: function() {
        //     toastr.error('You are no longer logged in', 'Logged Out')
        //   },
        //   409: function(error) {
        //     test = JSON.parse(JSON.parse(error.responseText).error.message);
        //     toastr.warning('conflict detected:'+error.statusText, 'NOT SAVED')
        //     conflictResults = {};
        //     conflictResults.sources = (JSON.stringify(test.sources) !== JSON.stringify(this.model.sources));
        //     conflictResults.css = (JSON.stringify(test.css) !== JSON.stringify(this.model.css));
        //     conflictResults.options = (JSON.stringify(test.options) !== JSON.stringify(this.model.options));
        //     conflictResults.scripts = (JSON.stringify(test.script) !== JSON.stringify(this.model.script));
        //     conflictResults.template = (JSON.stringify(test.template) !== JSON.stringify(this.model.template));
        //     modal({headerClass:'bg-danger' ,title: 'Conflict(s) detected', content: render('conflict', conflictResults)})//, footer:'<div class="btn btn-danger">Force Save</div>'})
        //   }.bind(this),
        //   401: function() {
        //     toastr.error('You are not authorized to perform this action', 'Not Authorized')
        //   }
        // }
    })
  }else{
    toastr.error('Please correct the compile/syntax errors ('+ errorCount +')', 'Errors Found')
    modal({headerClass:'danger' ,title: 'Syntax Error(s)', content: render('error', {count:errorCount, temp: template_errors, script: script_errors/*, css: css_errors*/})})//, footer:'<div class="btn btn-danger">Force Save</div>'})
  }
})

// $('#import').on('click', function() {
//     $().berry({name: 'update', inline: true, legend: '<i class="fa fa-cube"></i> Update Microapp',fields: [	{label: 'Descriptor', type: 'textarea'}]}).on('save', function(){
//       $.ajax({
//         url: root+attributes.app_id+'/code',
//         data: $.extend({force: true, updated_at:''}, JSON.parse(this.toJSON().descriptor)),
//         method: 'PUT',
//         success: function(){
//           Berries.update.trigger('close');
//           window.location.reload();
//         },
//         error: function(e){
//           toastr.error(e.statusText, 'ERROR');
//         }
//       })
//   });
// });

$('#publish').on('click', function() {
    $().berry({name: 'publish', inline: true, legend: '<i class="fa fa-cube"></i> Publish Service',fields: [	
        {label: 'Summary', required: true},
        {label: 'Description', type: 'textarea'}
      ]}).on('save', function() {
        if(Berries.publish.validate()){
          $.ajax({
            url: '/api/proxy/'+slug+'/services/'+attributes.id+'/publish',
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

// $('#instances').on('click', function() {
//   viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a href="/app/{{group_id}}/{{slug}}" target="_blank">{{name}}</a><a class="btn btn-warning" style="position: absolute;top: 3px;right: 3px;" href="/admin/appinstances/{{id}}" target="_blank"><i class="fa fa-pencil"></i></a></div>{{/items}}</div>');
//   $.get('/api/appinstances/?app_id=' + loaded.app_id, function(data) {
//     if(data.length > 0){
//       modal({title: 'This App Instance was found on the following pages', content: viewTemplate.render({items: data})});
//     }else{
//       modal({title: 'No pages Found', content: 'This App Instance is not currently placed on any pages.'});
//     }
//   })
// });

// $('#versions').on('click', function() {
//   $.ajax({
//     url: root + loaded.app_id + '/versions',
//     success: function(data) {
//       console.log(data);
//       if(!orig.stable) {
//         data.unshift({id:orig.id,label:'Working Version'})
//       }
//       Berry.btn.switch={
//         label: 'Switch',
//         icon:'reply',
//         id: 'berry-submit',
//         modifier: 'success pull-right',
//         click: function() {
//           if(this.options.autoDestroy) {
//             this.on('saved', this.destroy);
//           }
//           this.trigger('save');
//         }
//       }

//       $().berry({actions:['cancel','switch'],name:'modal',attributes:{app_version_id:loaded.id},legend:'Select Version',fields:[
//         {label: 'Version', name:'app_version_id', options:data,type:'select', value_key:'id',label_key:'label'},
//       ]}).on('save', function() {
//         //switch version
//         $.ajax({
//           url: root+attributes.app_id+'/versions/'+this.toJSON().app_version_id,
//           method: 'get',
//           data: data,
//           success:function(data) {
//             data.app = loaded.app;
//             loaded = data;
//             load(loaded.code);
//             Berries.modal.trigger('close');
//           }
//         })
//       })
//     }
//   })
// })

