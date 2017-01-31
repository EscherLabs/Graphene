@extends('default.apps')

@section('welcome_name')
{{ Auth::user()->first_name }} {{ Auth::user()->last_name }}
@endsection

@section('content')
				<div class="row">
					<div class="col-sm-12">
						<div class="dropdown pull-right">
							<button id="dLabel" class="btn btn-default" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								Widgets
								<span class="caret"></span>
							</button>
							<ul id="sortableList" class="dropdown-menu list-group" aria-labelledby="dLabel">
								<li data-type="RSS"><a href="javascript:void(0);">Rss</a></li>
								<li data-type="Content"><a href="javascript:void(0);">Content</a></li>
								<li data-type="uApp"><a href="javascript:void(0);">Apps</a></li>
							</ul>
						</div>
						<h1 class="page-header">Dashboard</h1>

						<div class="row ">
						<div class="widget_container col-md-6"></div>
						<div class="widget_container col-md-6"></div>
						</div>
					</div>
				</div>
@endsection


@section('bottom_page_scripts')
<script src='/assets/js/berryApp.js'></script> 

		<link rel='stylesheet' type='text/css' href='/assets/css/cobler.css'>
		<script type="text/javascript" src="/assets/js/sortable.js"></script>
		<script type='text/javascript' src='/assets/js/cob/cob.js'></script>
		<script type='text/javascript' src='/assets/js/cob/content.cob.js'></script>
		<script type='text/javascript' src='/assets/js/cob/uapp.cob.js'></script>
		<!-- // <script type='text/javascript' src='assets/js/form.cob.js'></script>		 -->
		<script type='text/javascript' src='//cdn.tinymce.com/4/tinymce.min.js'></script>`
		<script type='text/javascript' src='assets/js/cob/widget_templates.js'></script>

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
      var apps = {!! $apps !!};
      var config = {!! $config !!};
			var save = function(){$.post('/api/dashboard',{"config":{"sections":cb.toJSON({editor: true})} })}
			templates['itemContainer'] = Hogan.compile(document.getElementsByName('itemContainer')[0].innerHTML);

      var data = config.sections || [[{"title":"This is the title","app_id":1,"widgetType":"uApp"}]];
      cb = new Cobler({ disabled: false, targets: document.getElementsByClassName('widget_container'), items:data})

      list = document.getElementById('sortableList');
      cb.addSource(list);
      list.addEventListener('click', function(e) {
        cb.collections[0].addItem($(e.target).closest('li').data('type'));
      })


			cb.on('moved',save);
			cb.on('reorder', save);
			cb.on('remove', save);
			cb.on('change',save);

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