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
    var group = {!! $group or "{}" !!};
    var user = {!! Auth::user() !!};
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
      container: '#table', 
      berry: {flatten: false},
      add: function(model){
        $().berry({legend:'Comment',fields:[{name:'comment',label:'Comment',required:true}]}).on('save',function(){
          model.attributes.comment = this.toJSON().comment;

          $.ajax({url: api, type: 'POST', data: model.attributes,
            success:function(data) {
              model.set(data);
              // Berries.modal.trigger('close')
              toastr.success('', 'Successfully Added')
            }.bind(model),
            error:function(e) {
              toastr.error(e.statusText, 'ERROR');
            }
          });

          this.trigger('close')
        }).on('cancel',function(){
          model.delete();
          model.owner.draw();
        })
    },
      edit: function(model){
        $().berry({legend:'Update Comment', fields:[{name:'comment',label:'Comment',required:true}]}).on('save',function(){
            model.attributes.comment = this.toJSON().comment;

            $.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
            success:function(data) {
              model.set(data);
              toastr.success('', 'Successfully Updated')
            },
            error:function(e) {
              toastr.error(e.statusText, 'ERROR');
            }

            
          });
          this.trigger('close')
        }).on('cancel',function(){
          model.undo();
          model.owner.draw()
          
        })
    },
      delete: function(model){ 
        $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE',
        success:function() {
          toastr.success('', 'Successfully Deleted')
        },
        error:function(e) {
          toastr.error(e.statusText, 'ERROR');
        }
      });}
    }

    $('[href="/admin/'+route+'"]').parent().addClass('active');
  </script>
@endsection

@section('end_body_scripts_bottom')
  <script src='/assets/js/paged.js'></script> 
  <script src='/assets/js/vendor/moment.js'></script>

  <script src='/assets/js/resources/{{ $resource }}.js'></script> 
@endsection
