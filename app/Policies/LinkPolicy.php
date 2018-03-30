<?php

namespace App\Policies;

use App\User;
use App\Link;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class LinkPolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user) {
        if ($user->group_content_admin() || $user->site_admin) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        if ($user->group_content_admin() || $user->site_admin) {
            return true;
        }
    }

    public function get(User $user, Link $link) {
        if ($user->group_member($link->group_id) || $user->group_admin($link->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->group_content_admin(request()->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Link $link)
    {
        if ($user->group_content_admin($link->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Link $link)
    {
        if ($user->group_content_admin($link->group_id) || $user->site_admin) {
            return true;
        }
    }
}
