<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">
    <title>{{ config('app.site')->name }}</title>
    <link href="/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="/assets/css/font-awesome.min.css" rel="stylesheet">
    <link href="/assets/css/toastr.min.css" rel="stylesheet">

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
          <a class="navbar-brand" style="background-color:#2d8cc3" href="/">
            &nbsp;{{ $config->name }}
          </a>
          <ul class="nav navbar-nav navbar-right hidden-xs">
            <li><a href="#"><h4 style="margin:0"></h4></a></li>
          </ul>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle user-info" data-toggle="dropdown" role="button">
                <img class="gravatar" src="https://www.gravatar.com/avatar/{{ md5(Auth::user()->email) }}?d=mm" /> 
                {{ Auth::user()->first_name }} {{ Auth::user()->last_name }} 
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                @can('view_in_admin', 'App\Site')
                @foreach (config('app.site')->proxyserver_config as $config)
                    <li><a href="/admin/apiserver/{{ $config->slug }}/environments"><i class="fa fa-server"></i> {{ $config->name }}</a></li>
                @endforeach
                @endcan
                <li><a href="/admin/sites/{{ config('app.site')->id }}"><i class="fa fa-gear"></i> Admin</a></li>
                <li><a href="{{ url('/logout') }}"><i class="fa fa-times-circle"></i> Logout</a></li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right visible-xs-block">
            @can('view_in_admin', 'App\Site')
            <li><a href="/admin/apiserver/{{$slug}}/environments"><i class="fa fa-cloud fa-fw"></i>&nbsp; Environments</a></li>
            <li><a href="/admin/apiserver/{{$slug}}/users"><i class="fa fa-users fa-fw"></i>&nbsp; Users</a></li>
            <li><a href="/admin/apiserver/{{$slug}}/apis"><i class="fa fa-cubes fa-fw"></i>&nbsp; APIs</a></li>
            <!--<li><a href="/admin/apiserver/{{$slug}}/api_versions"><i class="fa fa-code-fork fa-fw"></i>&nbsp; API Versions</a></li>-->
            <li><a href="/admin/apiserver/{{$slug}}/api_instances"><i class="fa fa-cube fa-fw"></i>&nbsp; API Instances</a></li>
            <li><a href="/admin/apiserver/{{$slug}}/resources"><i class="fa fa-database fa-fw"></i>&nbsp; Resources</a></li>
            <li><a href="/admin/apiserver/{{$slug}}/schedule"><i class="fa fa-calendar fa-fw"></i>&nbsp; Schedule</a></li>
            <li><a href="/admin/apiserver/{{$slug}}/activity_log"><i class="fa fa-file fa-fw"></i>&nbsp; Activity Log</a></li>
            @endcan  
          </ul>
          <!--form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form-->
        </div>
      </div>
    </nav>
    <div class="col-sm-3 col-md-2 sidebar">
      <ul class="nav nav-sidebar">
        @can('view_in_admin', 'App\Site')
        <li><a href="/admin/apiserver/{{$slug}}/environments"><i class="fa fa-cloud fa-fw"></i>&nbsp; Environments</a></li>
        <li><a href="/admin/apiserver/{{$slug}}/users"><i class="fa fa-users fa-fw"></i>&nbsp; Users</a></li>
        <li><a href="/admin/apiserver/{{$slug}}/apis"><i class="fa fa-cubes fa-fw"></i>&nbsp; APIs</a></li>
        <!--<li><a href="/admin/apiserver/{{$slug}}/api_versions"><i class="fa fa-code-fork fa-fw"></i>&nbsp; API Versions</a></li>-->
        <li><a href="/admin/apiserver/{{$slug}}/api_instances"><i class="fa fa-cube fa-fw"></i>&nbsp; API Instances</a></li>
        <li><a href="/admin/apiserver/{{$slug}}/resources"><i class="fa fa-database fa-fw"></i>&nbsp; Resources</a></li>
        <li><a href="/admin/apiserver/{{$slug}}/schedule"><i class="fa fa-calendar fa-fw"></i>&nbsp; Schedule</a></li>
        <li><a href="/admin/apiserver/{{$slug}}/activity_log"><i class="fa fa-file fa-fw"></i>&nbsp; Activity Log</a></li>
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

    <script src='/assets/js/vendor/jquery.min.js'></script>
    <script src="/assets/js/vendor/bootstrap.min.js"></script>
    <script src='/assets/js/vendor/hogan.min.js'></script>
    <script src='/assets/js/vendor/lodash.min.js'></script>		
    <script>_.findWhere = _.find; _.where = _.filter;_.pluck = _.map;_.contains = _.includes;</script>
    
    <script src='/assets/js/vendor/summernote.min.js'></script>
    <script src='/assets/js/vendor/dropzone.min.js'></script>
		<script src="/assets/js/vendor/sortable.js"></script>
		<script src="/assets/js/templates/admin.js"></script>
    <script src="/assets/js/vendor/ace/ace.js" charset="utf-8"></script>
    <script src='/assets/js/vendor/toastr.min.js'></script> 
    <script src='/assets/js/lib.js'></script> 
    @yield('end_body_scripts_top')
    <script src='/assets/js/vendor/berry.full.js'></script> 
    <script src='/assets/js/vendor/bootstrap.full.berry.js'></script> 
    <script src='/assets/js/vendor/berrytables.full.js'></script> 
    @yield('end_body_scripts_bottom')
    @yield('bottom_page_styles')
  </body>
</html>
