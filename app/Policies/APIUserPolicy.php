<?php

namespace App\Policies;

use App\User;
use App\APIUser;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class APIUserPolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user) {
        if ($user->site_admin) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function get(User $user, APIUser $api_user)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function update(User $user, APIUser $api_user)
    {
        if ($user->site_admin) {
            return true;
        }
    }

    public function delete(User $user, APIUser $api_user)
    {
        if ($user->site_admin) {
            return true;
        }
    }
}
