<?php

namespace App\Http\Controllers\Auth;

use App\AppInstance;
use App\Group;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'logout']);
    }

    /**
     * Show the application's login form.
     *
     * @return \Illuminate\Http\Response
     */
    public function showLoginForm()
    {
        $current_user_apps = AppInstance::where('public','=','1')->whereHas('group', function($q){
            $q->where('site_id', '=', config('app.site')->id);
        })->with('app')->get();

        $links = Group::where('site_id', '=', config('app.site')->id)->with(['app_instances'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'icon', 'public');
            $q->where('public','=','1');
        },'pages'=>function($q){
            $q->select('group_id','id', 'name', 'slug', 'public');
            $q->where('public','=','1');

        }])
        ->whereHas('app_instances', function($q) {
             $q->where('public','=','1');
         })
        ->orWhereHas('pages', function($q) {
             $q->where('public','=','1');
        })
        ->get();
        // dd($links->toArray());
        return view('auth.login', ['apps'=>$current_user_apps, 'links'=>$links]);

        //return view('auth.login');
    }

}
