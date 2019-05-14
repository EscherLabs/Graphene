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
            'admin' => url ('/admin'),
            'login' => url ('/login'),
        ];
    }

    private function get_site_templates() {
        // dd((array)Auth::user()->site->templates->main);
    }

    public function render($data) {
        $this->get_site_templates();
        $this->set_defaults($data);

        /* Build / Cleanup "mygroups" object */
        $content_types = ['pages','app_instances'];
        foreach($data['mygroups'] as $index => $mygroup) {
            $has_content = false;
            foreach($content_types as $content_type) {
                foreach($mygroup[$content_type] as $ctype_index => $page) {
                    $data['mygroups'][$index][$content_type][$ctype_index]['slug'] = strtolower($data['mygroups'][$index][$content_type][$ctype_index]['slug']);
                    if (Auth::user()!==null && !Auth::user()->can('get', $page)) {
                        $data['mygroups'][$index][$content_type]->forget($ctype_index);
                    }
                    // Something about the model/mustache engine makes this blow up -- actively unsetting groups
                    if (isset($data['mygroups'][$index][$content_type][$ctype_index])) {
                        unset($data['mygroups'][$index][$content_type][$ctype_index]['groups']);
                    }
                    $has_content = true;
                }
            }
            $data['mygroups'][$index]->hascontent = $has_content;
            /* !!NOTE!! Keeping this in for backwards compatibility */
            $data['mygroups'][$index]->has_apps_or_pages = $has_content;
            $data['mygroups'][$index]->group_id = $mygroup->id;
            $data['mygroups'][$index]->group_slug = strtolower($mygroup->slug);
            $data['mygroups'][$index]->slug = strtolower($mygroup->slug);
            $data['mygroups'][$index]->pages = array_values($mygroup->pages->toArray());
            $data['mygroups'][$index]->app_instances = array_values($mygroup->app_instances->toArray());
        }

        /* Build current "group" object */
        if (isset($data['group'])) {            
            $data['group'] = $data['group']->toArray();
            $data['group']['content'] = $data['mygroups']->where('id','=',$data['group']['id'])->first()->toArray();
            /* !!NOTE!! Keeping this in for backwards compatibility */
            $data['group']['apps_pages'] = $data['group']['content'];
            if(isset($data['user']) && isset($data['user']['content_admin_groups']) && isset($data['user']['apps_admin_groups'])){
                $data['group']['admin'] = in_array($data['group']['id'], $data['user']['content_admin_groups']) || in_array($data['group']['id'], $data['user']['apps_admin_groups']);   
            }
        }

        $data['mygroups'] = $data['mygroups']->toArray();

        // TJC -- 2/10/18 -- Should make slice size configurable at the site level
        $slice_size = 5;
        $data['mygroups'] = [array_slice($data['mygroups'],0,$slice_size),array_slice($data['mygroups'],$slice_size)];
        /* !!NOTE!! Keeping this in for backwards compatibility */
        $data['apps_pages'] = $data['mygroups'];

        /* Build "data" object */
        if (!isset($data['data'])) {
            $data['data'] = '';
        }else{
            $data['data'] = json_encode($data['data']);
        }

        /* Build "apps" object */
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

        /* Build "user" object */
        $data['user'] = Auth::user();

        /* Setup Templates */
        $site_templates = config('app.site')->select('templates')->first()->templates;

        $loader = new \Mustache_Loader_CascadingLoader(array(
            new \Mustache_Loader_ArrayLoader((array)$site_templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ));
        $partials_loader = new \Mustache_Loader_CascadingLoader(array(
            new \Mustache_Loader_ArrayLoader((array)$site_templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ));

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