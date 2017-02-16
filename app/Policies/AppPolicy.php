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
        if (in_array($app->id,session('developer_apps'))) {
            return true;
        }
    }

    public function create(User $user)
    {
        // Need access to the group_id, and this is in Request, which I don't have
        return true;
    }

    public function update(User $user, App $app)
    {
        if (in_array($app->id,session('developer_apps'))) {
            return true;
        }
    }

    public function delete(User $user, App $app)
    {
        if (in_array($app->id,session('developer_apps'))) {
            return true;
        }
    }
}
