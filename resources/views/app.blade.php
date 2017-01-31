@extends('default.apps')

@section('welcome_name')
{{ Auth::user()->first_name }} {{ Auth::user()->last_name }}
@endsection

@section('content')
<div class="row">
  <div class="col-sm-12 main">
    <div id="app-container"></div>
  </div>
</div>
@endsection

@section('bottom_page_scripts')
<script src='/assets/js/berryApp.js'></script> 
<script>
  var opts = {
    $el: $('#app-container'),
    data:{!! $data !!},
    config: {!! $app->app['code'] !!},
    crud: function(name, data, callback, verb){
          $.ajax({
          url      : '/api/app_data/{{ $app->id }}/' +name+ '?verb='+verb,
          dataType : 'json',
          type: 'POST',
          data: {request: data},
          error: function (data) {
          }.bind(this),
          success  : callback.bind(this)
        });
    }
  }
  $('body').append('<style>'+opts.config.css+'</style>');

  bae = new berryAppEngine(opts);
  
  var refetch = function(data){
    bae.destroy();
    delete bae;
    bae = new berryAppEngine(opts);
    bae.app.on('refetch', refetch) 
    // console.log('fetch')
  }
  bae.app.on('refetch', refetch) 
</script> 
@endsection