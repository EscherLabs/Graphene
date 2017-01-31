<?php

namespace App\Http\Controllers;
use App\UserDashboard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }
    
    public function index() {
        $config = UserDashboard::find(Auth::user()->id);
        if(is_null($config)){
            $config = '""';
        }else{
            $config = $config->config;
        }
        return view('dashboard',['apps'=>\App\AppInstance::with('app')->get(),'config'=>$config]);
    }

    public function update(Request $request) {
        return UserDashboard::updateOrCreate(['user_id'=>Auth::user()->id], ['config'=>json_encode($request->get('config'))]);
    }

}
