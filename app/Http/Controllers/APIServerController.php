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
        $response = $httpHelper->http_fetch($url, "GET", array(), config('apiserver.user'), config('apiserver.password'));
        return $response['content'];
    }
}
