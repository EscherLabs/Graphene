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
// use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
use App\Libraries\PageRenderer;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use App\Libraries\ResourceService;
use Illuminate\Support\Facades\Log;

class ResourceService
{
    public function __construct(CustomAuth $customAuth) {
        // $this->middleware('auth')->except('run','fetch', 'get_data');
        $this->customAuth = $customAuth;
        // $this->reportingService = new ResourceService($this->customAuth);
    }

    public function fetch(WorkflowInstance $workflow_instance, $request) {
        // if (Auth::check()) { /* User is Authenticated */
        //      $current_user = Auth::user();
        //      $this->authorize('fetch' ,$workflow_instance);
        //  } else { /* User is not Authenticated */
        //      $current_user = new User;
        //      if (is_null($workflow_instance)) { abort(403); }
        //  }
        $workflow_instance->findVersion();

        if($workflow_instance != null){
            $data = [
                // 'user'=>$current_user
            ];
            if($workflow_instance->workflow->code && isset($workflow_instance->workflow->code->resources) ){
                foreach($workflow_instance->workflow->code->resources as $source){
                    if ($source->fetch === 'true' || $source->fetch === true) {
                        $response = $this->get_data_int($workflow_instance, $source->name, $request);
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

        if ($resource_info->cache === true || $resource_info->cache === 'true') {
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
                $response = $httpHelper->http_fetch($url,$verb,$all_data['request']);
            } else if ($endpoint->type == 'http_basic_auth') {
                $response = $httpHelper->http_fetch($url,$verb,$all_data['request'],$endpoint->config->username, $endpoint->getSecret());
            } else {
                abort(505,'Authentication Type Not Supported');
            }
            if ($resource_info->cache === true || $resource_info->cache === 'true') {
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
                } catch (\Exception $e) {
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

    public function get_data_int(WorkflowInstance $workflow_instance, $endpoint_name, $request) {
        // session_write_close(); // Don't keep waiting
        if(!isset($workflow_instance->workflow->code)){
            $workflow_instance->findVersion();
        }

        //  if (!$workflow_instance->public) {
        //      $this->authorize('get_data', $workflow_instance);
        //  }

        // $options = $workflow_instance->options;
        // $user_options_default = $workflow_instance->user_options_default;
        $resources = $workflow_instance->configuration->resources;
        // $temp = $request->all();
        $verb = 'GET'; // Default Verb
        if (isset($request['verb'])) {
            $verb = $request['verb'];
        }

        if (isset($request['request']) && !is_array($request['request'])) {
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


        // Merge Workflow Options with User Preferences, User Info, and `request` data
        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            // $user_prefs = $workflow_instance->user_options()->where('user_id','=',$current_user->id)->first();
        } else { /* User is not Authenticated */
            $current_user = new User;
        }

        // dd($resource_endpoint);

        $all_data = ['user'=>$current_user->toArray(),
                    'request'=>isset($request['request'])?$request['request']:[]];

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
        // else if ($endpoint->type == 'google_sheets') {
        //     $data = $this->google_endpoint($endpoint, $resource_app, $verb, $all_data);
        // }
        return $response;
    }


}
