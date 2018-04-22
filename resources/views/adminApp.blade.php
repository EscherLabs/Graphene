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
    <li><a href="/api/apps/{!! $app->app_id !!}" target="_blank">Export</a></li>
    <li><a href="#" id="import">Import</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="versions">Versions</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="publish">Publish</a></li>
    <!--<li role="separator" class="divider"></li>
    <li><a href="#">Visit</a></li>-->
  </ul>
</div>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#resources" aria-controls="resources" role="tab" data-toggle="tab"><i class="fa fa-archive"></i> <span class="hidden-xs hidden-sm">Reresources<span></a></li>
    <li role="presentation"><a href="#scripts" aria-controls="scripts" role="tab" data-toggle="tab"><i class="fa fa-coffee"></i> <span class="hidden-xs hidden-sm">Scripts</span></a></li>
    <li role="presentation"><a href="#templates" aria-controls="templates" role="tab" data-toggle="tab"><i class="fa fa-code"></i> <span class="hidden-xs hidden-sm">Templates</span></a></li>
    <li role="presentation"><a href="#styles" aria-controls="styles" role="tab" data-toggle="tab"><i class="fa fa-css3"></i> <span class="hidden-xs hidden-sm">Styles</a></span></li>
    <li role="presentation"><a href="#forms" aria-controls="forms" role="tab" data-toggle="tab"><i class="fa fa-check-square-o"></i> <span class="hidden-xs hidden-sm">Forms<span></a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane scripts" id="scripts"></div>
    <div role="tabpanel" class="tab-pane templates" id="templates"></div>
    <div role="tabpanel" class="tab-pane active " id="resources">
      <div class="row"><div class="col-md-12 resources "></div></div></div>
    <div role="tabpanel" class="tab-pane" id="styles">
       <div class="row"><div class="col-sm-9 styles"></div>
  <div class="col-sm-3"></div></div>
    </div>
    <div role="tabpanel" class="tab-pane forms" id="forms"></div>
  </div>

</div>
<!-- <div id="container" style="width:800px;height:600px;border:1px solid grey"></div> -->
@endsection

@section('end_body_scripts_bottom')
  <script src='//unpkg.com/ractive/ractive.min.js'></script>    
  <script>var loaded = {!! $app !!};</script>
	<script type="text/javascript" src="/assets/js/sortable.js"></script>
  <script type='text/javascript' src='/assets/js/templates/admin.js'></script>
  <script type='text/javascript' src='/assets/js/cob/cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/image.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/form.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script>
  <script type='text/javascript' src='/assets/js/editApp.js'></script>
  <link href="/assets/css/cobler.css" rel="stylesheet">

  <!-- TJC 4/22/18 Monaco Test -->
  <!-- <script>var require = { paths: { 'vs': '/assets/js/vendor/vs' } };</script>
  <script src="/assets/js/vendor/vs/loader.js"></script>
  <script src="/assets/js/vendor/vs/editor/editor.main.nls.js"></script>
  <script src="/assets/js/vendor/vs/editor/editor.main.js"></script> 
  <script>
    var editor = monaco.editor.create(document.getElementById('container'), {
      value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
      ].join('\n'),
      language: 'javascript'
    });
  </script> -->
  <!-- END TJC 4/22/18 Monaco Test -->
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection

@section('top_page_styles')
  <!-- TJC 4/22/18 Monaco Test -->
  <!-- <link data-name="vs/editor/editor.main" rel="stylesheet" href="/assets/js/vendor/vs/editor/editor.main.css"> -->
  <!-- END TJC 4/22/18 Monaco Test -->
@endsection
