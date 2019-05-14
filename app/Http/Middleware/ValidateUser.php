<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Closure;
use App\User;
use App\Site;
use App\App;
use App\Workflow;
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
        $this->customAuth = new CustomAuth();
        
        if (is_null(Auth::user())) {
            // ATS - If user isn't currently logged in, do custom auth?
            $return = $this->customAuth->authenticate($request, true);
            if(!Auth::user()){
                if(isset($return)){
                    return $return;
                }
                return $next($request);
            }
        }

        $user_site = SiteMember::where('user_id','=',Auth::user()->id)
                                ->where('site_id','=',$current_site->id)->first();

        /* User is not a member of the current site */
        if (is_null($user_site)) {
            Auth::logout();
            abort(403, 'Unauthorized action.');
        }

        $developer_workflows = []; $developer_apps = []; $groups = []; $content_admin_groups = []; $apps_admin_groups = []; $is_developer = false; $is_admin = false;

        // Store Critical User Info in Session for 1 Minute, Regenerate After
        if (Auth::user()->invalidate_cache !== true && session()->has('user_data_timestamp') && session('user_data_timestamp') + (1*60) >= time()) {
            Auth::user()->content_admin_groups = session('content_admin_groups');
            Auth::user()->apps_admin_groups = session('apps_admin_groups');
            Auth::user()->groups = session('groups');
            Auth::user()->developer_apps = session('developer_apps');
            Auth::user()->developer_workflows = session('developer_workflows');
            Auth::user()->tags_array = session('tags_array');
        } else {
            Auth::user()->content_admin_groups = Group::where('site_id', '=', $current_site->id )->whereHas('admins', function($q){
                $q->where('user_id', '=', Auth::user()->id)->where('content_admin','=',true);
            })->pluck('id')->toArray();
            Auth::user()->apps_admin_groups = Group::where('site_id', '=', $current_site->id )->whereHas('admins', function($q){
                $q->where('user_id', '=', Auth::user()->id)->where('apps_admin','=',true);
            })->pluck('id')->toArray();

            $member_groups = Group::where('site_id', '=', $current_site->id )->whereHas('members', function($q){
                $q->where('user_id', '=',  Auth::user()->id);
            })->pluck('id')->toArray();
            // Add user to "default" group if they are not a member of any other groups
            if (count($member_groups) == 0) {
                $member_groups = Group::where([['site_id', '=', $current_site->id],['name','like','default']])->pluck('id')->toArray();
            }
            $composite_groups = GroupComposite::whereIn('composite_group_id', $member_groups)->pluck('group_id')->toArray();
            Auth::user()->groups = array_values(array_unique(array_merge($member_groups, $composite_groups)));

            Auth::user()->developer_apps = App::where('site_id', '=', $current_site->id )->whereHas('developers', function($q){
                $q->where('user_id', '=',  Auth::user()->id);
            })->pluck('id')->toArray();

            Auth::user()->developer_workflows = Workflow::where('site_id', '=', $current_site->id )->whereHas('developers', function($q){
                $q->where('user_id', '=',  Auth::user()->id);
            })->pluck('id')->toArray();

            Auth::user()->tags_array = Tag::whereIn('group_id',Auth::user()->groups)->get(['name','value'])->toArray();
            session([
                'content_admin_groups' => Auth::user()->content_admin_groups,
                'apps_admin_groups' => Auth::user()->apps_admin_groups,
                'groups' => Auth::user()->groups,
                'developer_apps' => Auth::user()->developer_apps,
                'developer_workflows' => Auth::user()->developer_workflows,
                'tags_array' => Auth::user()->tags_array,
                'user_data_timestamp' => time()
            ]);  
            Auth::user()->invalidate_cache = false;
            Auth::user()->save();
        }
        
        Auth::user()->tags = [];
        foreach(Auth::user()->tags_array as $tag) {
            Auth::user()->tags[$tag['name']][] = $tag['value'];
        }

        Auth::user()->site = $current_site;
        Auth::user()->site_admin = $user_site->site_admin;
        Auth::user()->site_developer = $user_site->site_developer;

        return $next($request);
    }
}
