<?php

namespace App\Http\Controllers;

use App\AppInstance;
use App\Endpoint;
use Illuminate\Http\Request;

class AppInstanceController extends Controller
{
    public function index()
    {
        return AppInstance::all(); // Get current Site info from??
    }

    public function show(AppInstance $app_instance)
    {
        return $app_instance->with('app')->get()->first();
    }

    public function create(Request $request)
    {
        $this->validate($request,['name'=>['required']]);
        $app_instance = new AppInstance($request->all());
        $app_instance->site_id = 1; // Get current Site info from??
        $app_instance->save();
        return $app_instance;
    }

    public function update(Request $request, AppInstance $app_instance)
    {
        $app_instance->update($request->all());
        return $app;
    }

    public function destroy(AppInstance $app_instance)
    {
        if ($app_instance->delete()) {
            return 1;
        }
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
            $url = $url_parts['scheme'].'://'.$url_parts['host'].
                    $url_parts['path'].'?'.$url_parts['query'].'&'.
                    http_build_query($request_data);
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

    public function get_data(AppInstance $app_instance, $endpoint_name, Request $request) {
        $app_instance->configuration = json_decode($app_instance->configuration);
        $app_instance->resources = json_decode($app_instance->resources);

        $verb = 'GET'; // Default Verb
        if ($request->has('verb')) {
            $verb = $request->input('verb');
        }

        if ($request->has('request') && !is_array($request->input('request'))) {
            abort(505,'request must be an array');
        }

        // Lookup Resource by Name
        $endpoint_found = false;
        foreach($app_instance->resources as $resource_info) {
            if ($endpoint_name == $resource_info->name) {
                $endpoint_found = true; break;
            }
        }
        if (!$endpoint_found) {
            abort(505,'Endpoint Not Found');
        }

        // Lookup Endpoint
        $endpoint = Endpoint::find((int)$resource_info->endpoint);
        $endpoint->credentials = json_decode($endpoint->credentials);

        // Merge App Configuration with User Preferences, User Info, and `request` data
        $all_data = ['configuration'=>$app_instance->configuration,
                     'preferences'=>[], 'user'=>[],
                     'request'=>$request->has('request')?$request->input('request'):[]];

        // Derive and Map URL with Mustache
        $m = new \Mustache_Engine;
        $url = $m->render($endpoint->credentials->url . $resource_info->path, $all_data);

        // Fetch Data based on Endpoint Type
        if ($endpoint->type == 'http_no_auth') {
            $data = $this->http_fetch($url,$verb,$all_data['request']);
        } else if ($endpoint->type == 'http_basic_auth') {
            $data = $this->http_fetch($url,$verb,$all_data['request'],
                    $endpoint->credentials->username, $endpoint->credentials->password);
        } else {
            abort(505,'Authentication Type Not Supported');
        }

        // Convert Data based on Modifier
        if ($resource_info->modifier == 'csv') {
            $data = array_map("str_getcsv", explode("\n", $data));
        } else if ($resource_info->modifier == 'xml') {
            $data = json_decode(json_encode(simplexml_load_string($data)));
        }
        return $data;
    }

}
