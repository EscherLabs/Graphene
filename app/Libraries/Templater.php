<?php 

namespace App\Libraries;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class Templater {

    private function set_defaults(&$data) {
        $data['site'] = config('app.site');
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

        // Strip Out App Instances and Pages User Doesn't Have Permission to See
        foreach($data['apps_pages'] as $index => $group_apps_pages) {
            $data['apps_pages'][$index]['slug'] = strtolower($data['apps_pages'][$index]['slug']);
            foreach($group_apps_pages->pages as $page_index => $page) {
                // unset($data['apps_pages'][$index]->pages[$page_index]['groups']);
                $data['apps_pages'][$index]->pages[$page_index]['slug'] = strtolower($data['apps_pages'][$index]->pages[$page_index]['slug']);
                if (Auth::user()!==null && !Auth::user()->can('get', $page)) {
                    $data['apps_pages'][$index]->pages->forget($page_index);
                }
            }
            foreach($group_apps_pages->app_instances as $app_instance_index => $app_instance) {
                // unset($data['apps_pages'][$index]->app_instances[$app_instance_index]['groups']);
                $data['apps_pages'][$index]->app_instances[$app_instance_index]['slug'] = strtolower($data['apps_pages'][$index]->app_instances[$app_instance_index]['slug']);
                if (Auth::user()!==null && !Auth::user()->can('fetch', $app_instance)) {
                    $data['apps_pages'][$index]->app_instances->forget($app_instance_index);
                }
            }
        }

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
            $data['group']['apps_pages']['group_slug'] = strtolower($data['group']['slug']);
            if(isset($data['user']) && isset($data['user']['content_admin_groups']) && isset($data['user']['apps_admin_groups'])){
                $data['group']['admin'] = in_array($data['group']['id'], $data['user']['content_admin_groups']) || in_array($data['group']['id'], $data['user']['apps_admin_groups']);   
            }
        }

        $data['apps_pages'] = $data['apps_pages']->toArray();

        foreach($data['apps_pages'] as $index => $link) {
            $data['apps_pages'][$index]['group_id'] = $link['id'];
            $data['apps_pages'][$index]['group_slug'] = strtolower($link['slug']);
            if (count($link['app_instances'])>0 || count($link['pages'])>0) {
                $data['apps_pages'][$index]['has_apps_or_pages'] = true;
            }  
            $data['apps_pages'][$index]['pages'] = array_values($link['pages']);
            $data['apps_pages'][$index]['app_instances'] = array_values($link['app_instances']);
        }

        // TJC -- 2/10/18 -- Should make slice size configurable at the site level
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

        // if(!(Auth::user()->app_developer() || Auth::user()->site_developer)) {
        //     $data['apps_json'] = preg_replace('/(?:\s\s+)/', ' ', preg_replace('/(?:\\\n+|\\\t+)/', ' ', $data['apps_json']));            
        // }
        $site_templates = config('app.site')->select('templates')->first()->templates;

        $loader = new \Mustache_Loader_CascadingLoader(array(
            new \Mustache_Loader_ArrayLoader((array)$site_templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ));
        $partials_loader = new \Mustache_Loader_CascadingLoader(array(
            new \Mustache_Loader_ArrayLoader((array)$site_templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ));

        $data['user'] = Auth::user();
        // Render Template
        $m = new \Mustache_Engine([
            'loader' => $loader,
            'partials_loader' => $partials_loader,
            'cache' => storage_path('cache/mustache'),
        ]);
    if (!isset($data['template'])) {
        $data['template'] = 'main';
    }   
    $tpl = $m->loadTemplate($data['template']);
        return $tpl->render($data);
    }
}