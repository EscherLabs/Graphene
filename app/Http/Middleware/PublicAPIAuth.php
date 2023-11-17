<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Closure;
use App\User;
use App\Site;
use App\App;
use App\AppDeveloper;
use App\GroupMember;
use App\GroupAdmin;
use App\Group;
use App\GroupComposite;
use App\Tag;
use App\APIUser;

class PublicAPIAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(Auth::check())return $next($request);
        $logged_in = false;
        if ($request->header('PHP_AUTH_USER', null) && $request->header('PHP_AUTH_PW', null)) {
            $username = $request->header('PHP_AUTH_USER');
            $password = $request->header('PHP_AUTH_PW');
            $user = APIUser::where('site_id',config('app.site')->id)->
                where('app_name','=',$username)->first();
            if (!is_null($user) && $username === $user->app_name && $user->check_app_secret($password)) {
                $logged_in = true;
            }
        }
    
        if ($logged_in === false) {
            $headers = ['WWW-Authenticate' => 'Basic'];
            return response()->make('Invalid credentials.', 401, $headers);
        } else {

            //ATS - doing this universally becomes problematic if you have "unique_id" in your route 
            // but this is not the desired action 
            // - this should be explicetly requested via query parameter or handled in specific routes 
            // or with additional middleware on routes that desire this action

            // If unique_id was passed as part of the API, attempt to authenticate as that user.
            if (!is_null($request->route('unique_id'))) {
                $current_user = User::where('unique_id',$request->route('unique_id'))->first();
                if (is_null($current_user)) {
                    return response()->make('User '.$request->route('unique_id').' not found!', 404);
                }
                Auth::login($current_user);
            }else{
              Auth::login($user);
              Auth::user()->site_admin = 1;
              Auth::user()->site_developer = 1;
            }
            return $next($request);
        }    
    }
}
