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
        // User must be an admin of one or more groups
        if (count($user->admin_groups)>0) {
            return true;
        }
    }

    public function get(User $user, Image $image) {
        // User must be a member of the group
        if (in_array($image->group_id,$user->groups)) {
            return true;
        }
    }

    public function create(User $user)
    {
        // User must be admin of image group
        if (in_array(request()->group_id,$user->admin_groups)) {
            return true;
        }
    }

    public function update(User $user, Image $image)
    {
        // User must be admin of image group
        if (in_array($image->group_id,$user->admin_groups)) {
            return true;
        }
    }

    public function delete(User $user, Image $image)
    {
        // User must be admin of image group
        if (in_array($image->group_id,$user->admin_groups)) {
            return true;
        }
    }
}
