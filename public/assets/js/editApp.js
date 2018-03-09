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
  var data = {code:{}};
  data.style = Berries.style.toJSON().style;
  data.code.resources = _.map(bt.models,'attributes');
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
    url: '/api/apps/'+attributes.app_id+'/code',
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
        url: '/api/apps/'+attributes.app_id+'/code',
        data: $.extend({force: true, updated_at:''}, JSON.parse(Berries.update.toJSON().descriptor)),
        method: 'PUT',
        success: function(){
          Berries.update.trigger('close');
          window.location.reload();
        }
      })
  });
})




$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey))
  {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});

$('.styles').berry({
  actions:false,
  name: 'style',
  autoDestroy:false,
  attributes:attributes,
  inline:true,
  flatten:false,
  fields:[
    {name:'code', label: false,  type: 'fieldset', fields:[
      {label:false, name:'css', type:'ace', mode:'ace/mode/css'},
    ]}
  ]})
  

// var api = '/api/apps'+;
var tableConfig = {
		entries: [25, 50, 100],
		count: 25,
		autoSize: -20,
		container: '.resources',
    edit:true,delete:true,add:true
	}


    		tableConfig.schema = [
          {label: 'Name',name: 'name'},
          {label: 'Fetch', type: 'checkbox',name:'fetch'},
          {label: 'Path',name:'path'},
          {label: 'Cache', type: 'checkbox',name:'cache'},
          {label: 'Modifier',name: 'modifier', type: 'select', options:[{label: 'None', value: 'none'},{label: 'XML', value: 'xml'}, {label: 'CSV', value: 'csv'}]}
				];
        // debugger;
				tableConfig.data = attributes.code.resources;
				// tableConfig.click = function(model){window.location.href = '/admin/sites/'+model.attributes.id};
				bt = new berryTable(tableConfig)





  var temp = $(window).height() - $('.nav-tabs').offset().top -77;// - (88+ this.options.autoSize) +'px');

  $('body').append('<style>.ace_editor { height: '+temp+'px; }</style>')
  templatePage = new paged('.templates',{items:attributes.code.templates, label:'Template'});
  scriptPage = new paged('.scripts',{items:attributes.code.scripts, mode:'ace/mode/javascript', label:'Script'});
  formPage = new paged('.forms',{items:attributes.code.forms, mode:'ace/mode/javascript', label:'Form',extra: function(item){

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