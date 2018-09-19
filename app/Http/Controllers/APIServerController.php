<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;
use App\App;
use App\Libraries\HTTPHelper;

class APIServerController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function index($slug, $resource = null) {
       return view('APIServer', ['resource'=>'APIServer_'.$resource,'id'=>'','slug'=>$slug]);
    }    

    public function fetch($slug, $route, $object_id=null, Request $request) {
        $httpHelper = new HTTPHelper();
        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);
        $url = $api_config->server."/api/".$route;
        if(!is_null($object_id)){
            $url .= '/'.$object_id;
        }
        $input = $request->input();
        if(isset($input['id']) && $input['id'] == '' ){
            unset($input['id']);
        }
        $response = $httpHelper->http_fetch($url, $request->method(), $request->input(), $api_config->username, $api_config->password);
        return $response['content'];
    }

    public function service($slug, $service_id) {
        $httpHelper = new HTTPHelper();

        $mysite = config('app.site')->select('proxyserver_config')->first();
        $api_config = $mysite->get_proxyserver_by_slug($slug);

        $url = $api_config->server."/api/service_versions/".$service_id;        
        $service_version = $httpHelper->http_fetch($url,"GET", array(), $api_config->username, $api_config->password);

        $httpHelper = new HTTPHelper();

        $url = $api_config->server."/api/services/".$service_id;                
        $service = $httpHelper->http_fetch($url,"GET", array(), $api_config->username, $api_config->password);
        // return $service;
        return view('adminModule', ['resource'=>'APIServer_service_edit','id'=>$service['content']['id'], 'service'=>json_encode($service['content']),'service_version'=>json_encode($service_version['content']),'slug'=>$slug]);
     } 
}
