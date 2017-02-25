<?php

namespace App\Http\Controllers;
use App\UserDashboard;
use App\AppInstance;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }
    
    public function index() {
        $user_dashboard = UserDashboard::find(Auth::user()->id);
        if(is_null($user_dashboard)){
            $config = '""';
        }else{
            $config = $config->config;
        }
        
        return view('dashboard',['apps'=>AppInstance::whereIn('group_id',Auth::user()->groups)->with('app')->get(),'name'=>"Dashboard", 'config'=>$config]);
    }

    public function update(Request $request) {
        return UserDashboard::updateOrCreate(['user_id'=>Auth::user()->id], ['config'=>$request->get('config')]);
    }

}
