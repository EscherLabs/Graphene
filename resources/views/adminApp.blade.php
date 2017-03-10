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
    <li role="presentation"><a href="#sources" aria-controls="sources" role="tab" data-toggle="tab"><i class="fa fa-archive"></i> Resources</a></li>
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
<script src='http://unpkg.com/ractive/ractive.min.js'></script>    

<script>var loaded = {!! $app !!};
</script>
  <script type='text/javascript' src='/assets/js/editApp.js'></script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  </style>
@endsection

