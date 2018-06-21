
@extends('default.admin')

@section('content')
<div class="row">
  <div class="col-sm-12">
    <div id="tableouter" style="margin:-21px">
      <div class="panel-page">
        <section class="panel panel-default">
          @if(isset($group))
          <div class="panel-heading">
            <h4 class="panel-title"><a href="/admin/groups/{{$group->id}}">{{$group->name}} <span class="text-muted">({{$group->slug}})</span></a></h4>
          </div>
          @endif
          <div id="mypanel" class="panel-body">
            <div id="table" style="margin:-16px -21px -42px"></div>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>
@endsection

@section('end_body_scripts_top')
  <script>
    var route = '{{ $resource }}';
    var resource_id = '{{ $id }}';
    var group = {!! $group or "{}" !!};
    var user = {!! Auth::user() !!};
    var url = '/api/'+route;
    if(resource_id !== ''){
      url= '/api/groups/'+resource_id+'/'+route;
    }
    var api = '/api/'+route;
    var tableConfig = {
      entries: [25, 50, 100],
      count: 25,
      autoSize: -20,
      container: '#table', 
      berry: {flatten: false},
      add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes,
        success:function(data) {
          model.set(data);
          Berries.modal.trigger('close')
          toastr.success('', 'Successfully Added')
        }.bind(model),
        error:function(e) {
          toastr.error(e.statusText, 'ERROR');
        }
      });},
      edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
        success:function(data) {
          model.set(data);
          toastr.success('', 'Successfully Updated')
        },
        error:function(e) {
          toastr.error(e.statusText, 'ERROR');
        }
      });},
      delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE',
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

  <script src='/assets/js/resources/{{ $resource }}.js'></script> 
@endsection
