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
  Promise.all(_.map(urls, url =>{
    return new Promise((resolve,reject) => {
      gform.ajax({path: url,success:function(data){resolve(data)},error:function(data){reject(data)}})
    })
  })).then(data => {
    let ss = callback.toString().split('=>')[0].split('(');
    ((ss.length>1)?ss[1]:ss[0]).split(')')[0].split(',').reduce((data, item, index) => {
      //assumes no more parameters are expected in the callback than the number of urls requested
      $g.collections.add(item.trim(), data[index])
      return data;
    },data)

    callback.apply(null, data);
  }).catch(function(data){
    // debugger;
  })
}
    var route = '{{ $resource }}';
    var resource_id = '{{ $id }}';
    var group = {!! $group ?? "{}" !!};
    const composites = (group.composites||[]).map( composite => composite.group );

    var user = {!! Auth::user() !!};
    var url = '/api/'+route;
    if(resource_id !== ''){
      url= '/api/groups/'+resource_id+'/'+route;
    }

    var api = '/api/'+route;

    data = {
      resource_id:resource_id,
      group:group,
      user:user,
      route:route
    }
    templates = {};
    
    var tableConfig = {
      entries: [25, 50, 100],
      count: 25,
      autoSize: -20,
      el: '#table',
      events:[
        {
          event: "model:created",
          handler: e => {
            $.ajax({
              url: $g.render(routes.create, {...e.model.attributes, resource_id: resource_id}),
              type: verbs.create, 
              dataType : 'json',
              contentType: 'application/json',
              data: JSON.stringify(e.model.attributes),
              success: function(model, response){
                model.set(response);
                toastr.success('', 'Successfully Added')
              }.bind(null, e.model),
              error: response => {
                toastr.error(response.statusText, 'ERROR');
              }
            });
          }
        },
      {
        event:"model:edited",
        handler: e => {
          debugger;
          $.ajax({
            url: $g.render(routes.update, {...e.model.attributes, resource_id: resource_id}),
            type: verbs.update,
            dataType : 'json',
            contentType: 'application/json',
            data: JSON.stringify(e.model.attributes),
              success:function(e,data) {
                e.model.set(data);
                toastr.success('', 'Successfully Updated')
              }.bind(null,e),
              error: e => {
                toastr.error(e.statusText, 'ERROR');
              }
          });
        }
      },{event:"model:deleted",handler:function(e){
          $.ajax({
            url: $g.render(routes.delete, {...e.model.attributes, resource_id: resource_id}),
            type: verbs.delete,
            success:function(e) {
              toastr.success('', 'Successfully Deleted')
            }.bind(null,e),
            error: e => {
              toastr.error(e.statusText, 'ERROR');
            }
          });
      }}]
    }

    $('[href="/admin/'+route+'"]').parent().addClass('active');
    $('body').on('click','.save-sort',() => {
      $.ajax({
        url: $g.render(routes.sort, {resource_id: resource_id}),
        type: 'POST',
        data: {order:_.map($('#sorter').children(), (item,index) => {return {id:item.dataset.id,index:index}})},
        success: response => {
          _.each(response, function(item){
            var temp = grid.find({id:parseInt(item.id)});
            if(typeof temp !== 'undefined' && temp.length){
              temp[0].update({order:item.index},true)
            }
          })
          toastr.success('', 'Order successfully updated')
          mymodal.ref.modal('hide')
          grid.state.set({sort: 'order', reverse: true})

        }
      })
    })

@verbatim

var routes={
      create: api,
      update: api+"/{{id}}",
      delete: api+"/{{id}}",
      sort: api+'/order/{{resource_id}}',
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
  <script src='/assets/js/fileManager.js?cb={{ config("app.cache_bust_id") }}'></script> 
  <script src='/assets/js/vendor/moment.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script src='/assets/js/vendor/moment_datepicker.js?cb={{ config("app.cache_bust_id") }}'></script>
  <script>$g.collections.add('composites',composites);</script>
  <script src='/assets/js/resources/{{ $resource }}.js?cb={{ config("app.cache_bust_id") }}'></script> 
@endsection
