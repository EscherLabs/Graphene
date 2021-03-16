@extends('default.admin')

@section('content')

<div id="admin-content-target">
  @if(isset($group))
    <h4 class="panel-title" style="position: fixed;left: 200px;right: 0px;top: 50px;background: #f8f8f8;padding: 14px;z-index: 1001;border-bottom: solid 1px #f0f0f0;"><a href="/admin/groups/{{$group->id}}">{{$group->name}} <span class="text-muted">({{$group->slug}})</span></a></h4>
    <div id="table" style="margin:21px -21px -44px"><center style="margin:200px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center></div>
    @endif
  @if(!isset($group))
    <div id="table" style="margin:-21px -21px -44px"><center style="margin:200px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center></div>
    @endif
</div>
@endsection

@section('end_body_scripts_top')
<script src='/assets/js/vendor/ractive.min.js'></script>    
<script src='/assets/js/vendor/bluebird.min.js'></script>    

  <script>
function getData(urls,callback){
  if(typeof urls == 'string')urls = [urls];
  Promise.all(_.map(urls,function(url){
  return new Promise(function(resolve,reject){
		gform.ajax({path: url,success:function(data){resolve(data)},error:function(data){reject(data)}})
	})
})).then(function(data){
    callback.apply(null,data);
  }).catch(function(data){
  debugger;
})
}
    var route = '{{ $resource }}';
    var resource_id = '{{ $id }}';
    var group = {!! $group ?? "{}" !!};
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
      el: '#table',
      events:[{event:"model:created",handler:function(e){
        $.ajax({url: gform.m(routes.create,_.extend({resource_id:resource_id},e.model.attributes)), type: verbs.create, 
        
      dataType : 'json',
      contentType: 'application/json',
      data: JSON.stringify(e.model.attributes),
          success:function(e,data) {
            e.model.set(data);
            toastr.success('', 'Successfully Added')
          }.bind(null,e),
          error:function(e) {
            toastr.error(e.statusText, 'ERROR');
          }
        });
      }},{event:"model:edited",handler:function(e){
        debugger;
        $.ajax({url: gform.m(routes.update,_.extend({resource_id:resource_id},e.model.toJSON())), type: verbs.update,

        dataType : 'json',
      contentType: 'application/json',
      data: JSON.stringify(e.model.attributes),
        success:function(e,data) {
          e.model.set(data);
          toastr.success('', 'Successfully Updated')
        }.bind(null,e),
        error:function(e) {
          toastr.error(e.statusText, 'ERROR');
        }
      });
      }},{event:"model:deleted",handler:function(e){
        debugger;
        $.ajax({url: gform.m(routes.delete,_.extend({resource_id:resource_id},e.model.attributes)), type: verbs.delete,
          success:function(e) {
            toastr.success('', 'Successfully Deleted')
          }.bind(null,e),
          error:function(e) {
            toastr.error(e.statusText, 'ERROR');
          }
        });
      }}],
      // berry: {flatten: false},
      // add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes,
      //   success:function(data) {
      //     model.set(data);
      //     Berries.modal.trigger('close')
      //     toastr.success('', 'Successfully Added')
      //   }.bind(model),
      //   error:function(e) {
      //     toastr.error(e.statusText, 'ERROR');
      //   }
      // });},
      // edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes,
      //   success:function(data) {
      //     model.set(data);
      //     toastr.success('', 'Successfully Updated')
      //   },
      //   error:function(e) {
      //     toastr.error(e.statusText, 'ERROR');
      //   }
      // });},
      // delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE',
      //   success:function() {
      //     toastr.success('', 'Successfully Deleted')
      //   },
      //   error:function(e) {
      //     toastr.error(e.statusText, 'ERROR');
      //   }
      // });}
    }

    $('[href="/admin/'+route+'"]').parent().addClass('active');


data = {
  resource_id:resource_id,
  group:group,
  user:user,
  route:route
}
templates = {};
@verbatim
var routes={
      create:api,
      update:api+"/{{id}}",
      delete:api+"/{{id}}",
    }
var verbs={
      create:'POST',
      update:'PUT',
      delete:"DELETE",
    }
ractive = new Ractive({el: "admin-content-target",template:`
{{#group}}
  <h4 class="panel-title" style="position: fixed;left: 200px;right: 0px;top: 50px;background: #f8f8f8;padding: 14px;z-index: 1001;border-bottom: solid 1px #f0f0f0;"><a href="/admin/groups/{{group.id}}">{{group.name}} <span class="text-muted">({{group.slug}})</span></a></h4>
  <div id="table" style="margin:21px -21px -44px"><center style="margin:200px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center></div>
{{/group}}
{{^group}}
  <div id="table" style="margin:-21px -21px -44px"><center style="margin:200px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center></div>
{{/group}}
`,data: _.extend({},data), partials: templates  })
// this.ractive = new Ractive({el: document.querySelector('.report'), template: templates.report, data: _.extend({},this.methods,mappedData), partials: templates});
@endverbatim




  </script>
@endsection

@section('end_body_scripts_bottom')
  <script src='/assets/js/paged.js'></script> 
  <script src='/assets/js/vendor/moment.js'></script>
  <script src='/assets/js/vendor/moment_datepicker.js'></script>

  <script src='/assets/js/resources/{{ $resource }}.js'></script> 
@endsection
