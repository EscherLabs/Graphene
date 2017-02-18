<?php

namespace App\Http\Controllers;

use App\AppInstance;
use App\Endpoint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AppInstanceController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }
    
    public function index() {
        return AppInstance::with('app')->get(); // Get current Site info from??
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

    public function run($slug, Request $request) {
        $myApp = \App\AppInstance::with('app')->with(['user_preferences'=>function($query){
            $query->where('user_id','=', Auth::user()->id);
        }])->where('slug', '=', $slug)->first();
        if($myApp != null){
            // Create data object that will be used by the app
            $data = [
                'user'=>Auth::user(),
                'options'=>json_decode($myApp->configuration)
            ];
            if(!is_null($myApp->user_preferences)) {
                $data['user']['preferences'] = json_decode($myApp->user_preferences->preferences);
                if(is_null($data['user']['preferences'])){
                    $data['user']['preferences'] = [];
                }
            }else{
                $data['user']['preferences'] = [];
            }

            // Get each source
            // TODO: add conditionals for types and "autofetch", etc
            foreach(json_decode($myApp->app->code)->sources as $source){
                $data[$source->name] = $this->get_data($myApp, $source->name, $request);
            }

            return view('app', ['apps'=>\App\AppInstance::with('app')->get(),'name'=>$myApp->name, 'app'=>$myApp,'data'=>json_encode($data)]);
        }
        abort(404,'App not found');
    }
    
    public function fetch($ai_id, Request $request) {
        $myApp = \App\AppInstance::with(['user_preferences'=>function($query){
            $query->where('user_id','=',Auth::user()->id);
        }])->where('id', '=', $ai_id)->first();

        if($myApp != null){
            // Create data object that will be used by the app
            $data = [
                'user'=>Auth::user(),
                'options'=>json_decode($myApp->configuration)
            ];
            if(!is_null($myApp->user_preferences)) {
                $data['user']['preferences'] = json_decode($myApp->user_preferences->preferences);
                if(is_null($data['user']['preferences'])){
                    $data['user']['preferences'] = [];
                }
            }else{
                $data['user']['preferences'] = [];
            }



            // Get each source
            // TODO: add conditionals for types and "autofetch", etc
            foreach(json_decode($myApp->app->code)->sources as $source){
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
        $url = $m->render($endpoint->config['url'] . $resource_info->path, $all_data);

        // Fetch Data based on Endpoint Type
        if ($endpoint->type == 'http_no_auth') {
            $data = $this->http_fetch($url,$verb,$all_data['request']);
        } else if ($endpoint->type == 'http_basic_auth') {
            $data = $this->http_fetch($url,$verb,$all_data['request'],
                    $endpoint->config['username'], $endpoint->config['password']);
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
        $config = $endpoint->config;
        $client->setAccessToken($config['accessToken']);
        if ($client->isAccessTokenExpired()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
            $config['accessToken'] = $client->getAccessToken();
            $endpoint->config = json_encode($config);
            $endpoint->save();
            $endpoint->config = $config;
        }
        $service = new \Google_Service_Sheets($client);
        $sheets = new \GoogleSheets\Sheets();
        $sheets->setService($service);
        if ($resource_info->path == '' ) {
            abort(505,'The path endpoint must specifiy a valid worksheet name');
        }
        $values = $sheets->spreadsheet($endpoint->config['sheet_id'])->sheet($resource_info->path)->all();
        return $values;
    }

    public function get_data(AppInstance $app_instance, $endpoint_name, Request $request) {
        $configuration = json_decode($app_instance->configuration);
        $resources = json_decode($app_instance->resources);

        $verb = 'GET'; // Default Verb
        if ($request->has('verb')) {
            $verb = $request->input('verb');
        }

        if ($request->has('request') && !is_array($request->input('request'))) {
            abort(505,'request must be an array');
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
        $endpoint->config = json_decode($endpoint->config,true);

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
