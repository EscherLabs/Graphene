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
  data.code.sources = Berries.app.toJSON().code.sources;
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

var paged = function(selector, options){
  this.$el = $(selector);
  options.hasextra  = (typeof options.extra == 'function');
  options.u_id =  Berry.getUID();
  options.items = _.map(options.items, function(item) {
    item.key = options.u_id+item.name.toLowerCase().replace(/ /g,"_");
    return item;
  })
  options.fields = _.map(options.items, function(item) {
        return {fieldset:item.key,name:item.key};        
  })  
  options.attributes  = {};
  _.map(options.items, function(item) {
    if(typeof item.content == 'object'){
      item.content = JSON.stringify(item.content)
    }
    options.attributes[item.key] = item.content; 
  })
  options.default ={label: false,type:'ace',mode:options.mode || 'ace/mode/handlebars'}
  this.options = $.extend(true,{editable: true},options);
  $(selector).html(templates.pages.render(this.options,templates));
  this.berry = $(selector+' .dummyTarget').berry(this.options);

  this.render = function(){
    $(selector+' .list-group').empty().html(templates.pages_listgroupitem.render(this.options));
    $('[href="#'+this.active+'"]').click();
  }

  $(selector+' .actions .pages_delete,'+selector+' .actions .pages_edit,'+selector+' .actions .pages_new,'+selector+' .pages_extra').on('click', function(e){
    var currentItem = _.findWhere(this.options.items, {key: this.active});
    if($(e.currentTarget).hasClass('pages_delete') && !currentItem.disabled){
      currentItem.removed = true;
      this.render();
    }else{
      if($(e.currentTarget).hasClass('pages_edit') && !currentItem.disabled){
        $().berry({name:'page_name', legend: 'Edit Section', attributes: {name: currentItem.name},fields: {'Name': {}}}).on('save', function(){
          _.findWhere(this.options.items, {key:this.active}).name = Berries.page_name.toJSON().name;
          this.render();
          Berries.page_name.trigger('close');
        }, this);
      }else{
        if($(e.currentTarget).hasClass('pages_new')){
          $().berry({name:'page_name', legend: 'New Section',fields: {'Name': {}}}).on('save', function(){
            var name = Berries.page_name.toJSON().name;
            var key = this.options.u_id+name.toLowerCase().replace(/ /g,"_");

            this.options.items.push({name: name,key:key, content:""})
            this.active = key;
            this.$el.find('.tab-content').append(templates.pages_tabpanel.render({name: name,key:key, content:""}));
            this.berry.createField($.extend({name:key},this.berry.options.default), this.$el.find('.tab-content').find('#'+key),null)
            this.render();

            Berries.page_name.trigger('close');
          }, this);
        }else{
          if($(e.currentTarget).hasClass('pages_extra')) {
            this.options.extra.call(this, currentItem);
          }
        }
      }
    }
  }.bind(this));

  $(selector).on('click','.list-group-item.tab',function(e){
    $(e.currentTarget).parent().find('.list-group-item').removeClass('active');
    $(e.currentTarget).addClass('active');
    this.active = $(e.currentTarget).attr('aria-controls');
    this.berry.fields[this.active].editor.clearSelection();
 this.berry.fields[this.active].focus();
  }.bind(this))
  $(selector).find('.list-group-item.tab').first().click();

  return {
    toJSON:function(){
      var options = this.options;
      var temp = _.map(this.berry.toJSON(),function(item,i){
        var cachedItem = _.findWhere(options.items, {key:i});
        
        if(typeof cachedItem !== 'undefined' && !cachedItem.removed){
          return {name: _.findWhere(options.items, {key:i}).name, content: item};
        }else{
          return false;
        }
      });
      return _.filter(temp, function(item){return item;});
    }.bind(this),
    getCurrent:function(){
      return _.findWhere(this.options.items, {key: this.active});
    }.bind(this),
    update:function(key,value){
      this.berry.fields[key].setValue(value)
    }.bind(this)
  //  setCurrent: function(value){
  //   //  return currentItem;
  //   //  return _.findWhere(this.options.items, {key: this.active});
  //   // debugger;
  //   this.berry.fields[this.active].setValue(value)

  //   }.bind(this)
  }
}


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
      {fieldset:'sources',"multiple": {"duplicate": true},label: false, name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]},
      // {fieldset:'forms',label: 'Configuration Form',type:'ace', name:'form', mode:'ace/mode/javascript'},        
      // {fieldset:'forms',label: 'User Preferences Form',type:'ace', name:'user_preference_form', mode:'ace/mode/javascript'}
    ]}
  ]})
  var temp = $(window).height() - $('.nav-tabs').offset().top -77;// - (88+ this.options.autoSize) +'px');

  $('body').append('<style>.ace_editor { height: '+temp+'px; }</style>')
  templatePage = new paged('.templates',{items:attributes.code.templates});
  scriptPage = new paged('.scripts',{items:attributes.code.scripts, mode:'ace/mode/javascript'});
  formPage = new paged('.forms',{items:attributes.code.forms, mode:'ace/mode/javascript',extra: function(item){
    if (!_.some(JSON.parse(formPage.getCurrent().content).fields, function(o) { return _.has(o, "fields"); })) {

      modalForm(item.content, item.name, function(){
        var old = formPage.getCurrent();
        formPage.update(old.key, JSON.stringify($.extend(true, {}, JSON.parse(old.content),{"fields":cb.toJSON({editor:false})[0]}), null, 2 ))
      });
    }else{
      toastr.error('If you would like to continue using the form builder UI you will need to remove any fieldsets', 'Fieldsets Not Supported');
    }
  }});
  // formPage = new paged('.forms',{items:[{name:'Options Form',content:attributes.code.form},{name:'User Options Form',content:attributes.code.user_preference_form}],  mode:'ace/mode/javascript'});


function modalForm(form, name, onSave){
  if(typeof cb === 'undefined'){
    if(typeof form === 'string'){
      form = JSON.parse(form);
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