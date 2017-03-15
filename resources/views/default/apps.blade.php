<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="/assets/favicon.png">
    <title>{{ config('app.site')->name }}</title>
    @if(!empty(config('app.site')->theme->icon))
      <link rel="icon" type="image/png" href="/assets/icons/fontawesome/gray/32/{{ config('app.site')->theme->icon }}.png" />
    @endif    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/jquery-nivoslider/3.2/nivo-slider.min.css" rel="stylesheet">
    

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<link href="../../assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">-->
    <!-- Custom styles for this template -->
    <link href="/assets/css/dashboard.css" rel="stylesheet">
    @if(!empty(config('app.site')->theme->css))<style> {!! config('app.site')->theme->css !!}</style>@endif
    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <!--<script src="../../assets/js/ie-emulation-modes-warning.js"></script>-->
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body class="
  @if( Request::get('topbar') !== 'false' )
  topbar
  @endif  
  @if( Request::get('sidemenu') !== 'false' )
  sidemenu
  @endif
">
    @if( Request::get('topbar') !== 'false' )
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
            <li><a href="#"><h4 style="margin:0">{{ $name}}</h4></a></li>
          </ul>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li class="dropdown">
              @if(Auth::check())
              <a href="#" class="dropdown-toggle user-info" data-toggle="dropdown" role="button">
                <img class="gravatar" src="https://www.gravatar.com/avatar/{{ md5(Auth::user()->email) }}?d=mm" /> 
                {{ Auth::user()->first_name }} {{ Auth::user()->last_name }} 
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a href="{{ url('/') }}"><i class="fa fa-dashboard"></i> Dashboard</a></li>
                @can('visit_admin', 'App\User')
                  <li><a href="{{ url('/admin/groups') }}"><i class="fa fa-gear"></i> Admin</a></li>
                @endcan  
                <li><a href="{{ url('/logout') }}"><i class="fa fa-times-circle"></i> Logout</a></li>
              </ul>
              @else
              <a href="#" class="dropdown-toggle user-info" data-toggle="dropdown" role="button">
                <img class="gravatar" src="https://www.gravatar.com/avatar/?d=mm&f=y" /> Guest 
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu">
                <li><a href="{{ url('/login') }}"><i class="fa fa-sign-in fa-fw"></i> Login</a></li>
              </ul>
              @endif
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right visible-xs-block">
            <!--<li><a href="/"><i class="fa fa-dashboard"></i> Dashboard</a></li>-->
            @foreach ($apps as $app)
              <li><a href="/app/{{ $app->slug }}"><i class="fa fa-{{ (!is_null($app->icon)&&$app->icon!='')?$app->icon:'cube'}} fa-fw"></i>&nbsp; {{ $app->name }}</a></li>
            @endforeach
          </ul>
          <!--form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form-->
          @yield('titlebar')
        </div>
      </div>
    </nav>
    @endif
    @if( Request::get('sidemenu') !== 'false' )
    <div class="col-sm-3 col-md-2 sidebar">
      <ul class="nav nav-sidebar">
        @if(isset($links))
        @foreach ($links as $app)
          <li><a data-toggle="collapse" href="#collapse{{ $app->id }}">{{ $app->name }}</a></li>
          <ul class="collapse"  id="collapse{{ $app->id }}">
          @foreach ($app->app_instances as $instance)
                    <li><a href="/app/{{ $app->slug }}/{{ $instance->slug }}{{ (Request::get('topbar') !== 'false') ? '' : '?topbar=false' }}"><i class="fa fa-{{ (!is_null($instance->icon)&&$instance->icon!='')?$instance->icon:'cube' }} fa-fw"></i>&nbsp; {{ $instance->name }}</a></li>
          @endforeach
          @foreach ($app->pages as $page)
                    <li><a href="/page/{{ $app->slug }}/{{ $page->slug }}{{ (Request::get('topbar') !== 'false') ? '' : '?topbar=false' }}"><i class="fa fa-{{ (!is_null($page->icon)&&$page->icon!='')?$page->icon:'cube' }} fa-fw"></i>&nbsp; {{ $page->name }}</a></li>
          @endforeach
          </ul>
        @endforeach
        @endif
      </ul>
    </div>
    @endif
    <div class="container-fluid" id="main-container">
      <div class="row">
        <div class="col-sm-12 main">
          @yield('content')
        </div>
      </div>

    </div>
    <!--<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2" id="footer">&copy; 2017 Escher Labs, Inc.</div>-->
    <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type='text/javascript' src='//twitter.github.com/hogan.js/builds/3.0.1/hogan-3.0.1.js'></script>
    <!--/*<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'></script>		*/-->
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<script src="../../assets/js/ie10-viewport-bug-workaround.js"></script>-->
    <script src='https://rawgit.com/Cloverstone/Berry/master/bin/full.berry.min.js'></script>
    <script src='https://rawgit.com/Cloverstone/Berry/master/bin/bootstrap.full.berry.js'></script> 
    <!--<script src='https://rawgit.com/Cloverstone/berryTables/master/bin/js/berryTables.min.js'></script> -->
    <script src='https://rawgit.com/Cloverstone/Cobler/master/bin/cobler.min.js'></script> 
    <script src='https://rawgit.com/Cloverstone/Cobler/master/bin/bootstrap.cobler.js'></script> 
    <script src="https://cdn.jsdelivr.net/lodash/4.17.4/lodash.min.js"></script>
    <script>_.findWith = _.find;</script>
    <script src='http://unpkg.com/ractive/ractive.min.js'></script>    
    <script src='//cdnjs.cloudflare.com/ajax/libs/lockr/0.8.4/lockr.min.js'></script>    
    <script src='//cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js'></script> 
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js" charset="utf-8"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-nivoslider/3.2/jquery.nivo.slider.min.js" charset="utf-8"></script>
    @yield('bottom_page_scripts')
    <!--<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js" charset="utf-8"></script>-->
    <!--<script type='text/javascript' src='//cdn.tinymce.com/4/tinymce.min.js'></script>-->
  </body>
</html>