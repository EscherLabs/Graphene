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

    <nav class="bg-slate-800 h-12 border-b border-neutral-100 fixed inset-0 bottom-auto shadow-lg text-sm z-10">
      <div class="mx-auto px-4 h-full">
        <div class="flex justify-between h-full">
          <div class="flex">
            <div class="shrink-0 flex items-center">
              <a href="/admin"><img style="height:25px;padding-left:1.5px" src="/assets/img/graphene_white.png"></a>
            </div>

            <div class="hidden space-x-2 items-center sm:flex">
              <span class="ml-4 text-gray-500">/</span>
              <a class="mx-2 text-gray-100 hover:text-brand-300 capitalize" target="" href="/admin/{{ $resource }}s">{{ $resource }}</a><svg xmlns="http://www.w3.org/500/svg" version="1.1" viewBox="0 0 24 26" fill="none" class="h-6 w-auto text-gray-500 hidden md:inline"><circle class="stroke-current stroke-2" transform="" cx="12" cy="12" r="4"></circle></svg>
              <a class="mx-2 text-gray-100 hover:text-brand-300" target="" href="/admin/{{ $resource }}/{{ $project['id'] }}">{{ $project['name'] }}</a>
              <svg xmlns="http://www.w3.org/500/svg" version="1.1" viewBox="0 0 24 26" fill="none" class="h-6 w-auto text-gray-500 hidden md:inline"><circle class="stroke-current stroke-2" transform="" cx="12" cy="12" r="4"></circle></svg>
              <a class="mx-2 h-6 text-gray-100 hover:text-brand-300" target="_blank" href="/{{ $resource }}/{{ $project['instances'][0]['slug'] }}/{{ $asset }}/{{ $id }}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-4 w-4 inline-block"><path fill-rule="evenodd" d="M15.75 2.25H21a.75.75 0 01.75.75v5.25a.75.75 0 01-1.5 0V4.81L8.03 17.03a.75.75 0 01-1.06-1.06L19.19 3.75h-3.44a.75.75 0 010-1.5zm-10.5 4.5a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V10.5a.75.75 0 011.5 0v8.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V8.25a3 3 0 013-3h8.25a.75.75 0 010 1.5H5.25z" clip-rule="evenodd"></path></svg></a>
            </div>
          </div>
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

  @if(isset($data))
  <script>
    document.initialData = {!! json_encode($data) !!};
  </script>
  @endif
    
  <script src="/assets/js/vendor/lodash.min.js"></script>
    
    <script src="/assets/js/vendor/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/vendor/gform_bootstrap.min.js"></script>
    <!-- <script type="text/javascript" src="/assets/js/vendor/GrapheneDataGrid.min.js"></script> -->
<script type="text/javascript" src="/assets/js/vendor/gform.tailwind.js"></script>
<script type="text/javascript" src="/assets/js/vendor/toastr.min.js"></script>

<script type="text/javascript" src="/assets/js/lib.js"></script>
    @yield('end_body_scripts_top')
 
    @yield('end_body_scripts_bottom')
    @yield('bottom_page_styles')
  </body>
</html>



