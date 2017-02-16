<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Closure;
use App\User;
use App\Site;
use App;
use App\AppDeveloper;
use App\GroupMember;
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
        $user = Auth::user();

        // If user isn't currently logged in, do nothing
        if (is_null($user)) {
            return $next($request);
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

        // Build Session Data for Current User
        session(['developer_apps'=>$developer_apps,
                'groups'=>$groups,
                'admin_groups'=>$admin_groups,
                'site'=>$user->site,
                'is_developer'=>(count($developer_apps) > 0),
                'is_admin'=>(count($admin_groups))]);

        // Log user out if they are not a member of the current site!
        // if (session('site')->domain != $request->server('SERVER_NAME')) {
        //     Auth::logout();
        //     return redirect('/login');
        // }

        // Disallow User from accessing /admin if not admin of any group
        // if ($request->is('admin/*') && !(session('is_admin') || session('is_developer'))) {
        //     App::abort(403, 'Access denied');
        // }

        return $next($request);
    }
}
