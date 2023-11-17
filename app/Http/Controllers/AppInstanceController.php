<?php

namespace App\Http\Controllers;

use App\AppInstance;
use App\App;
use App\AppVersion;
use App\Endpoint;
use App\Group;
use App\UserPreference;
use App\User;
use App\Page;
use App\ResourceCache;
use App\UserOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
// use App\Libraries\Templater;
use App\Libraries\PageRenderer;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AppInstanceController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('run','fetch', 'get_data');

        $this->customAuth = new CustomAuth();
    }

    public function list_all_app_instances(Request $request) {
        if (Auth::user()->site_admin) {
            $app_instances = AppInstance::with(array('app','group'=>function($q){
                $q->with('endpoints');
            }))
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id);
                })->orderBy('group_id','desc')->orderBy('order','desc');
        } else {
            $app_instances = AppInstance::with(array('app','group'=>function($q){
                $q->with('endpoints');
            }))
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->apps_admin_groups);
                })->orderBy('group_id','desc')->orderBy('order','desc');
            }
        if($request->has('app_id')){
            $app_instances->where('app_id','=',$request->get('app_id'));
        }
        return $app_instances->get();
    }

    public function admin(AppInstance $app_instance) {
        $app_instance->load(array('group'=>function($query){
            $query->with(array('composites'=>function($query){
                $query->with('group')->get();
            }));
        }));

        return view('admin', ['resource'=>'app_instance','id'=>$app_instance->id, 'group'=>$app_instance->group]);
    }

    public function show(AppInstance $app_instance) {

        $myApp = AppInstance::with('app')->with('group')->where('id', '=', $app_instance->id)->first();

        $myApp->findVersion();
        return $myApp;
    }
	public function pages(AppInstance $app_instance)
	{
        $pages = Page::with('group')->where('group_id', '=',  $app_instance->group_id)->get();
		$page_list = [];
		foreach($pages as $page){
            $sections = $page->content;
            if(isset($sections)){
                foreach($sections->sections as $section){
                    foreach($section as $widget){
                        if($widget->widgetType === 'uApp'){
                            if(isset($widget->app_id) && $widget->app_id == $app_instance->id){
                                unset($page->content);
                                $page_list[] = $page;
                                break 2;
                            }
                        }
                    }
                }
            }
		}
		return $page_list;
	}

    public function create(Request $request) {
        $this->validate($request,[
            'name'=>['required'],
            "group_id"=>["required"],
            'slug'=>["required",
                Rule::unique('app_instances', 'slug')->where(function ($query) use($request) {
                    return $query->where('group_id', $request->get('group_id'));
                })
            ]
        ]);
        if(new AppInstance($request->all()))
        $app_instance = new AppInstance($request->all());

        // Default New App Instances to NULL (latest working or published)
        $app_instance->app_version_id = null;
        $app_instance->app_id = $request->get('app_id');
        $app_instance->group_id = $request->get('group_id');

        if(isset($request['groups'])){
            $app_instance['groups'] = array_filter($request['groups']);
        }

        $app_instance->save();
        return $app_instance;
    }

    public function update(Request $request, AppInstance $app_instance) {
        if($request->has('slug')){
            $this->validate($request,[
                // 'name'=>['required'],
                'slug'=>[
                    Rule::unique('app_instances', 'slug')->where(function ($query) use($app_instance) {
                        return $query->where('group_id', $app_instance->group_id);
                    })->ignore($app_instance)
                ]
            ]);
        }
        $data = $request->all();
        if(isset($data['groups'])){
            $data['groups'] = array_filter($data['groups']);
        }

        $app_instance->update($data);
        return AppInstance::where('id', '=',$app_instance->id)->first();
    }
    // public function version(Request $request, AppInstance $app_instance) {
    //     $this->validate($request,[
    //         'version'=>['required']
    //     ]);

    //     $app_instance->app_version_id = $request->get('version');
    //     $app_instance->save();
    //     return AppInstance::where('id', '=',$app_instance->id)->first();
    // }

    public function destroy(AppInstance $app_instance){
        if ($app_instance->delete()) {
            return 1;
        }
    }

    public function save_user_options(Request $request, AppInstance $app_instance)
    {
        // if (Auth::check()) {
        //     $this->authorize('modify_user_options', $app_instance);
            return $app_instance->set_user_options(Auth::user(),$request->get('options'));
        // } else {
        //     session(['ai_'.$app_instance->id =>(object)$request->get('options')]);
        //     $user_option = new UserOption(['app_instance_id'=>$app_instance->id,'options'=>$request->get('options')]);
        //     return $user_option;
        // }
    }
    public function run(Request $request, $group, $slug = null) {
        return $this->render($request, "main", $group, $slug);
    }

    public function render(Request $request, $template, $group, $slug) {
        if(!is_numeric($group)) {
            $groupObj = Group::with('composites')->where('slug','=',$group)->first();
			$group = $groupObj->id;
		}else{
    		$groupObj = Group::with('composites')->where('id','=',$group)->first();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myApp = AppInstance::with('app')->with(['user_options'=>function($query){
                $query->where('user_id','=', Auth::user()->id);
            }])->where('group_id','=', $group)->where('slug', '=', $slug)->with('app')->first();

            if (is_null($myApp)) { 
                abort(404); 
            }
            
            if($myApp->public == 0) {
                $this->authorize('fetch' ,$myApp);
            }
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myApp = AppInstance::with('app')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
            if (is_null($myApp)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
        }

        $myApp->findVersion();
        $scripts = [];
        $styles = [];

        if($myApp->app->code && isset($myApp->app->code->resources) ) {
            foreach($myApp->app->code->resources as $resource) {
                if($resource->modifier == "script"){
                    $scripts[] = array("src"=>$resource->path,"name"=>$resource->name);
                }else if($resource->modifier == "css"){
                    $styles[] =  array("src"=>$resource->path,"name"=>$resource->name);
                }
            }
        }

        if(!empty($myApp->options) && !empty($myApp->options->template)){
            $template =$myApp->options->template;
        }
        if($myApp != null) {
            $renderer = new PageRenderer();
            return $renderer->render([
                'group'=>$groupObj,
                'config'=>[
                    "sections"=>[[[
                        "title"=>$myApp->name,
                        "app_id"=>$myApp->id,
                        "widgetType"=>"uApp",
                        "container"=>true
                    ]]],
                    "layout"=>4,
                ],
                'uapp'=>$myApp,
                'scripts'=>$scripts,
                'template'=>$template,
                'styles'=>$styles,
                'id'=>$myApp->id,
                'resource'=>'app',
                'name'=>$myApp->name,
            ]);
        }
        abort(404,'App not found');
    }

    public function fetch(Request $request, $ai_id) {
    //    session_write_close();
       if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myApp = AppInstance::with(['user_options'=>function($query){
                $query->where('user_id','=',Auth::user()->id);
            }])->where('id', '=', $ai_id)->first();
            $this->authorize('fetch' ,$myApp);
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myApp = AppInstance::where('id', '=', $ai_id)->first();
            if ($request->has('options')) {
                $myApp->user_options->options = $request->options;
            }
            // if (session()->has('ai_'.$ai_id)) {
            //     $myApp->user_options->options = session('ai_'.$ai_id);
            // }
            if (is_null($myApp)) { abort(403); }
        }

        $myApp->findVersion();

        if($myApp != null){
            $data = [
                'user'=>$current_user,
                'options'=>$myApp->options
            ];
            if(!is_null($myApp->user_options)) {
                $data['user']->options = $myApp->user_options->options;
                if(is_null($data['user']->options)){
                    $data['user']->options = is_null($myApp->user_options_default)?[]:$myApp->user_options_default;
                }
            }else{
                $data['user']->options = is_null($myApp->user_options_default)?[]:$myApp->user_options_default;
            }

            if($myApp->app->code && isset($myApp->app->code->resources) ){
                foreach($myApp->app->code->resources as $source){
                    if ($source->fetch === 'true' || $source->fetch === true) {
                        $response = $this->get_data_int($request, $myApp, $source->name);
                        $data[$source->name] = $response['content'];
                    }
                }
            }

            return $data;
        }
        abort(404,'App not found');
    }

    private function http_endpoint(Endpoint $endpoint, $resource_info, $verb, $all_data, $app_instance_id) {
        // Derive and Map URL with Mustache
        $m = new \Mustache_Engine;
        $url = $m->render($endpoint->config->url . $resource_info->path, $all_data);

        if ($resource_info->cache === true || $resource_info->cache === 'true') {
            $cache = ResourceCache::where('app_instance_id', '=', $app_instance_id)
                    ->where('url','=',$url)
                    ->where('created_at','>=',Carbon::now()->subMinutes(10)->toDateTimeString())
                    ->first();
            if (!is_null($cache)) {
                $response = unserialize($cache->content);
            }
        }
        if (!isset($response)) {
            // Disconnect from the database while we wait for the endpoint response.
            // If we need to cache the data, we will reconnect automatically at that time.
            // This is to avoid having too many simulataenous connections to the database,
            // especially when an endpoint is responding very slowly.
            DB::connection()->disconnect(); 
            $httpHelper = new HTTPHelper();
            $http_config = [
              'url'  => $url,
              'verb' => $verb,
              'data' => $all_data['request'],
            ];
            
            if (isset($endpoint->config->content_type) && $endpoint->config->content_type !== '') {
              $http_config['content_type'] = $endpoint->config->content_type;
            }
            if (isset($endpoint->config->timeout) && $endpoint->config->timeout !== '') {
                $http_config['timeout'] = $endpoint->config->timeout;
            }
            if (isset($endpoint->config->headers) && is_array($endpoint->config->headers)) {
                $http_config['headers'] = $endpoint->config->headers;
            }

            if ($endpoint->type == 'http_basic_auth') {
              $http_config['username'] =$endpoint->config->username;
              $http_config['password'] =$endpoint->getSecret();
              
            } else if ($endpoint->type !== 'http_no_auth') {
                abort(505,'Authentication Type Not Supported');
            }

            $response = $httpHelper->http_fetch($http_config);


            if ($resource_info->cache === true || $resource_info->cache === 'true') {
                // TJC -- Laravel has a "non-bug" which prevents updateOrCreate from working 
                // correctly in the event of a race condition.  See details:
                // https://github.com/laravel/framework/issues/19372
                // Wrapping this in try/catch, as I don't really care if the insert
                // fails.
                try {
                    $cache = ResourceCache::updateOrCreate([
                        'app_instance_id' => $app_instance_id,
                        'url' => $url,
                    ],[
                        'content' => serialize($response),
                        'created_at' => Carbon::now(),
                    ]);
                } catch (\Throwable $e) {
                    // Move along
                }
                // Delete Other Stale Cache
                ResourceCache::where('created_at','<',Carbon::now()->subMinutes(10)->toDateTimeString())->delete();
            }
        }
        // Convert Data based on Modifier
        if ($resource_info->modifier == 'csv') {
            $response['content'] = array_map("str_getcsv", explode("\n", $response['content']));
        } else if ($resource_info->modifier == 'xml') {
            // UTF-8 Encode Data to prevent any errors during XML Parsing
            try {
                $xml_data = simplexml_load_string($response['content'],'SimpleXMLElement',LIBXML_NOCDATA);
            } catch (\Throwable $e) {
                $xml_data = simplexml_load_string(utf8_encode($response['content']),'SimpleXMLElement',LIBXML_NOCDATA);
            }
            $response['content'] = json_decode(json_encode($xml_data),true);
        } else {
            try{
                if(is_string($response['content'])){
                    $try_decode = json_decode($response['content']);
                    if($try_decode){
                        $response['content'] = $try_decode;
                    }
                }
            }catch(\Throwable $e){}
        }
        return $response;
    }

    public function get_data_int(Request $request, AppInstance $app_instance, $endpoint_name) {
        // session_write_close(); // Don't keep waiting
        if(!isset($app_instance->app->code)){
            $app_instance->findVersion();
        }

        if (!$app_instance->public) {
            $this->authorize('get_data', $app_instance);
        }
        $options = $app_instance->options;
        $user_options_default = $app_instance->user_options_default;
        $resources = $app_instance->resources;

        $verb = 'GET'; // Default Verb
        if ($request->has('verb')) {
            $verb = $request->input('verb');
        }

        if ($request->has('request') && !is_array($request->input('request'))) {
            abort(505,'request must be an array');
        }
        if(!count($resources)){
            return [];
        }
        // Lookup Resource by Name
        $endpoint_found = false;
        foreach($resources as $resource_endpoint) {
            if ($endpoint_name == $resource_endpoint->name) {
                $endpoint_found = true; break;
            }
        }
        if (!$endpoint_found) {
            abort(404, 'Endpoint Not Found');
        }

        if ($resource_endpoint->endpoint === 'none') {
            $endpoint = new Endpoint(['config'=>['url'=>''],'type'=>'http_no_auth']);
        } else {
            // Lookup Endpoint
            $endpoint = Endpoint::find((int)$resource_endpoint->endpoint);
        }


        // Merge App Options with User Preferences, User Info, and `request` data
        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $user_prefs = $app_instance->user_options()->where('user_id','=',$current_user->id)->first();
        } else { /* User is not Authenticated */
            $current_user = new User;
            if ($request->has('options')) {
                $user_prefs = ['options'=>$request->options];
            }
            // if (session()->has('ai_'.$app_instance->id)) {
            //     $user_prefs = ['options'=>session('ai_'.$app_instance->id)];
            // }
        }
        $all_data = ['options'=>$options,
                     'user'=>$current_user->toArray(),
                     'request'=>$request->has('request')?$request->input('request'):[],
                     'app'=>array('instance_id'=>$app_instance->id)
                    ];

        if(isset($user_prefs) && isset($user_prefs['options'])){
            $all_data['user']['options'] = $user_prefs['options'];
        }else{
            $all_data['user']['options'] = $user_options_default;
        }

        $resource_found = false;
        if($app_instance->app->code && isset($app_instance->app->code->resources) ){
            foreach($app_instance->app->code->resources as $resource_app) {
                if ($endpoint_name == $resource_app->name) {
                    $resource_found = true; break;
                }
            }
        }
        if (!$resource_found) {
            abort(505,'Resource Not Found');
        }
        $resource_app->endpoint = $resource_endpoint->endpoint;

        if ($endpoint->type == 'http_no_auth' || $endpoint->type == 'http_basic_auth') {
            $response = $this->http_endpoint($endpoint, $resource_app, $verb, $all_data, $app_instance->id);
        }
        return $response;
    }

    public function get_data(Request $request, AppInstance $app_instance, $endpoint_name) {
        $data = self::get_data_int($request, $app_instance, $endpoint_name);
        if (is_array($data['content']) || is_object($data['content'])) {
            $content_type = 'application/json';
            $data['content'] = json_encode($data['content']);
        } else if (is_bool($data['content']) || is_numeric($data['content'])) {
            $content_type = 'application/json';
            $data['content'] = (string)$data['content'];
        } else {
            $content_type = 'text/plain';
        }
        return response($data['content'], $data['code'])
            ->header('Content-Type', $content_type)
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Expires', '0')
            ->header('Pragma', 'no-cache');
    }
}
