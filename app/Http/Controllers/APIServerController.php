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
        return $response['content'];
    }

    public function service($slug, $service_id) {
        $httpHelper = new HTTPHelper();

        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);

        $url = $api_config->server."/api/services/".$service_id.'/versions/latest';        
        $service_version = $httpHelper->http_fetch($url,"GET", array(), $api_config->username, $api_config->password);

        $httpHelper = new HTTPHelper();

        $url = $api_config->server."/api/services/".$service_id;                
        $service = $httpHelper->http_fetch($url,"GET", array(), $api_config->username, $api_config->password);
        // return $service;
        return view('adminModule', ['resource'=>'APIServer_service_edit','id'=>$service['content']['id'], 'service'=>json_encode($service['content']),'service_version'=>json_encode($service_version['content']),'slug'=>$slug,'config'=>$api_config]);
     } 
}
