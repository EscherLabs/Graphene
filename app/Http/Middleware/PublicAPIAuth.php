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
use App\SiteMember;
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
            // If unique_id was passed as part of the API, attempt to authenticate as that user.
            if (!is_null($request->route('unique_id'))) {
                $current_user = User::where('unique_id',$request->route('unique_id'))->first();
                if (is_null($current_user)) {
                    return response()->make('User '.$unique_id.' not found!', 404, $headers);
                }
                Auth::login($current_user);
            }
            return $next($request);
        }    
    }
}
