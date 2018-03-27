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
        if ($user->site_admin || $user->group_apps_admin($app_instance->group_id)) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ( $user->site_admin || ($user->group_apps_admin(request()->group_id) && $user->app_developer(requet()->app_id))) {
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
        if ($user->site_admin || $user->group_admin($app_instance->group_id) || $user->group_member()) {
            return true;
        }
    }
    public function get_data(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || $user->group_admin($app_instance->group_id) || $user->group_member()) {
            return true;
        }
    }

    public function fetch(User $user, AppInstance $app_instance)
    {
        if ($user->site_admin || $user->group_admin($app_instance->group_id) || $user->group_member()) {
            return true;
        }
    }

}
