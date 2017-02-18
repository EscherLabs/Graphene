<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class UserPolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        return true;
        // User must be an admin of one or more groups, or a site admin, or a developer
        if (count($user->admin_groups)>0 || $user->site_admin || $user->developer) {
            return true;
        }
    }

    public function get(User $user, User $the_user)
    {
        // User must be an admin of one or more groups, or a site admin, or a developer, or the user
        if (count($user->admin_groups)>0 || $user->site_admin || $user->developer || $user->id == $the_user->id) {
            return true;
        }
    }

    public function create(User $user)
    {
        // User must be a site administrator
        if ($user->site_admin) {
            return true;
        }
    }

    public function update(User $user, User $the_user)
    {
        // User must be a site_admin or the user
        if ($user->site_admin || $user->id == $the_user->id) {
            return true;
        }
    }

    public function delete(User $user, User $the_user)
    {
        // User must be a site administrator
        if ($user->site_admin) {
            return true;
        }
    }
}
