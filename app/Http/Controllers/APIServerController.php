<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;
use App\App;
use App\Libraries\HTTPHelper;
use Illuminate\Support\Facades\Auth;

class APIServerController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function index($slug, $resource = null,$resource_id = '') {
        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);
        if (is_null($api_config)) {
            abort(404);
        }
       return view('APIServer', ['resource'=>'APIServer_'.$resource,'id'=>$resource_id,'slug'=>$slug,'config'=>$api_config]);
    }    

    public function fetch($slug, $route, $object_id=null, $action=null,$selection=null, Request $request) {
        $httpHelper = new HTTPHelper();
        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);
        $url = $api_config->server."/api/".$route;
        if(!is_null($object_id)){
            $url .= '/'.$object_id;
        }
        if(!is_null($action)){
            $url .= '/'.$action;
        }
        if(!is_null($selection)){
            $url .= '/'.$selection;
        }
        $input = $request->input();
        if(isset($input['id']) && $input['id'] == '' ){
            unset($input['id']);
        }
        $response = $httpHelper->http_fetch($url, $request->method(), array_merge($request->input(),['user_id'=>Auth::user()->unique_id]), $api_config->username, $api_config->password);
        return response($response['content'],$response['code']);
    }

    public function api($slug, $api_id) {
        $httpHelper = new HTTPHelper();

        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);

        $url = $api_config->server."/api/apis/".$api_id.'/versions/latest';        
        $api_version = $httpHelper->http_fetch($url,"GET", array(), $api_config->username, $api_config->password);

        $httpHelper = new HTTPHelper();

        $url = $api_config->server."/api/apis/".$api_id;                
        $api = $httpHelper->http_fetch($url,"GET", array(), $api_config->username, $api_config->password);
        // return $api;
        return view('adminAPI', ['resource'=>'APIServer_api_edit','id'=>$api['content']['id'], 'api'=>json_encode($api['content']),'api_version'=>json_encode($api_version['content']),'slug'=>$slug,'config'=>$api_config]);
     } 

     public function api_docs($slug, $api_instance_id) {
        $httpHelper = new HTTPHelper();

        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);

        $url = $api_config->server."/api/api_docs/".$api_instance_id;        
        $docs = $httpHelper->http_fetch($url,"GET", [], $api_config->username, $api_config->password);
        if (isset($docs['content']['error'])) {
            dd($docs['content']['error']);
        }
        if (!isset($docs['content']['docs'])) {
            return response($docs['content'], 500);
        }
        return response($docs['content']['docs'], 200);
    } 

}
