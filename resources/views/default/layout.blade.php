<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Adam Smallcomb, Tim Cortesi">
    <meta name="cachbust-id" content="{{ config('app.cache_bust_id') }}">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0" />
    
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Vary" content="*" />

@if(config('app.debug'))

  @if(config('app.env') === "local")
  <link rel="icon" href="/favicon_local.png"> 
  @else
  <link rel="icon" href="/favicon_debug.png"> 
  @endif
@else
<link rel="icon" href="/favicon.png"> 
@endif
    <title>{{ config('app.site')->name }}</title>

    <!-- <link href="/assets/css/admin.css" rel="stylesheet"> -->

    <link rel="stylesheet" href="/build/app.css">
    
    @yield('top_page_styles')
  </head>

  <body>
  <div class="min-h-screen bg-gray-100">


<nav class="fixed inset-0 h-12 px-4 bg-brand-800 bg border-b border-neutral-100 bottom-auto shadow-lg text-sm z-10">
  <div class="flex items-center h-full">

      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand flex items-center gap-4 text-lg  text-white" href="/"><img style="height:25px" src="/assets/img/graphene_logo_white.png"><i class="bu-b bu text-2xl "></i>{{ config('app.site')->name }}</a>

      <ul class="flex ml-auto gap-4">
        
        <li class="border-r border-slate-500  pr-4 relative">
            <span data-id="notification-count" class="rounded-full  hidden absolute -top-1 right-2 px-1 text-xs text-white z-10 bg-red-500"></span>   
            <a href="/workflows/assignments" role="button" class="pb-2" style="border-left:0;padding-bottom: 9px;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-slate-200">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <span class="sr-only">Notifications</span>
            </a>
        </li>


        <li class="">
          <a href="#" class="dropdown-toggle user-info" data-toggle="dropdown" role="button">
          <img alt="{{ Auth::user()->first_name }} {{ Auth::user()->last_name }}" class="rounded-sm h-8 w-8 border border-slate-200" src="https://www.gravatar.com/avatar/{{ md5(Auth::user()->email) }}?d=mm" />
                <p class="truncate hidden">{{ Auth::user()->first_name }} {{ Auth::user()->last_name }}
                  @if(!Auth::check())
                  Guest
                  @endif</p>
                <span class="caret"></span>
              </a>
          <ul class="hidden">
            @if(Auth::check())
                @can('visit_admin', 'App\User')
                  <li><a href="{{ url('/admin/groups') }}"><i class="fa fa-gear"></i> Admin</a></li>
                @endcan
              <li><a href="{{ url('/logout') }}"><i class="fa fa-times-circle"></i> Logout</a></li>
            @else
              <li><a href="{{ url.login }}"><i class="fa fa-sign-in fa-fw"></i> Login</a></li>
            @endif
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
    <main class="flex fixed inset-0 top-12">
    

    
      @yield('content')
    </main>
  </div>
    <div class="container-fluid" id="main-container">
      <div class="row">

        <div class="col-sm-12 admin-main">

        
            <div id="content"></div>
        </div>
      </div>
    </div>
    <script>

  @if(isset($data))
    document.initialData = {!! json_encode($data) !!};
  @endif
    </script>

    @yield('end_body_scripts_top')
    
    <script src="/assets/js/vendor/lodash.min.js"></script>
    
    <script src="/assets/js/vendor/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/vendor/gform_bootstrap.min.js"></script>
    <script type="text/javascript" src="/assets/js/vendor/GrapheneDataGrid.min.js"></script>
<script type="text/javascript" src="/assets/js/vendor/gform.tailwind.js"></script>
<script type="text/javascript" src="/assets/js/vendor/toastr.min.js"></script>

<script type="text/javascript" src="/assets/js/lib.js"></script>

    @yield('end_body_scripts_bottom')
    @yield('bottom_page_styles')
  </body>
</html>





