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

@section('titlebar')
		<div class="btn btn-info pull-right" id="edit_instance" style="margin-top: 8px;"><i class="fa fa-gears"></i> Options</div>
		<a class="btn btn-default pull-right" style="margin-top: 8px;margin-right:15px" href="/admin/apps/{{ $app->id }}"><i class="fa fa-pencil"></i> Edit App</a>
@endsection

@section('bottom_page_scripts')
<script src='/assets/js/berryApp.js'></script> 
<script>
  $('[href="/app/{{ $app->slug }}"]').parent().addClass('active');
  var opts = {
    $el: $('#app-container'),
    data:{!! $data !!},
    config: {!! $app->app['code'] !!},
    crud: function(name, data, callback, verb){
          $.ajax({
          url      : '/api/app_data/{{ $app->id }}/' +name+ '?verb='+verb,
          type: 'POST',
          data: {request: data},
          error: function (data) {
          }.bind(this),
          success  : callback.bind(this)
        });
    }
  }
  $('#edit_instance').on('click', function(){
    // debugger;
    $().berry(JSON.parse(opts.config.user_preference_form)).on('save', function(){
      debugger;
      $.ajax({
        type: 'POST',
        url:'/api/preferences/{{ $app->id }}',
        data: {'preferences': this.toJSON()},

      })
      this.trigger('close');
    })
  })

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