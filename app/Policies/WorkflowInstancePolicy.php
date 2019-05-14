<?php

namespace App\Policies;

use App\User;
use App\WorkflowInstance;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class WorkflowInstancePolicy
{
    use HandlesAuthorization;

    public function view_in_admin(User $user) {
        if ($user->site_admin || $user->group_apps_admin()) {
            return true;
        }
    }

    public function get_all(User $user)
    {
        // TJC 3/26/18 -- Need to revisit
            return true;
    }

    public function get(User $user, WorkflowInstance $workflow_instance)
    {
        if ($user->site_admin || $user->group_apps_admin($workflow_instance->group_id)) {
            return true;
        }
    }

    public function create(User $user)
    {
        if ( $user->site_admin || ($user->group_apps_admin(request()->group_id) && $user->workflow_developer(request()->workflow_id))) {
            return true;
        }
        $workflow_exists_in_group = is_null(WorkflowInstance::select('id')->where('group_id','=',request()->group_id)->where('workflow_id','=',request()->workflow_id)->first())?false:true;
        if ( $user->group_apps_admin(request()->group_id) && $workflow_exists_in_group) {
            return true;
        }
    }

    public function update(User $user, WorkflowInstance $workflow_instance)
    {
        if ($user->site_admin || $user->group_apps_admin($workflow_instance->group_id)) {
            return true;
        }
    }

    public function delete(User $user, WorkflowInstance $workflow_instance)
    {
        if ($user->site_admin || $user->group_apps_admin($workflow_instance->group_id)) {
            return true;
        }
    }

    public function fetch(User $user, WorkflowInstance $workflow_instance) {
        // If you're an admin of the group, or you're an admin of the site => you can view the page.
        if ($user->group_admin($workflow_instance->group_id) || $user->site_admin) {
            return true;
        }
        
        // If the app instance limits visibility to composites, and you are a member of one of those composites => you can view the app instance.
        if (is_array($workflow_instance->groups) && count($workflow_instance->groups) > 0) { 
            if (count(array_intersect($user->groups, $workflow_instance->groups)) > 0) {
                return true;
            }
        // If the app instance DOESNT limit visibility to composites, and you are a member of the app instance group => you can view the app instance.
        } else if ($user->group_member($workflow_instance->group_id)) {
            return true;
        }

        // If the app instance is public => you can view the app instance.
        if ($workflow_instance->public == true) {
            return true;
        }
    }


}