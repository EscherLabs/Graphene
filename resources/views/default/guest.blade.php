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
    @isset(config('app.site')->name)
      <title>{{ config('app.site')->name }}</title>
    @endisset
    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<link href="../../assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">-->
    <!-- Custom styles for this template -->
    <link href="/assets/css/graphene.css" rel="stylesheet">
    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <!--<script src="../../assets/js/ie-emulation-modes-warning.js"></script>-->
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body class="topbar @yield('body_classes')">
    @if( request()->input('topbar') !== 'false' )
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
          @isset(config('app.site')->name)
            {{ config('app.site')->name }}
          @endisset
          </a>
          <!--<ul class="nav navbar-nav navbar-right hidden-xs">
            <li><a href="#"><h4 style="margin:0">HELLO WORLD</h4></a></li>
          </ul>-->
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
                <li><a href="{{ url('/') }}"><i class="fa fa-sign-in fa-fw"></i> Login</a></li>
              </ul>
              @endif
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right visible-xs-block">
            <!--<li><a href="/"><i class="fa fa-dashboard"></i> Dashboard</a></li>-->
            HELLO WORLD
          </ul>
          <!--form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form-->
          @yield('titlebar')
        </div>
      </div>
    </nav>
    @endif
    <br>
    @yield('sidemenu')
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
    @yield('bottom_page_scripts')
    <!--<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js" charset="utf-8"></script>-->
  </body>
</html>
