@extends('default.main')

@section('welcome_name')
{{ Auth::user()->first_name }} {{ Auth::user()->last_name }}
@endsection

@section('content')
<div class="row">
  <div class="col-sm-12 main">
    <h1 class="page-header">App Instances</h1>
    <div class="row">
      <ul class="list-group">
        @foreach ($apps as $app)
          <a href="/app/{{ $app->slug }}" class="list-group-item">{{ $app->name }}</a>
        @endforeach
    </div>
  </div>
</div>
@endsection