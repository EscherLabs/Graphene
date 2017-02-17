<?php

namespace App\Policies;

use App\User;
use App\App;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class AppPolicy
{
    use HandlesAuthorization;

    public function get(User $user, App $app)
    {
        if ($user->developer && in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->developer) {
            return true;
        }
    }

    public function update(User $user, App $app)
    {
        if ($user->developer && in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function delete(User $user, App $app)
    {
        if ($user->developer && in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }
}
