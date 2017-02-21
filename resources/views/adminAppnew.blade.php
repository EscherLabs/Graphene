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
    <li role="presentation" class="active"><a href="#scripts" aria-controls="scripts" role="tab" data-toggle="tab">Scripts</a></li>
    <li role="presentation"><a href="#templates" aria-controls="templates" role="tab" data-toggle="tab">Templates</a></li>
    <li role="presentation"><a href="#styles" aria-controls="styles" role="tab" data-toggle="tab">Styles</a></li>
    <li role="presentation"><a href="#sources" aria-controls="sources" role="tab" data-toggle="tab">Sources</a></li>
    <li role="presentation"><a href="#forms" aria-controls="forms" role="tab" data-toggle="tab">Forms</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane scripts active" id="scripts"></div>
    <div role="tabpanel" class="tab-pane templates" id="templates"></div>
    <div role="tabpanel" class="tab-pane sources" id="sources"></div>
    <div role="tabpanel" class="tab-pane styles" id="styles"></div>
    <div role="tabpanel" class="tab-pane forms" id="forms"></div>
  </div>

</div>
@endsection


@section('end_body_scripts_bottom')
  <script>
  $('.navbar-header .nav a h4').html('Developers');
  var attributes= $.extend(true,{},{code:{user_preference_form:"",form:"", css:""}}, {!! $app !!});

  $('.navbar-header .nav a h4').html(attributes.name+' <i class="hidden fa fa-pencil"></i>');
  $('#save').on('click',function() {
    var data = $.extend(true, {}, attributes,Berries.app.toJSON());
    data.code.templates = templatePage.toJSON();
    data.code.scripts = scriptPage.toJSON();
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
  this.options = options;
  $(selector).html(templates.pages.render(options,templates));
  this.berry = $(selector+' .dummyTarget').berry(options);

  this.render = function(){
    $(selector+' .list-group').empty().html(templates.pages_listgroupitem.render(options));
    $('[href="#'+this.active+'"]').click();
  }

  $(selector+' .actions .btn').on('click', function(e){
    var currentItem = _.findWhere(this.options.items, {key: this.active});
    if($(e.currentTarget).hasClass('btn-danger')){
      currentItem.removed = true;
      this.render();
    }else{
      if($(e.currentTarget).hasClass('btn-info')){
        $().berry({name:'page_name', legend: 'Edit Section', attributes: {name: currentItem.name},fields: {'Name': {}}}).on('save', function(){
          _.findWhere(this.options.items, {key:this.active}).name = Berries.page_name.toJSON().name;
          this.render();
          Berries.page_name.trigger('close');
        }, this);
      }else{
        $().berry({name:'page_name', legend: 'New Section',fields: {'Name': {}}}).on('save', function(){
          var name = Berries.page_name.toJSON().name;
          var key = this.options.u_id+name.toLowerCase().replace(/ /g,"_");

          this.options.items.push({name: name,key:key, content:""})
          this.active = key;
          this.$el.find('.tab-content').append(templates.pages_tabpanel.render({name: name,key:key, content:""}));
          debugger;
          this.berry.createField($.extend({name:key},this.berry.options.default), this.$el.find('.tab-content').find('#'+key),null)
          this.render();

          Berries.page_name.trigger('close');
        }, this);
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


  $('.forms').berry({
    actions:false,
    name: 'app',
    autoDestroy:false,
    attributes:attributes,
    inline:true,
    flatten:false,
    fields:[
      {label: 'Name', name:'name', required: true, fieldset:"app_name"},
      {name:'code', label: false,  type: 'fieldset', fields:[
        {label:false, name:'css', fieldset: 'styles', type:'ace', mode:'ace/mode/css'},
        {fieldset:'sources',"multiple": {"duplicate": true},label: false, name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]},
        {fieldset:'forms',label: 'Configuration Form',type:'ace', name:'form', mode:'ace/mode/javascript'},        
        {fieldset:'forms',label: 'User Preferences Form',type:'ace', name:'user_preference_form', mode:'ace/mode/javascript'}
      ]}
    ]})
    templatePage = new paged('.templates',{items:attributes.code.templates});
    scriptPage = new paged('.scripts',{items:attributes.code.scripts, mode:'ace/mode/javascript'});

  </script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  </style>
@endsection

