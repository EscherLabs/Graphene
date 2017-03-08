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

class AppInstanceController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->except('run','get_data');
    }
    
    public function index() {
        $app_instances = AppInstance::with('app')
            ->whereHas('group', function($q){
                $q->whereIn('id',Auth::user()->groups);
            })
            ->get();
        return $app_instances;
    }

    public function show(AppInstance $app_instance) {
        return $app_instance->with('app')->get()->first();
    }

    public function create(Request $request) {
        $this->validate($request,['name'=>['required']]);
        $app_instance = new AppInstance($request->all());
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

    public function save_preferences(AppInstance $app_instance, Request $request)
    {
        return $app_instance->set_preference(Auth::user() , $request->get('preferences'));
    }

    public function run($slug, Request $request) {
        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myApp = AppInstance::with('app')->with(['user_preferences'=>function($query){
                $query->where('user_id','=', Auth::user()->id);
            }])->where('slug', '=', $slug)->first();
            $this->authorize('fetch' ,$myApp);
            $current_user_apps = AppInstance::whereIn('group_id',Auth::user()->groups)->with('app')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myApp = AppInstance::with('app')->where('slug', '=', $slug)->where('public','=','1')->first();
            if (is_null($myApp)) { abort(403); }
            $current_user_apps = AppInstance::where('public','=','1')->whereHas('group', function($q){
                $q->where('site_id', '=', config('app.site')->id);
            })->with('app')->get();
        }

        if($myApp != null) {
            // Create data object that will be used by the app
            $data = ['user'=>$current_user,'options'=>$myApp->configuration];

            if(!isset($myApp->user_preferences) || is_null($myApp->user_preferences) || is_null($myApp->user_preferences->preferences)) {
                $data['user']['preferences'] = [];
            } else { 
                $data['user']['preferences'] = $myApp->user_preferences->preferences;
            }

            // Get each source
            // TODO: add conditionals for types and "autofetch", etc
            if(!is_null($myApp->app->code) && count($myApp->app->code->sources) > 0){
                foreach($myApp->app->code->sources as $source){
                    if($source->name !== ''){
                        $data[$source->name] = $this->get_data($myApp, $source->name, $request);
                    }
                }
            }
            return view('app', ['apps'=>$current_user_apps,'name'=>$myApp->name, 'app'=>$myApp,'data'=>$data]);
        }
        abort(404,'App not found');
    }
    
    public function fetch($ai_id, Request $request) {
        $myApp = AppInstance::with(['user_preferences'=>function($query){
            $query->where('user_id','=',Auth::user()->id);
        }])->where('id', '=', $ai_id)->first();

        if($myApp != null){
            // Create data object that will be used by the app
            $data = [
                'user'=>Auth::user(),
                'options'=>$myApp->configuration
            ];
            if(!is_null($myApp->user_preferences)) {
                $data['user']['preferences'] = $myApp->user_preferences->preferences;
                if(is_null($data['user']['preferences'])){
                    $data['user']['preferences'] = [];
                }
            }else{
                $data['user']['preferences'] = [];
            }
            // Get each source
            // TODO: add conditionals for types and "autofetch", etc
            foreach($myApp->app->code->sources as $source){
                $data[$source->name] = $this->get_data($myApp, $source->name, $request);
            }

            return $data;
        }
        abort(404,'App not found');
    }
    
    private function http_fetch($url, $verb='GET', $request_data=[],$username=null,$password=null) {
        // Build HTTP Request
        $request_config = [];
        $request_config['method'] = $verb;
        $request_config['header'] = 'Content-type: application/x-www-form-urlencoded';
        if (!is_null($username)) {
            $request_config['header'] .= "\r\nAuthorization: Basic ".base64_encode($username.':'.$password);
        }
        if ($verb == 'GET') {
            $url_parts = parse_url($url);
            $url_parts_query = [];
            if(array_key_exists('query', $url_parts)){
                parse_str($url_parts['query'],$url_parts_query);
            }
            $url = $url_parts['scheme'].'://'.$url_parts['host'].
                    $url_parts['path'].'?'.
                    http_build_query(array_merge($request_data,$url_parts_query));
        } else {
            $request_config['content'] = http_build_query($request_data);
        }
        $context = stream_context_create(['http' =>$request_config]);
        $response = @file_get_contents($url, false, $context);
        if ($response === FALSE) {
            return error_get_last();
        }

        // Check if the data we got back was JSON Formatted
        foreach($http_response_header as $header) {
            if (stristr($header, 'Content-Type: application/json')) {
                $response = json_decode($response,true);
                break;
            }
        }
        return $response;
    }

    private function http_endpoint(Endpoint $endpoint, $resource_info, $verb, $all_data) {
        // Derive and Map URL with Mustache
        $m = new \Mustache_Engine;
        $url = $m->render($endpoint->config->url . $resource_info->path, $all_data);

        // Fetch Data based on Endpoint Type
        if ($endpoint->type == 'http_no_auth') {
            $data = $this->http_fetch($url,$verb,$all_data['request']);
        } else if ($endpoint->type == 'http_basic_auth') {
            $data = $this->http_fetch($url,$verb,$all_data['request'],
                    $endpoint->config->username, $endpoint->config->password);
        } else {
            abort(505,'Authentication Type Not Supported');
        }
        // Convert Data based on Modifier
        if ($resource_info->modifier == 'csv') {
            $data = array_map("str_getcsv", explode("\n", $data));
        } else if ($resource_info->modifier == 'xml') {
            $data = json_decode(json_encode(simplexml_load_string($data, 'SimpleXMLElement', LIBXML_NOCDATA)),true);
        }
        return $data;
    }

    private function google_endpoint(Endpoint $endpoint, $resource_info, $verb, $all_data) {
        $googleClient = new \PulkitJalan\Google\Client(config('google'));
        $client = $googleClient->getClient();
        $client->setAccessToken($endpoint->config->accessToken);
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            $endpoint->config->accessToken = $client->getAccessToken();
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
        if ($app_instance->public !== 1) {
            $this->authorize('get_data', $app_instance);
        } 

        $configuration = $app_instance->configuration;
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
        foreach($resources as $resource_info) {
            if ($endpoint_name == $resource_info->name) {
                $endpoint_found = true; break;
            }
        }
        if (!$endpoint_found) {
            abort(505,'Endpoint Not Found');
        }

        // Lookup Endpoint
        $endpoint = Endpoint::find((int)$resource_info->endpoint);
        
        // Merge App Configuration with User Preferences, User Info, and `request` data
        $all_data = ['configuration'=>$configuration,
                     'preferences'=>[], 'user'=>[],
                     'request'=>$request->has('request')?$request->input('request'):[]];

        if ($endpoint->type == 'http_no_auth' || $endpoint->type == 'http_basic_auth') {
            $data = $this->http_endpoint($endpoint, $resource_info, $verb, $all_data);
        } else if ($endpoint->type == 'google_sheets') {
            $data = $this->google_endpoint($endpoint, $resource_info, $verb, $all_data);
        }

        return $data;
    }

}
