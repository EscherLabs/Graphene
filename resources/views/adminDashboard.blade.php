@extends('default.admin')
@section('content')

<div id="content">
  <!-- <div class="app_name"></div> -->
<!-- Split button -->
<!-- <div class="btn-group pull-right">
  <button type="button" class="btn btn-primary" id="save">Save</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span>
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#" id="import">Import</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="versions">Versions</a></li>
    <li><a href="#" id="instances">Instances</a></li>
    <li role="separator" class="divider"></li>
    <li><a href="#" id="publish">Publish (new version)</a></li>
  </ul>
</div>
  <span class="label label-default" style="float:right;margin-right:15px;" id="version"></span> -->

</div>
<!--<div id="container" style="width:800px;height:600px;border:1px solid grey"></div>-->
@endsection

@section('end_body_scripts_top')
  <!-- <script src='//unpkg.com/ractive/ractive.min.js'></script>     -->
  <script src='/assets/js/vendor/ractive.min.js'></script>    

  <!-- <script src='/assets/js/paged.js'></script>  -->

  <!-- <script type="text/javascript" src="/assets/js/vendor/sortable.js"></script>
  <script type='text/javascript' src='/assets/js/cob/cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/image.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/form.cob.js'></script>
  <script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script> -->

@endsection

@section('end_body_scripts_bottom')
  <script>var loaded = {!! $user !!};

loaded.params = _.map(loaded.params, function(param,i){
  return {key: i, value: param};
})
loaded.app_developers = _.map(loaded.app_developers.reverse(), function(loaded, item){
    if(item.app !== null){
    item.date = item.app.versions[0].updated_at;
    
    item.app.app_instances = _.map(item.app.app_instances, function(loaded, instance){
      instance.options = _.each(instance.options, function(option, i){
        return {key: i, value: option};
      })
      instance.user_options_default = _.map(instance.options, function(user_option, i){
        return {key: i, value: user_option};
      })
      if(instance.version !== null) {
        instance.resources = _.map(instance.resources, function(loaded, instance, resource, i){
          var group = _.find(loaded.group_admins,{group_id:instance.group_id})
          if(typeof group !== 'undefined'){
            resource.endpoint = _.find(group.group.endpoints,{id:parseInt(resource.endpoint)})
            
          }
          resource.resource = _.find(instance.version.resources,{name:resource.name})
          return resource;
        }.bind(null, loaded, instance))
      }
      return instance;
    }.bind(null, loaded))
    item.app.tags = item.app.tags.split(',');

    item.app.user = item.app.user || {first_name:'Not',last_name:"Assigned", unknown:'#ffb8b8'};
    item.app.user.initials = item.app.user.first_name.substr(0,1)+item.app.user.last_name.substr(0,1)
  }
    return item;
  }.bind(null,loaded))

  loaded.app_developers = _.orderBy(loaded.app_developers,"date",'desc');

  loaded.workflow_developers = _.map(loaded.workflow_developers.reverse(), function(loaded, item){
    if(item.workflow !== null){
    item.date = item.workflow.versions[0].updated_at;
    
    item.workflow.workflow_instances = _.map(item.workflow.workflow_instances, function(loaded, instance){
      instance.options = _.each(instance.options, function(option, i){
        return {key: i, value: option};
      })
      instance.user_options_default = _.map(instance.options, function(user_option, i){
        return {key: i, value: user_option};
      })
      if(instance.version !== null) {
        instance.resources = _.map(instance.resources, function(loaded, instance, resource, i){
          var group = _.find(loaded.group_admins,{group_id:instance.group_id})
          if(typeof group !== 'undefined'){
            resource.endpoint = _.find(group.group.endpoints,{id:parseInt(resource.endpoint)})
            
          }
          resource.resource = _.find(instance.version.resources,{name:resource.name})
          return resource;
        }.bind(null, loaded, instance))
      }
      return instance;
    }.bind(null, loaded))
    item.workflow.tags = item.workflow.tags.split(',');

    item.workflow.user = item.workflow.user || {first_name:'Not',last_name:"Assigned", unknown:'#ffb8b8'};
    item.workflow.user.initials = item.workflow.user.first_name.substr(0,1)+item.workflow.user.last_name.substr(0,1)
  }
    return item;
  }.bind(null,loaded))

  loaded.workflow_developers = _.orderBy(loaded.workflow_developers,"date",'desc');

  
  </script>
  <script>
    $(document).ready(function() {
  $('#content').html(templates.admin_dashboard.render(loaded));
  $('.navbar-header .nav a h4').html('My Dashboard');

      new gform({
				name:'user_search',
				actions:[],
				horizontal:false,
				label:false,
				fields:[
					{name:'query',label:false,placeholder:'Search', pre:'<i class="fa fa-filter"></i>'},
					{type:'output',value:'',name:'results',label:false}
				]},'#search').on('change:query',function(e){
          processFilter({currentTarget:e.field.el.querySelector('input')});
				})
    $("time.timeago").timeago();
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

@verbatim
	viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>');
@endverbatim
  $('.find').on('click', function(e){
    $.get('/api/appinstances/'+e.currentTarget.dataset.id+'/pages', function(data){
      if(data.length > 0){
        modal({title:'This App Instance was found on the following pages', content:viewTemplate.render({items:data})});
      }else{
        modal({title: 'No pages Found', content:'This App Instance is not currently placed on any pages.'});
      }
    })
  })	
    // msnry.layout();
  })
  </script>
@endsection

@section('bottom_page_styles')

  <style>


/* .grid-sizer,.grid-item { width: 32%;}
.gutter-sizer { width: 0%; }

@media (min-width: 480px) {
    .grid-sizer,.grid-item { width: 32%;}
    .gutter-sizer { width: 2%; }
}

@media (min-width: 768px) {
    .grid-sizer,.grid-item { width: 32%;}
    .gutter-sizer { width: 2%; }
}

@media (min-width: 992px) {
    .grid-sizer,.grid-item { width: 23.5%;}
    .gutter-sizer { width: 2%; }
}

@media (min-width: 1200px) {
    .grid-sizer,.grid-item { width: 18.25%;}
    .gutter-sizer { width: 2%; }
} */


div.masonry-grid { 
  display: flex; 
  flex-direction: row; 
  flex-wrap: wrap;
  /* height: 100vw; */
  max-height: 80vh;
  justify-content: space-between;
  overflow:scroll;
}
div.masonry-grid .grid-item {  
  width: 49%;
} 

/* fallback for earlier versions of Firefox */

@supports not (flex-wrap: wrap) {
  div.masonry-grid { display: block; }
  div.masonry-grid .grid-item {  
  display: inline-block;
  vertical-align: top;
  }
}

.fa-collapse {
  display: inline-block;
    width: 0;
    height: 0;
    /* margin-left: 2px; */
    position:absolute;
    top:12px;
    left:7px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid\9;
    border-right: 4px solid #0000;
    border-left: 4px solid #0000;
}
.collapsed .fa-collapse {
    border-left: 4px dashed;
    border-left: 4px solid\9;
    border-bottom: 4px solid #0000;
    border-top: 4px solid #0000;
}

.appInstance,.workflowInstance{
  position:relative;
  margin: 0 0 5px;
  background: #f6f8fa;
  padding: 5px 5px 5px 20px;
}
.device_0:before{
  content: 'All'
}
.device_1:before{
  content: 'Desktop Only'
}
.device_2:before{
  content: 'Tablet and Desktop'
}
.device_3:before{
  content: 'Tablet and Phone'
}
.device_4:before{
  content: 'Phone Only'
}

.avatar{
  width: 40px;
    height: 40px;
    background: #b4cde0;
    text-align: center;
    border-radius: 50%;
    line-height: 40px;
    font-size: 20px;
    color: #fff;
    float: left;
    margin: 5px;
}
.avatar.self{
  background:#cab4e0;
}
.appInstance i{padding:5px;
/* color:#666 */
}

.fa-lock-0:before{
  content:"\f023";/*"\f09c"*/
  color:#8a6d3b;
}
.fa-lock-:before{
  content:"\f09c";
  color:#a94442;
}

.appInstance .fa-lock:before,.workflowInstance .fa-lock:before{
  color:#3c763d;
}
.appInstance a,.workflowInstance a{color:#666;text-decoration:none}
.tab-pane{padding-top:15px}
.panel-default >.panel-heading .badge{background:#8391f3}
.badge-notify{
  background: #afafaf;
  position: relative;
  top: 10px;
  left: -18px;
  margin-right: -18px;
}
.group-info{
  opacity:.8;
}
.grid-item:hover .group-info{
  opacity:1
}

  fieldset hr{display:none}
  fieldset > legend{font-size: 30px}
  fieldset fieldset legend{font-size: 21px}
  #myModal .modal-dialog{width:900px}
  </style>
@endsection