
@extends('default.admin')

@section('end_body_scripts_top')
  <script>
    var route = '{{ $resource }}';
    var resource_id = '{{ $id }}';
  </script>
@endsection