@extends('default.layout')

@section('content')

<div class="flex flex-col flex-grow"  id="app">
  
</div>
@endsection

@section('end_body_scripts_top')

@endsection

@section('end_body_scripts_bottom')
<!-- <script>$g.collections.add('composites',composites);</script> -->
@php
    $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
@endphp

<script type="module" src="/build/{{ $manifest['resources/assets/js/reports.js']['file'] }}"></script>

@if(false)
<link href="/build/{{ $manifest['resources/assets/js/reports.css']['file'] }}" rel="stylesheet" type="text/css">

<script type="module" >

import CreateGApp from "/build/{{ $manifest['resources/assets/js/app.js']['file'] }}";

import App from "/build/{{ $manifest['resources/assets/js/components/configBar.vue']['file'] }}";
CreateGApp(App);
</script>
@endif

<!-- <script type="text/javascript" src="/assets/js/vendor/gform_bootstrap.min.js"></script>
<script type="text/javascript" src="/assets/js/vendor/gform.tailwind.js"></script> -->
<script type="module" >

const app = Array.from(document.querySelectorAll('*')).find((e) => e.__vue_app__).__vue_app__
const version = app.version
const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
devtools.enabled = true
devtools.emit('app:init', app, version, {})

</script>
@endsection
