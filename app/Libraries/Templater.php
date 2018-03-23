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
            $data['group']['apps_pages'] = $data['apps_pages']->where('id','=',$data['group']['id'])->first();
            if(!is_null($data['group']['apps_pages'])){
              $data['group']['apps_pages'] = $data['group']['apps_pages']->toArray();   
            }else{
              $data['group']['apps_pages'] =[];
            }
            
            $data['group']['apps_pages']['group_id'] = $data['group']['id'];
            $data['group']['apps_pages']['group_slug'] = $data['group']['slug'];
            if(isset($data['user']) && isset($data['user']['admin_groups'])){
                $data['group']['admin'] = in_array ($data['group']['id'], $data['user']['admin_groups']);   
            }
        }

        $data['apps_pages'] = $data['apps_pages']->toArray();

        foreach($data['apps_pages'] as $index => $link) {
            $data['apps_pages'][$index]['group_id'] = $link['id'];
            $data['apps_pages'][$index]['group_slug'] = $link['slug'];    
        }

        // TJC -- 2/10/18 -- Should make slide size configurable at the site level
        $slice_size = 5;
        $data['apps_pages'] = [array_slice($data['apps_pages'],0,$slice_size),array_slice($data['apps_pages'],$slice_size)];

        if (!isset($data['data'])) {
            $data['data'] = '';
        }else{
            $data['data'] = json_encode($data['data']);
        }

        if (isset($data['apps']) && is_array($data['apps'])) {
            $data['apps'] = $data['apps']->toArray();
        }

        if (isset($data['uapp'])) {
            $data['apps'] = [$data['uapp']];
            $data['app'] = $data['uapp']->toArray();
            $data['app']['app']['code_json'] = json_encode($data['app']['app']['code']);
            $data['app_mode'] = true;
            if(isset($data['user']) && isset($data['user']->developer_apps)){
                $data['app']['developer'] = in_array ($data['app']['app_id'], $data['user']->developer_apps);   
            }

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