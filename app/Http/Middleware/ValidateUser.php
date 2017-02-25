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
        
        /* Site does not exist */
        if (is_null($current_site)) {
            Auth::logout();
            return redirect('/login');
        }

        $user_site = SiteMember::where('user_id','=',Auth::user()->id)
                                ->where('site_id','=',$current_site->id)->first();

        /* User is not a member of the current site */
        if (is_null($user_site)) {
            Auth::logout();
            return redirect('/login');
        }

        $developer_apps = []; $groups = []; $admin_groups = []; $is_developer = false; $is_admin = false;
        // foreach(DB::select('select id from group_members left join groups on group_members.group_id = groups.id where user_id = :user_id and site_id = :site_id', ['user_id' => Auth::user()->id, 'site_id' => $current_site->id]) as $group) {
        //     Auth::user()->groups[] = $group->id;
        // }
        // foreach(DB::select('select id from group_admins left join groups on group_admins.group_id = groups.id where user_id = :user_id and site_id = :site_id', ['user_id' => Auth::user()->id, 'site_id' => $current_site->id]) as $group) {
        //     Auth::user()->admin_groups[] = $group->id;
        // }
        // foreach(DB::select('select id from app_developers left join apps on app_developers.app_id = apps.id where user_id = :user_id and site_id = :site_id', ['user_id' => Auth::user()->id, 'site_id' => $current_site->id]) as $app) {
        //     Auth::user()->developer_apps[] = $app->id;
        // }

        Auth::user()->groups = Group::where('site_id', '=', $current_site->id )->whereHas('members', function($q){
            $q->where('user_id', '=',  Auth::user()->id);
        })->pluck('id')->toArray();
        
        Auth::user()->admin_groups = Group::where('site_id', '=', $current_site->id )->whereHas('admins', function($q){
            $q->where('user_id', '=',  Auth::user()->id);
        })->pluck('id')->toArray();

        Auth::user()->developer_apps = App::where('site_id', '=', $current_site->id )->whereHas('developers', function($q){
            $q->where('user_id', '=',  Auth::user()->id);
        })->pluck('id')->toArray();

        Auth::user()->site = $current_site;
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
