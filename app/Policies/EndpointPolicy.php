<?php

namespace App\Policies;

use App\User;
use App\Endpoint;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class EndpointPolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        // User must be an admin of one or more groups
        if (count($user->apps_admin_groups)>0) {
            return true;
        }
    }

    public function create(User $user)
    {
        // User must be admin of endpoint group
        if (in_array(request()->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function update(User $user, Endpoint $endpoint)
    {
        // User must be admin of endpoint group
        if (in_array($endpoint->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }

    public function delete(User $user, Endpoint $endpoint)
    {
        // User must be admin of endpoint group
        if (in_array($endpoint->group_id,$user->apps_admin_groups)) {
            return true;
        }
    }
}
