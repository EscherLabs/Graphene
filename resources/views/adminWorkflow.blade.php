@extends('default.admin')
@section('content')

<div>
  <div class="workflow_name"></div>
<!-- Split button -->
<div class="btn-group pull-right">
  <button type="button" class="btn btn-primary" id="save">Save</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="/admin/workflows/{!! $workflow->workflow_id !!}/developers" target="_blank">Manage Developers</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="/api/workflows/{!! $workflow->workflow_id !!}" target="_blank">Export</a></li>
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
  <li role="presentation" class="active"><a href="#resources" aria-controls="resources" role="tab" data-toggle="tab"><i class="fa fa-archive"></i> <span class="hidden-xs hidden-sm">Resources<span></a></li>

    <li role="presentation"><a href="#forms" aria-controls="forms" role="tab" data-toggle="tab"><i class="fa fa-check-square-o"></i> <span class="hidden-xs hidden-sm">Forms<span></a></li>
    <!-- <li role="presentation"><a href="#flow" aria-controls="flow" role="tab" data-toggle="tab"><i class="fa fa-code-fork fa-flip-vertical"></i> <span class="hidden-xs hidden-sm">Flow</span></a></li> -->
    <li role="presentation"><a href="#options" aria-controls="options" role="tab" data-toggle="tab"><i class="fa fa-sitemap"></i> <span class="hidden-xs hidden-sm">Flow</span></a></li>
    <li role="presentation"><a href="#map" aria-controls="map" role="tab" data-toggle="tab"><i class="fa fa-table"></i> <span class="hidden-xs hidden-sm">Data Map<span></a></li>
    <li role="presentation"><a href="#templates" aria-controls="templates" role="tab" data-toggle="tab"><i class="fa fa-code"></i> <span class="hidden-xs hidden-sm">Templates</span></a></li>
    <!-- <li role="presentation"><a href="#styles" aria-controls="styles" role="tab" data-toggle="tab"><i class="fa fa-css3"></i> <span class="hidden-xs hidden-sm">Styles</a></span></li> -->
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
  <div role="tabpanel" class="tab-pane active " id="resources">
      <div class="row"><div class="col-md-12 resources "></div></div></div>
    <div role="tabpanel" class="tab-pane forms" id="forms"></div>
    <!-- <div role="tabpanel" class="tab-pane scripts" id="scripts"></div> -->
    <div role="tabpanel" class="tab-pane" id="flow" style="padding-top: 15px">
        <div class="row">

        
          <div class="col-sm-3">
            <ul id="sortableListflow" class="list-group ">
            <li class="list-group-item" data-type="state">State</li>
            </ul>
            <div class="flowform"></div>
          </div>
          <div class="col-sm-5 flow cobler_select cobler_container" id="floweditor"></div>
          <!-- <div class="col-sm-8">
          <style>
          .flow-title {
    z-index: 1;
    top: 50px;
    position: sticky;
    background: #fff;
    margin: -15px -15px 15px;
    padding: 15px 15px 10px;
    border-bottom: solid 1px #eee;
}
</style>
          <div class="panel panel-default">
          <div class="collapsible panel-body">
          <h3 class="flow-title">Signature Authorization Form</h3>

          <div id="myForm" ></div>
          </div>
          </div>
          </div> -->

          <!-- <div class="col-sm-4">
            <div id="flow-preview" style="zoom: 150%;text-align: center;"></div>
          </div> -->
        </div>
      <!-- <div class="row"><div class="col-md-12 map "></div></div> -->
    <!-- </div> -->
    <!-- <div role="tabpanel" class="tab-pane" id="styles">
        
    </div> -->
  </div>
  <div role="tabpanel" class="tab-pane" id="options">
  <div class="options" style="width:0;display:none"></div>

          <div class="col-sm-6">
            <div class="btn btn-success pull-right" style="margin-top:15px" id="add-state" ><i class="fa fa-plus"></i> Add</div>
            <div id="flow-preview" style="zoom: 150%;text-align: center;"></div>
          </div>
          <div class="col-sm-6" id="flow-form">
          </div>
        </div>
  <div role="tabpanel" class="tab-pane" id="map">
    <div class="col-sm-8">
      <div class="map"></div>
    </div>
    <div class="col-sm-4">
    </div>
  </div>
  <div role="tabpanel" class="tab-pane templates" id="templates"></div>

</div>


@endsection

@section('end_body_scripts_top')
  <!-- <script src='//unpkg.com/ractive/ractive.min.js'></script>     -->
  <script src='/assets/js/vendor/ractive.min.js'></script>    

  <script src='/assets/js/paged.js'></script> 
  <script type="text/javascript" src="/assets/js/vendor/sortable.js"></script>
  <script type='text/javascript' src='/assets/js/templates/admin.js'></script>
  <script type='text/javascript' src='/assets/js/cob/cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/image.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/form.cob.js'></script>
  <script type="text/javascript" src="/assets/js/vendor/mermaid.min.js"></script>
  <script>
    mermaid.initialize({
        startOnLoad:false,
        securityLevel: 'loose'
    });

    var insertSvg = function(svgCode, bindFunctions){
      document.querySelector("#flow-preview").innerHTML = svgCode;
    };
    myfunc=function(e){
      graph = mermaid.mermaidAPI.render(gform.getUID(), e, insertSvg);

      
    }
</script>
  <!-- <script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script> -->
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
  <script>var loaded = {!! $workflow !!};</script>
  <script src='/assets/js/vendor/moment.js'></script>
  <script src='/assets/js/vendor/moment_datepicker.js'></script>

  <script type='text/javascript' src='/assets/js/editWorkflow.js'></script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection