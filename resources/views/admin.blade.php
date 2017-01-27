
@extends('default.admin')

@section('end_body_scripts_top')
  <script>
    var route = '{{ $resource }}';
  </script>
@endsection