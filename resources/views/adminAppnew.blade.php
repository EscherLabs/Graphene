@extends('default.admin')
@section('content')

<div>
  <div class="app_name"></div>
<!-- Split button -->
<div class="btn-group pull-right">
  <button type="button" class="btn btn-primary" id="save">Save</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#">Export</a></li>
    <li><a href="#">Import</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#">Visit</a></li>
  </ul>
</div>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#scripts" aria-controls="scripts" role="tab" data-toggle="tab"><i class="fa fa-coffee"></i> Scripts</a></li>
    <li role="presentation"><a href="#templates" aria-controls="templates" role="tab" data-toggle="tab"><i class="fa fa-code"></i> Templates</a></li>
    <li role="presentation"><a href="#styles" aria-controls="styles" role="tab" data-toggle="tab"><i class="fa fa-css3"></i> Styles</a></li>
    <li role="presentation"><a href="#sources" aria-controls="sources" role="tab" data-toggle="tab"><i class="fa fa-archive"></i> Sources</a></li>
    <li role="presentation"><a href="#forms" aria-controls="forms" role="tab" data-toggle="tab"><i class="fa fa-check-square-o"></i> Forms</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane scripts active" id="scripts"></div>
    <div role="tabpanel" class="tab-pane templates" id="templates"></div>
    <div role="tabpanel" class="tab-pane sources" id="sources"></div>
    <div role="tabpanel" class="tab-pane" id="styles">
       <div class="row"><div class="col-sm-9 styles"></div>
  <div class="col-sm-3"></div></div>
    </div>
    <div role="tabpanel" class="tab-pane forms" id="forms"></div>
  </div>

</div>
@endsection


@section('end_body_scripts_bottom')
  <script>
  var attributes= $.extend(true,{},{code:{user_preference_form:"",form:"", css:""}}, {!! $app !!});

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

  </script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  </style>
@endsection

