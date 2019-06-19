@extends('default.apps')

@section('titlebar')
						<div class="dropdown pull-right hidden editTools" style="margin-left:15px;margin-top: 8px;">
							<button id="dLabel" class="btn btn-default" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								Widgets
								<span class="caret"></span>
							</button>
							<ul id="sortableList" class="dropdown-menu list-group" aria-labelledby="dLabel">
								<li data-type="Image"><a href="javascript:addWidget('Image');">Image</a></li>
								<li data-type="Content"><a href="javascript:addWidget('Content');">Content</a></li>
								<li data-type="uApp"><a href="javascript:addWidget('uApp');">MicroApp</a></li>
							</ul>
						</div>
						<div class="btn btn-primary pull-right" id="startEditing" style="margin-top: 8px;" onclick="load(false);"><i class="fa fa-pencil"></i> Edit</div>
						<div class="btn btn-danger pull-right hidden editTools" style="margin-top: 8px;" id="doneEditing" onclick="load(true);"><i class="fa fa-times"></i> Done</div>
@endsection

@section('content')
				<div class="row">
					<div class="col-sm-12">

						<div class="row ">
							<div class="cobler_container col-md-6"></div>
							<div class="cobler_container col-md-6"></div>
						</div>
					</div>
				</div>
@endsection


@section('bottom_page_scripts')
<script src="/assets/js/vendor/lodash.min.js"></script>

<script src='/assets/js/vendor/gform_bootstrap.min.js'></script> 

<script src='/assets/js/grapheneAppEngine.js'></script> 

		<link rel='stylesheet' type='text/css' href='/assets/css/graphene.css'>
		<script type="text/javascript" src="/assets/js/vendor/sortable.js"></script>
		<script type='text/javascript' src='/assets/js/cob/cob.js'></script>
		<script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
		<script type='text/javascript' src='/assets/js/cob/image.cob.js'></script>

		<script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script>
		<script type='text/javascript' src='/assets/js/cob/flow.cob.js'></script>
		<!-- // <script type='text/javascript' src='assets/js/form.cob.js'></script>		 -->
		<script type='text/javascript' src='/assets/js/templates/widget.js'></script>
	    <script src='/assets/js/lib.js'></script> 

		<script type='text/template' name="itemContainer">
			<div class="cobler-li-content"></div>
			<div class="btn-group parent-hover">
				<span class="remove-item btn btn-danger fa fa-trash-o" data-title="Remove"></span>
				<span class="duplicate-item btn btn-default fa fa-copy" data-title="Duplicate"></span>
				<span class="edit-item btn btn-default fa fa-pencil" data-title="Edit"></span>
			</div>
		</script>

		<script type='text/javascript' >
      _.findWhere = _.find;
			function load(status){
				$('body').toggleClass('editor', !status)
				if(typeof cb !== 'undefined'){
					cb.destroy();
					delete cb;
				}
				templates['itemContainer'] = Hogan.compile(document.getElementsByName('itemContainer')[0].innerHTML);
				var template = 'widgets_container'
				var target = 'widget';
				if(!status){
					target ='';
					template = 'itemContainer';
				}
				
				var data = config.sections || [[]];// [[{"title":"This is the title","app_id":1,"widgetType":"uApp"}]];
				cb = new Cobler({ disabled: status, targets: document.getElementsByClassName('cobler_container'),itemContainer: template,itemTarget:target, items:data})

				if(!status){
					cb.addSource(document.getElementById('sortableList'));
					if("{{$slug}}" == 'Dashboard'){
						var save = function(){$.post('/api/dashboard',{"config":{"sections":cb.toJSON({editor: true})} },function(data){
							// config = JSON.parse(data.config);
							config = data.config;
						})}
					}else{
						var save = function(){$.ajax({
							url:'/api/pages/'+1,
							data:{"content":{"sections":cb.toJSON({editor: true})} },
							method:'PUT',
							success: function(data){
								config = data.content;
							}
						})}
					}
					cb.on('moved',save);
					cb.on('reorder', save);
					cb.on('remove', save);
					cb.on('change',save);
				}
			}

			function addWidget(e) { cb.collections[0].addItem(e); }
			var config = {!! json_encode($config) !!};
      		var apps = {!! $apps !!};
			// var status = true;
			load(true);
  		$('[href$="{{ $slug }}"]').parent().addClass('active').parent().addClass('in');

		</script>

		<script type='text/javascript' >
			$('body').keydown(function(event) {
				switch(event.keyCode) {
					case 27://escape
							cb.deactivate();
						break;
				}
			});
		</script>

@endsection