<?php

namespace App\Http\Controllers\Auth;

use App\AppInstance;
use App\Group;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

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

    protected function redirectTo()
    {
        return request()->redirect;
    }
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

        return view('auth.login', ['apps'=>$current_user_apps, 'links'=>Group::publicAppsPages()->get()]);

        //return view('auth.login');
    }

    /**
     * Log the user out of the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {

        $this->guard()->logout();
        $request->session()->invalidate();

        if (config('app.site')->auth == 'CAS') {
            cas()->logout();
        } else {
            return redirect()->back();
        }
    }

}
