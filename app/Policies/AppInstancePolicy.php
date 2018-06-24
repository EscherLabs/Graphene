<?php

namespace App\Policies;

use App\User;
use App\AppInstance;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class AppInstancePolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user) {
        if ($user->site_admin || $user->group_apps_admin()) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        // TJC 3/26/18 -- Need to revisit
            return true;
    }

    public function get(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || $user->group_apps_admin($app_instance->group_id)) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ( $user->site_admin || ($user->group_apps_admin(request()->group_id) && $user->app_developer(request()->app_id))) {
            return true;
        }
        $app_exists_in_group = is_null(AppInstance::select('id')->where('group_id','=',request()->group_id)->where('app_id','=',request()->app_id)->first())?false:true;
        if ( $user->group_apps_admin(request()->group_id) && $app_exists_in_group) {
            return true;
        }
    }

    public function update(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || $user->group_apps_admin($app_instance->group_id)) {
            return true;
        }
    }

    public function delete(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || $user->group_apps_admin($app_instance->group_id)) {
            return true;
        }
    }

    public function modify_user_options(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || $user->group_admin($app_instance->group_id) || $user->group_member($app_instance->group_id)) {
            return true;
        }
    }

    // public function get_data(User $user, AppInstance $app_instance)
    // {
    //     if ($user->site_admin || $user->group_admin($app_instance->group_id) || $user->group_member($app_instance->group_id)) {
    //         return true;
    //     }
    // }

    public function get_data(User $user, AppInstance $app_instance) {
        // If you're an admin of the group, or you're an admin of the site => you can view the page.
        if ($user->group_admin($app_instance->group_id) || $user->site_admin) {
            return true;
        }
        
        // If the app instance limits visibility to composites, and you are a member of one of those composites => you can view the app instance.
        if (is_array($app_instance->groups) && count($app_instance->groups) > 0) { 
            if (count(array_intersect($user->groups, $app_instance->groups)) > 0) {
                return true;
            }
        // If the app instance DOESNT limit visibility to composites, and you are a member of the app instance group => you can view the app instance.
        } else if ($user->group_member($app_instance->group_id)) {
            return true;
        }

        // If the app instancd is public => you can view the app instance.
        if ($app_instance->public == true) {
            return true;
        }
    }

    // public function fetch(User $user, AppInstance $app_instance)
    // {
    //     if ($user->site_admin || $user->group_admin($app_instance->group_id) || $user->group_member($app_instance->group_id)) {
    //         return true;
    //     }
    // }

    public function fetch(User $user, AppInstance $app_instance) {
        // If you're an admin of the group, or you're an admin of the site => you can view the page.
        if ($user->group_admin($app_instance->group_id) || $user->site_admin) {
            return true;
        }
        
        // If the app instance limits visibility to composites, and you are a member of one of those composites => you can view the app instance.
        if (is_array($app_instance->groups) && count($app_instance->groups) > 0) { 
            if (count(array_intersect($user->groups, $app_instance->groups)) > 0) {
                return true;
            }
        // If the app instance DOESNT limit visibility to composites, and you are a member of the app instance group => you can view the app instance.
        } else if ($user->group_member($app_instance->group_id)) {
            return true;
        }

        // If the app instancd is public => you can view the app instance.
        if ($app_instance->public == true) {
            return true;
        }
    }

}