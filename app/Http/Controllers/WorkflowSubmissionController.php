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
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Libraries\HTTPHelper;
use App\Libraries\Templater;
use App\Libraries\PageRenderer;
use \Carbon\Carbon;
use App\Libraries\CustomAuth;
use App\Libraries\JSExecHelper;
use \Ds\Vector;

class WorkflowSubmissionController extends Controller {
    public function __construct() {
        $this->customAuth = new CustomAuth();
    }
    public function list_user_workflow_submissions(Request $request) {
        if (!Auth::check()) { abort(403); }
        $submissions = WorkflowSubmission::select(
                'id','workflow_id','user_id','updated_at',
                'assignment_type','assignment_id','state','status'
            )
            ->with(['workflow'=>function($query){
                $query->select('id','name');
            }])
            ->with('user')
            ->where('user_id','=',Auth::user()->id)
            ->where('status',"!=",'new')
            ->orderBy('updated_at','asc')
            ->get();
        foreach ($submissions as $submission) {
            $submission->getAssignment();
            $submission->getSubmittedAt();
        }
        return $submissions;
    }
    public function list_workflow_submission_assignments(Request $request) {
        if (!Auth::check()) { abort(403); }
        $submissions = WorkflowSubmission::select(
                'id','workflow_id','user_id','updated_at',
                'assignment_type','assignment_id','state','status'
            )
            ->with(['workflow'=>function($query){
                $query->select('id','name');
            }])
            ->with(['user'=>function($query){
                $query->select('id','email','first_name','last_name');
            }])
            ->with(['assignment_group'=>function($query){
                $query->select('id','name','slug')->where('site_id',config('app.site')->id);
            }])
            ->with(['assignment_user'=>function($query){
                $query->select('id','email','first_name','last_name');
            }])
            ->with(['logs'=>function($query){
                $query->select('id','workflow_submission_id','created_at')->oldest();
            }])
            ->where('status',"=",'open')
            ->where(function($query) {
                $query->where(function($query) {
                    $query->where('assignment_type',"=",'user');
                    $query->where('assignment_id','=',Auth::user()->id);
                });
                $query->orWhere(function($query){
                    $query->where('assignment_type',"=",'group');
                    $query->whereIn('assignment_id',Auth::user()->groups);
                });
            })
            ->orderBy('updated_at','asc')->get();
        foreach ($submissions as $submission) {
            // $submission->getAssignment();
            // $submission->getSubmittedAt();
            if($submission->assignment_type == "user"){
                $submission->assignee = $submission->assignment_user;
            } else {
                $submission->assignee = $submission->assignment_group;
            }
            unset($submission->assignment_user); unset($submission->assignment_group);
            if(count($submission->logs)){
                $submission->submitted_at=$submission->logs[0]->created_at->format('Y-m-d H:i:s');
            }
            unset($submission->logs);
        }
        return $submissions;
    }
    public function list_user_workflow_action_history(Request $request) {
        if (!Auth::check()) { abort(403); }
        $submissions = WorkflowSubmission::select(
                'id','workflow_id','user_id','updated_at',
                'assignment_type','assignment_id','state','status'
            )
            ->with(['workflow'=>function($query){
                $query->select('id','name');
            }])
            ->with('user')
            ->whereHas('logs', function($query) {
                $query->where('user_id',Auth::user()->id);
            })
            ->where('status',"!=",'new')
            ->orderBy('created_at')->get();
        foreach ($submissions as $submission) {
            $submission->getAssignment();
            $submission->getSubmittedAt();
        }
        return $submissions; 
    }
    public function my_assignment_count(Request $request) {
        if (!Auth::check()) { abort(403); }
        $submissions = WorkflowSubmission::where('status',"=",'open')
            ->where(function($query) {
                $query->where(function($query) {
                    $query->where('assignment_type',"=",'user');
                    $query->where('assignment_id','=',Auth::user()->id);
                });
                $query->orWhere(function($query){
                    $query->where('assignment_type',"=",'group');
                    $query->whereIn('assignment_id',Auth::user()->groups);
                });
            })->count();
        return ['count'=>$submissions];
    } 

    public function list_instance_workflow_submissions(WorkflowInstance $workflow_instance, Request $request) {
        if (!Auth::check()) { abort(403); }
        $submissions_raw = WorkflowSubmission::select('assignment_id','assignment_type','created_at','updated_at','opened_at','id','state','status','user_id','workflow_version_id')
            ->with('user')
            ->with(['workflowVersion' => function($query) {
                $query->select('id','summary','updated_at');
            }])
            ->with('assignment_user')
            ->with('assignment_group')
            ->where('workflow_instance_id','=',$workflow_instance->id)
            ->where('status',"!=",'new')
            ->orderBy('created_at')->get();
        $submissions = [];
        foreach($submissions_raw as $submission_raw) {
            $submission = $submission_raw->only(['assignment_id','assignment_type','created_at','updated_at','opened_at','id','state','status','user_id','user','workflowVersion']);
            if ($submission_raw->assignment_type === 'user') {
                $submission['assignee'] = $submission_raw->assignment_user;
            } else if ($submission_raw->assignment_type === 'group') {
                $submission['assignee'] = $submission_raw->assignment_group;
            }
            $submissions[] = $submission;
        }
        return $submissions;
    }

    public function list_my_instance_workflow_submissions(Request $request, WorkflowInstance $workflow_instance) {
        if (!Auth::check()) { abort(403); }
        $submissions = WorkflowSubmission::
            select('assignment_id','assignment_type','created_at','updated_at','opened_at','id','state','status','data')
            ->with('files')
            ->where('user_id',Auth::user()->id)
            ->where('workflow_instance_id','=',$workflow_instance->id)
            ->orderBy('updated_at','asc')
            ->get();
        foreach ($submissions as $submission) {
            $submission->getSubmittedAt();
        }
        return $submissions;
    }   

    public function workflow_submission_history(WorkflowSubmission $workflow_submission, Request $request) {
        if (!Auth::check()) { abort(403); }
        return WorkflowSubmission::where('id','=',$workflow_submission->id)
            ->with('user')
            ->with(['logs'=>function($query){
                $query->with('user');
                $query->orderBy('id','desc')->get();
            }])
            ->with(['files'=>function($query){
                $query->withTrashed()->orderBy('updated_at','desc')->with('user')->with('deleted_by')->get();
            }])->first();
    }

    // public function view(WorkflowSubmission $workflow_submission, Request $request) {
    //     if (Auth::user()->site_developer || Auth::user()->site_admin) {
    //         $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->orderBy('name')->get();
    //     } else {
    //         $workflows = Workflow::with('user')->where('site_id',config('app.site')->id)->whereIn('id',Auth::user()->developer_workflows)->orderBy('name')->get();
    //     }
    //     if (Auth::check()) { /* User is Authenticated */
    //         $current_user = Auth::user();
    //         $myWorkflowInstance = WorkflowInstance::with('workflow')
    //             ->where('id','=', $workflow_submission->workflow_id)->with('workflow')->first();
    //         if (is_null($myWorkflowInstance)) { 
    //             abort(404); 
    //         }
    //         if($myWorkflowInstance->public == 0) {
    //             $this->authorize('fetch' ,$myWorkflowInstance);
    //         }
    //         $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
    //     } else { /* User is not Authenticated */
    //         $current_user = new User;
    //         $myWorkflowInstance = WorkflowInstance::with('workflow')
    //         ->where('id','=', $workflow_submission->workflow_id)->with('workflow')->where('public','=',true)->first();
    //         // $myWorkflowInstance = WorkflowInstance::with('workflow')->where('group_id','=', $group)->where('slug', '=', $slug)->where('public','=',true)->first();
    //         if (is_null($myWorkflowInstance)) { 
    //             $return = $this->customAuth->authenticate($request);
    //             if(isset($return)){
    //                 return $return;
    //             }
    //         }
    //         $links = Group::publicAppsPages()->where('unlisted','=',0)->orderBy('order')->get();
    //     }
    //     if (Auth::check()) { /* User is Authenticated */
    //         $current_user = Auth::user();
    //         $links = Group::AppsPages()->where('unlisted','=',0)->orderBy('order')->get();
    //     } else{
    //         abort(404); 
    //     }
    //     $myWorkflowInstance->findVersion();
    //     // if($myWorkflowInstance != null) {
    //         $template = new Templater();
    //         return $template->render([
    //             'mygroups'=>$links,
    //             'name'=>'workflow',
    //             'slug'=>'workflow',
    //             'id'=>0,
    //             'data'=>[],
    //             // 'config'=>json_decode('{"sections":[[],[{"title":"'.$myWorkflowInstance->name.'","workflow_id":'.$myWorkflowInstance->id.',"widgetType":"Workflow","container":true}],[]],"layout":"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div></div>"}'),
    //             'config'=>array("sections"=>[[array("title"=>$myWorkflowInstance->name,"data"=>$workflow_submission->data,"workflow_id"=>$myWorkflowInstance->id,"widgetType"=>"Workflow","container"=>true)]],"layout"=>"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div>"), 
    //             // json_decode('{"sections":[[],[{"title":"'.$myWorkflowInstance->name.'","workflow_id":'.$myWorkflowInstance->id.',"widgetType":"Workflow","container":true}],[]],"layout":"<div class=\"col-lg-offset-2 col-md-offset-1  col-lg-8 col-md-10 col-sm-12 cobler_container\"></div></div>"}'),
    //             // 'group'=>(Object)array("id"=>"0"),
    //             'scripts'=>[],
    //             'styles'=>[],
    //             'template'=>"main",
    //             'apps'=>(Object)[],
    //             'resource'=>'flow'
    //         ]);
    // }

    public function status(WorkflowSubmission $workflow_submission){
        return $workflow_submission;
    }

    public function destroy(WorkflowSubmission $workflow_submission){
        if ($workflow_submission->delete()) {
            return 1;
        }
    }

    public function upgrade_version(WorkflowSubmission $workflow_submission){
        $workflow_instance = WorkflowInstance::where('id',$workflow_submission->workflow_instance_id)->first();
        if ($workflow_submission->update([
                'workflow_version_id'=>$workflow_instance->version->id,
                'workflow_instance_configuration'=>(Array)$workflow_instance->configuration 
        ])) {
            return 1;
        }
    }

    public function report(WorkflowSubmission $workflow_submission,Request $request) {
        $workflow_submission = WorkflowSubmission::where('id','=',$workflow_submission->id)->with('user')->with('workflowVersion')->with('workflow')->first();

        if (Auth::check()) { /* User is Authenticated */
            $current_user = Auth::user();
        } 
        else { /* User is not Authenticated */
            $return = $this->customAuth->authenticate($request);
            if(isset($return)){
                return $return;
            }
        }
        $workflow_submission->load('workflowInstance');
        if(is_null($workflow_submission->workflowInstance)){
            abort(404,'Workflow Instance no longer exists');
        }
        $is_assigned = false;//(Auth::user()->site_developer || Auth::user()->site_admin);

        if($workflow_submission->assignment_type == "user"){
            $assignment = User::where("id", '=', $workflow_submission->assignment_id)->select('first_name','last_name','email','unique_id','params')->first();
            $is_assigned = ($is_assigned || (Auth::user()->id == $workflow_submission->assignment_id) );
        }else{
            $assignment = Group::where("id",'=',$workflow_submission->assignment_id)->where('site_id',config('app.site')->id)->select('name','slug','id')->first();
            $is_assigned = ($is_assigned || in_array($workflow_submission->assignment_id, Auth::user()->groups) );
        }

        $renderer = new PageRenderer();
        return $renderer->render([
            'config'=>[
                "sections"=>[[[
                    "title"=>"Workflow Submission",
                    "widgetType"=>"WorkflowSubmissionReport",
                    "report_url"=>URL::to('/workflows/report/'.$workflow_submission->id),
                    "user"=>$current_user,
                    "is_assigned"=>$is_assigned,
                    "assignment"=>$assignment,
                    "options"=>$workflow_submission,
                    "titlebar"=>true,
                    "container"=>true,
                ]]],
                "layout"=>'<div class="col-sm-12 cobler_container"></div>'
                ],
            'resource'=>'workflow',
            'name'=>'Workflow Submission',
        ]);
        return $workflows;
    }
}