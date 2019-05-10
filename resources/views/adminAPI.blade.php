@extends('default.APIServer')
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
    <li><a href="/api/proxy/{{ $slug }}/apis/{!! $id !!}/versions/latest" target="_blank">Export</a></li>
    <li><a href="#" id="import">Import</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="versions">Versions</a></li>
    <li><a href="#" id="instances">Instances</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="publish">Publish (new version)</a></li>
    <!-- <li><a href="#">Visit</a></li> -->
  </ul>
</div>
  <span class="label label-default" style="float:right;margin-right:15px;" id="version"></span>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
  <li role="presentation" class="active"><a href="#routes" aria-controls="routes" role="tab" data-toggle="tab"><i class="fa fa-map-marker"></i> <span class="hidden-xs hidden-sm">Routes<span></a></li>
  <li role="presentation"><a href="#resources" aria-controls="resources" role="tab" data-toggle="tab"><i class="fa fa-database"></i> <span class="hidden-xs hidden-sm">Resources<span></a></li>
  <li role="presentation"><a href="#functions" aria-controls="functions" role="tab" data-toggle="tab"><i class="fa fa-code"></i> <span class="hidden-xs hidden-sm">Functions</span></a></li>
  <li role="presentation"><a href="#files" aria-controls="files" role="tab" data-toggle="tab"><i class="fa fa-file"></i> <span class="hidden-xs hidden-sm">Files</span></a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
  <div role="tabpanel" class="tab-pane files" id="files"></div>
  <div role="tabpanel" class="tab-pane functions" id="functions"></div>
  <div role="tabpanel" class="tab-pane active " id="routes">
    <div class="row"><div class="col-md-12 routes "></div></div>
  </div>    
  <div role="tabpanel" class="tab-pane" id="resources">
      <div class="row"><div class="col-md-12 resources "></div></div>
    </div>
  </div>

</div>
<!--<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>-->
@endsection

@section('end_body_scripts_top')
  <!-- <script src='//unpkg.com/ractive/ractive.min.js'></script>     -->
  <script src='/assets/js/vendor/ractive.min.js'></script>    

  <script type="text/javascript" src="/assets/js/vendor/sortable.js"></script>
  <script type='text/javascript' src='/assets/js/templates/admin.js'></script>
  <script type='text/javascript' src='/assets/js/cob/cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/image.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/form.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script>

  <script src='/assets/js/vendor/gform_bootstrap.min.js'></script> 
  <script src='/assets/js/vendor/GrapheneDataGrid.min.js'></script> 
  <script src='/assets/js/fileManager.js'></script> 

@endsection

@section('end_body_scripts_bottom')
  <!--<script>
    var editor = monaco.editor.create(document.getElementById('container'), {
      value: [
        'function x() {',
        '\tconsole.log("Hello world!");',
        '}'
      ].join('\n'),
      language: 'javascript'
    });
  </script>-->
  <script>var loaded = {!! $api_version !!};
          var api = {!! $api !!};
          var slug = "{!! $slug !!}";
          var server = "{{ $config->server }}";

          </script>
  <script type='text/javascript' src='/assets/js/APIServer_api_edit.js'></script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection