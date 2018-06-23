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
        // If you're an admin of the group, or you're an admin of the site => you can view the page.
        if ($user->group_admin($page->group_id) || $user->site_admin) {
            return true;
        }
        
        // If the page limits visibility to composites, and you are a member of one of those composites => you can view the page.
        if (is_array($page->groups) && count($page->groups) > 0) { 
            if (count(array_intersect($user->groups, $page->groups)) > 0) {
                return true;
            }
        // If the page DOESNT limit visibility to composites, and you are a member of the page group => you can view the page.
        } else if ($user->group_member($page->group_id)) {
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