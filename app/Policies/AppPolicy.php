<?php

namespace App\Policies;

use App\User;
use App\App;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class AppPolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user)
    {
        if ($user->site_developer || $user->site_admin || count($user->developer_apps)>0) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        if ($user->site_developer || $user->site_admin || count($user->apps_admin_groups)>0 || count($user->developer_apps)>0) {
            return true;
        }
    }

    public function get(User $user, App $app)
    {
        if ($user->site_developer || $user->site_admin || in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ($user->site_developer || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, App $app)
    {
        if (in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function delete(User $user, App $app)
    {
        if ($user->site_developer || $user->site_admin) {
            return true;
        }
    }

    public function list_developers(User $user, App $app)
    {
        if ($user->site_developer || $user->site_admin || in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function add_developer(User $user, App $app)
    {
        if ($user->site_developer || $user->site_admin || in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }

    public function remove_developer(User $user, App $app)
    {
        if ($user->site_developer || $user->site_admin || in_array($app->id,$user->developer_apps)) {
            return true;
        }
    }
}