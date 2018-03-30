<?php

namespace App\Policies;

use App\User;
use App\Endpoint;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class EndpointPolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user) {
        if ($user->group_apps_admin() || $user->site_admin) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        if ($user->group_apps_admin() || $user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->group_apps_admin(request()->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Endpoint $endpoint)
    {
        if ($user->group_apps_admin($endpoint->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Endpoint $endpoint)
    {
        if ($user->group_apps_admin($endpoint->group_id) || $user->site_admin) {
            return true;
        }
    }
}
