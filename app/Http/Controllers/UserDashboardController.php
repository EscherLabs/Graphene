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
        $user_dashboard = UserDashboard::where('user_id','=',Auth::user()->id)->where('site_id','=',Auth::user()->site->id)->first();
        if(is_null($user_dashboard) || !isset($user_dashboard->config)){
            $config = '""';
        }else{
            $config = $user_dashboard->config;
        }
        
        return view('dashboard',['apps'=>AppInstance::whereIn('group_id',Auth::user()->groups)->with('app')->get(),'name'=>"Dashboard", 'config'=>$config]);
    }

    public function update(Request $request) {
        $user_dashboard = UserDashboard::where('user_id','=',Auth::user()->id)->where('site_id','=',Auth::user()->site->id)->first();
        if ($user_dashboard) {
            $user_dashboard->config = $request->get('config');
        } else {
            $user_dashboard = new UserDashboard([
                'user_id'=>Auth::user()->id,
                'site_id'=>Auth::user()->site->id,
                'config'=>$request->get('config')]);
        }
        $user_dashboard->save();
        return $user_dashboard;
    }

}
