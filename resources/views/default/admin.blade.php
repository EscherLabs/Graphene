<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Vary" content="*" />
    <link rel="icon" href="../../favicon.ico">
    <title>{{ config('app.site')->name }}</title>
    <link href="/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/css/font-awesome.min.css" rel="stylesheet">
    <link href="/assets/css/toastr.min.css" rel="stylesheet">
    <link rel='stylesheet' type='text/css' href='/assets/css/colorpicker.min.css'>

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<link href="../../assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">-->
    <!-- Custom styles for this template -->
    <link href="/assets/css/graphene.css" rel="stylesheet">
    <link href="/assets/css/admin.css" rel="stylesheet">

    <link href="/assets/css/dropzone.css" rel="stylesheet">
    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <!--<script src="../../assets/js/ie-emulation-modes-warning.js"></script>-->
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link data-name="vs/editor/editor.main" rel="stylesheet" href="/assets/js/vendor/vs/editor/editor.main.css">
    @yield('top_page_styles')
  </head>

  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/admin">
        <img style="height:25px" src="/assets/img/graphene_all_white.png">
          </a>
          <ul class="nav navbar-nav navbar-right hidden-xs">
          </li>
            <li><a href="#"><h4 style="margin:0"></h4></a></li>
          </ul>
          
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
          <li><a href="/"><h4 style="margin:0;">{{ config('app.site')->name }}</h4></a>


            <li class="dropdown">
              <a href="#" class="dropdown-toggle user-info" data-toggle="dropdown" role="button">
                <img class="gravatar" src="https://www.gravatar.com/avatar/{{ md5(Auth::user()->email) }}?d=mm" /> 
                {{ Auth::user()->first_name }} {{ Auth::user()->last_name }} 
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                @can('create', 'App\App')
                @if(!is_null(config('app.site')->proxyserver_config))
                @foreach (config('app.site')->proxyserver_config as $config)
                    @if($config->slug != '' && $config->name != '')
                    <li><a href="/admin/apiserver/{{ $config->slug }}/environments"><i class="fa fa-server"></i> {{ $config->name }}</a></li>
                    @endif
                @endforeach
                @endif
                @endcan  
                <li><a href="/"><i class="fa fa-arrow-left"></i> Back to {{ config('app.site')->name }}</a></li>
                <li><a href="{{ url('/logout') }}"><i class="fa fa-times-circle"></i> Logout</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right visible-xs-block">
            @can('view_in_admin','App\Group')
            <li><a href="/admin/groups"><i class="fa fa-users fa-fw"></i>&nbsp; Groups</a></li>
            @endcan
            @can('view_in_admin','App\User')
              <li><a href="/admin/users"><i class="fa fa-user fa-fw"></i>&nbsp; Users</a></li>
            @endcan
            @can('view_in_admin', 'App\Endpoint')
              <!-- <li><a href="/admin/endpoints"><i class="fa fa-crosshairs fa-fw"></i>&nbsp; Endpoints</a></li>   -->
            @endcan   
            @can('view_in_admin', 'App\Link')
              <!-- <li><a href="/admin/links"><i class="fa fa-link fa-fw"></i>&nbsp; Links</a></li>   -->
            @endcan   
            @can('view_in_admin', 'App\Image')
              <!-- <li><a href="/admin/images"><i class="fa fa-image fa-fw"></i>&nbsp; Images</a></li>   -->
            @endcan   
            @can('view_in_admin', 'App\Tag')
              <!-- <li><a href="/admin/tags"><i class="fa fa-tags fa-fw"></i>&nbsp; Tags</a></li>   -->
            @endcan   
            @can('view_in_admin','App\App')
              <li><a href="/admin/apps"><i class="fa fa-cube fa-fw"></i>&nbsp; MicroApps</a></li>
            @endcan
            @can('view_in_admin','App\Workflow')
              <li><a href="/admin/workflows"><i class="fa fa-check-square-o fa-fw"></i>&nbsp; Workflows</a></li>
            @endcan
            @can('view_in_admin','App\AppInstance')
              <!-- <li><a href="/admin/appinstances"><i class="fa fa-cubes fa-fw"></i>&nbsp; App Instances</a></li> -->
            @endcan
            @can('view_in_admin','App\Page')
              <!-- <li><a href="/admin/pages"><i class="fa fa-file fa-fw"></i>&nbsp; Pages</a></li> -->
            @endcan
            @can('view_in_admin', 'App\APIUser')
              <li><a href="/admin/api_users"><i class="fa fa-plug fa-fw"></i>&nbsp; API Accounts</a></li>
            @endcan  
            @can('view_in_admin', 'App\Site')
              <li><a href="/admin/sites"><i class="fa fa-cloud fa-fw"></i>&nbsp; Sites</a></li>
            @endcan  
          </ul>
          <!--form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form-->
        </div>
      </div>
    </nav>
    <div class="col-sm-3 col-md-2 sidebar">
    <!-- <div style="margin-top:15px;width: 120px;" class="btn btn-lg btn-new" id="graphene-quick-create"><i class="fa fa-plus fa-lg"></i> New</div> -->

      <ul class="nav nav-sidebar">
        @can('view_in_admin','App\Group')
          <li><a href="/admin/groups"><i class="fa fa-users fa-fw"></i>&nbsp; Groups</a></li>
        @endcan
        @can('view_in_admin','App\User')
          <li><a href="/admin/users"><i class="fa fa-user fa-fw"></i>&nbsp; Users</a></li>
        @endcan
        @can('view_in_admin', 'App\Endpoint')
          <!-- <li><a href="/admin/endpoints"><i class="fa fa-crosshairs fa-fw"></i>&nbsp; Endpoints</a></li>   -->
        @endcan   
        @can('view_in_admin', 'App\Link')
          <!-- <li><a href="/admin/links"><i class="fa fa-link fa-fw"></i>&nbsp; Links</a></li>   -->
        @endcan   
        @can('view_in_admin', 'App\Image')
          <!-- <li><a href="/admin/images"><i class="fa fa-image fa-fw"></i>&nbsp; Images</a></li>   -->
        @endcan   
        @can('view_in_admin', 'App\Tag')
          <!-- <li><a href="/admin/tags"><i class="fa fa-tags fa-fw"></i>&nbsp; Tags</a></li>   -->
        @endcan   
        @can('view_in_admin','App\App')
          <li><a href="/admin/apps"><i class="fa fa-cube fa-fw"></i>&nbsp; MicroApps</a></li>
        @endcan
        @can('view_in_admin','App\Workflow')
              <li><a href="/admin/workflows"><i class="fa fa-check-square-o fa-fw"></i>&nbsp; Workflows</a></li>
        @endcan
        @can('view_in_admin','App\AppInstance')
          <!-- <li><a href="/admin/appinstances"><i class="fa fa-cubes fa-fw"></i>&nbsp; App Instances</a></li> -->
        @endcan
        @can('view_in_admin','App\Page')
          <!-- <li><a href="/admin/pages"><i class="fa fa-file fa-fw"></i>&nbsp; Pages</a></li> -->
        @endcan
        @can('view_in_admin', 'App\APIUser')
          <li><a href="/admin/api_users"><i class="fa fa-plug fa-fw"></i>&nbsp; API Accounts</a></li>
        @endcan  
        @can('view_in_admin', 'App\Site')
          <li><a href="/admin/sites"><i class="fa fa-cloud fa-fw"></i>&nbsp; Sites</a></li>
        @endcan  
      </ul>
    </div>
    <div class="container-fluid" id="main-container">
      <div class="row">

        <div class="col-sm-12 admin-main">
            <div id="content">@yield('content')</div>
        </div>
      </div>
    </div>

    <script src='/assets/js/vendor/jquery.min.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/vendor/bootstrap.min.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/vendor/hogan.min.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/vendor/lodash.min.js?cb={{ config("app.cache_bust_id") }}'></script>		
    <script>_.findWhere = _.find; _.where = _.filter;_.pluck = _.map;_.contains = _.includes;</script>
    
    <script src='/assets/js/vendor/summernote.min.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/vendor/dropzone/dropzone.min.js?cb={{ config("app.cache_bust_id") }}'></script>

		<script src='/assets/js/vendor/sortable.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/vendor/ace/ace.js?cb={{ config("app.cache_bust_id") }}' charset="utf-8"></script>
    <script src='/assets/js/vendor/toastr.min.js?cb={{ config("app.cache_bust_id") }}'></script> 
    @yield('end_body_scripts_top')
    <script src='/assets/js/vendor/bootstrap.full.berry.js?cb={{ config("app.cache_bust_id") }}'></script> 
    <script src='/assets/js/vendor/state-machine.js?cb={{ config("app.cache_bust_id") }}'></script>

    <script src='/assets/js/vendor/gform_bootstrap.min.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/templates/admin.js?cb={{ config("app.cache_bust_id") }}'></script>

    <script src='/assets/js/vendor/GrapheneDataGrid.min.js?cb={{ config("app.cache_bust_id") }}'></script>
    <script src='/assets/js/lib.js?cb={{ config("app.cache_bust_id") }}'></script> 
 
    @yield('end_body_scripts_bottom')

    <script>

     startContent = "<div>"+

      @can('create','App\Group')
      "<a href='#' style='border-left-color:#44a77f' class='list-group-action' data-action='creategroup'><i class='fa fa-users'></i> Group</a>"+
      @endcan   
       @can('create','App\App')
      "<a href='#' style='border-left-color:#d85e16' class='list-group-action' data-action='createapp'><i class='fa fa-cube'></i> Micro App</a>"+
      @endcan   

      @can('create','App\Workflow')
      "<a href='#' style='border-left-color:#a816d8' class='list-group-action' data-action='createworkflow'><i class='fa fa-check-square-o'></i> Workflow</a>"+
      @endcan
      @can('create','App\Page')
      "<a href='#' style='border-left-color:#337ab7' class='list-group-action' data-action='createpage'><i class='fa fa-file'></i> Page</a>"+
      @endcan   
      @can('create','App\AppInstance')
      "<a href='#' style='border-left-color:#31708f' class='list-group-action' data-action='createappinstance'><i class='fa fa-cubes'></i> App Instance</a>"+
      @endcan   

      @can('create','App\WorkflowInstance')
      "<a href='#' style='border-left-color:#167ed8' class='list-group-action' data-action='createworkflowinstance'><i class='fa fa-check'></i> Workflow Instance</a>"+
      @endcan   

      @can('create','App\Endpoint')
      "<a href='#' style='border-left-color:#8a6d3b' class='list-group-action' data-action='createendpoint'><i class='fa fa-crosshairs'></i> Endpoint</a>"+
      @endcan   
      @can('create','App\Image')
      "<a href='#' style='border-left-color:#555' class='list-group-action' data-action='createimage'><i class='fa fa-image'></i> Image</a>"+
      @endcan   
      @can('create','App\Link')
      "<a href='#' style='' class='list-group-action' data-action='createlink'><i class='fa fa-link'></i> Link</a>"+
      @endcan   
      @can('create','App\User')
      "<a href='#' style='border-left-color:#333' class='list-group-action' data-action='createuser'><i class='fa fa-user'></i> User</a>"+
      @endcan   

      // "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a>"+

      "</div>";
    </script>
    <script src='/assets/js/resources/creators.js?cb={{ config("app.cache_bust_id") }}'></script>

    @yield('bottom_page_styles')
  </body>
</html>
