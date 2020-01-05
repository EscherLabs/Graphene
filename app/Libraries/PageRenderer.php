<?php 

namespace App\Libraries;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use App\Group;

class PageRenderer {

    private function set_defaults(&$data) {
        $data['site'] = config('app.site');
        $data['cache_bust_id'] = config('app.cache_bust_id');
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

    private function build_response($data) {
        $site_templates = config('app.site')->select('templates')->first()->templates;
        $loader = new \Mustache_Loader_CascadingLoader([
            new \Mustache_Loader_ArrayLoader((array)$site_templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ]);
        $partials_loader = new \Mustache_Loader_CascadingLoader([
            new \Mustache_Loader_ArrayLoader((array)$site_templates->partials),
            new \Mustache_Loader_FilesystemLoader(base_path().'/resources/views/mustache/partials')
        ]);
        $m = new \Mustache_Engine([
            'loader' => $loader,
            'partials_loader' => $partials_loader,
            'cache' => storage_path('cache/mustache'),
        ]);
        if (!isset($data['template'])) {
            $data['template'] = 'main';
        }   
        $tpl = $m->loadTemplate($data['template']);
        return response($tpl->render($data))
            ->header('Content-Type', 'text/html')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Expires', '0')
            ->header('Pragma', 'no-cache');
    }

    private function build_menu($current_group = null) {
        if (Auth::check()) { /* User is Authenticated */
            $groups_content = Group::MenuData()->where('unlisted','=',0)->orderBy('order')->get();
        } else {
            $groups_content = Group::publicMenuData()->where('unlisted','=',0)->orderBy('order')->get();
        }
        $all_group_content = $current_group_content = null;
        $content_types = [
            'pages'=>['slug'=>'page'],
            'app_instances'=>['slug'=>'app'],
            'workflow_instances'=>['slug'=>'workflow'],
            'links'=>['slug'=>'link']
        ];
        foreach($groups_content as $groups_index => $group) {
            $mygroup = $group->only('id','name','slug');
            $mygroup['url'] = url('/page/'.$group->slug);
            $mygroup['hascontent'] = false;
            foreach($content_types as $content_type => $content_type_metadata) {
                foreach($group[$content_type] as $ctype_index => $content) {
                    if ($content->public || (Auth::check() && Auth::user()->can('get', $content))) {
                        if (in_array($content_type,['pages','app_instances','workflow_instances'])) {
                            $mycontent = $content->only('id','name','icon','slug','groups','composite_limit');
                            $mycontent['type'] = $content_type_metadata['slug'];
                            $mycontent['url'] = url('/'.$content_type_metadata['slug'].'/'.$group->slug.'/'.$content->slug);
                            $mycontent['visibility'] = $content->only('hidden_xs','hidden_sm','hidden_md','hidden_lg');
                        } else if ($content_type === 'links') {
                            $mycontent = $content->only('id','title','link','icon');
                            $mycontent['url'] = url('/link/'.$mycontent['id']);
                            $mycontent['name'] = $mycontent['title'];
                        } 
                        $mygroup['content'][] = $mycontent;
                        $mygroup['hascontent'] = true;
                    }
                }
            }
            $all_group_content[] = $mygroup;
            if (!is_null($current_group) && $current_group->id == $group->id && isset($mygroup['content'])) {
                $current_group_content = $mygroup['content'];
            }
        }
        return ['groups'=>$all_group_content,'menu'=>$current_group_content];
    }

    public function render($data) {
        $group = isset($data['group'])?$data['group']:null;
        $menu_data = $this->build_menu($group);

        // Build Data Object
        $render_data = [];
        $this->set_defaults($render_data);
        $slice_size = 5;
        $render_data['mygroups'] = [
            array_slice($menu_data['groups'],0,$slice_size),
            array_slice($menu_data['groups'],$slice_size)
        ];
        if (isset($data['menu'])) {
            $render_data['menu'] = $data['menu'];
        } else {
            $render_data['menu'] = $menu_data['menu'];
        }
        $render_data['scripts'] = isset($data['scripts'])?$data['scripts']:[];
        $render_data['styles'] = isset($data['styles'])?$data['styles']:[];
        $render_data['id'] = isset($data['id'])?$data['id']:0;
        $render_data['resource'] = isset($data['resource'])?$data['resource']:'app';
        $render_data['name'] = isset($data['name'])?$data['name']:null;
        $render_data['group'] = !is_null($group)?$group->toArray():['id'=>0];
        if (isset($data['data'])) {
            $render_data['data'] = json_encode($data['data']);
        }else{
            $render_data['data'] = json_encode([]);
        }
        if (isset($data['apps'])) {
            $render_data['apps'] = $data['apps']->toArray();
        } else if (isset($data['uapp'])) {
            $render_data['apps'] = [$data['uapp']];
            $render_data['app'] = $data['uapp']->toArray();
            $render_data['app']['app']['code_json'] = json_encode($render_data['app']['app']['code']);
            $render_data['app_mode'] = true;
            if(isset($data['user']) && isset($data['user']->developer_apps)){
                $render_data['app']['developer'] = in_array ($data['app']['app_id'], $data['user']->developer_apps);   
            }
        } else {
            $render_data['apps'] = [];
        }
        $render_data['apps_json'] = json_encode($render_data['apps']);
        $render_data['config_json'] = json_encode($data['config']);

        /* Determine is Authenticated User Is Group Admin */
        if(isset($render_data['user']) && isset($render_data['user']['content_admin_groups']) && isset($render_data['user']['apps_admin_groups'])){
            $render_data['group']['admin'] = in_array($render_data['group']['id'], $render_data['user']['content_admin_groups']) || in_array($render_data['group']['id'], $render_data['user']['apps_admin_groups']);   
        }
        
        return $this->build_response($render_data);
    }
}