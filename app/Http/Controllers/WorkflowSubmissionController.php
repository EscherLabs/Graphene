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
            $submission->data = $request->get('_state');
            $submission->state = "submitted";
            $submission->user_id = $current_user->id;


            // $submission->assignment_type = $current_user->id;
            // $submission->assignment_id = $current_user->id;

            $submission->save();

            $activity = new WorkflowActivityLog();
            $activity->workflow_id = $myWorkflow->id;
            $activity->user_id = $current_user->id;
            $activity->data = $request->get('_state');
            $submission->end_state = "submitted";

            $activity->workflow_submission_id = $submission->id;
            $activity->action = 'submit';

            $activity->save();
            
            return $submission;
        }
        abort(404,'Workflow not found');
    }


    public function list_user_workflow_submissions(Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        return WorkflowSubmission::with('workflowVersion')->with('workflow')->where('user_id','=',Auth::user()->id)->get();
    }
    public function list_workflow_submission_assignments(Request $request) {
        if (!Auth::check()) {
            abort(403); // You must be authenticated to fetch links
        }
        return array('direct'=>WorkflowSubmission::with('workflowVersion')->with('workflow')->where('assignment_type',"=",'user')->where('assignment_id','=',Auth::user()->id)->get(),
        'group'=>WorkflowSubmission::with('workflowVersion')->with('workflow')->where('assignment_type',"=",'group')->whereIn('assignment_id',Auth::user()->groups)->get());

    }

    public function action(WorkflowSubmission $workflow_submission, Request $request) {

            $myWorkflow = WorkflowInstance::with('workflow')->where('id', '=', $workflow_submission->workflow_id)->first();
            $myWorkflow->findVersion();
            // dd(json_decode($myWorkflow->version->code->flow)->{$workflow_submission->state});
            foreach(json_decode($myWorkflow->version->code->flow)->{$workflow_submission->state}->actions as $action){
                if($action->name == $request->get('action')){
                    $workflow_submission->state = $action->to;
                }
            }
            // return json_decode($myWorkflow->version->code->flow)->{$workflow_submission->state};

            $workflow_submission->data = $request->get('_state');
            $workflow_submission->save();

            $activity = new WorkflowActivityLog();
            $activity->workflow_id = $myWorkflow->id;
            $activity->user_id = Auth::user()->id;
            $activity->end_state = $workflow_submission->state;
            $activity->data = $request->get('_state');

            $activity->workflow_submission_id = $workflow_submission->id;
            $activity->action = $request->get('action');

            $activity->save();
            



            return $workflow_submission;
        // }
        // abort(404,'Workflow not found');
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