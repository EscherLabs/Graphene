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

    private function get_site_templates() {
        // dd((array)Auth::user()->site->templates->main);
    }

    public function render($data) {
        $this->get_site_templates();
        $this->set_defaults($data);

        // Build $data object
        if (isset($data['group'])) {
            $data['group'] = $data['group']->toArray();
            $data['group']['links'] = $data['links']->where('id','=',$data['group']['id'])->first()->toArray();
            $data['group']['links']['group_id'] = $data['group']['id'];
            $data['group']['links']['group_slug'] = $data['group']['slug'];   
            $data['group']['admin'] = in_array ($data['group']['id'], $data['user']['admin_groups']);   
        }

        $data['links'] = $data['links']->toArray();

        foreach($data['links'] as $index => $link) {
            $data['links'][$index]['group_id'] = $link['id'];
            $data['links'][$index]['group_slug'] = $link['slug'];    
        }
        if (isset($data['apps']) && is_array($data['apps'])) {
            $data['apps'] = $data['apps']->toArray();
        }

        if (isset($data['uapp'])) {
            $data['apps'] = [$data['uapp']];
            $data['app'] = $data['uapp']->toArray();
            $data['app']['app']['code_json'] = json_encode($data['app']['app']['code']);
            $data['app_mode'] = true;
        } 

        $data['config_json'] = json_encode($data['config']);
        $data['apps_json'] = json_encode($data['apps']);
        
        // dd($data);
        $loader = new \Mustache_Loader_CascadingLoader(array(
            new \Mustache_Loader_ArrayLoader((array)config('app.site')->templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ));
        $partials_loader = new \Mustache_Loader_CascadingLoader(array(
            new \Mustache_Loader_ArrayLoader((array)config('app.site')->templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ));

        // Render Template
        $m = new \Mustache_Engine([
            'loader' => $loader,
            'partials_loader' => $partials_loader,
        ]);
        $tpl = $m->loadTemplate('main');
        return $tpl->render($data);
    }
}