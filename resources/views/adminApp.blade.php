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
    <li role="presentation" class="active"><a href="#scripts" aria-controls="scripts" role="tab" data-toggle="tab"><i class="fa fa-coffee"></i> <span class="hidden-xs hidden-sm">Scripts</span></a></li>
    <li role="presentation"><a href="#templates" aria-controls="templates" role="tab" data-toggle="tab"><i class="fa fa-code"></i> <span class="hidden-xs hidden-sm">Templates</span></a></li>
    <li role="presentation"><a href="#styles" aria-controls="styles" role="tab" data-toggle="tab"><i class="fa fa-css3"></i> <span class="hidden-xs hidden-sm">Styles</a></span></li>
    <li role="presentation"><a href="#sources" aria-controls="sources" role="tab" data-toggle="tab"><i class="fa fa-archive"></i> <span class="hidden-xs hidden-sm">Resources<span></a></li>
    <li role="presentation"><a href="#forms" aria-controls="forms" role="tab" data-toggle="tab"><i class="fa fa-check-square-o"></i> <span class="hidden-xs hidden-sm">Forms<span></a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane scripts active" id="scripts"></div>
    <div role="tabpanel" class="tab-pane templates" id="templates"></div>
    <div role="tabpanel" class="tab-pane " id="sources">
      <div class="row"><div class="col-md-9 sources"></div>
  <div class="col-md-3"></div></div></div>
    <div role="tabpanel" class="tab-pane" id="styles">
       <div class="row"><div class="col-sm-9 styles"></div>
  <div class="col-sm-3"></div></div>
    </div>
    <div role="tabpanel" class="tab-pane forms" id="forms"></div>
  </div>

</div>
@endsection


@section('end_body_scripts_bottom')
<script src='//unpkg.com/ractive/ractive.min.js'></script>    

<script>var loaded = {!! $app !!};

</script>
		<script type="text/javascript" src="/assets/js/sortable.js"></script>

  <script type='text/javascript' src='/assets/js/templates/admin.js'></script>
  <script type='text/javascript' src='/assets/js/cob/cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/form.cob.js'></script>
  
  <script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script>
  <script type='text/javascript' src='/assets/js/editApp.js'></script>
      <link href="/assets/css/cobler.css" rel="stylesheet">

@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection

