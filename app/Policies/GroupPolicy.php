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
        if (count($user->apps_admin_groups)>0 || count($user->content_admin_groups)>0 || $user->site_admin) {
            return true;
        }
    }

    public function get(User $user, Group $group)
    {
        if (in_array($group->id,$user->apps_admin_groups) || in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->groups) || $user->site_admin) {
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

    public function list_members(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function add_member(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function remove_member(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_admins(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
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
        if ($user->site_admin) {
            return true;
        }
    }

    public function list_tags(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_images(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_links(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_composites(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_pages(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_appinstances(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function list_endpoints(User $user, Group $group)
    {
        if (in_array($group->id,$user->content_admin_groups) || in_array($group->id,$user->apps_admin_groups) || $user->site_admin) {
            return true;
        }
    }


    public function add_composite(User $user, Group $group, Group $composite_group)
    {
        // User must be an admin of the group & composite group or a site admin
        if ((in_array($group->id,$user->apps_admin_groups) &&
             in_array($composite_group->id,$user->apps_admin_groups))
            || $user->site_admin) {
            return true;
        }
    }

    public function remove_composite(User $user, Group $group, Group $composite_group)
    {
        // User must be an admin of the group & composite group or a site admin
        if ((in_array($group->id,$user->apps_admin_groups) &&
             in_array($composite_group->id,$user->apps_admin_groups))
            || $user->site_admin) {
            return true;
        }
    }
}