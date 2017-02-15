@extends('default.admin')
@section('content')

<div>
<!-- Split button -->
<div class="btn-group pull-right">
  <button type="button" class="btn btn-primary">Save</button>
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
    <li role="presentation" class="active"><a href="#sources" aria-controls="sources" role="tab" data-toggle="tab">Sources</a></li>
    <li role="presentation"><a href="#css" aria-controls="css" role="tab" data-toggle="tab">CSS</a></li>
    <li role="presentation"><a href="#scripts" aria-controls="scripts" role="tab" data-toggle="tab">Scripts</a></li>
    <li role="presentation"><a href="#config" aria-controls="form" role="tab" data-toggle="tab">Forms</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active" id="sources">...</div>
    <div role="tabpanel" class="tab-pane" id="css">...</div>
    <div role="tabpanel" class="tab-pane" id="scripts">...</div>
    <div role="tabpanel" class="tab-pane" id="form">...</div>
  </div>

</div>
@endsection


@section('end_body_scripts_bottom')
  <script>
  $('.navbar-header .nav a h4').html('Developers');

  var attributes= {!! $app !!};
   $('.navbar-header .nav a h4').html(attributes.name+' <i class="fa fa-pencil"></i>');

  // $('#content').berry({
  //   action:'/api/apps/'+attributes.id,
  //   method:'PUT',
  //   autoDestroy:false,
  //   attributes:attributes,
  //   inline:true,
  //   flatten:false,
  //   fields:[
  //     {label: 'Name', name:'name', required: true},
  //     {name:'code', label: 'Code',  type: 'fieldset', fields:[
  //       {label: 'CSS', name:'css'},
  //       {label:'Templates', name: 't',parsable:false, type:'fieldset',fields:[]},
  //       {"multiple": {"duplicate": true},label: false, name: 'templates', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content', type:'textarea'}]},
  //       {label:'Scripts',name: 's', parsable:false, type:'fieldset',fields:[]},
  //       {"multiple": {"duplicate": true},label: false, name: 'scripts', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content', type:'textarea'}]},
  //       {label:'Sources',name:'s',parsable:false, type:'fieldset',fields:[]},
  //       {"multiple": {"duplicate": true},label: false, name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]},
  //       {label: 'Configuration Form', name:'form'},        
  //       {label: 'User Preferences Form', name:'user_preference_form'}
  //     ]}
  //   ]})
  </script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  </style>
@endsection

