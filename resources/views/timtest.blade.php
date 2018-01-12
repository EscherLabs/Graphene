<?php

// // Build $data object
// $links = $links->toArray();
// foreach($links as $index => $link) {
//     $links[$index]['group_id'] = $link['id'];
//     $links[$index]['group_slug'] = $link['slug'];    
// }
// $data = [
//     'site' => config('app.site'),
//     'topbar_enabled' => Request::get('topbar') !== 'false',
//     'sidemenu_enabled' => Request::get('sidemenu') !== 'false',
//     'logged_in' => Auth::check(),
//     'user' => Auth::user(),
//     'user_md5_email' => (null !== Auth::user())?md5(Auth::user()->email):'',
//     'is_admin' => (null !== Auth::user())?Auth::user()->can('visit_admin','App\User'):false,
//     'url' => [
//         'root' => url('/'),
//         'logout' => url('/logout'),
//         'admin' => url ('/admin/groups'),
//         'login' => url ('/login'),
//     ],
//     'apps' => $apps->toArray(),
//     'links' => $links,
// ];

// $data['app_mode'] = $data['dashboard_mode'] = false;
// if (isset($uapp)) {
//     $data['app'] = $uapp->toArray();
//     $data['app']['app']['code_json'] = json_encode($data['app']['app']['code']);
//     $data['data_json'] = json_encode($data2);
//     $data['app_mode'] = true;
// } 

// $data['dashboard_mode'] = true; 
// $data['slug'] = $slug; 
// $data['name'] = $name;
// $data['config_json'] = json_encode($config);
// $data['apps_json'] = json_encode($apps);
// if(isset($id)) {
//     $data['id'] = $id;
// }
    
// // dd($data);
// // Render Template
// $m = new Mustache_Engine([
//     'loader' => new Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/renderers'),
//     'partials_loader' => new Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials'),
// ]);
// $tpl = $m->loadTemplate('app');
// echo $tpl->render($data);