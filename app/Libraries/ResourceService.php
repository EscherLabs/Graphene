<?php 

namespace App\Libraries;

use App\WorkflowInstance;
use App\Workflow;
use App\WorkflowVersion;
use App\WorkflowSubmission;
use App\WorkflowActivityLog;
use App\Endpoint;
use App\Group;
use App\UserPreference;
use App\User;
use App\Page;
use App\ResourceCache;
use App\UserOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Arr;

// use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
// use App\Libraries\Templater;
use App\Libraries\PageRenderer;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use App\Libraries\ResourceService;
use Illuminate\Support\Facades\Log;

class ResourceService
{
    public function __construct(CustomAuth $customAuth) {
        $this->customAuth = $customAuth;
    }

    private function data(WorkflowInstance $WorkflowInstance, WorkflowSubmission $workflow_submission){
        $m = new \Mustache_Engine;

        $state_data = [];
        $state_data['is'] = $state_data['was'] = $state_data['previous'] = [];
        $WorkflowInstance->findVersion($workflow_submission->workflow_version_id);
        $flow = $WorkflowInstance->version->code->flow;

        $state_data['id']=$workflow_submission->id;
        $state = Arr::first($flow, function ($value, $key) use ($workflow_submission) {
            return $value->name === $workflow_submission->state;
        });     
        $owner = User::find($workflow_submission->user_id);

        $state_data['form'] = $workflow_submission->data = $workflow_submission->data;
        $state_data['report_url'] = URL::to('/workflows/report/'.$workflow_submission->id);

        // Set New Status (String)
        if(isset($state->status)){
            $state_data['status'] = $state->status;
        }else{
            $state_data['status'] = 'open';
        }       

        $state_data['owner'] = $owner->only('first_name','last_name','email','unique_id','params');
        $state_data['owner']['is'] = [];
        if (isset($previous_state->logic)) {
            $state_data['actor'] = null;
            $state_data['owner']['is']['actor'] = false;
        } else {
            $state_data['actor'] = Auth::user()->only('first_name','last_name','email','unique_id','params');
            $state_data['owner']['is']['actor'] = ($owner->id === Auth::user()->id);
        }
        $state_data['workflow'] = $WorkflowInstance->workflow->only('name','description');
        $state_data['workflow']['instance'] = $WorkflowInstance->only('group_id','slug','name','icon','public','configuration');
        $state_data['workflow']['version'] = $WorkflowInstance->version->only('id','summary','description','stable');
        $state_data['datamap'] = $state_data['assignment'] = [];
        if(isset($workflow_submission->workflow_instance_configuration->map)){
            foreach($workflow_submission->workflow_instance_configuration->map as $resource){
                $state_data['datamap'][$resource->name] = $resource->value;
            }
        }
        $state_data['state'] = $state->name;
        if (!isset($state->actions)) { $state->actions = []; }
        $state_data['actions'] = array_map(function ($ar) {
            return Arr::only((array)$ar,['label','name','type']);
        }, $state->actions);
        $state_data['is']['actionable'] = (count($state_data['actions'])>0);
        $state_data['is']['open'] = ($state_data['status']=='open')?true:false;
        $state_data['is']['closed'] = ($state_data['status']=='closed')?true:false;
        $state_data['is']['initial'] = ($workflow_submission->workflow_instance_configuration->initial == $state_data['state']);
        if (isset($state->assignment) && !isset($state->logic)) {
            $state_data['assignment']['type'] = $state->assignment->type;
            $state_data['assignment']['id'] = $m->render($state->assignment->id, $state_data);
        } else {
            $state_data['assignment'] = null;
        }
        return $state_data;
    }
    public function fetch(WorkflowInstance $workflow_instance,$workflow_submission, $request) {
        $workflow_instance->findVersion($workflow_submission->workflow_version_id);
        if($workflow_instance != null){
            $data = [
                // 'user'=>$current_user
            ];
            if($workflow_instance->workflow->code && isset($workflow_instance->workflow->code->resources) ){
                foreach($workflow_instance->workflow->code->resources as $source){
                    if ($source->fetch === 'true' || $source->fetch === true) {
                        $response = $this->get_data_int($workflow_instance,$workflow_submission, $source->name, $request);
                        $data[$source->name] = $response['content'];
                    }
                }
            }

            return $data;
        }
        abort(404,'Workflow not found');
    }

    private function http_endpoint(Endpoint $endpoint, $resource_info, $verb, $all_data, $workflow_instance_id) {
        // Derive and Map URL with Mustache
        $m = new \Mustache_Engine;
        $url = $m->render($endpoint->config->url . $resource_info->path, $all_data);

        if (isset($resource_info->cache) && ($resource_info->cache === true || $resource_info->cache === 'true')) {
            $cache = ResourceCache::where('workflow_instance_id', '=', $workflow_instance_id)
                    ->where('url','=',$url)
                    ->where('created_at','>=',Carbon::now()->subMinutes(10)->toDateTimeString())
                    ->first();
            if (!is_null($cache)) {
                $response = unserialize($cache->content);
            }
        }
        if (!isset($response)) {
            // Fetch Data based on Endpoint Type
            $httpHelper = new HTTPHelper();
            if ($endpoint->type == 'http_no_auth') {
                $response = $httpHelper->http_fetch(['url'=>$url, 'verb'=>$verb, 'data'=>$all_data['request']]);
            } else if ($endpoint->type == 'http_basic_auth') {
                $http_config = [
                    'url'  => $url,
                    'verb' => $verb,
                    'data' => $all_data['request'],
                    'username' => $endpoint->config->username,
                    'password' => $endpoint->getSecret(),
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
                $response = $httpHelper->http_fetch($http_config);
            } else {
                abort(505,'Authentication Type Not Supported');
            }
            if (isset($resource_info->cache) && ($resource_info->cache === true || $resource_info->cache === 'true')) {
                // TJC -- Laravel has a "non-bug" which prevents updateOrCreate from working 
                // correctly in the event of a race condition.  See details:
                // https://github.com/laravel/framework/issues/19372
                // Wrapping this in try/catch, as I don't really care if the insert
                // fails.
                try {
                    $cache = ResourceCache::updateOrCreate([
                        'workflow_instance_id' => $workflow_instance_id,
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
            } catch (\Exception $e) {
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
            }catch(Exception $e){}
        }
        return $response;
    }

    public function get_data_int($workflow_instance, $workflow_submission, $endpoint_name, $request) {
        if(!isset($workflow_instance->workflow->code)){
            $workflow_instance->findVersion($workflow_submission->workflow_version_id);
        }
        if(isset($workflow_submission->workflow_instance_configuration->resources)){
            $resources = $workflow_submission->workflow_instance_configuration->resources;
        }else{
            return array('content'=>[],'code'=>501);
        }
        $verb = 'GET'; // Default Verb
        if (isset($request['verb'])) {
            $verb = $request['verb'];
        }

        if (isset($request['request']) && !is_array($request['request'])) {
            abort(505,'request must be an array');
        }

        if(!count($resources)){
            return array('content'=>[],'code'=>501);

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


        // Merge Workflow Options with User Preferences, User Info, and `request` data
        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
        } else { /* User is not Authenticated */
            $current_user = new User;
        }
        $all_data = $this->data($workflow_instance,$workflow_submission);
        $all_data['user'] = $current_user->toArray();
        $all_data['request'] = isset($request['request'])?$request['request']:[];
        
        $resource_found = false;
        
        if($workflow_instance->workflow->code && isset($workflow_instance->workflow->code->resources) ){
            foreach($workflow_instance->workflow->code->resources as $resource_app) {
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
            $response = $this->http_endpoint($endpoint, $resource_app, $verb, $all_data, $workflow_instance->id);
        }
        return $response;
    }


}
