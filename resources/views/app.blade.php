@extends('default.apps')

@section('content')
<div class="panel panel-default">
  <div class="panel-body">
  <div id="app-container"></div>
  </div>
</div>
@endsection

@section('titlebar')
    @if (!is_null($app->app->code) && strlen($app->app->code->forms[1]->content)) )
    <div class="btn btn-info pull-right" id="edit_instance" style="margin-top: 8px;"><i class="fa fa-gears"></i> Options</div>
    @endif
    @if (Auth::check())
		<a class="btn btn-default pull-right" style="margin-top: 8px;margin-right:15px" href="/admin/apps/{{ $app->app_id }}"><i class="fa fa-pencil"></i> Edit App</a>
    @endif
@endsection

@section('bottom_page_scripts')
<script src='/assets/js/berryApp.js'></script> 
    <script src='/assets/js/lib.js'></script> 

<script>
  $('[href$="/{{ $app->slug }}"]').parent().addClass('active').parent().addClass('in');
  var opts = {
    $el: $('#app-container'),
    data:{!! json_encode($data) !!},
    config: {!! json_encode($app->app->code) !!},
    crud: function(name, data, callback, verb){
          $.ajax({
          url: '/api/app_data/{{ $app->id }}/' +name+ '?verb='+verb,
          type: 'POST',
          data: {request: data},
          error: function (data) {
            if(data.responseJSON.error) {
              toastr.error(data.responseJSON.error.message || data.responseJSON.error,'ERROR')
            }else{
              toastr.error(data.statusText, 'ERROR')
            }
          }.bind(this),
          success  : callback.bind(this),
        });
    }
  }
  if(typeof opts.data.user.id === 'undefined') {
    opts.data.user.options =  (Lockr.get('/api/apps/instances/{{ $app->id }}/user_options') || {options:{}}).options;
  }
  $('#edit_instance').on('click', function(){
    $().berry($.extend(true, {legend:'Edit Options', attributes: bae.data.user.options},JSON.parse(opts.config.forms[1].content))).on('save', function(){
      var url = '/api/apps/instances/{{ $app->id }}/user_options';
      if(typeof opts.data.user.id !== 'undefined') { // what is this??
        $.ajax({
          type: 'POST',
          url:url,
          data: {'options': this.toJSON()},
          success:function(data){
            bae.app.update({user:{options:data.options}});
            this.trigger('close');
            toastr.success('', 'Options Updated Successfully');
          }.bind(this),
          error:function(data){
              toastr.error(data.statusText, 'An error occured updating options')
          }
        })
      }else{
        bae.app.update({user:{options:this.toJSON()}});
        Lockr.set(url, {'options': this.toJSON()})
        this.trigger('close');
        toastr.success('', 'Options Updated Successfully');
      }

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