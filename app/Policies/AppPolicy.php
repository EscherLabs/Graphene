<?php

namespace App\Policies;

use App\User;
use App\App;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class AppPolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        // User must be a developer or a site admin or an admin of one or more groups
        if ($user->developer || $user->site_admin || count($user->admin_groups)>0) {
            return true;
        }
    }

    public function get(User $user, App $app)
    {
        // User must be a developer and a developer of the app
        if ($user->developer && in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function create(User $user)
    {
        // User must be a developer
        if ($user->developer) {
            return true;
        }
    }

    public function update(User $user, App $app)
    {
        // User must be a developer and a developer of the app
        if ($user->developer && in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function delete(User $user, App $app)
    {
        // User must be a developer and a developer of the app
        if ($user->developer && in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function list_developers(User $user, App $app)
    {
        // User must be a developer and a developer of the app OR a site admin
        if (($user->developer && in_array($app->id,$user->developer_apps)) || $user->site_admin) {
            return true;
        }
    }

    public function add_developer(User $user, App $app)
    {
        // User must be a developer and a developer of the app OR a site admin
        if (($user->developer && in_array($app->id,$user->developer_apps)) || $user->site_admin) {
            return true;
        }
    }

    public function remove_developer(User $user, App $app)
    {
        // User must be a developer and a developer of the app OR a site admin
        if (($user->developer && in_array($app->id,$user->developer_apps)) || $user->site_admin) {
            return true;
        }
    }
}