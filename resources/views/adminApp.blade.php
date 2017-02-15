@extends('default.admin')

@section('end_body_scripts_bottom')
  <script>
  $('.navbar-header .nav a h4').html('Developers');

  var attributes= {!! $app !!};
  $('#content').berry({
    action:'/api/apps/'+attributes.id,
    method:'PUT',
    autoDestroy:false,
    attributes:attributes,
    inline:true,
    flatten:false,
    fields:[
      {label: 'Name', name:'name', required: true},
      {name:'code', label: 'Code',  type: 'fieldset', fields:[
        {label: 'CSS', name:'css'},
        {label:'Templates', name: 't',parsable:false, type:'fieldset',fields:[]},
        {"multiple": {"duplicate": true},label: false, name: 'templates', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content', type:'textarea'}]},
        {label:'Scripts',name: 's', parsable:false, type:'fieldset',fields:[]},
        {"multiple": {"duplicate": true},label: false, name: 'scripts', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content', type:'textarea'}]},
        {label:'Sources',name:'s',parsable:false, type:'fieldset',fields:[]},
        {"multiple": {"duplicate": true},label: false, name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]},
        {label: 'Configuration Form', name:'form'},        
        {label: 'User Preferences Form', name:'user_preference_form'}
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

