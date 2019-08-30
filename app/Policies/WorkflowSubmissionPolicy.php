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
        if ($workflow_submission->user_id === $user->id) {
            return true;
        }
        // User is Assigned to Submission (User Assignment Type)
        if ($workflow_submission->assignment_type === 'user' && $workflow_submission->assignment_id === $user->id) {
            return true;
        }
        // User is Assigned to Submission (Group Assignment Type)
        if ($workflow_submission->assignment_type === 'group' && $user->group_member($workflow_submission->assignment_id)) {
            return true;
        }
        // User is Admin of Group that Submission Instance belongs to
        if ($user->group_admin($workflow_submission->workflowInstance->group_id)) {
            return true;
        }
        // User was previously assigned the submission (as a user or member of a group)
        // User previously took action on the submission
        $activity_count = WorkflowActivityLog::where(function($query) use ($user,$workflow_submission){
                $query->where('workflow_submission_id', $workflow_submission->id);
                $query->where('assignment_type', 'user');
                $query->where('assignment_id', $user->id);
            })
            ->orWhere(function($query) use ($user,$workflow_submission){
                $query->where('workflow_submission_id', $workflow_submission->id);
                $query->where('assignment_type', 'group');
                $query->whereIn('assignment_id', $user->groups);
            })
            ->orWhere(function($query) use ($user,$workflow_submission){
                $query->where('workflow_submission_id', $workflow_submission->id);
                $query->where('user_id', $user->id);
            })->count();
        if ($activity_count > 0) {
            return true;
        }
    }
}