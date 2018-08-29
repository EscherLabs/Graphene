<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Group;
use App\App;

class APIServerController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth');
    }
    
    public function index($resource = null) {
       return view('APIServer', ['resource'=>'APIServer_'.$resource,'id'=>'']);
    }    
 
}
