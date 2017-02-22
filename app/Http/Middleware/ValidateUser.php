<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use App\User;
use App\Site;
use App;
use App\AppDeveloper;
use App\GroupMember;
use App\SiteMember;
use App\GroupAdmin;

class ValidateUser
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
        // If user isn't currently logged in, do nothing
        if (is_null(Auth::user())) {
            return $next($request);
        }

        $current_site = Site::where('domain','=',$request->server('SERVER_NAME'))->first();
        if (is_null($current_site)) {
            App::abort(404, 'Not Found');
        }

        $user_site = SiteMember::where('user_id','=',Auth::user()->id)
                                ->where('site_id','=',$current_site->id)->first();

        if (is_null($user_site)) {
            App::abort(403, 'Access denied');
        }

        $developer_apps = []; $groups = []; $admin_groups = []; $is_developer = false; $is_admin = false;
        foreach(AppDeveloper::where('user_id','=', Auth::user()->id)->get() as $app) {
            $developer_apps[] = $app->app_id;
        }
        foreach(GroupMember::where('user_id','=', Auth::user()->id)->get() as $group) {
            $groups[] = $group->group_id;
        }
        foreach(GroupAdmin::where('user_id','=', Auth::user()->id)->get() as $admin_group) {
            $admin_groups[] = $admin_group->group_id;
        }

        Auth::user()->developer_apps = $developer_apps;
        Auth::user()->groups = $groups;
        Auth::user()->admin_groups = $admin_groups;
        Auth::user()->site_id = $current_site->id;
        Auth::user()->site_admin = $user_site->site_admin;
        Auth::user()->developer = $user_site->developer;

        if ($request->is('admin*') && 
            !(  Auth::user()->site_admin || 
                Auth::user()->developer ||
                count(Auth::user()->admin_groups)>0
            )) {
            App::abort(403, 'Access denied');
        }
        return $next($request);
    }
}
