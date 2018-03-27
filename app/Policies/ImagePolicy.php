<?php

namespace App\Policies;

use App\User;
use App\Image;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class ImagePolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        if (count($user->content_admin_groups)>0 || $user->site_admin) {
            return true;
        }
    }

    public function get(User $user, Image $image) {
        if (in_array($image->group_id,$user->groups) || $user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        if (in_array(request()->group_id,$user->content_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Image $image)
    {
        if (in_array($image->group_id,$user->content_admin_groups) || $user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, Image $image)
    {
        if (in_array($image->group_id,$user->content_admin_groups) || $user->site_admin) {
            return true;
        }
    }
}
