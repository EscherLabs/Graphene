// if(loaded.code == null){loaded.code = {scripts:[{name:'Main',content:'', disabled: true}],templates:[{name:'Main',content:'', disabled: true}],
// forms:[{name:'Options',content:'', disabled: true},{name:'User Options',content:'', disabled: true}]
// };}
loaded.code = $.extend(true, {scripts:[{name:'Main',content:'', disabled: true}],templates:[{name:'Main',content:'', disabled: true}],
forms:[{name:'Options',content:'', disabled: true},{name:'User Options',content:'', disabled: true}]
},loaded.code)

var attributes= $.extend(true,{},{code:{user_preference_form:"",form:"", css:""}}, loaded);

$('.navbar-header .nav a h4').html(attributes.name+' <i class="fa fa-pencil"></i>');
$('.navbar-header .nav a h4').on('click',function(){
  $().berry({legend:'Update App Name',fields:[{name:'name',label:false, value: attributes.name}]}).on('save', function(){
      attributes.name = this.toJSON().name;
      $('.navbar-header .nav a h4').html(attributes.name+' <i class="fa fa-pencil"></i>');
      this.trigger('close');
  });
})
$('#save').on('click',function() {
  var data = $.extend(true, {}, attributes, Berries.app.toJSON());
  data.code.resources = Berries.app.toJSON().code.resources;
  data.code.templates = templatePage.toJSON();
  // var successCompile = false;
  try{
    _.each(data.code.templates, function(partial){
      Ractive.parse(partial.content);
    })
    // if(!this.resourcesForm.validate()){
    //   toastr.error(e.message, e.name);
    //   return false;
    // }
  }catch(e) {
      toastr.error(e.message, e.name);
      return false;
  }



  data.code.scripts = scriptPage.toJSON();
  var temp = formPage.toJSON();
  data.code.forms = formPage.toJSON();

  // data.code.form = temp[0].content;
  // data.code.user_options_form = temp[1].content;
  $.ajax({
    url: '/api/apps/'+attributes.id,
    method: 'put',
    data: data,
    success:function() {
      toastr.success('', 'Successfully Saved')
    },
    error:function(e) {
      toastr.error(e.statusText, 'ERROR');
    }
  })
})


$('#import').on('click',function() {

    $().berry({name: 'update', inline: true, legend: '<i class="fa fa-cube"></i> Update Microapp',fields: [	{label: 'Descriptor', type: 'textarea'}]}).on('save', function(){
      $.ajax({
        url: '/api/apps/'+attributes.id,
        data: $.extend({force: true, updated_at:''}, JSON.parse(Berries.update.toJSON().descriptor)),
        method: 'PUT',
        success: function(){
          Berries.update.trigger('close');
          window.location.reload();
        }
      })
  });


  // var data = $.extend(true, {}, attributes, Berries.app.toJSON());
  // data.code.resources = Berries.app.toJSON().code.resources;
  // data.code.templates = templatePage.toJSON();
  // // var successCompile = false;
  // try{
  //   _.each(data.code.templates, function(partial){
  //     Ractive.parse(partial.content);
  //   })
  //   // if(!this.resourcesForm.validate()){
  //   //   toastr.error(e.message, e.name);
  //   //   return false;
  //   // }
  // }catch(e) {
  //     toastr.error(e.message, e.name);
  //     return false;
  // }



  // data.code.scripts = scriptPage.toJSON();
  // var temp = formPage.toJSON();
  // data.code.forms = formPage.toJSON();

  // // data.code.form = temp[0].content;
  // // data.code.user_options_form = temp[1].content;
  // $.ajax({
  //   url: '/api/apps/'+attributes.id,
  //   method: 'put',
  //   data: data,
  //   success:function() {
  //     toastr.success('', 'Successfully Saved')
  //   },
  //   error:function(e) {
  //     toastr.error(e.statusText, 'ERROR');
  //   }
  // })
})




$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey))
  {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});

$('.sources').berry({
  actions:false,
  name: 'app',
  autoDestroy:false,
  attributes:attributes,
  inline:true,
  flatten:false,
  fields:[
    // {label: 'Name', name:'name', required: true, fieldset:"app_name"},
    {name:'code', label: false,  type: 'fieldset', fields:[
      {label:false, name:'css', fieldset: 'styles', type:'ace', mode:'ace/mode/css'},
      {fieldset:'resources',"multiple": {"duplicate": true},label: false, name: 'resources', type: 'fieldset', fields:[
          {label: 'Name',name: 'name'},
          {label: 'Fetch', type: 'checkbox'},
          {label: 'Path'},
          {label: 'Cache', type: 'checkbox'},
          {label: 'Modifier', type: 'select', choices:[{label: 'None', value: 'none'},{label: 'XML', value: 'xml'}, {label: 'CSV', value: 'csv'}]}
      ]},
      // {fieldset:'forms',label: 'Configuration Form',type:'ace', name:'form', mode:'ace/mode/javascript'},        
      // {fieldset:'forms',label: 'User Preferences Form',type:'ace', name:'user_preference_form', mode:'ace/mode/javascript'}
    ]}
  ]})
  var temp = $(window).height() - $('.nav-tabs').offset().top -77;// - (88+ this.options.autoSize) +'px');

  $('body').append('<style>.ace_editor { height: '+temp+'px; }</style>')
  templatePage = new paged('.templates',{items:attributes.code.templates});
  scriptPage = new paged('.scripts',{items:attributes.code.scripts, mode:'ace/mode/javascript'});
  formPage = new paged('.forms',{items:attributes.code.forms, mode:'ace/mode/javascript',extra: function(item){

    item.content = this.berry.fields[this.active].toJSON();
    if (!_.some(JSON.parse(item.content||'{}').fields, function(o) { return _.has(o, "fields"); })) {

      modalForm(item.content, item.name, function(){

        var old = formPage.getCurrent();
        
        formPage.update(old.key, JSON.stringify($.extend(true, {}, JSON.parse(old.content||'{}'),{"fields":cb.toJSON({editor:false})[0]}), null, 2 ))
      });
    }else{
      toastr.error('If you would like to continue using the form builder UI you will need to remove any fieldsets', 'Fieldsets Not Supported');
    }
  }});
  // formPage = new paged('.forms',{items:[{name:'Options Form',content:attributes.code.form},{name:'User Options Form',content:attributes.code.user_preference_form}],  mode:'ace/mode/javascript'});


function modalForm(form, name, onSave){

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
    this.ref.modal();

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

      temp.fields[i] = Berry.normalizeItem(Berry.processOpts(temp.fields[i]), i);
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