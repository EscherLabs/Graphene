@extends('default.admin')
@section('content')
<h1>Workflow Stuff Goes Here!</h1>
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
  <script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script>
  <!-- TJC 4/22/18 Monaco Test -->
  <!--<script>var require = { paths: { 'vs': '/assets/js/vendor/vs' } };</script>
  <script src="/assets/js/vendor/vs/loader.js"></script>
  <script src="/assets/js/vendor/vs/editor/editor.main.nls.js"></script>
  <script src="/assets/js/vendor/vs/editor/editor.main.js"></script> -->
  <!-- END TJC 4/22/18 Monaco Test -->
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