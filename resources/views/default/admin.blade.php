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
    @if(!empty(config('app.site')->theme->icon))
      <link rel="icon" type="image/png" href="/assets/icons/fontawesome/gray/32/{{ config('app.site')->theme->icon }}.png" />
    @endif
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<link href="../../assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">-->
    <!-- Custom styles for this template -->
    <link href="/assets/css/cobler.css" rel="stylesheet">
    <link href="/assets/css/dashboard.css" rel="stylesheet">
    <link href="/assets/css/dropzone.css" rel="stylesheet">
    <!--@if(!empty(config('app.site')->theme->css))<style> {!! config('app.site')->theme->css !!}</style>@endif-->
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

  <body class="topbar sidemenu">

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="/">
            @if(!empty(config('app.site')->theme->icon))
            <i class="fa fa-{{ config('app.site')->theme->icon }} fa-fw" style="font-size: 36px;margin: -8px 0px 0px -8px;float: left;"></i>
            @endif
            &nbsp;{{ config('app.site')->name }}
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
            @can('view_in_admin','App\AppInstance')
              <li><a href="/admin/appinstances"><i class="fa fa-cubes fa-fw"></i>&nbsp; App Instances</a></li>
            @endcan
            @can('view_in_admin','App\Page')
              <li><a href="/admin/pages"><i class="fa fa-file fa-fw"></i>&nbsp; Pages</a></li>
            @endcan
            @can('view_in_admin', 'App\APIUser')
              <li><a href="/admin/api_users"><i class="fa fa-plug fa-fw"></i>&nbsp; Manage API Accounts</a></li>
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
        @can('view_in_admin','App\AppInstance')
          <li><a href="/admin/appinstances"><i class="fa fa-cubes fa-fw"></i>&nbsp; App Instances</a></li>
        @endcan
        @can('view_in_admin','App\Page')
          <li><a href="/admin/pages"><i class="fa fa-file fa-fw"></i>&nbsp; Pages</a></li>
        @endcan
        @can('view_in_admin', 'App\APIUser')
          <li><a href="/admin/api_users"><i class="fa fa-plug fa-fw"></i>&nbsp; Manage API Accounts</a></li>
        @endcan  
        @can('view_in_admin', 'App\Site')
          <li><a href="/admin/sites"><i class="fa fa-cloud fa-fw"></i>&nbsp; Sites</a></li>
        @endcan  
      </ul>
    </div>
    <div class="container-fluid" id="main-container">
      <div class="row">

        <div class="col-sm-12 mymain">
            <div id="content">@yield('content')</div>
        </div>
      </div>
    </div>

    <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.2/hogan.min.js'></script>
    <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'></script>		
    <script type='text/javascript' src='/assets/js/vendor/summernote.min.js'></script>
    <script type='text/javascript' src='/assets/js/vendor/dropzone.min.js'></script>
		<script type="text/javascript" src="/assets/js/sortable.js"></script>
		<script type="text/javascript" src="/assets/js/templates/admin.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js" charset="utf-8"></script>
    <script src='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js'></script> 
    <script src='/assets/js/lib.js'></script> 
    @yield('end_body_scripts_top')
    <script src='/assets/js/vendor/berry.full.js'></script> 
    <script src='https://rawgit.com/Cloverstone/Berry/master/bin/bootstrap.full.berry.js'></script> 
    <script src='/assets/js/vendor/berrytables.full.js'></script> 
    @yield('end_body_scripts_bottom')
    @yield('bottom_page_styles')
  </body>
</html>
