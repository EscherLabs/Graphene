<?php

$m = new Mustache_Engine([
    'loader' => new Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/renderers'),
    'partials_loader' => new Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials'),
]);

$data = [
    'site' => config('app.site'),
    'topbar_enabled' => Request::get('topbar') !== 'false',
    'sidemenu_enabled' => Request::get('sidemenu') !== 'false',
    'logged_in' => Auth::check(),
    'user' => Auth::user(),
    'user_md5_email' => md5(Auth::user()->email),
    'is_admin' => Auth::user()->can('visit_admin'),
    'url' => [
        'root' => url('/'),
        'logout' => url('/logout'),
        'admin' => url ('/admin/groups'),
        'login' => url ('/login'),
    ],
    'apps' => $apps,
    'links' => $links->toArray(),
];
// dd($links[0]->app_instances);
// dd($links);
$tpl = $m->loadTemplate('app');
echo $tpl->render($data);