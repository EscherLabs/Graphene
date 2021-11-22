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
    <li><a href="/admin/apps/{!! $app->app_id !!}/developers" target="_blank">Manage Developers</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="/api/apps/{!! $app->app_id !!}" target="_blank">Export</a></li>
    <li><a href="#" id="import">Import</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="versions">Versions</a></li>
    <!-- <li><a href="#" id="instances">Instances</a></li> -->
    <li role="separator" class="divider"></li>
    <li><a href="#" id="publish">Publish (new version)</a></li>
    <!-- <li><a href="#">Visit</a></li> -->
  </ul>
</div>
  <span class="label label-default" style="float:right;margin-right:15px;" id="version"></span>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#resources" aria-controls="resources" role="tab" data-toggle="tab"><i class="fa fa-archive"></i> <span class="hidden-xs hidden-sm">Resources<span></a></li>
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
    <div role="tabpanel" class="tab-pane forms" id="forms" style="margin-top:5px">
    <div class="">
      <div class="row">
          <div class="col-md-2 col-sm-8 col-xs-12">
            <div class="target"></div>
          </div>
          <div class="col-md-6 col-sm-8 col-xs-12">
            <div style="display:none;position: absolute;top: -5px;left: 0;right: 0;bottom: -20px;z-index:-1;background: #eaeaea;border: solid #9aa5b1;border-width: 0 1px;"></div>
            <div class="btn-group pull-right" role="group" style="margin-bottom:20px" aria-label="...">
                  <a class="btn btn-default viewform"><i class="fa fa-eye"></i><span class="visible-lg"> View</span></a>
                  <a class="btn btn-danger edit"><i class="fa fa-pencil"></i><span class="visible-lg"> Edit</span></a>
                  <!-- <a class="btn btn-info" href="examples/">Examples</a> -->
                </div>
            <ul id="sortableList" class="form-types-group">
                    <li style="color:#22aa10" data-type="input"><i class="fa fa-font"></i> Input</li>
                    <li style="color:#ee1515" data-type="collection"><i class="fa fa-list"></i> Options</li>
                    <li style="color:#0088ff" data-type="bool"><i class="fa fa-check-square-o"></i> Boolean</li>
                    <li style="color:#555" data-type="section"><i class="fa fa-list-ol"></i> Section</li>
                  </ul>			

            <div class="panel panel-primary">
       
              <div class="panel-body" style="position:relative">
                <form>
                <div id="editor" style="position:relative;z-index:1" class="form-horizontal widget_container cobler_select"></div>
                <div><i class="fa fa-arrow-circle-o-up fa-2x pull-left text-muted"></i>Click or Drag Form Elements HERE</div>
                <style>

                  .form-types-group{
                    list-style-type: none;
                    height:60px;
                    padding-left:0;
                  }
                  .form-types-group li{
                    cursor:pointer;
                    display:block;
                    text-align: center;
                    padding:10px;
                    line-height: 40px;
                    width:80px;
                    height:60px;
                    float:left;
                    border:solid 1px;
                    border-radius:3px;
                    background:#fff;
                    margin-right:10px;
                  }
                  .form-types-group li i{
                    position: relative;
                    display:block;
                  }

                  .margin-bottom{margin-bottom:15px !important}
                  #editor + div {
                    display: none;
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    right: 15px;
                    padding: 11px;
                    text-align: center;
                    border:dashed 1px #080;
                    border-radius:30px;
                  }

                  #editor:empty + div{
                    display: block;
                  }
                </style>
                </form>

              </div>
            </div>
          </div>

          <div class="col-md-4 col-sm-4 col-xs-12">
          <div style="height:40px" id='formlist'></div>
            
            <div class="panel panel-default">

              <div class="panel-body">
                <div class=" source view view_source" id="alt-sidebar">

                  <div id="mainform"></div>				
                  <div id="form" class="form-horizontal"></div>				
                  </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

</div>
<!--<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>-->
@endsection

@section('end_body_scripts_top')
  <script type="text/javascript" src='/assets/js/vendor/ractive.min.js?cb={{ config("app.cache_bust_id") }}'></script>    
  <script type="text/javascript" src='/assets/js/vendor/sortable.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/cob/cob.js?cb={{ config("app.cache_bust_id") }}'></script>
@endsection

@section('end_body_scripts_bottom')
  <script>var loaded = {!! $app !!};</script>

  <script type='text/javascript' src='/assets/js/vendor/moment.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/vendor/moment_datepicker.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/vendor/math.min.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/vendor/popper.min.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/vendor/colorpicker.min.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/fileManager.js?cb={{ config("app.cache_bust_id") }}'></script> 
  <script type='text/javascript' src='/assets/js/editApp.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script type='text/javascript' src='/assets/js/form.cob.js?cb={{ config("app.cache_bust_id") }}'></script>
@endsection

@section('bottom_page_styles')
  <style>
  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{    font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection