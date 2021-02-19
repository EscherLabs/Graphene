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

Berry.validations['validurlpath'] = {
	method: function(value, args) {
		if (!/^[\/][a-zA-Z0-9_\/-]*[a-zA-Z0-9]$/.test(value)) {
			return false;
		}
		return true;
	},
	message: 'Must be a valid url path begining with a / and ending in a number or letter. Please see examples in help text'
}

Berry.validations['phpclassname'] = {
	method: function(value, args) {
		if (!/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/.test(value)) {
			return false;
		}
		return true;
	},
	message: 'API name must be a valid php function name'
}





attributes = {};
var root = '/api/apps/';
function load(app_version) {

	$('.nav-tabs').stickyTabs();
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    grid.fixStyle()
  })

  attributes= app_version;

  attributes.files = $.extend(true, [{name:'Main',content:'', disabled: true}],attributes.files)
  attributes.functions = $.extend(true, [{name:'Constructor',content:'', disabled: true}],attributes.functions)

  $('.navbar-header .nav a h4').html('API - '+api.name);

  $('#version').html((attributes.summary || 'Working Version'));


  new gform({
    name: 'resources',
    data:attributes,
    actions:[],
    fields:[
      // {type:'output',name:'test',format:{value:'<div></div>'},label:false},
      {
        "name":"resources",
        "array": {
            "min": 0,
            "max": 50,
            "duplicate": {
                "enable": "auto",
                "clone": false
            }
        },
        "type":"fieldset",
        "fields": [
          // "database": {}
          // {label: false, name:'database',type:'select', required: true,choices:'/api/proxy/databases',label_key:'name',value_key:'id'}
          {label: "Name", name:'name', required: false, columns:6},
          // {label: 'Type', name:'type', type:'select',options:[
          //   {label: 'MySQL Database',value: 'mysql'},
          //   {label: 'Oracle Database', value:'oracle'},
          //   {label: 'Value', value:'value'},
          //   {label: 'Secret Value (Encrypted at Rest)', value:'secret'}
          // ], columns:6}
          
        ]
      }
    ]
  },'.resources')










  // var tableConfig = {
	// 	entries: [25, 50, 100],
	// 	count: 25,
	// 	autoSize: -20,
	// 	container: '.routes',
  //   edit:function(model){
  //     var temp = model.attributes;
  //     temp.required = _.filter(temp.required, function(o) { return o.name !== ''; });
  //     temp.optional = _.filter(temp.optional, function(o) { return o.name !== ''; });
  //     model.set(temp)
  //     model.owner.draw();
  //   },delete:true, add:function(model){
  //     var temp = model.attributes;
  //     temp.required = _.filter(temp.required, function(o) { return o.name !== ''; });
  //     temp.optional = _.filter(temp.optional, function(o) { return o.name !== ''; });
  //     model.set(temp)
  //     model.owner.draw();    }
	// }


  // tableConfig.schema = [
  //   {label: 'Description',name: 'description'},
  //   {label: 'Path', name:'path', validate:{required:true,validurlpath:true}, help:'i.e. /example/route or /my-example_2'},
  //   {label: 'Function Name', name:'function_name', validate:{required:true,phpclassname:true}},
  //   // {label: 'Path',name:'path'},
  //   {label: 'Verb',name:'verb',type:'select',options:["ALL", "GET", "POST", "PUT", "DELETE"], required:true},
  //   {
  //     "show":false,
  //     "name": "parameters",
  //     "label": "Parameters",
  //     "template":'{{#attributes.required}}<b>{{name}}</b><br> {{/attributes.required}}{{#attributes.optional}}{{#name}}{{name}}<br>{{/name}} {{/attributes.optional}}',
  //     "fields": {
  //       "required": {
  //         "label": false,
  //         "multiple": {
  //           "duplicate": true
  //         },
  //         fields:[
  //           {'name':'name','label':'Name',"inline":true},
  //           {'name':'description','label':'Description','type':'textarea',"inline":true},
  //           {'name':'example','label':'Example',"inline":true}
  //           // {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
  //         ]
  //       },
  //       "optional": {
  //         "label": false,
  //         "multiple": {
  //           "duplicate": true
  //         },
  //         fields:[
  //           {'name':'name','label':'Name',"inline":true},
  //           {'name':'description','label':'Description','type':'textarea',"inline":true},
  //           {'name':'example','label':'Example',"inline":true}
  //           // {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
  //         ]
  //       }
  //     }
  //   }
  // ];
  // tableConfig.data = attributes.routes;


  // tableConfig.events=[
  //   {'name': 'required', 'label': '<i class="fa fa-lock"></i> Required Parameters', callback: function(model){
  //     $().berry({
  //       // model:model,
  //       attributes:model.attributes,
  //       legend:'Required Parameters',
  //       name:'required',
  //       fields:[
  //         {label: 'Description',name: 'description',type:'hidden'},
  //         {label: 'Path', name:'path', type:'hidden'},
  //         {label: 'Function Name', name:'function_name',type:'hidden'},
  //         {label: 'Verb',name:'verb',type:'hidden',options:["ALL", "GET", "POST", "PUT", "DELETE"]},
  //         {
  //           "name": "params",
  //           "label": false,
  //           "fields": {
  //             "required": {
  //               "label": false,
  //               "multiple": {
  //                 "duplicate": true
  //               },
  //               fields:[
  //                 {'name':'name','label':'Name',"inline":true,columns:6},
  //                 {'name':'example','label':'Example',"inline":true, columns:6},
  //                 {'name':'description','label':'Description','type':'textarea',"inline":true}
  //                 // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
  //               ]
  //             },
  //             "optional": {
  //               "show":false,
  //               "label": false,
  //               "multiple": {
  //                 "duplicate": true
  //               },
  //               fields:[
  //                 {'name':'name','label':'Name',"inline":true},
  //                 {'name':'description','label':'Description','type':'textarea',"inline":true},
  //                 {'name':'example','label':'Example',"inline":true}
  //                 // {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
  //               ]
  //             }
  //           }
  //         }
  //       ]
  //       }).on('save',function(){
  //         var temp = Berries.required.toJSON();
  //         temp.required = _.filter(temp.required, function(o) { return o.name !== ''; });
  //         temp.optional = _.filter(temp.optional, function(o) { return o.name !== ''; });
  //         this.set(temp)
  //         this.owner.draw();
  //         Berries.required.trigger('close')
  //       },model)
  //   }, multiEdit: false},    
  //   {'name': 'optional', 'label': '<i class="fa fa-info"></i> Optional Parameters', callback: function(model){
  //     $().berry({
  //       // model:model,
  //       attributes:model.attributes,
  //       legend:'Optional Parameters',
  //       name:'optional',
  //       fields:[
  //         {label: 'Description',name: 'description',type:'hidden'},
  //         {label: 'Path', name:'path', type:'hidden'},
  //         {label: 'Function Name', name:'function_name',type:'hidden'},
  //         {label: 'Verb',name:'verb',type:'hidden',options:["ALL", "GET", "POST", "PUT", "DELETE"]},
  //         {
  //           "name": "params",
  //           "label": false,
  //           "fields": {
  //             "required": {
  //               "show":false,
  //               "label": false,
  //               "multiple": {
  //                 "duplicate": true
  //               },
  //               fields:[
  //                 {'name':'name','label':'Name',"inline":true},
  //                 {'name':'description','label':'Description','type':'textarea',"inline":true},
  //                 {'name':'example','label':'Example',"inline":true}
  //                 // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
  //               ]
  //             },
  //             "optional": {
  //               "label": false,
  //               "multiple": {
  //                 "duplicate": true
  //               },
  //               fields:[
  //                 {'name':'name','label':'Name',"inline":true,columns:6},
  //                 {'name':'example','label':'Example',"inline":true, columns:6},
  //                 {'name':'description','label':'Description','type':'textarea',"inline":true}
  //                 // {'name':'required','label':'Required?','type':'checkbox',falsestate:'',"inline":true,columns:4},
  //               ]
  //             }
  //           }
  //         }
  //       ]
  //       }).on('save',function(){
  //         var temp = Berries.optional.toJSON();
  //         temp.required = _.filter(temp.required, function(o) { return o.name !== ''; });
  //         temp.optional = _.filter(temp.optional, function(o) { return o.name !== ''; });
  //         this.set(temp)
  //         this.owner.draw();

  //         Berries.optional.trigger('close')
  //       },model)
  //   }, multiEdit: false}

  // ]
  // bt = new berryTable(tableConfig)


  var options = {
    data: attributes.routes,
		el: '.routes',
    schema:[
      {label: 'Description',name: 'description'},
      {label: 'Path', name:'path', validate:{required:true,validurlpath:true}, help:'i.e. /example/route or /my-example_2'},
      {label: 'Function Name', name:'function_name', validate:{required:true,phpclassname:true}},
      {label: 'Verb',name:'verb',type:'select',options:["ALL", "GET", "POST", "PUT", "DELETE"], required:true},
      {
            "show":false,
            "name": "parameters",
            "label": "Parameters",
            "template":'{{#attributes.required}}<b>{{name}}</b><br> {{/attributes.required}}{{#attributes.optional}}{{#name}}{{name}}<br>{{/name}} {{/attributes.optional}}',
            
      }
    ],
    actions:[
      {name:"create"},'|',
      {name:"edit"},{'name': 'required', 'label': '<i class="fa fa-lock"></i> Required Parameters',min:1,max:1},{'name': 'optional', 'label': '<i class="fa fa-info"></i> Optional Parameters',min:1,max:1},'|',
      {name:"delete"}
    ]
  };
  
  if(typeof grid !== 'undefined'){
    grid.destroy();
  }
  grid = new GrapheneDataGrid(options)
  grid.on('model:required',function(e){
     new gform({
      data:e.model.attributes,
      legend:'Required Parameters',
      name:'required',
      "fields": [
        {
          "name":"required",
          "label": false,
          "array":{min:1,max:100},
          "type":"fieldset",
          fields:[
            {'name':'name','label':'Name',"inline":true,columns:6},
            {'name':'example','label':'Example',"inline":true, columns:6},
            {'name':'description','label':'Description','type':'textarea',"inline":true}
            // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
          ]
        }
  ]
      }).on('save',function(e){
        this.update(e.form.get());
        e.form.dispatch('close')
      }.bind(e.model)).on('cancel',function(e){e.form.dispatch('close')}).modal()


  })
  grid.on('model:optional',function(e){
    new gform({
      data:e.model.attributes,
      legend:'Optional Parameters',
      name:'optional',
      "fields": [
        {
          "name":"optional",
          "label": false,
          "array":{min:1,max:100},
          "type":"fieldset",
          fields:[
            {'name':'name','label':'Name',"inline":true,columns:6},
            {'name':'example','label':'Example',"inline":true, columns:6},
            {'name':'description','label':'Description','type':'textarea',"inline":true}
            // {'name':'required','label':'Required?','type':'checkbox',falsestate:0,"inline":true,columns:4},
          ]
        }
  ]
      }).on('save',function(e){
        this.update(e.form.get());
        e.form.dispatch('close')
      }.bind(e.model)).on('cancel',function(e){e.form.dispatch('close')}).modal()


  })















  //adjust ace height to fill page
  $('body').append('<style>.ace_editor { height: '+($(window).height() - $('.nav-tabs').offset().top -77)+'px; }</style>')


  //add file managers here
  filepage = new fileManager('.files',{name:'scripts', items:attributes.files, mode:'ace/mode/php', label:'File'});
  functionpage = new fileManager('.functions',{name:'functions', items:attributes.functions, mode:'ace/mode/php', label:'Function', inlinemode:true});
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
  script_errors =filepage.errors();
  script_errors +=functionpage.errors();
  var data = attributes;
  data.routes = grid.toJSON();
  data.resources = gform.instances.resources.get().resources;
  var errorCount = script_errors.length;//+ css_errors.length

  if(!errorCount){
    data.files = filepage.toJSON();
    data.functions = functionpage.toJSON();
    data.updated_at = attributes.updated_at;
    toastr.info('', 'Saving...')
    
    $.ajax({
      url: '/api/proxy/'+slug+'/apis/'+attributes.api_id+'/code',
      method: 'PUT',
      data: data,
      success:function(e) {
        if(typeof e.updated_at !== 'undefined'){
          attributes.updated_at = e.updated_at;
        }
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

$('#import').on('click', function() {
    $().berry({name: 'update', inline: true, legend: '<i class="fa fa-cube"></i> Update Microapp',fields: [	{label: 'Descriptor', type: 'textarea'}]}).on('save', function(){
      $.ajax({
        url: '/api/proxy/'+slug+'/apis/'+attributes.api_id+'/code',
        method: 'PUT',
        data: $.extend({force: true, updated_at:''}, JSON.parse(this.toJSON().descriptor)),
        success:function(e) {
          Berries.update.trigger('close');
          window.location.reload()
        },
        error:function(e) {
          toastr.error(e.statusText, 'ERROR');
        }

      })
  });
});

$('#publish').on('click', function() {
    $().berry({name: 'publish', inline: true, legend: '<i class="fa fa-cube"></i> Publish API',fields: [	
        {label: 'Summary', required: true},
        {label: 'Description', type: 'textarea'}
      ]}).on('save', function() {
        if(Berries.publish.validate()){
          $.ajax({
            url: '/api/proxy/'+slug+'/apis/'+attributes.api_id+'/publish',
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
  viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a href="'+server+'/{{slug}}" target="_blank">{{name}}</a><a class="btn btn-warning" style="position: absolute;top: 3px;right: 3px;" href="/admin/apiserver/'+slug+'/api_instance/{{id}}" target="_blank"><i class="fa fa-pencil"></i></a></div>{{/items}}</div>');
  $.get('/api/proxy/'+slug+'/api_instances', function(data) {
    data = _.where(data, {api_id:api.id})
    if(data.length > 0){
      modal({title: 'This API has the following instances', content: viewTemplate.render({items: data})});
    }else{
      modal({title: 'No instances Found', content: 'This App not currently instantiated.'});
    }
  })
});

$('#versions').on('click', function() {
  $.ajax({
    url: "/api/proxy/"+slug+"/apis/"+api.id+"/versions",
    success: function(data) {
      console.log(data);
      data = _.where(data,{stable:1})
      if(!orig.stable) {
        data.unshift({id:orig.id,summary:'Working Version'})
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
        {label: 'Version', name:'api_version_id', options:data,type:'select', value_key:'id',label_key:'summary'},
      ]}).on('save', function() {
        // switch version
        $.ajax({
          url: '/api/proxy/'+slug+'/api_versions/'+this.toJSON().api_version_id,
          method: 'get',
          // data: data,
          success:function(data) {
            loaded = data;
            load(loaded);
            Berries.modal.trigger('close');
          }
        })
      })
    }
  })
})

