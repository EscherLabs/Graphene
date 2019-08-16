<?php

namespace App\Policies;

use App\User;
use App\WorkflowSubmission;
use App\WorkflowInstance;
use App\WorkflowActivityLog;
use App\Group;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request;

class WorkflowSubmissionPolicy
{
    use HandlesAuthorization;

    public function view(User $user, WorkflowSubmission $workflow_submission)
    {
        // User is Owner of Submission
        // User is 
        return true;
        $activity_log = WorkflowActivityLog::where('workflow_submission_id',$workflow_submission->id);
        if ($user->id === $workflow_submission->user_id) {} //

        if ($user->group_member($group->id) || $user->group_admin($group->id)) {
            true;
        }
    }
}