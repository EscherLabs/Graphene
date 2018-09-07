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
    
    public function index($resource = null) {
       return view('APIServer', ['resource'=>'APIServer_'.$resource,'id'=>'']);
    }    

    public function fetch($route, $object_id=null, Request $request) {
        $httpHelper = new HTTPHelper();
        $url = config('apiserver.server')."/api/".$route;
        if(!is_null($object_id)){
            $url .= '/'.$object_id;
        }
        $input = $request->input();
        if(isset($input['id']) && $input['id'] == '' ){
            unset($input['id']);
        }
        
        $response = $httpHelper->http_fetch($url, $request->method(), $request->input(), config('apiserver.user'), config('apiserver.password'));
        return $response['content'];
    }

    public function module($module_id) {
        $httpHelper = new HTTPHelper();

        $url = config('apiserver.server')."/api/module_versions/".$module_id;        
        $module_version = $httpHelper->http_fetch($url,"GET", array(), config('apiserver.user'), config('apiserver.password'));

        $httpHelper = new HTTPHelper();

        $url = config('apiserver.server')."/api/modules/".$module_id;                
        $module = $httpHelper->http_fetch($url,"GET", array(), config('apiserver.user'), config('apiserver.password'));
        // return $module;
        return view('adminModule', ['resource'=>'APIServer_module_edit','id'=>$module['content']['id'], 'module'=>json_encode($module['content']),'module_version'=>json_encode($module_version['content'])]);
     } 
}
