<?php

namespace App\Policies;

use App\User;
use App\Image;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class ImagePolicy
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

    public function get(User $user, Image $image) {
        if ($user->group_member($image->group_id) || 
            $user->group_admin($image->group_id) || 
            $user->site_admin ||
            $image->public) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->group_content_admin(request()->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Image $image)
    {
        if ($user->group_content_admin($image->group_id) || $user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Image $image)
    {
        if ($user->group_content_admin($image->group_id) || $user->site_admin) {
            return true;
        }
    }
}
