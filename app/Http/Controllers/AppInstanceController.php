<?php

namespace App\Http\Controllers;

use App\AppInstance;
use App\App;
use App\Endpoint;
use App\Group;
use App\UserPreference;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;

class AppInstanceController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except('run','fetch', 'get_data');
    }
    
    public function index() {
        $app_instances = AppInstance::with('app')
            ->whereHas('group', function($q){
                $q->whereIn('id',Auth::user()->admin_groups);
            })
            ->get();
        return $app_instances;
    }

    public function admin(AppInstance $app_instance) {
     return view('admin', ['resource'=>'app_instance','id'=>$app_instance->id]);
    }

    public function show(AppInstance $app_instance) {
        return AppInstance::with('app')->where('id', '=', $app_instance->id)->first();
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app_instance = new AppInstance($request->all());
        // Add App Version
        // $app_instance->app_version_id = $request->get('app_version_id');
        $app_instance->app_id = $request->get('app_id');
        $app_instance->group_id = $request->get('group_id');
        $app_instance->save();
        return $app_instance;
    }

    public function update(Request $request, AppInstance $app_instance) {
        $app_instance->update($request->all());
        return $app_instance;
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
			$group = $groupObj->id;
		}else{
			$groupObj = Group::where('id','=',$group)->first();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myApp = AppInstance::with('app')->with(['user_options'=>function($query){
                $query->where('user_id','=', Auth::user()->id);
            }])->where('group_id','=', $group)->where('slug', '=', $slug)->with('app')->first();
            $this->authorize('fetch' ,$myApp);
            // $current_user_apps = AppInstance::whereIn('group_id',Auth::user()->groups)->with('app')->get();
            $links = Group::links()->get();
        } else { /* User is not Authenticated */
            $current_user = new User;

            $myApp = AppInstance::with('app')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
            if (is_null($myApp)) { abort(403); }
            // $current_user_apps = AppInstance::where('public','=',true)->whereHas('group', function($q){
            //     $q->where('site_id', '=', config('app.site')->id);
            // })->with('app')->get();
            $links = Group::publicLinks()->get();

        }

        if($myApp != null) {
            // dd($myApp->toArray());
            // Create data object that will be used by the app
            // $data = ['user'=>$current_user,'options'=>$myApp->options];
            

            // if(!Auth::check() || !isset($myApp->user_options) || is_null($myApp->user_options) || is_null($myApp->user_options->options)) {
            //     $data['user']->options = is_null($myApp->user_options_default)?[]:$myApp->user_options_default;
            // } else { 
            //     $data['user']->options = $myApp->user_options->options;
            // }
            
            // // Get each source
            // // TODO: add conditionals for types and "autofetch", etc
            // if(!is_null($myApp->app->code) && count($myApp->app->code->sources) > 0){
            //     foreach($myApp->app->code->sources as $source){
            //         if($source->name !== ''){
            //             $data[$source->name] = $this->get_data($myApp, $source->name, $request);
            //         }
            //     }
            // }
            // return view('app', ['links'=>$links, 'apps'=>$current_user_apps,'name'=>$myApp->name, 'app'=>$myApp,'data'=>$data]);
            
            $template = new Templater();
            return $template->render([
                'links'=>$links, 
                // 'apps'=>$current_user_apps,
                'name'=>$myApp->name,
                'slug'=>$myApp->slug,
                'uapp'=>$myApp, 
                // 'data2'=>$data,
                'config'=>json_decode('{"sections":[[{"title":"'.$myApp->name.'","app_id":'.$myApp->id.',"widgetType":"uApp"}]],"layout":4}'),
                'group'=>$groupObj
            ]);

            
            // return view('timtest', [
            //     'links'=>$links, 
            //     'apps'=>$current_user_apps,
            //     'name'=>$myApp->name,
            //     'slug'=>$myApp->slug,
            //     'uapp'=>$myApp, 
            //     'data2'=>$data,
            //     'config'=>json_decode('{"sections":[[{"title":"'.$myApp->name.'","app_id":'.$myApp->id.',"widgetType":"uApp"}]],"layout":4}')
            //     ]);


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

        if($myApp != null){
            // Create data object that will be used by the app
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
                // Get each source
                // TODO: add conditionals for types and "autofetch", etc
                foreach($myApp->app->code->resources as $source){
                    $data[$source->name] = $this->get_data($myApp, $source->name, $request);
                }
            }

            return $data;
        }
        abort(404,'App not found');
    }

    private function http_endpoint(Endpoint $endpoint, $resource_info, $verb, $all_data) {
        // Derive and Map URL with Mustache
        $m = new \Mustache_Engine;
        $url = $m->render($endpoint->config->url . $resource_info->path, $all_data);
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
            $data = $this->http_endpoint($endpoint, $resource_app, $verb, $all_data);
        } else if ($endpoint->type == 'google_sheets') {
            $data = $this->google_endpoint($endpoint, $resource_app, $verb, $all_data);
        }
        return $data;
    }

}
