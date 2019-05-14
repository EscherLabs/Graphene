<?php

namespace App\Policies;

use App\User;
use App\Workflow;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class WorkflowPolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user)
    {
        if ($user->site_developer || $user->site_admin || $user->workflow_developer()) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        if ($user->site_developer || $user->site_admin || $user->group_apps_admin() || $user->workflow_developer()) {
            return true;
        }
    }

    public function get(User $user, Workflow $workflow)
    {
        if ($user->site_developer || $user->site_admin || $user->workflow_developer($workflow->id)) {
            return true;
        }
    }

    public function get_versions(User $user, Workflow $workflow)
    {
        if ($user->site_developer || $user->site_admin || $user->group_apps_admin() || $user->workflow_developer()) {
            return true;
        }
    }


    public function create(User $user)
    {
        if ($user->site_developer || $user->site_admin) {
            return true;
        }
    }

    public function update(User $user, Workflow $workflow)
    {
        if ($user->workflow_developer($workflow->id)) {
            return true;
        }
    }

    public function delete(User $user, Workflow $workflow)
    {
        // TJC 7/25/18 -- Prevent Bulk Deleting of Apps Accidentally, Even if You're 
        // a Site Admin or Site Developer.  (MUST BE AN A DEVELOPER OF THAT APP)
        // Advised by Lauri Arnold / Robin Sassani
        if ($user->workflow_developer($workflow->id)) {
            return true;
        }
    }

    public function list_developers(User $user, Workflow $workflow)
    {
        if ($user->site_developer || $user->site_admin || $user->workflow_developer($workflow->id)) {
            return true;
        }
    }

    public function list_all_developers(User $user)
    {
        if ($user->site_developer || $user->site_admin || $user->workflow_developer()) {
            return true;
        }
    }

    public function add_developer(User $user, Workflow $workflow)
    {
        if ($user->site_developer || $user->site_admin || $user->workflow_developer($workflow->id)) {
            return true;
        }
    }

    public function remove_developer(User $user, Workflow $workflow)
    {
        if ($user->site_developer || $user->site_admin || $user->workflow_developer($workflow->id)) {
            return true;
        }
    }
}