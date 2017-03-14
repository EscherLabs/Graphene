<?php

namespace App\Policies;

use App\User;
use App\Site;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class SitePolicy
{
    use HandlesAuthorization;

    public function get_all(User $user)
    {
        //  Current User is a site admin
        if ($user->site_admin) {
            return true;
        }
    }

    public function get(User $user, Site $site)
    {
        // User is Site Admin of Specified Site OR At Master Site, and user is a site admin
        if (($user->site_admin && $site->id == config('app.site')->id) || 
            (config('app.master_site')==request()->server('SERVER_NAME') && $user->site_admin)) {
            return true;
        }
    }

    public function create(User $user)
    {
        // At Master Site, and user is a site admin
        if (config('app.master_site')==request()->server('SERVER_NAME') && $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Site $site)
    {
        // User is Site Admin of Specified Site OR At Master Site, and user is a site admin
        if (($user->site_admin && $site->id == config('app.site')->id) || 
            (config('app.master_site')==request()->server('SERVER_NAME') && $user->site_admin)) {
            return true;
        }
    }

    public function delete(User $user, Site $site)
    {
        // At Master Site, and user is a site admin
        if (config('app.master_site')==request()->server('SERVER_NAME') && $user->site_admin) {
            return true;
        }
    }
}
