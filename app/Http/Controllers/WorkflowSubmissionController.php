<?php

namespace App\Http\Controllers;

use App\WorkflowInstance;
use App\Workflow;
use App\WorkflowVersion;
use App\WorkflowSubmission;
use App\WorkflowActivityLog;
use App\Endpoint;
use App\Group;
use App\UserPreference;
use App\User;
use App\Page;
use App\ResourceCache;
use App\UserOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;

class WorkflowSubmissionController extends Controller
{
    public function __construct() {
        // $this->middleware('auth')->except('run','fetch', 'get_data');

        $this->customAuth = new CustomAuth();
    }

    public function create($group, $workflow_id = null, Request $request) {
        if(!is_numeric($group)) {
            $groupObj = Group::with('composites')->where('slug','=',$group)->first();
			$group = $groupObj->id;
		}else{
    		$groupObj = Group::with('composites')->where('id','=',$group)->first();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();

            $myWorkflow = WorkflowInstance::with('workflow')
                ->where('group_id','=', $group)->where('id', '=', $workflow_id)->with('workflow')->first();

            if (is_null($myWorkflow)) { 
                abort(404); 
            }
            
            if($myWorkflow->public == 0) {
                $this->authorize('fetch' ,$myWorkflow);
            }
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflow = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('id', '=', $workflow_id)->where('public','=',true)->first();
            if (is_null($myWorkflow)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }

        if($myWorkflow != null) {
            $myWorkflow->findVersion();

            $submission = new WorkflowSubmission();

            $submission->workflow_id = $myWorkflow->id;
            $submission->workflow_version_id = $myWorkflow->version->id;
            $submission->state = $request->get('_state');
            $submission->user_id = $current_user->id;
            $submission->save();

            $activity = new WorkflowActivityLog();
            $activity->workflow_id = $myWorkflow->id;
            $activity->user_id = $current_user->id;
            $activity->end_state = $request->get('_state');
            $activity->workflow_submission_id = $submission->id;
            $activity->action = 'submitted';

            $activity->save();
            
            return $submission;
        }
        abort(404,'App not found');
    }




    public function action($group, $workflow_id, $submission_id, Request $request) {
        return $submission_id;
        if(!is_numeric($group)) {
            $groupObj = Group::with('composites')->where('slug','=',$group)->first();
			$group = $groupObj->id;
		}else{
    		$groupObj = Group::with('composites')->where('id','=',$group)->first();
        }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();

            $myWorkflow = WorkflowInstance::with('workflow')
                ->where('group_id','=', $group)->where('id', '=', $workflow_id)->with('workflow')->first();

            if (is_null($myWorkflow)) { 
                abort(404); 
            }
            
            if($myWorkflow->public == 0) {
                $this->authorize('fetch' ,$myWorkflow);
            }
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflow = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('id', '=', $workflow_id)->where('public','=',true)->first();
            if (is_null($myWorkflow)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }

        if($myWorkflow != null) {
            $myWorkflow->findVersion();

            $submission = new WorkflowSubmission();

            $submission->workflow_id = $myWorkflow->id;
            $submission->workflow_version_id = $myWorkflow->version->id;
            $submission->state = $request->get('_state');
            $submission->user_id = $current_user->id;
            $submission->save();

            $activity = new WorkflowActivityLog();
            $activity->workflow_id = $myWorkflow->id;
            $activity->user_id = $current_user->id;
            $activity->end_state = $request->get('_state');
            $activity->workflow_submission_id = $submission->id;
            $activity->action = 'submitted';

            $activity->save();
            
            return $submission;
        }
        abort(404,'App not found');
    }

    public function status(WorkflowSubmission $workflow_submission){
        return $workflow_submission;
    }

    public function destroy(WorkflowSubmission $workflow_submission){
        if ($workflow_submission->delete()) {
            return 1;
        }
    }
}