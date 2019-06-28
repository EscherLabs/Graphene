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


            $flow = json_decode($myWorkflow->version->code->flow);                
            $submission->assignment_type = $flow->{'submitted'}->assignment_type;
            $submission->assignment_id = $flow->{'submitted'}->assignment_id;

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
            $activity = new WorkflowActivityLog();

            $activity->workflow_id = $myWorkflow->id;
            $activity->user_id = Auth::user()->id;
            $activity->start_state = $workflow_submission->state;


            $flow = json_decode($myWorkflow->version->code->flow);
            foreach($flow->{$workflow_submission->state}->actions as $action){
                if($action->name == $request->get('action')){
                    $workflow_submission->state = $action->to;
                    if(isset($flow->{$action->to}->status)){
                        $workflow_submission->status = $flow->{$action->to}->status;
                    }else{
                        $workflow_submission->status = 'open';
                    }
                }
            }

            $workflow_submission->data = $request->get('_state');

            $workflow_submission->update();

            $activity->end_state = $workflow_submission->state;
            $activity->data = $request->get('_state');

            $activity->workflow_submission_id = $workflow_submission->id;
            $activity->action = $request->get('action');

            $activity->save();
            
            return WorkflowSubmission::with('workflowVersion')->with('workflow')->where('id','=',$workflow_submission->id)->first();
        // abort(404,'Workflow not found');
    }

    public function view(WorkflowSubmission $workflow_submission, Request $request) {
        

        if (Auth::user()->site_developer || Auth::user()->site_admin) {
            $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
        } else {
            $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
        }



        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            $myWorkflow = WorkflowInstance::with('workflow')
                ->where('id','=', $workflow_submission->workflow_id)->with('workflow')->first();

            if (is_null($myWorkflow)) { 
                abort(404); 
            }
            
            if($myWorkflow->public == 0) {
                $this->authorize('fetch' ,$myWorkflow);
            }
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else { /* User is not Authenticated */
            $current_user = new User;
            $myWorkflow = WorkflowInstance::with('workflow')
            ->where('id','=', $workflow_submission->workflow_id)->with('workflow')->where('public','=',true)->first();
            // $myWorkflow = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
            if (is_null($myWorkflow)) { 
                $return = $this->customAuth->authenticate($request);
                if(isset($return)){
                    return $return;
                }
            }
            $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        }





        // if(!is_numeric($group)) {
        //     $groupObj = Group::with('composites')->where('slug','=',$group)->first();
		// 	$group = $groupObj->id;
		// }else{
    	// 	$groupObj = Group::with('composites')->where('id','=',$group)->first();
        // }

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
            // $myWorkflow = WorkflowInstance::with('workflow')
            //     ->where('group_id','=', $group)->where('slug', '=', $slug)->with('workflow')->first();

            // if (is_null($myWorkflow)) { 
            //     abort(404); 
            // }
            
            // if($myWorkflow->public == 0) {
            //     $this->authorize('fetch' ,$myWorkflow);
            // }
            $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        } else{

        }
        // else { /* User is not Authenticated */
        //     $current_user = new User;
        //     $myWorkflow = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
        //     if (is_null($myWorkflow)) { 
        //         $return = $this->customAuth->authenticate($request);
        //         if(isset($return)){
        //             return $return;
        //         }
        //     }
        //     $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
        // }

        // $workflow_submission->data
        $myWorkflow->findVersion();
        // if($myWorkflow != null) {
            $template = new Templater();
            return $template->render([
                'mygroups'=>$links,
                'name'=>'workflow',
                'slug'=>'workflow',
                'id'=>0,
                'data'=>[],
                // 'config'=>json_decode('{"sections":[[],[{"title":"'.$myWorkflow->name.'","workflow_id":'.$myWorkflow->id.',"widgetType":"Workflow","container":true}],[]],"layout":"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div></div>"}'),
                'config'=>array("sections"=>[[array("title"=>$myWorkflow->name,"data"=>$workflow_submission->data,"workflow_id"=>$myWorkflow->id,"widgetType"=>"Workflow","container"=>true)]],"layout"=>"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div>"),
                
                // json_decode('{"sections":[[],[{"title":"'.$myWorkflow->name.'","workflow_id":'.$myWorkflow->id.',"widgetType":"Workflow","container":true}],[]],"layout":"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div></div>"}'),
                // 'group'=>(Object)array("id"=>"0"),
                'scripts'=>[],
                'styles'=>[],
                'template'=>"main",
                'apps'=>(Object)[],
                'resource'=>'flow'
            ]);


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