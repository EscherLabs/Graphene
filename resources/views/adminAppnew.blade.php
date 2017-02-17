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
  var attributes= {!! $app !!};

  $('.navbar-header .nav a h4').html(attributes.name+' <i class="hidden fa fa-pencil"></i>');
  $('#save').on('click',function() {
    Berries.app.trigger('save');
  })


  // var fields = [{label: false, name: 'content', type:'ace'}]
  // $('#scripts').berry({
  //   actions:false,
  //   autoDestroy:false,
  //   inline:true,
  //   attributes:attributes.code.scripts[0],
  //   fields:fields})

  // $('#templates').berry({
  //   actions:false,
  //   autoDestroy:false,
  //   inline:true,
  //   attributes:attributes.code.templates[0],
  //   fields:fields})

  // $('#styles').berry({
  //   actions:false,
  //   autoDestroy:false,
  //   inline:true,
  //   attributes:attributes.code.css[0],
  //   fields:fields})

  // $('#forms').berry({
  //   actions:false,
  //   autoDestroy:false,
  //   inline:true,
  //   // attributes:attributes.code,
  //   fields:[
  //     {type:'ace', label: 'Configuration Form', name:'form'},        
  //     {type:'ace', label: 'User Preferences Form', name:'user_preference_form'}
  // ]})
  // $('#sources').berry({
  //   actions:false,
  //   autoDestroy:false,
  //   attributes:attributes,
  //   inline:true,
  //   flatten:false,
  //   fields:[
  //     {name:'code', label: false,  type: 'fieldset', fields:[
  //       {label:false,name:'s',parsable:false, type:'fieldset',fields:[]},
  //       {"multiple": {"duplicate": true},label: false, name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]},
  //     ]}
  //   ]})




  $('.app_name').berry({
    action:'/api/apps/'+attributes.id,
    method:'PUT',
    actions:false,
    name: 'app',
    autoDestroy:false,
    attributes:attributes,
    inline:true,
    flatten:false,
    fields:[
      {label: 'Name', name:'name', required: true},
      {name:'code', label: false,  type: 'fieldset', fields:[
        {label:false, name:'css', fieldset: 'styles', type:'ace', mode:'ace/mode/css'},
        // {label:'Templates', name: 't',parsable:false, type:'fieldset',fields:[]},
        {fieldset:'templates', "multiple": {"duplicate": true},label: false, name: 'templates', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content', type:'ace'}]},
        // {label:'Scripts',name: 's', parsable:false, type:'fieldset',fields:[]},
        {fieldset:'scripts',"multiple": {"duplicate": true},label: false, name: 'scripts', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content', type:'ace', mode:'ace/mode/javascript'}]},
        // {label:'Sources',name:'s',parsable:false, type:'fieldset',fields:[]},
        {fieldset:'sources',"multiple": {"duplicate": true},label: false, name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]},
        {fieldset:'forms',label: 'Configuration Form',type:'ace', name:'form', mode:'ace/mode/javascript'},        
        {fieldset:'forms',label: 'User Preferences Form',type:'ace', name:'user_preference_form', mode:'ace/mode/javascript'}
      ]}
    ]})
  </script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  </style>
@endsection

