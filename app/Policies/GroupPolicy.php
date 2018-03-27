<?php

namespace App\Policies;

use App\User;
use App\Group;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class GroupPolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        if ($user->group_admin() || $user->site_admin) {
            return true;
        }
    }

    public function get(User $user, Group $group)
    {
        if ($user->group_admin($group->id) || $user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Group $group)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Group $group)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function add_member(User $user, Group $group)
    {
        if ($user->group_admin($group->id) || $user->site_admin) {
            return true;
        }
    }

    public function remove_member(User $user, Group $group)
    {
        if ($user->group_admin($group->id) || $user->site_admin) {
            return true;
        }
    }

    public function add_admin(User $user, Group $group)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function remove_admin(User $user, Group $group)
    {
        if ($user->group_admin($group->id) || $user->site_admin) {
            return true;
        }
    }

    public function list_components(User $user, Group $group)
    {
        if ($user->group_admin($group->id) || $user->site_admin) {
            return true;
        }
    }

    public function add_composite(User $user, Group $group, Group $composite_group)
    {
        if (($user->group_apps_admin($group->id) &&
            $user->group_apps_admin($composite_group->id))
            || $user->site_admin) {
            return true;
        }
    }

    public function remove_composite(User $user, Group $group, Group $composite_group)
    {
        if (($user->group_apps_admin($group->id) &&
            $user->group_apps_admin($composite_group->id))
            || $user->site_admin) {
            return true;
        }
    }
}