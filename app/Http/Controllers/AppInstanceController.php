<?php

namespace App\Http\Controllers;

use App\AppInstance;
use App\App;
use App\AppVersion;
use App\Endpoint;
use App\Group;
use App\UserPreference;
use App\User;
use App\ResourceCache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;

class AppInstanceController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except('run','fetch', 'get_data');
    }
    
    public function list_all_app_instances(Request $request) {
        if (Auth::user()->site_admin) {
            $app_instances = AppInstance::select('id','app_id','group_id','app_version_id','name','slug','icon','order','device','unlisted','public')
                ->with('app')
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id);
                })->orderBy('group_id','order')->get();
        } else {
            $app_instances = AppInstance::select('id','app_id','group_id','app_version_id','name','slug','icon','order','device','unlisted','public')
                ->with('app')
                ->whereHas('group', function($q){
                    $q->where('site_id','=',config('app.site')->id)->whereIn('id',Auth::user()->apps_admin_groups);
                })->orderBy('group_id','order')->get();
        }
        return $app_instances;
    }

    public function admin(AppInstance $app_instance) {
     return view('admin', ['resource'=>'app_instance','id'=>$app_instance->id]);
    }

    public function show(AppInstance $app_instance) {

        $myApp = AppInstance::with('app')->with('group')->where('id', '=', $app_instance->id)->first();

        $myApp->findVersion();
        return $myApp;
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app_instance = new AppInstance($request->all());
        $app_instance->app_version_id = AppVersion::where('app_id','=',$request->get('app_id'))->orderBy('id','desc')->pluck('id')->first();
        $app_instance->app_id = $request->get('app_id');
        $app_instance->group_id = $request->get('group_id');
        $app_instance->save();
        return $app_instance;
    }

    public function update(Request $request, AppInstance $app_instance) {
        $data = $request->all();
        if($request->app_version_id == -1){$data['app_version_id'] = null;}
        $app_instance->update($data);
        return AppInstance::with('app')->where('id', '=',$app_instance->id)->first();
    }

    public function destroy(AppInstance $app_instance){
        if ($app_instance->delete()) {
            return 1;
        }
    }

    public function save_user_options(AppInstance $app_instance, Request $request)
    {
        return $app_instance->set_user_options(Auth::user(),$request->get('options'));
    }

    public function run($group, $slug, Request $request) {
        if(!is_numeric($group)) {
            $groupObj = Group::where('slug','=',$group)->first();

            if (Auth::user()->site_admin || Auth::user()->group_admin($groupObj->id)) {
                $groupObj->load(array('composites'=>function($query){
                    $query->with(array('group'=>function($query){
                    $query->select('name','id');
                }))->select('group_id','composite_group_id');
                }));
            }else{
                $groupObj->load('composites');
            }            
            
			$group = $groupObj->id;
		}else{
            if (Auth::user()->site_admin || Auth::user()->group_admin($agroup)) {
                $groupObj = Group::with(array('composites'=>function($query){
                    $query->with(array('group'=>function($query){
                    $query->select('name','id');
                }))->select('group_id','composite_group_id');
                }))->where('id','=',$group)->first();
                $group = $groupObj->id;
            }else{
    			$groupObj = Group::with('composites')->where('id','=',$group)->first();
            }

        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myApp = AppInstance::with('app')->with(['user_options'=>function($query){
                $query->where('user_id','=', Auth::user()->id);
            }])->where('group_id','=', $group)->where('slug', '=', $slug)->with('app')->first();

            if($myApp->public == 0) {
                $this->authorize('fetch' ,$myApp);
            }
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;

            $myApp = AppInstance::with('app')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
            if (is_null($myApp)) { abort(403); }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }

        $myApp->findVersion();

        if($myApp != null) {
            $template = new Templater();
            return $template->render([
                'apps_pages'=>$links, 
                'name'=>$myApp->name,
                'slug'=>$myApp->slug,
                'id'=>$myApp->id,
                'uapp'=>$myApp, 
                'data'=>array(),
                'config'=>json_decode('{"sections":[[{"title":"'.$myApp->name.'","app_id":'.$myApp->id.',"widgetType":"uApp"}]],"layout":4}'),
                'group'=>$groupObj
            ]);

        }
        abort(404,'App not found');
    }
    
    public function fetch($ai_id, Request $request) {
       session_write_close();
       if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myApp = AppInstance::with(['user_options'=>function($query){
                $query->where('user_id','=',Auth::user()->id);
            }])->where('id', '=', $ai_id)->first();
            $this->authorize('fetch' ,$myApp);
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myApp = AppInstance::where('id', '=', $ai_id)->first();
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
            if($myApp->app->code){
                foreach($myApp->app->code->resources as $source){
                    if ($source->fetch === 'true' || $source->fetch === true) {
                        $data[$source->name] = $this->get_data($myApp, $source->name, $request);
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
                    ->whereRaw('created_at >= (NOW() - INTERVAL 10 MINUTE)')
                    ->first();
            if (!is_null($cache)) {
                $data = unserialize($cache->content);
            }
        }
        if (!isset($data)) {
            // Fetch Data based on Endpoint Type
            $httpHelper = new HTTPHelper();
            if ($endpoint->type == 'http_no_auth') {
                $data = $httpHelper->http_fetch($url,$verb,$all_data['request']);
            } else if ($endpoint->type == 'http_basic_auth') {
                $data = $httpHelper->http_fetch($url,$verb,$all_data['request'],
                        $endpoint->config->username, $endpoint->getSecret());
            } else {
                abort(505,'Authentication Type Not Supported');
            }
            if ($resource_info->cache === true || $resource_info->cache === 'true') {
                // Delete existing cache for that app_instance, as well as any other stale cache
                ResourceCache::where('app_instance_id', '=', $app_instance_id)->where('url','=',$url)->delete();
                ResourceCache::whereRaw('created_at < (NOW() - INTERVAL 10 MINUTE)')->delete();
                $cache = ResourceCache::create([
                    'app_instance_id' => $app_instance_id,
                    'url' => $url,
                    'content' => serialize($data),
                ]);
            }
        }
        // Convert Data based on Modifier
        if ($resource_info->modifier == 'csv') {
            $data = array_map("str_getcsv", explode("\n", $data));
        } else if ($resource_info->modifier == 'xml') {
            $data = json_decode(json_encode(simplexml_load_string($data, 'SimpleXMLElement', LIBXML_NOCDATA)),true);
        } else {
            
            try{
                if(is_string($data)){
                    $try_decode = json_decode($data);
                    if($try_decode){
                        $data = $try_decode;
                    }
                }
            }catch(Exception $e){}
        }

        return $data;
    }

    private function google_endpoint(Endpoint $endpoint, $resource_info, $verb, $all_data) {
        $googleClient = new \PulkitJalan\Google\Client(config('google'));
        $client = $googleClient->getClient();
        $client->setAccessToken($endpoint->getSecret());
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            $endpoint->config->secret = $client->getAccessToken();
            $endpoint->save();
        }
        $service = new \Google_Service_Sheets($client);
        $sheets = new \GoogleSheets\Sheets();
        $sheets->setService($service);
        if ($resource_info->path == '' ) {
            abort(505,'The path endpoint must specifiy a valid worksheet name');
        }
        $values = $sheets->spreadsheet($endpoint->config->sheet_id)->sheet($resource_info->path)->all();
        return $values;
    }

    public function get_data(AppInstance $app_instance, $endpoint_name, Request $request) {
        session_write_close(); // Don't keep waiting
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
            abort(505,'Endpoint Not Found');
        }

        // Lookup Endpoint
        $endpoint = Endpoint::find((int)$resource_endpoint->endpoint);
        
        // Merge App Options with User Preferences, User Info, and `request` data

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
        } else { /* User is not Authenticated */
            $current_user = new User;
        }

        $all_data = ['options'=>$options,
                     'user'=>$current_user->toArray(),
                     'request'=>$request->has('request')?$request->input('request'):[]];

        $user_prefs = $app_instance->user_options()->where('user_id','=',$current_user->id)->first();
        if(isset($user_prefs['options'])){
            $all_data['user']['options'] = $user_prefs['options'];
        }else{
            $all_data['user']['options'] = $user_options_default;
        }

        $resource_found = false;
        foreach($app_instance->app->code->resources as $resource_app) {
            if ($endpoint_name == $resource_app->name) {
                $resource_found = true; break;
            }
        }
        if (!$resource_found) {
            abort(505,'Resource Not Found');
        }
        $resource_app->endpoint = $resource_endpoint->endpoint;

        if ($endpoint->type == 'http_no_auth' || $endpoint->type == 'http_basic_auth') {
            $data = $this->http_endpoint($endpoint, $resource_app, $verb, $all_data, $app_instance->id);
        } else if ($endpoint->type == 'google_sheets') {
            $data = $this->google_endpoint($endpoint, $resource_app, $verb, $all_data);
        }
        return $data;
    }

}
