<?php

namespace App\Policies;

use App\User;
use App\Page;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class PagePolicy
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

    public function get(User $user, Page $page) {
        if ($user->group_member($page->group_id) || $user->group_admin($page->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->group_content_admin(request()->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Page $page)
    {
        if ($user->group_content_admin($page->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Page $page)
    {
        if ($user->group_content_admin($page->group_id) || $user->site_admin) {
            return true;
        }
    }
}