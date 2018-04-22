
@extends('default.admin')

@section('end_body_scripts_top')
  <script>
    var route = '{{ $resource }}';
    var resource_id = '{{ $id }}';
    var user = {!! Auth::user() !!};
  </script>
@endsection

@section('end_body_scripts_bottom')
  <script src='/assets/js/routes.js'></script> 
@endsection