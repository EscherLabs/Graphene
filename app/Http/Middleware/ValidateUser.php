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
use App\Libraries\CustomAuth;

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
            // ATS - If user isn't currently logged in, do custom auth?
            if ($request->is('login*')) {
                $this->customAuth = new CustomAuth();
                
                $this->customAuth->authenticate();
            }
            return $next($request);
        }

        $user_site = SiteMember::where('user_id','=',Auth::user()->id)
                                ->where('site_id','=',$current_site->id)->first();

        /* User is not a member of the current site */
        if (is_null($user_site)) {
            Auth::logout();
            abort(403, 'Unauthorized action.');
        }

        $developer_apps = []; $groups = []; $content_admin_groups = []; $apps_admin_groups = []; $is_developer = false; $is_admin = false;

        Auth::user()->content_admin_groups = Group::where('site_id', '=', $current_site->id )->whereHas('admins', function($q){
            $q->where('user_id', '=', Auth::user()->id)->where('content_admin','=',true);
        })->pluck('id')->toArray();
        Auth::user()->apps_admin_groups = Group::where('site_id', '=', $current_site->id )->whereHas('admins', function($q){
            $q->where('user_id', '=', Auth::user()->id)->where('apps_admin','=',true);
        })->pluck('id')->toArray();

        $member_groups = Group::where('site_id', '=', $current_site->id )->whereHas('members', function($q){
            $q->where('user_id', '=',  Auth::user()->id);
        })->pluck('id')->toArray();
        $composite_groups = GroupComposite::whereIn('composite_group_id', $member_groups)->pluck('group_id')->toArray();
        
        // Treat Group Admin Permissions as Group Memberships as well -- TJC 2/11/18
        // ATS- added array_values to make the array the same as the other group lists and work in mustache
        Auth::user()->groups = array_values(array_unique(array_merge($member_groups, $composite_groups)));/*,Auth::user()->content_admin_groups,Auth::user()->apps_admin_groups));*/
        
        Auth::user()->developer_apps = App::where('site_id', '=', $current_site->id )->whereHas('developers', function($q){
            $q->where('user_id', '=',  Auth::user()->id);
        })->pluck('id')->toArray();

        Auth::user()->tags_array = Tag::whereIn('group_id',Auth::user()->groups)->get(['name','value'])->toArray();
        Auth::user()->tags = [];
        foreach(Auth::user()->tags_array as $tag) {
            Auth::user()->tags[$tag['name']][] = $tag['value'];
        }

        Auth::user()->site = $current_site;
        Auth::user()->site_admin = $user_site->site_admin;
        Auth::user()->site_developer = $user_site->site_developer;

        if ($request->is('admin*') && 
            !(  Auth::user()->site_admin || 
                Auth::user()->developer ||
                count(Auth::user()->content_admin_groups)>0 ||
                count(Auth::user()->apps_admin_groups)>0
            )) {
            abort(403, 'Access denied');
        }

        return $next($request);
    }
}
