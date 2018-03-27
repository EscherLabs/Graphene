<?php

namespace App\Policies;

use App\User;
use App\Link;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class LinkPolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        // User must be an admin of one or more groups
        if (count($user->content_admin_groups)>0 || $user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        // User must be admin of link group
        if (in_array(request()->group_id,$user->content_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Link $link)
    {
        // User must be admin of link group
        if (in_array($link->group_id,$user->content_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Link $link)
    {
        // User must be admin of link group
        if (in_array($link->group_id,$user->content_admin_groups) || $user->site_admin) {
            return true;
        }
    }
}
