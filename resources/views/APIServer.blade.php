@extends('default.APIServer')

@section('content')
  @if(isset($group))
    <h4 class="panel-title" style="position: fixed;left: 200px;right: 0px;top: 50px;background: #f8f8f8;padding: 14px;z-index: 1001;border-bottom: solid 1px #f0f0f0;"><a href="/admin/groups/{{$group->id}}">{{$group->name}} <span class="text-muted">({{$group->slug}})</span></a></h4>
    <div id="table" style="margin:21px -21px -44px"><center style="margin:200px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center></div>
  @endif
  @if(!isset($group))
    <div id="table" style="margin:-21px -21px -44px"><center style="margin:200px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center></div>
  @endif
@endsection

@section('end_body_scripts_top')
  <script>
    var route = '{{ $resource }}';
    var resource_id = '{{ $id }}';
    var slug = '{{ $slug }}';
    var group = {!! $group ?? "{}" !!};
    var user = {!! Auth::user() !!};

    var server = "{{ $config->server }}";

    // var url = '/admin/apiserver/fetch/'+route;
    // if(resource_id !== ''){
    //   url= '/api/groups/'+resource_id+'/'+route;
    // }
    // var api = '/api/'+route;
    var api = '/api/proxy/'+slug+'/'+route;

    var tableConfig = {
      entries: [25, 50, 100],
      count: 25,
      autoSize: -20,
      el: '#table', 
      actions:[{name:'delete',max:1 },
      '|',
      {name:'edit',max:1},
      '|',
      {name:'create'}],
      events:{
      "created":[
        e => {
          let model = e.model;
          new gform({
              legend:'Comment',
              fields:[{name:'comment',label:'Comment',required:true}]
          })
          .on('save', e =>{
            model.attributes.comment = e.form.get('comment');
            $.ajax({
              url: api, 
              type: 'POST', 
              data: model.attributes,
              success: data => {
                model.set(data);
                toastr.success('', 'Successfully Added')
              },
              error: () => {
                toastr.error(e.statusText, 'ERROR');
              }
            });
            e.form.trigger('close')
          })
          .on('cancel', e =>{
            e.form.trigger('close');
            if(typeof e.field !== 'undefined' && e.field.type == "cancel") model.delete();
            model.owner.draw();
          }).modal()

    }],
    'model:edited':[
      e => {
        let model = e.model;
        new gform ({
          legend:'Update Comment', 
          fields:[{name:'comment',label:'Comment',required:true}]
        })
        .on('save', e =>{
          model.attributes.comment = e.form.get('comment');
          $.ajax({
            url: api+'/'+model.attributes.id, 
            type: 'PUT', 
            data: model.attributes,
            success: data => {
              model.set(data);
              toastr.success('', 'Successfully Updated')
            },
            error: () => {
              toastr.error(e.statusText, 'ERROR');
            }
          });
          e.form.trigger('close')
        })
        .on('cancel',function(){
          model.undo();
          if(typeof e.field !== 'undefined' && e.field.type == "cancel") model.undo();
          model.owner.draw()
        }).modal();
    }],
    'model:deleted':[function(e){
      let model = e.model;

      $.ajax({
        url: api+'/'+model.attributes.id, 
        type: 'DELETE',
        success:function() {
          toastr.success('', 'Successfully Deleted')
        },
        error:function(e) {
          toastr.error(e.statusText, 'ERROR');
        }
      });
    }]
    
  }
}

    $('[href="/admin/'+route+'"]').parent().addClass('active');
  </script>
@endsection

@section('end_body_scripts_bottom')
  <script src='/assets/js/resources/{{ $resource }}.js?cb={{ config("app.cache_bust_id") }}'></script> 
@endsection
