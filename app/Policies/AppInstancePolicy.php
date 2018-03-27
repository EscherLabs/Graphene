<?php

namespace App\Policies;

use App\User;
use App\AppInstance;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class AppInstancePolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        // TJC 3/26/18 -- Need to revisit
            return true;
    }

    public function get(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || in_array($app_instance->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->site_admin || in_array(request()->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function update(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || in_array(request()->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function delete(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || in_array(request()->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function get_user_options(User $user, AppInstance $app_instance)
    {
        // User must be member or admin of app_instance group
        if (in_array($app_instance->group_id,$user->groups) || in_array($app_instance->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }
    public function update_user_options(User $user, AppInstance $app_instance)
    {
        // User must be member or admin of app_instance group
        if (in_array($app_instance->group_id,$user->groups) || in_array($app_instance->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }
    public function get_route(User $user, AppInstance $app_instance, $route_name)
    {
        // User must be member or admin of app_instance group
        if (in_array($app_instance->group_id,$user->groups) || in_array($app_instance->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function get_data(User $user, AppInstance $app_instance)
    {
        // User must be member or admin of app_instance group
        if (in_array($app_instance->group_id,$user->groups) || in_array($app_instance->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function fetch(User $user, AppInstance $app_instance)
    {
        return true;
        // User must be member or admin of app_instance group
        if (in_array($app_instance->group_id,$user->groups) || in_array($app_instance->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }
}
