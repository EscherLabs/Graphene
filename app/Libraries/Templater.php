<?php 

namespace App\Libraries;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class Templater {

    private function set_defaults(&$data) {
        $data['site'] = config('app.site');
        $data['topbar_enabled'] = Request::get('topbar') !== 'false';
        $data['sidemenu_enabled'] = Request::get('sidemenu') !== 'false';
        $data['logged_in'] = Auth::check();
        $data['user'] = Auth::user();
        $data['user_md5_email'] = (null !== Auth::user())?md5(Auth::user()->email):'';
        $data['is_admin'] = (null !== Auth::user())?Auth::user()->can('visit_admin','App\User'):false;
        $data['url'] = [
            'root' => url('/'),
            'logout' => url('/logout'),
            'admin' => url ('/admin/groups'),
            'login' => url ('/login'),
        ];
    }

    public function render($template,$data) {
        $this->set_defaults($data);
        // Build $data object
        $links = $data['links']->toArray();
        foreach($links as $index => $link) {
            $links[$index]['group_id'] = $link['id'];
            $links[$index]['group_slug'] = $link['slug'];    
        }
        $data['apps'] = $data['apps']->toArray();
        $data['links'] = $links;
        $data['app_mode'] = $data['dashboard_mode'] = false;

        if (isset($data['uapp'])) {
            $data['app'] = $data['uapp']->toArray();
            $data['app']['app']['code_json'] = json_encode($data['app']['app']['code']);
            $data['data_json'] = json_encode($data['data2']);
            $data['app_mode'] = true;
        } 

        $data['dashboard_mode'] = true; 
        $data['config_json'] = json_encode($data['config']);
        $data['apps_json'] = json_encode($data['apps']);
            
        // Render Template
        $m = new \Mustache_Engine([
            'loader' => new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/renderers'),
            'partials_loader' => new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials'),
        ]);
        $tpl = $m->loadTemplate('app');
        return $tpl->render($data);
    }
}