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
        $current_site = config('app.site');

        // If user isn't currently logged in, do nothing
        if (is_null(Auth::user())) {
            return $next($request);
        }

        $user_site = SiteMember::where('user_id','=',Auth::user()->id)
                                ->where('site_id','=',$current_site->id)->first();

        /* User is not a member of the current site */
        if (is_null($user_site)) {
            Auth::logout();
            abort(403, 'Unauthorized action.');
        }

        $developer_apps = []; $groups = []; $admin_groups = []; $is_developer = false; $is_admin = false;

        // Must be updated to add composites 
        $member_groups = Group::where('site_id', '=', $current_site->id )->whereHas('members', function($q){
            $q->where('user_id', '=',  Auth::user()->id);
        })->pluck('id')->toArray();
        $composite_groups = GroupComposite::whereIn('group_id', $member_groups)->pluck('composite_group_id')->toArray();
        Auth::user()->groups = array_unique(array_merge($member_groups, $composite_groups));
        
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
            abort(403, 'Access denied');
        }
        return $next($request);
    }
}
