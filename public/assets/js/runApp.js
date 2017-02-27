  if(loaded.code == null){loaded.code = {scripts:[{name:'main',content:''}],templates:[{name:'main',content:''}]};}
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
    var data = $.extend(true, {}, attributes,Berries.app.toJSON());
    data.code.templates = templatePage.toJSON();
    data.code.scripts = scriptPage.toJSON();
    var temp = formPage.toJSON();
    data.code.form = temp[0].content;
    data.code.user_preference_form = temp[1].content;
    $.ajax({
      url: '/api/apps/'+attributes.id,
      method: 'put',
      data: data,
      success: function() {
      }
    })
  })




var paged = function(selector, options){
  this.$el = $(selector);

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

  $(selector+' .actions .pages_delete,'+selector+' .actions .pages_edit,'+selector+' .actions .pages_new').on('click', function(e){
    var currentItem = _.findWhere(this.options.items, {key: this.active});
    if($(e.currentTarget).hasClass('pages_delete')){
      currentItem.removed = true;
      this.render();
    }else{
      if($(e.currentTarget).hasClass('pages_edit')){
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
        }
      }
    }
  }.bind(this));

  $(selector).on('click','.list-group-item.tab',function(e){
    $(e.currentTarget).parent().find('.list-group-item').removeClass('active');
    $(e.currentTarget).addClass('active');
    this.active = $(e.currentTarget).attr('aria-controls');
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
  }
}


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
    formPage = new paged('.forms',{items:[{name:'Form',content:attributes.code.form},{name:'User Preference Form',content:attributes.code.user_preference_form}], editable: false, mode:'ace/mode/javascript'});
